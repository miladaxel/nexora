import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Transaction, TransactionStatus, PaymentMethod } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { TransactionDetailModal } from '@/components/modals/TransactionDetailModal';
import {
  Receipt,
  Search,
  ArrowUpDown,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  formatToman,
  formatPersianDate,
  getTransactionStatusLabel,
  getPaymentMethodLabel,
  toPersianDigits,
} from '@/lib/formatters';
import { downloadCSV } from '@/lib/csvExport';

type SortField = 'date' | 'amount' | 'customerName' | 'status';
type SortOrder = 'asc' | 'desc';

export const TransactionsPage: React.FC = () => {
  const { transactions } = useData();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected Transaction Modal
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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
  const processedTransactions = useMemo(() => {
    return transactions
      .filter((trx) => {
        const matchesSearch =
          trx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trx.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (trx.description && trx.description.includes(searchQuery));

        const matchesStatus = statusFilter === 'all' || trx.status === statusFilter;
        const matchesMethod = methodFilter === 'all' || trx.paymentMethod === methodFilter;

        return matchesSearch && matchesStatus && matchesMethod;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'customerName') {
          comp = a.customerName.localeCompare(b.customerName, 'fa');
        } else if (sortField === 'amount') {
          comp = a.amount - b.amount;
        } else if (sortField === 'date') {
          comp = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortField === 'status') {
          comp = a.status.localeCompare(b.status);
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [transactions, searchQuery, statusFilter, methodFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(processedTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedTransactions.slice(start, start + pageSize);
  }, [processedTransactions, currentPage, pageSize]);

  // Statistics
  const totalVolume = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const completedCount = transactions.filter((t) => t.status === 'completed').length;
  const pendingCount = transactions.filter((t) => t.status === 'pending').length;
  const failedCount = transactions.filter((t) => t.status === 'failed').length;

  const handleExportCSV = () => {
    const headers = [
      'شناسه تراکنش',
      'کد پیگیری',
      'نام مشتری',
      'مبلغ (تومان)',
      'وضعیت پرداخت',
      'شیوه پرداخت',
      'شماره فاکتور',
      'تاریخ و زمان',
    ];

    const rows = processedTransactions.map((t) => [
      t.id,
      t.trackingCode,
      t.customerName,
      t.amount,
      getTransactionStatusLabel(t.status),
      getPaymentMethodLabel(t.paymentMethod),
      t.invoiceNumber,
      formatPersianDate(t.date, { showTime: true }),
    ]);

    downloadCSV('تراکنش‌های_مالی_نکسورا', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            تراکنش‌های مالی
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            پیگیری پرداخت‌های الکترونیک، واریزهای پایا و کارت به کارت، صدور فاکتور و وضعیت تسویه
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4 ml-1.5" />
          <span>خروجی اکسل (CSV)</span>
        </Button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-muted-foreground block mb-1">کل حجم تراکنش‌های موفق</span>
            <div className="text-xl font-black text-foreground">
              {formatToman(totalVolume)}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              تسویه‌شده با درگاه‌های شتابی
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-muted-foreground block mb-1">تراکنش‌های موفق</span>
            <div className="text-2xl font-black text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{toPersianDigits(completedCount)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">نرخ موفقیت ۹۶.۴٪</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-muted-foreground block mb-1">در انتظار پرداخت / تایید فیش</span>
            <div className="text-2xl font-black text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>{toPersianDigits(pendingCount)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">نیازمند بررسی تیم مالی</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-muted-foreground block mb-1">ناموفق یا مسترد شده</span>
            <div className="text-2xl font-black text-foreground flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <span>{toPersianDigits(failedCount)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">خطای شتاب یا لغو خرید</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Transactions Table Card */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:max-w-sm">
              <Input
                placeholder="جستجو بر اساس نام مشتری، کد پیگیری یا شناسه تراکنش..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'completed', 'pending', 'failed', 'refunded'] as const).map((status) => {
                const labelMap = {
                  all: 'همه وضعیت‌ها',
                  completed: 'موفق',
                  pending: 'در انتظار',
                  failed: 'ناموفق',
                  refunded: 'مسترد شده',
                };
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
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
        </CardHeader>

        <CardContent className="p-0">
          {processedTransactions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Receipt className="w-10 h-10" />}
                title="تراکنشی با مشخصات مدنظر پیدا نشد"
                description="عبارت جستجو یا وضعیت فیلتر را تغییر دهید."
                actionLabel="مشاهده همه تراکنش‌ها"
                onAction={() => {
                  setStatusFilter('all');
                  setMethodFilter('all');
                  setSearchQuery('');
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                    <th className="py-3.5 px-4 font-semibold">شناسه و کد پیگیری</th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center gap-1">
                        <span>مشتری</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center gap-1">
                        <span>مبلغ</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-semibold">شیوه پرداخت</th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-1">
                        <span>زمان تراکنش</span>
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
                    <th className="py-3.5 px-4 font-semibold text-center">مشاهده رسید</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedTransactions.map((trx) => {
                    const statusVariant =
                      trx.status === 'completed'
                        ? 'success'
                        : trx.status === 'pending'
                        ? 'warning'
                        : trx.status === 'failed'
                        ? 'destructive'
                        : 'secondary';

                    return (
                      <tr key={trx.id} className="hover:bg-muted/40 transition-colors group">
                        <td className="py-3.5 px-4">
                          <p className="font-mono font-medium text-foreground" dir="ltr">
                            {trx.id}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground mt-0.5" dir="ltr">
                            {trx.trackingCode}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-foreground">{trx.customerName}</p>
                          <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                            {trx.description || trx.invoiceNumber}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 font-extrabold text-foreground">
                          {formatToman(trx.amount)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-muted-foreground font-medium">
                            {getPaymentMethodLabel(trx.paymentMethod)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground">
                          {formatPersianDate(trx.date, { showTime: true })}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant={statusVariant} size="sm">
                            {getTransactionStatusLabel(trx.status)}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTransaction(trx)}
                            className="h-8 px-2.5"
                          >
                            <Eye className="w-3.5 h-3.5 ml-1" />
                            <span>رسید</span>
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
              totalItems={processedTransactions.length}
              pageSize={pageSize}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <TransactionDetailModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );
};
