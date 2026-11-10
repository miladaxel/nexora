import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import {
  monthlyRevenueData,
  revenueCategoryDistribution,
} from '@/data/mockData';
import {
  Download,
  DollarSign,
  Users,
  CreditCard,
  Receipt,
} from 'lucide-react';
import {
  formatToman,
  formatPersianDate,
  getCustomerStatusLabel,
  getSubscriptionPlanLabel,
  getSubscriptionStatusLabel,
  getTransactionStatusLabel,
  getPaymentMethodLabel,
  toPersianDigits,
} from '@/lib/formatters';
import { downloadCSV } from '@/lib/csvExport';
import { useToast } from '@/context/ToastContext';

type ReportType = 'revenue' | 'customers' | 'subscriptions' | 'transactions';

export const ReportsPage: React.FC = () => {
  const { customers, subscriptions, transactions, metrics } = useData();
  const { showToast } = useToast();

  const [activeReport, setActiveReport] = useState<ReportType>('revenue');

  const reportTabs: { id: ReportType; label: string; icon: any; count?: number }[] = [
    { id: 'revenue', label: 'گزارش درآمد', icon: DollarSign },
    { id: 'customers', label: 'گزارش مشتریان', icon: Users, count: customers.length },
    { id: 'subscriptions', label: 'گزارش اشتراک‌ها', icon: CreditCard, count: subscriptions.length },
    { id: 'transactions', label: 'گزارش تراکنش‌ها', icon: Receipt, count: transactions.length },
  ];

  // Export CSV handler according to active report
  const handleExportCurrentReport = () => {
    if (activeReport === 'revenue') {
      const headers = ['ماه', 'درآمد محقق‌شده (تومان)', 'هدف تعیین‌شده (تومان)', 'درآمد تکرارشونده MRR (تومان)'];
      const rows = monthlyRevenueData.map((d) => [d.month, d.revenue, d.target, d.mrr]);
      downloadCSV('گزارش_تحلیلی_درآمد_نکسورا', headers, rows);
    } else if (activeReport === 'customers') {
      const headers = ['شناسه', 'نام و نام‌خانوادگی', 'ایمیل', 'شماره تماس', 'سازمان/شرکت', 'طرح', 'مجموع خرید (تومان)', 'وضعیت', 'تاریخ عضویت'];
      const rows = customers.map((c) => [
        c.id,
        c.name,
        c.email,
        c.phone,
        c.company || 'شخصی',
        getSubscriptionPlanLabel(c.plan),
        c.totalSpent,
        getCustomerStatusLabel(c.status),
        formatPersianDate(c.joinDate),
      ]);
      downloadCSV('گزارش_جامع_مشتریان_نکسورا', headers, rows);
    } else if (activeReport === 'subscriptions') {
      const headers = ['شناسه اشتراک', 'نام مشترک', 'ایمیل', 'پلن', 'مبلغ (تومان)', 'دوره پرداخت', 'وضعیت', 'تاریخ شروع', 'سررسید بعدی'];
      const rows = subscriptions.map((s) => [
        s.id,
        s.customerName,
        s.customerEmail,
        getSubscriptionPlanLabel(s.plan),
        s.price,
        s.billingCycle === 'yearly' ? 'سالانه' : 'ماهانه',
        getSubscriptionStatusLabel(s.status),
        formatPersianDate(s.startDate),
        formatPersianDate(s.nextBillingDate),
      ]);
      downloadCSV('گزارش_وضعیت_اشتراک‌های_نکسورا', headers, rows);
    } else if (activeReport === 'transactions') {
      const headers = ['شناسه تراکنش', 'کد پیگیری', 'نام مشتری', 'مبلغ (تومان)', 'وضعیت', 'درگاه/روش پرداخت', 'شماره فاکتور', 'تاریخ'];
      const rows = transactions.map((t) => [
        t.id,
        t.trackingCode,
        t.customerName,
        t.amount,
        getTransactionStatusLabel(t.status),
        getPaymentMethodLabel(t.paymentMethod),
        t.invoiceNumber,
        formatPersianDate(t.date, { showTime: true }),
      ]);
      downloadCSV('گزارش_ریز_تراکنش‌های_نکسورا', headers, rows);
    }

    showToast('success', 'فایل گزارش با موفقیت ایجاد شد', 'فایل CSV با انکودینگ UTF-8 مناسب اکسل دانلود گردید.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            مرکز گزارش‌گیری و خروجی داده‌ها
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            تهیه گزارش‌های رسمی مالی، عملکرد فروش، مشترکین و دانلود خروجی استاندارد CSV
          </p>
        </div>

        <Button size="sm" onClick={handleExportCurrentReport}>
          <Download className="w-4 h-4 ml-1.5" />
          <span>دانلود گزارش فعلی (CSV)</span>
        </Button>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {toPersianDigits(tab.count)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Report Details & Previews */}
      {activeReport === 'revenue' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <span className="text-xs text-muted-foreground block mb-1">مجموع درآمد کل</span>
                <span className="text-xl font-black text-foreground">
                  {formatToman(metrics.totalRevenue)}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
                  رشد تجمیعی {toPersianDigits(metrics.revenueGrowth)}٪+
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <span className="text-xs text-muted-foreground block mb-1">درآمد ماهانه تکرارشونده</span>
                <span className="text-xl font-black text-foreground">
                  {formatToman(metrics.mrr)}
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 block mt-1">
                  پایداری جریان نقدی ۹۴٪
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <span className="text-xs text-muted-foreground block mb-1">میانگین درآمد به ازای مشترک (ARPU)</span>
                <span className="text-xl font-black text-foreground">
                  {formatToman(Math.round(metrics.mrr / (metrics.activeCustomersCount || 1)))}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  محاسبه‌شده برای {toPersianDigits(metrics.activeCustomersCount)} مشترک فعال
                </span>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>پیش‌نمایش نمودار درآمد محقق‌شده</CardTitle>
                <CardDescription>بررسی روند تحقق هدف‌های مالی در طول سال</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueAreaChart data={monthlyRevenueData} height={280} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزیع منابع درآمد</CardTitle>
                <CardDescription>تفکیک درآمدهای ناشی از پلن‌ها و سرویس‌های ارزش افزوده</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryDonutChart data={revenueCategoryDistribution} height={250} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeReport === 'customers' && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>پیش‌نمایش جدول اطلاعات مشتریان</CardTitle>
                <CardDescription>نمایش ۵ ردیف ابتدایی از گزارش خروجی</CardDescription>
              </div>
              <Button size="sm" onClick={handleExportCurrentReport}>
                <Download className="w-4 h-4 ml-1.5" />
                <span>دانلود کل {toPersianDigits(customers.length)} رکورد مشتریان</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 font-semibold">شناسه</th>
                      <th className="py-2.5 font-semibold">نام و سازمان</th>
                      <th className="py-2.5 font-semibold">ایمیل</th>
                      <th className="py-2.5 font-semibold">پلن</th>
                      <th className="py-2.5 font-semibold">مجموع خرید</th>
                      <th className="py-2.5 font-semibold">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {customers.slice(0, 6).map((c) => (
                      <tr key={c.id} className="hover:bg-muted/30">
                        <td className="py-2.5 font-mono text-muted-foreground" dir="ltr">{c.id}</td>
                        <td className="py-2.5 font-semibold">{c.name} {c.company && `(${c.company})`}</td>
                        <td className="py-2.5 font-mono text-muted-foreground" dir="ltr">{c.email}</td>
                        <td className="py-2.5">{getSubscriptionPlanLabel(c.plan)}</td>
                        <td className="py-2.5 font-bold">{formatToman(c.totalSpent)}</td>
                        <td className="py-2.5">
                          <Badge variant={c.status === 'active' ? 'success' : 'secondary'} size="sm">
                            {getCustomerStatusLabel(c.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeReport === 'subscriptions' && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>پیش‌نمایش گزارش وضعیت اشتراک‌ها</CardTitle>
                <CardDescription>نمایش نمونه ردیف‌های خروجی اشتراک‌ها</CardDescription>
              </div>
              <Button size="sm" onClick={handleExportCurrentReport}>
                <Download className="w-4 h-4 ml-1.5" />
                <span>دانلود گزارش کامل اشتراک‌ها</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 font-semibold">شناسه</th>
                      <th className="py-2.5 font-semibold">مشترک</th>
                      <th className="py-2.5 font-semibold">پلن</th>
                      <th className="py-2.5 font-semibold">مبلغ دوره</th>
                      <th className="py-2.5 font-semibold">سررسید بعدی</th>
                      <th className="py-2.5 font-semibold">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {subscriptions.slice(0, 6).map((s) => (
                      <tr key={s.id} className="hover:bg-muted/30">
                        <td className="py-2.5 font-mono text-muted-foreground" dir="ltr">{s.id}</td>
                        <td className="py-2.5 font-semibold">{s.customerName}</td>
                        <td className="py-2.5">{getSubscriptionPlanLabel(s.plan)}</td>
                        <td className="py-2.5 font-bold">{formatToman(s.price)}</td>
                        <td className="py-2.5">{formatPersianDate(s.nextBillingDate)}</td>
                        <td className="py-2.5">
                          <Badge variant={s.status === 'active' ? 'success' : 'secondary'} size="sm">
                            {getSubscriptionStatusLabel(s.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeReport === 'transactions' && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>پیش‌نمایش ریز گزارش تراکنش‌ها</CardTitle>
                <CardDescription>نمایش آخرین تراکنش‌های بانکی برای خروجی حسابداری</CardDescription>
              </div>
              <Button size="sm" onClick={handleExportCurrentReport}>
                <Download className="w-4 h-4 ml-1.5" />
                <span>دانلود خروجی کامل تراکنش‌ها</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 font-semibold">شناسه</th>
                      <th className="py-2.5 font-semibold">کد پیگیری</th>
                      <th className="py-2.5 font-semibold">مشتری</th>
                      <th className="py-2.5 font-semibold">مبلغ</th>
                      <th className="py-2.5 font-semibold">شیوه پرداخت</th>
                      <th className="py-2.5 font-semibold">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {transactions.slice(0, 6).map((t) => (
                      <tr key={t.id} className="hover:bg-muted/30">
                        <td className="py-2.5 font-mono text-muted-foreground" dir="ltr">{t.id}</td>
                        <td className="py-2.5 font-mono text-muted-foreground" dir="ltr">{t.trackingCode}</td>
                        <td className="py-2.5 font-semibold">{t.customerName}</td>
                        <td className="py-2.5 font-bold">{formatToman(t.amount)}</td>
                        <td className="py-2.5">{getPaymentMethodLabel(t.paymentMethod)}</td>
                        <td className="py-2.5">
                          <Badge variant={t.status === 'completed' ? 'success' : 'secondary'} size="sm">
                            {getTransactionStatusLabel(t.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
