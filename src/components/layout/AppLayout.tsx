import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { Database, Github, Heart } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      {/* Sidebar - RTL is on right */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0',
          isSidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64'
        )}
      >
        {/* Top Header */}
        <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        {/* Demo banner */}
        <div className="bg-primary/5 border-b border-primary/10 px-4 py-2 text-right">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>
                نسخه نمایش پرفورمنس پورتفولیو (Frontend-Only): تمامی داده‌ها به صورت خودکار در حافظه مرورگر (LocalStorage) نگهداری می‌شوند.
              </span>
            </div>
            <a
              href="https://github.com/miladaxel/nexora"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-mono transition-colors shrink-0"
            >
              <Github className="w-3.5 h-3.5" />
              <span>miladaxel/nexora</span>
            </a>
          </div>
        </div>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border/60 py-5 px-6 bg-card/40 text-xs text-muted-foreground text-center sm:text-right">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Nexora Business Analytics</span>
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>پلتفرم تحلیل و مدیریت هوشمند کسب‌وکار</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span>توسعه یافته با</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>جهت ارائه نمونه‌کار حرفه‌ای مهندسی نرم‌افزار</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
