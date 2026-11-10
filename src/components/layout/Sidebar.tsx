import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '@/context/DataContext';
import { toPersianDigits } from '@/lib/formatters';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { customers, subscriptions } = useData();

  const activeCustCount = customers.filter((c) => c.status === 'active').length;
  const activeSubsCount = subscriptions.filter((s) => s.status === 'active').length;

  const navItems = [
    {
      to: '/',
      label: 'نمای کلی',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/analytics',
      label: 'تحلیل و آمار',
      icon: BarChart3,
      badge: null,
    },
    {
      to: '/customers',
      label: 'مشتریان',
      icon: Users,
      badge: toPersianDigits(activeCustCount),
    },
    {
      to: '/subscriptions',
      label: 'اشتراک‌ها',
      icon: CreditCard,
      badge: toPersianDigits(activeSubsCount),
    },
    {
      to: '/transactions',
      label: 'تراکنش‌ها',
      icon: Receipt,
      badge: null,
    },
    {
      to: '/reports',
      label: 'گزارش‌ها',
      icon: FileSpreadsheet,
      badge: null,
    },
    {
      to: '/settings',
      label: 'تنظیمات',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 right-0 z-40 bg-card border-l border-border flex flex-col transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64',
          // Mobile state
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/80">
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center w-full')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-wide text-foreground flex items-center gap-1.5">
                  نکسورا
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
                    Nexora
                  </span>
                </span>
                <span className="text-[11px] text-muted-foreground">سامانه هوشمند تحلیل کسب‌وکار</span>
              </div>
            )}
          </div>

          {/* Collapse Toggle for Desktop */}
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="جمع کردن منو"
              aria-label="جمع کردن منو"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
                    isCollapsed && 'justify-center px-2'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span
                        className={cn(
                          'text-[11px] px-2 py-0.5 rounded-full font-bold',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-muted text-muted-foreground group-hover:bg-card'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && (
                      <div className="absolute right-full mr-2 hidden group-hover:flex items-center px-2.5 py-1 rounded-md bg-popover text-popover-foreground text-xs shadow-md whitespace-nowrap z-50 border border-border">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Collapsed Expand Button */}
        {isCollapsed && (
          <div className="p-3 border-t border-border/60 hidden lg:flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="باز کردن منو"
              aria-label="باز کردن منو"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Bottom Local Demo Status Card */}
        {!isCollapsed && (
          <div className="p-3 m-3 rounded-xl bg-muted/50 border border-border/60 text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-foreground">حالت دمو لوکال (Frontend-Only)</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              داده‌ها در LocalStorage مرورگر ذخیره می‌شوند و نیاز به اینترنت و سرور بک‌اند ندارد.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
