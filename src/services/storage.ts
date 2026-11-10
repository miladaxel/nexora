import { Customer, Subscription, Transaction, RecentActivity, UserSettings } from '@/types';
import {
  initialCustomers,
  initialSubscriptions,
  initialTransactions,
  initialActivities,
  initialUserSettings,
} from '@/data/mockData';

const STORAGE_KEYS = {
  CUSTOMERS: 'nexora_customers_v1',
  SUBSCRIPTIONS: 'nexora_subscriptions_v1',
  TRANSACTIONS: 'nexora_transactions_v1',
  ACTIVITIES: 'nexora_activities_v1',
  SETTINGS: 'nexora_user_settings_v1',
  THEME: 'nexora_theme_v1',
} as const;

export const storage = {
  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : initialCustomers;
    } catch (e) {
      console.error('Failed to read customers from storage', e);
      return initialCustomers;
    }
  },

  setCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to write customers to storage', e);
    }
  },

  getSubscriptions(): Subscription[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      return data ? JSON.parse(data) : initialSubscriptions;
    } catch (e) {
      console.error('Failed to read subscriptions from storage', e);
      return initialSubscriptions;
    }
  },

  setSubscriptions(subscriptions: Subscription[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
    } catch (e) {
      console.error('Failed to write subscriptions to storage', e);
    }
  },

  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : initialTransactions;
    } catch (e) {
      console.error('Failed to read transactions from storage', e);
      return initialTransactions;
    }
  },

  setTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to write transactions to storage', e);
    }
  },

  getActivities(): RecentActivity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : initialActivities;
    } catch (e) {
      console.error('Failed to read activities from storage', e);
      return initialActivities;
    }
  },

  setActivities(activities: RecentActivity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to write activities to storage', e);
    }
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : initialUserSettings;
    } catch (e) {
      console.error('Failed to read settings from storage', e);
      return initialUserSettings;
    }
  },

  setSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to write settings to storage', e);
    }
  },

  getTheme(): 'light' | 'dark' {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (theme === 'light' || theme === 'dark') return theme;
      // Default to light or check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  },

  setTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error('Failed to write theme to storage', e);
    }
  },

  resetAllToDefaults(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
      localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  },
};
