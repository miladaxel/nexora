import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Subscription, SubscriptionStatus, SubscriptionPlan } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { SubscriptionDetailModal } from '@/components/modals/SubscriptionDetailModal';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  ArrowUpDown,
  Eye,
  Download,
} from 'lucide-react';
import {
  formatToman,
  formatPersianDate,
  getSubscriptionPlanLabel,
  getSubscriptionStatusLabel,
  toPersianDigits,
} from '@/lib/formatters';
import { downloadCSV } from '@/lib/csvExport';

type SortField = 'customerName' | 'price' | 'startDate' | 'nextBillingDate' | 'status';
type SortOrder = 'asc' | 'desc';

export const SubscriptionsPage: React.FC = () => {
  const { subscriptions, updateSubscriptionStatus, cancelSubscription } = useData();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubscriptionStatus>('all');
  const [planFilter, setPlanFilter] = useState<'all' | SubscriptionPlan>('all');
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected subscription for modal
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  // Summary Metrics
  const activeSubs = subscriptions.filter((s) => s.status === 'active').length;
  const canceledSubs = subscriptions.filter((s) => s.status === 'canceled').length;
  const trialingSubs = subscriptions.filter((s) => s.status === 'trialing').length;
  const monthlyRecurringRevenue = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? Math.round(s.price / 12) : s.price), 0);

  // Sorting helper
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filtered & Sorted list
  const processedSubscriptions = useMemo(() => {
    return subscriptions
      .filter((sub) => {
        const matchesSearch =
          sub.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
        const matchesPlan = planFilter === 'all' || sub.plan === planFilter;

        return matchesSearch && matchesStatus && matchesPlan;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'customerName') {
          comp = a.customerName.localeCompare(b.customerName, 'fa');
        } else if (sortField === 'price') {
          comp = a.price - b.price;
        } else if (sortField === 'startDate') {
          comp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        } else if (sortField === 'nextBillingDate') {
          comp = new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
        } else if (sortField === 'status') {
          comp = a.status.localeCompare(b.status);
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [subscriptions, searchQuery, statusFilter, planFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(processedSubscriptions.length / pageSize) || 1;
  const paginatedSubscriptions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedSubscriptions.slice(start, start + pageSize);
  }, [processedSubscriptions, currentPage, pageSize]);

  const handleExportCSV = () => {
    const headers = [
      'شناسه اشتراک',
      'نام مشتری',
      'ایمیل',
      'پلن',
      'دوره پرداخت',
      'مبلغ (تومان)',
      'وضعیت',
      'تاریخ شروع',
      'سررسید بعدی',
    ];

    const rows = processedSubscriptions.map((s) => [
      s.id,
      s.customerName,
      s.customerEmail,
      getSubscriptionPlanLabel(s.plan),
      s.billingCycle === 'yearly' ? 'سالانه' : 'ماهانه',
      s.price,
      getSubscriptionStatusLabel(s.status),
      formatPersianDate(s.startDate),
      formatPersianDate(s.nextBillingDate),
    ]);

    downloadCSV('گزارش_اشتراک‌های_نکسورا', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            مدیریت اشتراک‌ها
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            نظارت بر چرخه‌های تمدید، پلن‌های فعال (پایه، حرفه‌ای، سازمانی) و درآمد پایدار ماهانه
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4 ml-1.5" />
          <span>خروجی اکسل (CSV)</span>
        </Button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">اشتراک‌های فعال</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-foreground">
              {toPersianDigits(activeSubs)}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              در حال دریافت خدمت و تمدید دوره‌ای
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">اشتراک‌های لغوشده</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-foreground">
              {toPersianDigits(canceledSubs)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">عدم تمدید خودکار توسط کاربر</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">اشتراک‌های آزمایشی</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-foreground">
              {toPersianDigits(trialingSubs)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">دوره تست رایگان ۱۴ روزه</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">درآمد ماهانه اشتراک‌ها</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-foreground">
              {formatToman(monthlyRecurringRevenue)}
            </div>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              جریان درآمدی تکرارشونده (MRR)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Subscriptions Table */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:max-w-sm">
              <Input
                placeholder="جستجو بر اساس نام مشتری، ایمیل یا شناسه اشتراک..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Filter tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Pills */}
              <div className="flex items-center gap-1">
                {(['all', 'active', 'trialing', 'past_due', 'canceled'] as const).map((status) => {
                  const labelMap = {
                    all: 'همه',
                    active: 'فعال',
                    trialing: 'آزمایشی',
                    past_due: 'معوقه',
                    canceled: 'لغو شده',
                  };
                  const isActive = statusFilter === status;
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {labelMap[status]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {processedSubscriptions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<CreditCard className="w-10 h-10" />}
                title="اشتراکی با این مشخصات یافت نشد"
                description="فیلترها را بازنشانی کرده یا عبارت جستجو را ویرایش کنید."
                actionLabel="مشاهده همه اشتراک‌ها"
                onAction={() => {
                  setStatusFilter('all');
                  setPlanFilter('all');
                  setSearchQuery('');
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                    <th className="py-3.5 px-4 font-semibold">شناسه</th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center gap-1">
                        <span>نام مشترک</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-semibold">پلن سرویس</th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center gap-1">
                        <span>مبلغ اشتراک</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('startDate')}
                    >
                      <div className="flex items-center gap-1">
                        <span>شروع اشتراک</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('nextBillingDate')}
                    >
                      <div className="flex items-center gap-1">
                        <span>سررسید بعدی</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        <span>وضعیت</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-semibold text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedSubscriptions.map((sub) => {
                    const statusVariant =
                      sub.status === 'active'
                        ? 'success'
                        : sub.status === 'trialing'
                        ? 'warning'
                        : sub.status === 'past_due'
                        ? 'destructive'
                        : 'secondary';

                    return (
                      <tr key={sub.id} className="hover:bg-muted/40 transition-colors group">
                        <td className="py-3.5 px-4 font-mono font-medium text-muted-foreground" dir="ltr">
                          {sub.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-foreground">{sub.customerName}</p>
                          <p className="text-[11px] font-mono text-muted-foreground truncate max-w-[150px]" dir="ltr">
                            {sub.customerEmail}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" size="sm">
                            {getSubscriptionPlanLabel(sub.plan)}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {formatToman(sub.price)}{' '}
                          <span className="text-[10px] text-muted-foreground font-normal">
                            ({sub.billingCycle === 'yearly' ? 'سالانه' : 'ماهانه'})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {formatPersianDate(sub.startDate)}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-foreground">
                          {formatPersianDate(sub.nextBillingDate)}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={statusVariant} size="sm">
                            {getSubscriptionStatusLabel(sub.status)}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSub(sub)}
                            className="h-8 px-2.5"
                          >
                            <Eye className="w-3.5 h-3.5 ml-1" />
                            <span>مدیریت</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-4 border-t border-border/60">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={processedSubscriptions.length}
              pageSize={pageSize}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscription Details & Status Change Modal */}
      <SubscriptionDetailModal
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        subscription={selectedSub}
        onUpdateStatus={updateSubscriptionStatus}
        onCancelSubscription={cancelSubscription}
      />
    </div>
  );
};
