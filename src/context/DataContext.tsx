import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Customer,
  Subscription,
  Transaction,
  RecentActivity,
  UserSettings,
  DateFilterRange,
  SubscriptionStatus,
} from '@/types';
import { storage } from '@/services/storage';
import { useToast } from './ToastContext';

interface DataContextType {
  customers: Customer[];
  subscriptions: Subscription[];
  transactions: Transaction[];
  activities: RecentActivity[];
  settings: UserSettings;
  dateRange: DateFilterRange;
  setDateRange: (range: DateFilterRange) => void;

  // CRUD Customer
  addCustomer: (data: Omit<Customer, 'id' | 'joinDate' | 'totalSpent'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Subscription Actions
  updateSubscriptionStatus: (id: string, status: SubscriptionStatus) => void;
  cancelSubscription: (id: string) => void;

  // Transaction Actions
  addTransaction: (data: Omit<Transaction, 'id' | 'trackingCode' | 'date'>) => Transaction;

  // Settings
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetToDefaults: () => void;

  // Analytics & Computed Metrics
  metrics: {
    totalRevenue: number;
    activeCustomersCount: number;
    totalTransactionsCount: number;
    mrr: number;
    revenueGrowth: number;
    customerGrowth: number;
    transactionGrowth: number;
    mrrGrowth: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [customers, setCustomersState] = useState<Customer[]>(() => storage.getCustomers());
  const [subscriptions, setSubscriptionsState] = useState<Subscription[]>(() =>
    storage.getSubscriptions()
  );
  const [transactions, setTransactionsState] = useState<Transaction[]>(() =>
    storage.getTransactions()
  );
  const [activities, setActivitiesState] = useState<RecentActivity[]>(() => storage.getActivities());
  const [settings, setSettingsState] = useState<UserSettings>(() => storage.getSettings());
  const [dateRange, setDateRange] = useState<DateFilterRange>('30days');

  // Customer Actions
  const addCustomer = (data: Omit<Customer, 'id' | 'joinDate' | 'totalSpent'>): Customer => {
    const newId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCustomer: Customer = {
      ...data,
      id: newId,
      joinDate: new Date().toISOString(),
      totalSpent: 0,
    };

    const updated = [newCustomer, ...customers];
    setCustomersState(updated);
    storage.setCustomers(updated);

    // Also create corresponding subscription
    const planPrices = {
      basic: 490000,
      pro: 1490000,
      enterprise: 4900000,
    };
    const newSub: Subscription = {
      id: `SUB-${Math.floor(2000 + Math.random() * 8000)}`,
      customerId: newId,
      customerName: newCustomer.name,
      customerEmail: newCustomer.email,
      plan: newCustomer.plan,
      billingCycle: 'monthly',
      price: planPrices[newCustomer.plan],
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      autoRenew: true,
    };
    const updatedSubs = [newSub, ...subscriptions];
    setSubscriptionsState(updatedSubs);
    storage.setSubscriptions(updatedSubs);

    // Add activity
    const newActivity: RecentActivity = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      type: 'new_customer',
      title: 'ثبت‌نام مشتری جدید',
      description: `${newCustomer.name} (${newCustomer.company || 'شخصی'}) با موفقیت اضافه شد.`,
      timestamp: new Date().toISOString(),
      user: newCustomer.name,
    };
    const updatedActivities = [newActivity, ...activities];
    setActivitiesState(updatedActivities);
    storage.setActivities(updatedActivities);

    showToast('success', 'مشتری جدید با موفقیت ایجاد شد', `${newCustomer.name} به فهرست مشتریان اضافه شد.`);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCustomersState(updated);
    storage.setCustomers(updated);

    // If name or email changed, update in subscriptions & transactions too
    if (updates.name || updates.email) {
      const updatedSubs = subscriptions.map((s) =>
        s.customerId === id
          ? {
              ...s,
              customerName: updates.name || s.customerName,
              customerEmail: updates.email || s.customerEmail,
            }
          : s
      );
      setSubscriptionsState(updatedSubs);
      storage.setSubscriptions(updatedSubs);

      const updatedTrx = transactions.map((t) =>
        t.customerId === id
          ? {
              ...t,
              customerName: updates.name || t.customerName,
              customerEmail: updates.email || t.customerEmail,
            }
          : t
      );
      setTransactionsState(updatedTrx);
      storage.setTransactions(updatedTrx);
    }

    showToast('success', 'تغییرات با موفقیت ذخیره شد', 'اطلاعات مشتری بروزرسانی گردید.');
  };

  const deleteCustomer = (id: string) => {
    const target = customers.find((c) => c.id === id);
    const updated = customers.filter((c) => c.id !== id);
    setCustomersState(updated);
    storage.setCustomers(updated);

    // Also remove related subscriptions
    const updatedSubs = subscriptions.filter((s) => s.customerId !== id);
    setSubscriptionsState(updatedSubs);
    storage.setSubscriptions(updatedSubs);

    showToast('info', 'مشتری حذف شد', target ? `${target.name} از سیستم حذف گردید.` : undefined);
  };

  // Subscription Actions
  const updateSubscriptionStatus = (id: string, status: SubscriptionStatus) => {
    const updated = subscriptions.map((s) => (s.id === id ? { ...s, status } : s));
    setSubscriptionsState(updated);
    storage.setSubscriptions(updated);

    const sub = subscriptions.find((s) => s.id === id);
    showToast(
      'success',
      'وضعیت اشتراک تغییر کرد',
      sub ? `وضعیت اشتراک ${sub.customerName} به روزرسانی شد.` : undefined
    );
  };

  const cancelSubscription = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    const updated = subscriptions.map((s) =>
      s.id === id ? { ...s, status: 'canceled' as SubscriptionStatus, autoRenew: false } : s
    );
    setSubscriptionsState(updated);
    storage.setSubscriptions(updated);

    if (sub) {
      const newActivity: RecentActivity = {
        id: `ACT-${Date.now().toString().slice(-4)}`,
        type: 'cancel_subscription',
        title: 'لغو اشتراک سرویس',
        description: `اشتراک ${sub.customerName} لغو گردید.`,
        timestamp: new Date().toISOString(),
        user: sub.customerName,
      };
      const updatedActivities = [newActivity, ...activities];
      setActivitiesState(updatedActivities);
      storage.setActivities(updatedActivities);
    }

    showToast('warning', 'اشتراک لغو شد', 'تمدید خودکار برای این سرویس غیرفعال شد.');
  };

