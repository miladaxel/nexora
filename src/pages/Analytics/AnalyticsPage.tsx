import React, { useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart';
import { CustomerGrowthLineChart } from '@/components/charts/CustomerGrowthLineChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import {
  monthlyRevenueData,
  customerGrowthData,
  retentionCohortData,
} from '@/data/mockData';
import {
  TrendingUp,
  BarChart3,
  Percent,
  Users2,
  DollarSign,
} from 'lucide-react';
import { DateFilterRange } from '@/types';
import { formatToman, toPersianDigits } from '@/lib/formatters';

export const AnalyticsPage: React.FC = () => {
  const { dateRange, setDateRange } = useData();

  const filterButtons: { label: string; value: DateFilterRange }[] = [
    { label: 'امروز', value: 'today' },
    { label: '۷ روز گذشته', value: '7days' },
    { label: '۳۰ روز گذشته', value: '30days' },
    { label: '۳ ماه گذشته', value: '3months' },
    { label: '۶ ماه گذشته', value: '6months' },
    { label: 'یک سال گذشته', value: '1year' },
  ];

  // Dynamic multipliers based on selected date range to demonstrate live responsive filtering
  const rangeMultiplier = useMemo(() => {
    switch (dateRange) {
      case 'today':
        return 0.08;
      case '7days':
        return 0.25;
      case '30days':
        return 1.0;
      case '3months':
        return 2.8;
      case '6months':
        return 5.4;
      case '1year':
        return 10.2;
      default:
        return 1.0;
    }
  }, [dateRange]);

  // Scaled summary figures
  const dynamicRevenue = Math.round(158900000 * rangeMultiplier);
  const conversionRate = 4.8;
  const churnRate = 1.9;
  const ltv = 24500000;

  // Filtered dataset slice
  const filteredMonthlyData = useMemo(() => {
    if (dateRange === 'today' || dateRange === '7days') {
      return monthlyRevenueData.slice(-3);
    }
    if (dateRange === '30days' || dateRange === '3months') {
      return monthlyRevenueData.slice(-6);
    }
    return monthlyRevenueData;
  }, [dateRange]);

  const filteredCustomerData = useMemo(() => {
    if (dateRange === 'today' || dateRange === '7days') {
      return customerGrowthData.slice(-3);
    }
    if (dateRange === '30days' || dateRange === '3months') {
      return customerGrowthData.slice(-6);
    }
    return customerGrowthData;
  }, [dateRange]);

  return (
    <div className="space-y-6">
      {/* Page Title & Filter toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            تحلیل و شاخص‌های پیشرفته کسب‌وکار
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            بررسی الگوهای رفتاری، درآمد تکرارشونده، ضریب ماندگاری (Retention) و شاخص‌های SaaS
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap p-1 rounded-2xl bg-card border border-border shadow-sm">
          {filterButtons.map((btn) => {
            const isActive = dateRange === btn.value;
            return (
              <button
                key={btn.value}
                onClick={() => setDateRange(btn.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total revenue in range */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">درآمد دوره انتخابی</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-foreground">
              {formatToman(dynamicRevenue)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{toPersianDigits(16.4)}٪+ رشد نسبت به دوره قبل</span>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">نرخ تبدیل به خرید (CVR)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-foreground">
              {toPersianDigits(conversionRate)}٪
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{toPersianDigits(0.8)}٪+ بهبود قیف فروش</span>
            </div>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">نرخ ریزش مشتریان (Churn)</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Users2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-foreground">
              {toPersianDigits(churnRate)}٪
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              وضعیت عالی (استاندارد جهانی کمتر از ۳٪)
            </p>
          </CardContent>
        </Card>

        {/* LTV to CAC Ratio */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">نسبت LTV به CAC</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-foreground">
              {toPersianDigits(13.2)}x
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              ارزش طول عمر: {formatToman(ltv, { compact: true })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts: Revenue vs Target Comparison & Monthly MRR Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>روند درآمد دوره‌ای</CardTitle>
            <CardDescription>
              بررسی پیوسته فروش در بازه زمانی {filterButtons.find((f) => f.value === dateRange)?.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart data={filteredMonthlyData} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مقایسه عملکرد ماهانه و MRR</CardTitle>
            <CardDescription>
              مقایسه درآمد کل با درآمد پایدار تکرارشونده اشتراک‌ها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyBarChart data={filteredMonthlyData} height={300} />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Customer Acquisition & Retention Cohort Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Growth */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>شاخص‌های جذب و حفظ مشتری</CardTitle>
            <CardDescription>تعداد کاربران فعال به تفکیک ماه‌های مختلف</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerGrowthLineChart data={filteredCustomerData} height={280} />
          </CardContent>
        </Card>

        {/* Cohort Retention Table */}
        <Card>
          <CardHeader>
            <CardTitle>تحلیل ماندگاری (Retention Cohort)</CardTitle>
            <CardDescription>درصد مشتریان حفظ‌شده پس از ماه‌های ثبت‌نام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {retentionCohortData.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{item.cohort}</span>
                    <span className="font-bold text-primary">{toPersianDigits(item.rate)}٪</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground leading-relaxed text-right">
              میانگین ماندگاری ۶ ماهه در نکسورا ۸۱٪ است که نشان‌دهنده رضایت بالای مشتریان از ماژول‌های تحلیلی است.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
