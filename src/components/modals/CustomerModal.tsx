import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Customer } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const customerSchema = z.object({
  name: z.string().min(3, 'نام و نام‌خانوادگی باید حداقل ۳ حرف باشد'),
  email: z.string().email('فرمت ایمیل نامعتبر است'),
  phone: z
    .string()
    .min(10, 'شماره تلفن باید حداقل ۱۰ رقم باشد')
    .regex(/^[0-9۰-۹+]+$/, 'شماره تلفن فقط می‌تواند شامل ارقام باشد'),
  status: z.enum(['active', 'inactive', 'pending']),
  plan: z.enum(['basic', 'pro', 'enterprise']),
  city: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormValues) => void;
  initialData?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'active',
      plan: 'pro',
      city: 'تهران',
      company: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        status: initialData.status,
        plan: initialData.plan,
        city: initialData.city || '',
        company: initialData.company || '',
        notes: initialData.notes || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        status: 'active',
        plan: 'pro',
        city: 'تهران',
        company: '',
        notes: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (values: CustomerFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'ویرایش مشخصات مشتری' : 'افزودن مشتری جدید'}
      description={
        initialData
          ? 'اطلاعات مشتری را بروزرسانی کنید'
          : 'مشخصات و پلن اشتراک مشتری جدید را وارد کنید'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5 text-right">
            نام و نام‌خانوادگی <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="مثال: سارا رادمنش"
            {...register('name')}
            error={errors.name?.message}
          />
        </div>

        {/* Email & Phone in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 text-right">
              آدرس ایمیل <span className="text-rose-500">*</span>
            </label>
            <Input
              type="email"
              dir="ltr"
              placeholder="user@example.ir"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 text-right">
              شماره تماس <span className="text-rose-500">*</span>
            </label>
            <Input
              dir="ltr"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>
        </div>

        {/* Plan & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Select label="طرح اشتراک اولیه" {...register('plan')}>
              <option value="basic">طرح پایه (۴۹۰,۰۰۰ تومان)</option>
              <option value="pro">طرح حرفه‌ای (۱,۴۹۰,۰۰۰ تومان)</option>
              <option value="enterprise">طرح سازمانی (۴,۹۰۰,۰۰۰ تومان)</option>
            </Select>
          </div>
          <div>
            <Select label="وضعیت حساب" {...register('status')}>
              <option value="active">فعال</option>
              <option value="pending">در انتظار تایید</option>
              <option value="inactive">غیرفعال</option>
            </Select>
          </div>
        </div>

        {/* Company & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 text-right">
              نام شرکت / سازمان (اختیاری)
            </label>
            <Input placeholder="مثال: شرکت داده‌پردازان" {...register('company')} />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 text-right">
              شهر (اختیاری)
            </label>
            <Input placeholder="مثال: تهران" {...register('city')} />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5 text-right">
            یادداشت‌های اختصاصی پشتیبانی
          </label>
          <textarea
            rows={2}
            className="w-full rounded-xl border border-input bg-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-right"
            placeholder="یادداشت‌های داخلی درباره نیازهای مشتری..."
            {...register('notes')}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {initialData ? 'ذخیره تغییرات' : 'ثبت مشتری جدید'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
