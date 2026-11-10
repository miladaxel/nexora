import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { DataProvider } from '@/context/DataContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Loader2 } from 'lucide-react';

// Lazy-loaded pages for optimized performance and bundle splitting
const OverviewPage = lazy(() =>
  import('@/pages/Overview/OverviewPage').then((m) => ({ default: m.OverviewPage }))
);
const AnalyticsPage = lazy(() =>
  import('@/pages/Analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);
const CustomersPage = lazy(() =>
  import('@/pages/Customers/CustomersPage').then((m) => ({ default: m.CustomersPage }))
);
const SubscriptionsPage = lazy(() =>
  import('@/pages/Subscriptions/SubscriptionsPage').then((m) => ({ default: m.SubscriptionsPage }))
);
const TransactionsPage = lazy(() =>
  import('@/pages/Transactions/TransactionsPage').then((m) => ({ default: m.TransactionsPage }))
);
const ReportsPage = lazy(() =>
  import('@/pages/Reports/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/Settings/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-muted-foreground">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
    <span className="text-xs font-medium">در حال فراخوانی داده‌های سامانه...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DataProvider>
          <HashRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<OverviewPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="subscriptions" element={<SubscriptionsPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </HashRouter>
        </DataProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