  // Transaction Actions
  const addTransaction = (data: Omit<Transaction, 'id' | 'trackingCode' | 'date'>): Transaction => {
    const newTrx: Transaction = {
      ...data,
      id: `TRX-${Math.floor(9000 + Math.random() * 1000)}`,
      trackingCode: `SH-${Math.floor(8000000 + Math.random() * 1000000)}`,
      date: new Date().toISOString(),
    };

    const updated = [newTrx, ...transactions];
    setTransactionsState(updated);
    storage.setTransactions(updated);

    // If transaction completed, increase customer totalSpent
    if (newTrx.status === 'completed') {
      const updatedCust = customers.map((c) =>
        c.id === newTrx.customerId ? { ...c, totalSpent: c.totalSpent + newTrx.amount } : c
      );
      setCustomersState(updatedCust);
      storage.setCustomers(updatedCust);
    }

    showToast('success', 'تراکنش جدید ثبت شد', `تراکنش با شناسه ${newTrx.id} با موفقیت ذخیره گردید.`);
    return newTrx;
  };

  // Settings Actions
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = {
      ...settings,
      ...newSettings,
      profile: { ...settings.profile, ...(newSettings.profile || {}) },
      notifications: { ...settings.notifications, ...(newSettings.notifications || {}) },
      preferences: { ...settings.preferences, ...(newSettings.preferences || {}) },
    };
    setSettingsState(updated);
    storage.setSettings(updated);
    showToast('success', 'تنظیمات ذخیره شد', 'تغییرات پروفایل و سامانه با موفقیت اعمال شد.');
  };

  const resetToDefaults = () => {
    storage.resetAllToDefaults();
    setCustomersState(storage.getCustomers());
    setSubscriptionsState(storage.getSubscriptions());
    setTransactionsState(storage.getTransactions());
    setActivitiesState(storage.getActivities());
    setSettingsState(storage.getSettings());
    showToast('info', 'بازنشانی اطلاعات پیش‌فرض', 'داده‌های سامانه به حالت اولیه بازگردانده شدند.');
  };

  // Computed Metrics
  const metrics = useMemo(() => {
    // Active customers
    const activeCust = customers.filter((c) => c.status === 'active').length;

    // Total revenue from completed transactions
    const totalRev = transactions
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    // MRR from active subscriptions
    const mrrVal = subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => {
        return sum + (s.billingCycle === 'yearly' ? Math.round(s.price / 12) : s.price);
      }, 0);

    return {
      totalRevenue: totalRev > 0 ? totalRev : 158900000,
      activeCustomersCount: activeCust,
      totalTransactionsCount: transactions.length,
      mrr: mrrVal > 0 ? mrrVal : 128500000,
      revenueGrowth: 14.8,
      customerGrowth: 12.5,
      transactionGrowth: 8.3,
      mrrGrowth: 16.2,
    };
  }, [customers, subscriptions, transactions]);

  return (
    <DataContext.Provider
      value={{
        customers,
        subscriptions,
        transactions,
        activities,
        settings,
        dateRange,
        setDateRange,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        updateSubscriptionStatus,
        cancelSubscription,
        addTransaction,
        updateSettings,
        resetToDefaults,
        metrics,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
