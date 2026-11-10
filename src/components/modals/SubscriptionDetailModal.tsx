import React, { useState } from 'react';
import { Subscription, SubscriptionStatus } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  formatToman,
  formatPersianDate,
  getSubscriptionPlanLabel,
  getSubscriptionStatusLabel,
} from '@/lib/formatters';
import { Calendar, CreditCard, User, AlertOctagon, RefreshCw } from 'lucide-react';

interface SubscriptionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onUpdateStatus: (id: string, status: SubscriptionStatus) => void;
  onCancelSubscription: (id: string) => void;
}

export const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpdateStatus,
  onCancelSubscription,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus>('active');

  React.useEffect(() => {
    if (subscription) {
      setSelectedStatus(subscription.status);
    }
  }, [subscription]);

  if (!subscription) return null;

  const statusVariant =
    subscription.status === 'active'
      ? 'success'
      : subscription.status === 'trialing'
      ? 'warning'
      : subscription.status === 'past_due'
      ? 'destructive'
      : 'secondary';

  const handleSaveStatus = () => {
    onUpdateStatus(subscription.id, selectedStatus);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="مدیریت اشتراک سرویس" maxWidth="md">
      <div className="space-y-5 text-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/60">
          <div>
            <span className="text-xs text-muted-foreground block">شناسه اشتراک: {subscription.id}</span>
            <h4 className="text-base font-bold text-foreground mt-0.5">
              پلن {getSubscriptionPlanLabel(subscription.plan)}
            </h4>
          </div>
          <Badge variant={statusVariant}>
            {getSubscriptionStatusLabel(subscription.status)}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-border/60 bg-card flex items-center gap-2.5">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[11px]">مشتری</span>
              <span className="font-semibold text-foreground">{subscription.customerName}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-card flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[11px]">مبلغ دوره</span>
              <span className="font-bold text-foreground">
                {formatToman(subscription.price)}{' '}
                <span className="text-[10px] text-muted-foreground">
                  ({subscription.billingCycle === 'yearly' ? 'سالانه' : 'ماهانه'})
                </span>
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-card flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[11px]">تاریخ شروع</span>
              <span className="font-medium text-foreground">
                {formatPersianDate(subscription.startDate)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-card flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-muted-foreground block text-[11px]">سررسید تمدید بعدی</span>
              <span className="font-medium text-foreground">
                {formatPersianDate(subscription.nextBillingDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Status update form */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
          <label className="block text-xs font-semibold text-foreground">
            تغییر وضعیت اشتراک در سیستم:
          </label>
          <div className="flex gap-2">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as SubscriptionStatus)}
              className="flex-1"
            >
              <option value="active">فعال</option>
              <option value="trialing">آزمایشی (Trial)</option>
              <option value="past_due">معوقه در پرداخت</option>
              <option value="canceled">لغو شده</option>
            </Select>
            <Button size="sm" onClick={handleSaveStatus}>
              ثبت تغییر
            </Button>
          </div>
        </div>

        {/* Cancel Subscription Option */}
        {subscription.status !== 'canceled' && (
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                لغو تمدید خودکار و پایان دادن به این اشتراک
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onCancelSubscription(subscription.id);
                onClose();
              }}
            >
              لغو اشتراک
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            بستن
          </Button>
        </div>
      </div>
    </Modal>
  );
};
