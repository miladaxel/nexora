import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useData } from '@/context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Search, User, CreditCard, ArrowRight, BarChart3, Users, Settings, FileText } from 'lucide-react';
import { formatToman } from '@/lib/formatters';

interface SearchPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchPaletteModal: React.FC<SearchPaletteModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { customers, transactions } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const navItems = [
    { title: 'نمای کلی و داشبورد', path: '/', icon: <BarChart3 className="w-4 h-4 text-indigo-500" /> },
    { title: 'تحلیل و آمار پیشرفته', path: '/analytics', icon: <BarChart3 className="w-4 h-4 text-cyan-500" /> },
    { title: 'مدیریت مشتریان', path: '/customers', icon: <Users className="w-4 h-4 text-emerald-500" /> },
    { title: 'مدیریت اشتراک‌ها', path: '/subscriptions', icon: <CreditCard className="w-4 h-4 text-purple-500" /> },
    { title: 'لیست و وضعیت تراکنش‌ها', path: '/transactions', icon: <CreditCard className="w-4 h-4 text-amber-500" /> },
    { title: 'گزارش‌گیری و خروجی اکسل', path: '/reports', icon: <FileText className="w-4 h-4 text-blue-500" /> },
    { title: 'تنظیمات حساب و سامانه', path: '/settings', icon: <Settings className="w-4 h-4 text-slate-500" /> },
  ];

  const filteredNav = useMemo(() => {
    if (!query) return navItems;
    return navItems.filter((item) => item.title.includes(query));
  }, [query]);

  const filteredCustomers = useMemo(() => {
    if (!query) return customers.slice(0, 4);
    return customers
      .filter(
        (c) =>
          c.name.includes(query) ||
          c.email.toLowerCase().includes(query.toLowerCase()) ||
          (c.company && c.company.includes(query))
      )
      .slice(0, 5);
  }, [customers, query]);

  const filteredTransactions = useMemo(() => {
    if (!query) return [];
    return transactions
      .filter(
        (t) =>
          t.id.toLowerCase().includes(query.toLowerCase()) ||
          t.trackingCode.toLowerCase().includes(query.toLowerCase()) ||
          t.customerName.includes(query)
      )
      .slice(0, 4);
  }, [transactions, query]);

  const handleSelectNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSelectCustomer = () => {
    navigate('/customers');
    onClose();
  };

  const handleSelectTransaction = () => {
    navigate('/transactions');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="جستجوی سریع در نکسورا" maxWidth="lg">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-muted-foreground absolute right-3.5 top-3" />
          <input
            type="text"
            placeholder="جستجو در بین صفحات، نام مشتری، شرکت، شناسه تراکنش یا کد پیگیری..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full h-11 pr-11 pl-4 rounded-xl border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-right"
          />
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-1">
          {/* Navigation */}
          {filteredNav.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">صفحات سامانه</p>
              <div className="space-y-1">
                {filteredNav.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectNav(item.path)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted text-right transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">مشتریان</p>
              <div className="space-y-1">
                {filteredCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    onClick={handleSelectCustomer}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted text-right transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{cust.name}</p>
                        <p className="text-xs text-muted-foreground">{cust.email} {cust.company && `• ${cust.company}`}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-primary">مشاهده لیست</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transactions */}
          {filteredTransactions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">تراکنش‌ها</p>
              <div className="space-y-1">
                {filteredTransactions.map((trx) => (
                  <button
                    key={trx.id}
                    onClick={handleSelectTransaction}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted text-right transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{trx.customerName}</p>
                      <p className="text-xs text-muted-foreground">{trx.id} • {trx.trackingCode}</p>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {formatToman(trx.amount)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredCustomers.length === 0 && filteredTransactions.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-8">
              موردی مطابق با جستجوی شما یافت نشد.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
