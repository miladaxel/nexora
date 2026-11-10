import React from 'react';
import { Customer } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  formatToman,
  formatPersianDate,
  getCustomerStatusLabel,
  getSubscriptionPlanLabel,
} from '@/lib/formatters';
import { Mail, Phone, Building2, MapPin, Calendar, CreditCard, Edit, Trash2 } from 'lucide-react';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  onClose,
  customer,
  onEdit,
  onDelete,
}) => {
  if (!customer) return null;

  const statusVariant =
    customer.status === 'active'
      ? 'success'
      : customer.status === 'pending'
      ? 'warning'
      : 'secondary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="مشخصات و جزئیات مشتری" maxWidth="md">
      <div className="space-y-5 text-right">
        {/* Customer Header card */}
        <div className="flex items-start justify-between gap-3 p-4 rounded-xl bg-muted/40 border border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              {customer.name.slice(0, 1)}
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">{customer.name}</h4>
              <p className="text-xs text-muted-foreground">{customer.id}</p>
            </div>
          </div>
          <Badge variant={statusVariant}>{getCustomerStatusLabel(customer.status)}</Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-card">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <span className="text-muted-foreground block text-[11px]">ایمیل</span>
              <span className="font-medium text-foreground truncate block font-mono" dir="ltr">
                {customer.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-card">
            <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[11px]">شماره تماس</span>
              <span className="font-medium text-foreground font-mono" dir="ltr">
                {customer.phone}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-card">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[11px]">سازمان / شرکت</span>
              <span className="font-medium text-foreground">{customer.company || 'شخصی'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-card">
            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[11px]">شهر</span>
              <span className="font-medium text-foreground">{customer.city || 'ثبت نشده'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-card">
            <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[11px]">طرح فعلی</span>
              <span className="font-bold text-primary">
                {getSubscriptionPlanLabel(customer.plan)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-card">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[11px]">تاریخ عضویت</span>
              <span className="font-medium text-foreground">
                {formatPersianDate(customer.joinDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Financial stats */}
        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">مجموع خریدهای ثبت شده:</span>
          <span className="text-sm font-extrabold text-foreground">
            {formatToman(customer.totalSpent)}
          </span>
        </div>

        {/* Notes */}
        {customer.notes && (
          <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-xs">
            <span className="font-semibold text-foreground block mb-1">یادداشت داخلی:</span>
            <p className="text-muted-foreground leading-relaxed">{customer.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(customer);
            }}
          >
            <Trash2 className="w-4 h-4 ml-1.5" />
            <span>حذف مشتری</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              بستن
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onEdit(customer);
              }}
            >
              <Edit className="w-4 h-4 ml-1.5" />
              <span>ویرایش مشخصات</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
