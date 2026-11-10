import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Customer, CustomerStatus } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CustomerModal } from '@/components/modals/CustomerModal';
import { CustomerDetailModal } from '@/components/modals/CustomerDetailModal';
import {
  Search,
  UserPlus,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  Users,
  Download,
  Filter,
} from 'lucide-react';
import {
  formatToman,
  formatPersianDate,
  getCustomerStatusLabel,
  getSubscriptionPlanLabel,
} from '@/lib/formatters';
import { downloadCSV } from '@/lib/csvExport';

type SortField = 'name' | 'totalSpent' | 'joinDate' | 'status';
type SortOrder = 'asc' | 'desc';

export const CustomersPage: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all');
  const [sortField, setSortField] = useState<SortField>('joinDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // Sorting helper
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filtered & Sorted Customers
  const processedCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        const matchesSearch =
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
          customer.phone.includes(searchQuery);

        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'name') {
          comp = a.name.localeCompare(b.name, 'fa');
        } else if (sortField === 'totalSpent') {
          comp = a.totalSpent - b.totalSpent;
        } else if (sortField === 'joinDate') {
          comp = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        } else if (sortField === 'status') {
          comp = a.status.localeCompare(b.status);
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [customers, searchQuery, statusFilter, sortField, sortOrder]);

  // Paginated Customers
  const totalPages = Math.ceil(processedCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedCustomers.slice(start, start + pageSize);
  }, [processedCustomers, currentPage, pageSize]);

  // Export filtered customers to CSV
  const handleExportCSV = () => {
    const headers = [
      'شناسه مشتری',
      'نام و نام خانوادگی',
      'ایمیل',
      'شماره تماس',
      'شرکت',
      'شهر',
      'طرح اشتراک',
      'مجموع خرید (تومان)',
      'وضعیت',
      'تاریخ عضویت',
    ];

    const rows = processedCustomers.map((c) => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.company || '-',
      c.city || '-',
      getSubscriptionPlanLabel(c.plan),
      c.totalSpent,
      getCustomerStatusLabel(c.status),
      formatPersianDate(c.joinDate),
    ]);

    downloadCSV('گزارش_مشتریان_نکسورا', headers, rows);
  };

  const handleCreateCustomer = (formData: any) => {
    addCustomer(formData);
  };

  const handleUpdateCustomer = (formData: any) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
      setEditingCustomer(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingCustomer) {
      deleteCustomer(deletingCustomer.id);
      setDeletingCustomer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            مدیریت مشتریان
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            مشاهده، ثبت، ویرایش و مدیریت اطلاعات مشترکین و حساب‌های تجاری
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 ml-1.5" />
            <span>خروجی اکسل (CSV)</span>
          </Button>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus className="w-4 h-4 ml-1.5" />
            <span>افزودن مشتری</span>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="w-full md:max-w-sm">
              <Input
                placeholder="جستجو بر اساس نام، ایمیل، شرکت یا شماره تماس..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium ml-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                وضعیت:
              </span>
              {(['all', 'active', 'pending', 'inactive'] as const).map((status) => {
                const labelMap = {
                  all: 'همه',
                  active: 'فعال',
                  pending: 'در انتظار',
                  inactive: 'غیرفعال',
                };
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {labelMap[status]}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {processedCustomers.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Users className="w-10 h-10" />}
                title="مشتری با این مشخصات یافت نشد"
                description="عبارت جستجو یا فیلترهای انتخابی را تغییر دهید، یا مشتری جدیدی اضافه کنید."
                actionLabel="افزودن مشتری جدید"
                onAction={() => setIsAddModalOpen(true)}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <span>نام مشتری و سازمان</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-semibold">تماس و ایمیل</th>
                    <th className="py-3.5 px-4 font-semibold">طرح اشتراک</th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('totalSpent')}
                    >
                      <div className="flex items-center gap-1">
                        <span>مجموع خرید</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        <span>وضعیت</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                      onClick={() => handleSort('joinDate')}
                    >
                      <div className="flex items-center gap-1">
                        <span>تاریخ عضویت</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-semibold text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedCustomers.map((customer) => {
                    const statusVariant =
                      customer.status === 'active'
                        ? 'success'
                        : customer.status === 'pending'
                        ? 'warning'
                        : 'secondary';

                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-muted/40 transition-colors group"
                      >
                        {/* Name and company */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {customer.name.slice(0, 1)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{customer.name}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {customer.company || 'شخصی'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email & Phone */}
                        <td className="py-3.5 px-4">
                          <p className="font-mono text-muted-foreground truncate max-w-[170px]" dir="ltr">
                            {customer.email}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground/80 mt-0.5" dir="ltr">
                            {customer.phone}
                          </p>
                        </td>

                        {/* Plan */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-foreground">
                            {getSubscriptionPlanLabel(customer.plan)}
                          </span>
                        </td>

                        {/* Total Spent */}
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {formatToman(customer.totalSpent)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <Badge variant={statusVariant} size="sm">
                            {getCustomerStatusLabel(customer.status)}
                          </Badge>
                        </td>

                        {/* Join Date */}
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {formatPersianDate(customer.joinDate)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setViewingCustomer(customer)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title="مشاهده جزئیات"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCustomer(customer)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                              title="ویرایش"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingCustomer(customer)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 border-t border-border/60">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={processedCustomers.length}
              pageSize={pageSize}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      <CustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCustomer}
      />

      {/* Edit Customer Modal */}
      <CustomerModal
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSubmit={handleUpdateCustomer}
        initialData={editingCustomer}
      />

      {/* View Customer Details Modal */}
      <CustomerDetailModal
        isOpen={!!viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        customer={viewingCustomer}
        onEdit={(cust) => setEditingCustomer(cust)}
        onDelete={(cust) => setDeletingCustomer(cust)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={handleConfirmDelete}
        title="حذف حساب مشتری"
        message={
          deletingCustomer
            ? `آیا از حذف کامل مشتری «${deletingCustomer.name}» اطمینان دارید؟ کلیه اشتراک‌های مرتبط با این مشتری نیز حذف خواهند شد.`
            : ''
        }
        confirmText="بله، حذف کن"
        cancelText="انصراف"
        variant="destructive"
      />
    </div>
  );
};
