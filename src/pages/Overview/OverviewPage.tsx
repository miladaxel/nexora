import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart';
import { CustomerGrowthLineChart } from '@/components/charts/CustomerGrowthLineChart';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { TransactionDetailModal } from '@/components/modals/TransactionDetailModal';
import {
  monthlyRevenueData,
  revenueCategoryDistribution,
  customerGrowthData,
} from '@/data/mockData';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
  Eye,
  Clock,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import {
  formatToman,
  formatPersianDate,
  toPersianDigits,
  getTransactionStatusLabel,
} from '@/lib/formatters';
import { Transaction } from '@/types';
import { Link } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const { metrics, transactions, customers, activities } = useData();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Top metric cards
  const metricCards = [
    {
      id: 'rev',
      title: 'مجموع درآمد',
      value: formatToman(metrics.totalRevenue),
      change: metrics.revenueGrowth,
      isPositive: true,
      period: 'نسبت به ماه گذشته',
      icon: DollarSign,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'mrr',
      title: 'درآمد ماهانه تکرارشونده (MRR)',
      value: formatToman(metrics.mrr),
      change: metrics.mrrGrowth,
      isPositive: true,
      period: 'رشد درآمد دوره‌ای',
      icon: Activity,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'cust',
      title: 'مشتریان فعال',
      value: `${toPersianDigits(metrics.activeCustomersCount)} مشتری`,
      change: metrics.customerGrowth,
      isPositive: true,
      period: 'افزایش اشتراک‌ها',
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'trx',
      title: 'تعداد تراکنش‌ها',
      value: `${toPersianDigits(metrics.totalTransactionsCount)} تراکنش`,
      change: metrics.transactionGrowth,
      isPositive: true,
      period: 'تراکنش‌های ثبت شده',
      icon: CreditCard,
      color: 'from-amber-600 to-orange-600',
    },
  ];

  // Top customers by total spent
  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              نمای کلی سامانه
            </h1>
            <Badge variant="default" size="sm">
              <Sparkles className="w-3 h-3 text-primary ml-1" />
              داشبورد زنده
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            پایش لحظه‌ای شاخص‌های کلیدی مالی، رشد کاربران و جریان نقدی کسب‌وکار
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/reports">
            <Button variant="outline" size="sm">
              دریافت گزارش تفصیلی
            </Button>
          </Link>
          <Link to="/customers">
            <Button size="sm">
              مدیریت مشتریان
              <ChevronLeft className="w-4 h-4 mr-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.id} className="relative overflow-hidden group hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-xl md:text-2xl font-black text-foreground mb-3 tracking-tight">
                  {card.value}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                  <div
                    className={`flex items-center gap-1 font-semibold ${
                      card.isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {card.isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>{toPersianDigits(card.change)}٪+</span>
                  </div>
                  <span className="text-muted-foreground text-[11px]">{card.period}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Row 1 Charts: Revenue Overview (Area) & Category Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>نمودار روند درآمد و هدف فروش</CardTitle>
              <CardDescription>
                تحلیل درآمد تجمیعی ماهانه در مقایسه با تارگت‌های هدف‌گذاری شده
              </CardDescription>
            </div>
            <Badge variant="outline" size="sm">
              سال جاری
            </Badge>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart data={monthlyRevenueData} height={320} />
          </CardContent>
        </Card>

        {/* Revenue Distribution Donut (1 col) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>سهم درآمد به تفکیک پلن‌ها</CardTitle>
            <CardDescription>توزیع حجم درآمدهای دریافتی بر اساس نوع سرویس</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryDonutChart data={revenueCategoryDistribution} height={250} />
          </CardContent>
        </Card>
      </div>

      {/* Row 2 Charts & Data: Customer Growth & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Growth Line Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>نرخ رشد و جذب مشتریان</CardTitle>
              <CardDescription>
                مقایسه تعداد کاربران فعال ماهانه و نرخ ورود مشترکین جدید
              </CardDescription>
            </div>
            <Link to="/analytics" className="text-xs text-primary hover:underline font-medium">
              مشاهده جزئیات تحلیل
            </Link>
          </CardHeader>
          <CardContent>
            <CustomerGrowthLineChart data={customerGrowthData} height={280} />
          </CardContent>
        </Card>

        {/* Recent Activities (1 col) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>آخرین رویدادها</CardTitle>
              <CardDescription>جریان فعالیت‌های اخیر ثبت شده در سیستم</CardDescription>
            </div>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-right">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{act.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatPersianDate(act.timestamp, { showTime: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Recent Transactions & Top Customers Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>آخرین تراکنش‌های مالی</CardTitle>
              <CardDescription>فهرست پرداخت‌های دریافتی اخیر از درگاه‌ها</CardDescription>
            </div>
            <Link to="/transactions">
              <Button variant="outline" size="sm">
                مشاهده همه
                <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="pb-3 font-semibold pr-2">شناسه</th>
                    <th className="pb-3 font-semibold">مشتری</th>
                    <th className="pb-3 font-semibold">مبلغ</th>
                    <th className="pb-3 font-semibold">تاریخ</th>
                    <th className="pb-3 font-semibold">وضعیت</th>
                    <th className="pb-3 font-semibold text-center">جزئیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentTransactions.map((trx) => {
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
                        <td className="py-3 font-mono font-medium text-muted-foreground pr-2" dir="ltr">
                          {trx.id}
                        </td>
                        <td className="py-3 font-semibold text-foreground">{trx.customerName}</td>
                        <td className="py-3 font-bold text-foreground">
                          {formatToman(trx.amount)}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {formatPersianDate(trx.date)}
                        </td>
                        <td className="py-3">
                          <Badge variant={statusVariant} size="sm">
                            {getTransactionStatusLabel(trx.status)}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => setSelectedTransaction(trx)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors inline-flex items-center"
                            title="مشاهده رسید"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Customers (1 col) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>مشتریان برتر</CardTitle>
              <CardDescription>بر اساس بیشترین ارزش خرید تجمیعی</CardDescription>
            </div>
            <Link to="/customers" className="text-xs text-primary hover:underline font-medium">
              فهرست کامل
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5">
              {topCustomers.map((c, index) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-muted text-[11px] font-bold text-muted-foreground flex items-center justify-center">
                      {toPersianDigits(index + 1)}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-foreground">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground">{c.company || c.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {formatToman(c.totalSpent, { compact: true })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Detail Receipt Modal */}
      <TransactionDetailModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );
};
