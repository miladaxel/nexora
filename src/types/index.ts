export type CustomerStatus = 'active' | 'inactive' | 'pending';
export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'trialing' | 'past_due';
export type BillingCycle = 'monthly' | 'yearly';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'shaparak' | 'card_to_card' | 'paya' | 'wallet';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: CustomerStatus;
  joinDate: string; // ISO string
  totalSpent: number; // in Toman
  plan: SubscriptionPlan;
  city?: string;
  company?: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  price: number; // in Toman
  startDate: string;
  nextBillingDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
}

export interface Transaction {
  id: string;
  trackingCode: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  amount: number; // in Toman
  status: TransactionStatus;
  date: string;
  paymentMethod: PaymentMethod;
  description: string;
  invoiceNumber: string;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: number;
  isPositive: boolean;
  periodText: string;
  iconName: string;
}

export interface RecentActivity {
  id: string;
  type: 'new_customer' | 'new_subscription' | 'cancel_subscription' | 'transaction' | 'report_export';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export type DateFilterRange = 'today' | '7days' | '30days' | '3months' | '6months' | '1year' | 'custom';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  role: string;
  avatar: string;
}

export interface NotificationSettings {
  emailReports: boolean;
  transactionAlerts: boolean;
  subscriptionRenewals: boolean;
  systemNotifications: boolean;
  securityAlerts: boolean;
}

export interface AccountPreferences {
  language: 'fa' | 'en';
  currency: 'IRT' | 'IRR';
  dateFormat: 'persian' | 'gregorian';
  numberFormat: 'persian' | 'english';
}

export interface UserSettings {
  profile: UserProfile;
  notifications: NotificationSettings;
  preferences: AccountPreferences;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  timestamp: number;
}
