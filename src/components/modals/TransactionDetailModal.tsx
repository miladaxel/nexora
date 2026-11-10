import React from 'react';
import { Transaction } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  formatToman,
  formatPersianDate,
  getTransactionStatusLabel,
  getPaymentMethodLabel,
} from '@/lib/formatters';
import { Receipt, Printer } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { showToast } = useToast();

  if (!transaction) return null;

  const statusVariant =
    transaction.status === 'completed'
      ? 'success'
      : transaction.status === 'pending'
      ? 'warning'
      : transaction.status === 'failed'
      ? 'destructive'
      : 'secondary';

  const handlePrint = () => {
    showToast('info', 'چاپ رسید پرداخت', 'رسید تراکنش برای چاپ ارسال شد.');
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="رسید و جزئیات تراکنش مالی" maxWidth="md">
      <div className="space-y-5 text-right">
        {/* Receipt Box styled like official payment gateway receipt */}
        <div className="p-5 rounded-2xl border border-border/80 bg-muted/20 relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm text-foreground">رسید الکترونیکی پرداخت</span>
            </div>
            <Badge variant={statusVariant}>{getTransactionStatusLabel(transaction.status)}</Badge>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-xs text-muted-foreground mb-1">مبلغ تراکنش</span>
            <span className="text-2xl font-black text-foreground">
              {formatToman(transaction.amount)}
            </span>
          </div>

          {/* Key-Value lines */}
          <div className="space-y-2.5 text-xs pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">شماره پیگیری پرداخت:</span>
              <span className="font-mono font-bold text-foreground" dir="ltr">
                {transaction.trackingCode}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">شناسه تراکنش سیستم:</span>
              <span className="font-mono text-foreground" dir="ltr">
                {transaction.id}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">شماره فاکتور:</span>
              <span className="font-mono text-foreground" dir="ltr">
                {transaction.invoiceNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">نام پرداخت‌کننده:</span>
              <span className="font-semibold text-foreground">{transaction.customerName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">درگاه / شیوه واریز:</span>
              <span className="font-medium text-foreground">
                {getPaymentMethodLabel(transaction.paymentMethod)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">زمان ثبت تراکنش:</span>
              <span className="font-medium text-foreground">
                {formatPersianDate(transaction.date, { showTime: true })}
              </span>
            </div>

            {transaction.description && (
              <div className="pt-2 border-t border-border/40">
                <span className="text-muted-foreground block mb-1">شرح تراکنش:</span>
                <span className="text-foreground leading-relaxed block">
                  {transaction.description}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Demo notification note */}
        <p className="text-[11px] text-muted-foreground text-center">
          * کلیه تراکنش‌ها به صورت نمونه‌کار در مرورگر شبیه‌سازی شده‌اند و پرداخت واقعی صورت نگرفته است.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 ml-1.5" />
            <span>چاپ رسید</span>
          </Button>

          <Button size="sm" onClick={onClose}>
            بستن
          </Button>
        </div>
      </div>
    </Modal>
  );
};
