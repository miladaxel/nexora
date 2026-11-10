import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Calendar,
  Check,
  RotateCcw,
  User,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { DateFilterRange } from '@/types';
import { SearchPaletteModal } from '@/components/modals/SearchPaletteModal';
import { formatRelativeTime } from '@/lib/formatters';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { theme, toggleTheme } = useTheme();
  const { dateRange, setDateRange, activities, settings, resetToDefaults } = useData();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setIsDateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const dateOptions: { label: string; value: DateFilterRange }[] = [
    { label: 'امروز', value: 'today' },
    { label: '۷ روز گذشته', value: '7days' },
    { label: '۳۰ روز گذشته', value: '30days' },
    { label: '۳ ماه گذشته', value: '3months' },
    { label: '۶ ماه گذشته', value: '6months' },
    { label: 'یک سال گذشته', value: '1year' },
  ];

  const currentDateLabel =
    dateOptions.find((opt) => opt.value === dateRange)?.label || '۳۰ روز گذشته';

  return (
    <>
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between transition-colors">
        {/* Right side: Mobile Menu + Search bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Mobile hamburger button */}
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="منوی اصلی"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-input bg-background/60 hover:bg-muted/70 text-muted-foreground hover:text-foreground text-xs md:text-sm transition-all w-full max-w-xs justify-between group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>جستجو در نکسورا...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-border bg-muted text-muted-foreground">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Left side actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Date Range Selector */}
          <div className="relative" ref={dateRef}>
            <button
              onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
              className="flex items-center gap-2 h-9 px-3 rounded-xl border border-input bg-card hover:bg-muted text-xs font-medium text-foreground transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">{currentDateLabel}</span>
            </button>

            {isDateMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-2xl border border-border bg-card p-1.5 shadow-xl z-50 animate-fade-in text-right">
                <p className="text-[11px] font-semibold text-muted-foreground px-2.5 py-1 mb-1">
                  فیلتر بازه زمانی
                </p>
                {dateOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setDateRange(opt.value);
                      setIsDateMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-colors"
                  >
                    <span>{opt.label}</span>
                    {dateRange === opt.value && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
            title={theme === 'dark' ? 'حالت روز' : 'حالت شب'}
            aria-label="تغییر تم"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative border border-transparent hover:border-border"
              aria-label="اعلان‌ها"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-border bg-card p-3 shadow-2xl z-50 animate-fade-in text-right">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                  <span className="text-xs font-bold text-foreground">اعلان‌ها و رویدادها</span>
                  <span className="text-[11px] text-primary hover:underline cursor-pointer">
                    مشاهده همه
                  </span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-2 rounded-xl hover:bg-muted/60 transition-colors text-right"
                    >
                      <p className="text-xs font-semibold text-foreground">{act.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        {act.description}
                      </p>
                      <span className="text-[10px] text-muted-foreground/75 mt-1 block">
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-muted transition-colors border border-border/60"
            >
              <img
                src={settings.profile.avatar}
                alt={settings.profile.fullName}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-primary/30"
              />
              <span className="text-xs font-semibold text-foreground hidden md:inline">
                {settings.profile.fullName}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50 animate-fade-in text-right">
                <div className="p-2 border-b border-border/60">
                  <p className="text-xs font-bold text-foreground">{settings.profile.fullName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {settings.profile.email}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    مدیریت کل سیستم
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>تنظیمات پروفایل</span>
                  </Link>
                  <a
                    href="https://github.com/miladaxel/nexora"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      گیت‌هاب پروژه
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">v1.0</span>
                  </a>
                </div>

                <div className="pt-1 border-t border-border/60">
                  <button
                    onClick={() => {
                      resetToDefaults();
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>بازنشانی داده‌های دمو</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Search Palette Modal */}
      <SearchPaletteModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
