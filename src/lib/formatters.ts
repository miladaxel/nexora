import { CustomerStatus, SubscriptionPlan, SubscriptionStatus, TransactionStatus, PaymentMethod } from '@/types';

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

export function formatPersianNumber(value: number): string {
  try {
    return new Intl.NumberFormat('fa-IR').format(value);
  } catch {
    return toPersianDigits(value.toLocaleString('en-US'));
  }
}

export function formatToman(amount: number, options?: { showUnit?: boolean; compact?: boolean }): string {
  const { showUnit = true, compact = false } = options || {};

  if (compact) {
    if (amount >= 1_000_000_000) {
      const billions = (amount / 1_000_000_000).toFixed(1);
      return `${toPersianDigits(billions)} میلیارد${showUnit ? ' تومان' : ''}`;
    }
    if (amount >= 1_000_000) {
      const millions = (amount / 1_000_000).toFixed(1);
      return `${toPersianDigits(millions)} میلیون${showUnit ? ' تومان' : ''}`;
    }
  }

  const formatted = formatPersianNumber(amount);
  return showUnit ? `${formatted} تومان` : formatted;
}

export function formatPersianDate(
  dateInput: string | Date | number,
  options?: { showTime?: boolean; monthFormat?: 'long' | 'short' | 'numeric' }
): string {
  if (!dateInput) return '-';
  try {
    const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '-';

    const { showTime = false, monthFormat = 'long' } = options || {};

    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: monthFormat,
      day: 'numeric',
      ...(showTime
        ? {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }
        : {}),
    });

    return formatter.format(date);
  } catch {
    return String(dateInput);
  }
}

export function formatRelativeTime(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'لحظاتی پیش';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${toPersianDigits(diffInMinutes)} دقیقه پیش`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${toPersianDigits(diffInHours)} ساعت پیش`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${toPersianDigits(diffInDays)} روز پیش`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${toPersianDigits(diffInMonths)} ماه پیش`;
}

export function getCustomerStatusLabel(status: CustomerStatus): string {
  switch (status) {
    case 'active':
      return 'فعال';
    case 'inactive':
      return 'غیرفعال';
    case 'pending':
      return 'در انتظار تایید';
    default:
      return status;
  }
}

export function getSubscriptionPlanLabel(plan: SubscriptionPlan): string {
  switch (plan) {
    case 'basic':
      return 'پایه';
    case 'pro':
      return 'حرفه‌ای';
    case 'enterprise':
      return 'سازمانی';
    default:
      return plan;
  }
}

export function getSubscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
      return 'فعال';
    case 'canceled':
      return 'لغو شده';
    case 'trialing':
      return 'آزمایشی';
    case 'past_due':
      return 'معوقه';
    default:
      return status;
  }
}

export function getTransactionStatusLabel(status: TransactionStatus): string {
  switch (status) {
    case 'completed':
      return 'موفق';
    case 'pending':
      return 'در انتظار پرداخت';
    case 'failed':
      return 'ناموفق';
    case 'refunded':
      return 'مسترد شده';
    default:
      return status;
  }
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'shaparak':
      return 'درگاه شاپرک';
    case 'card_to_card':
      return 'کارت به کارت';
    case 'paya':
      return 'انتقال پایا / ساتنا';
    case 'wallet':
      return 'اعتبار کیف پول';
    default:
      return method;
  }
}
