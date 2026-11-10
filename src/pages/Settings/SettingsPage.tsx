import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  Palette,
  Bell,
  Sliders,
  Shield,
  RotateCcw,
  Check,
  Sun,
  Moon,
  Save,
  Key,
  Database,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useData();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'preferences' | 'security'>('profile');

  // Local state for profile form
  const [fullName, setFullName] = useState(settings.profile.fullName);
  const [email, setEmail] = useState(settings.profile.email);
  const [phone, setPhone] = useState(settings.profile.phone);
  const [companyName, setCompanyName] = useState(settings.profile.companyName);
  const [role, setRole] = useState(settings.profile.role);
  const [avatar, setAvatar] = useState(settings.profile.avatar);

  // Local state for notifications
  const [notifications, setNotifications] = useState(settings.notifications);

  // Local state for preferences
  const [preferences, setPreferences] = useState(settings.preferences);

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      profile: {
        fullName,
        email,
        phone,
        companyName,
        role,
        avatar,
      },
    });
  };

  // Toggle notification preference
  const handleToggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    updateSettings({ notifications: updated });
  };

  // Update preferences
  const handlePreferenceChange = (key: keyof typeof preferences, val: any) => {
    const updated = { ...preferences, [key]: val };
    setPreferences(updated);
    updateSettings({ preferences: updated });
  };

  // Avatar choices
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          تنظیمات سامانه
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          مدیریت حساب کاربری، ظاهر برنامه، نحوه نمایش اعداد و تاریخ، و پیکربندی اعلان‌ها
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-right transition-all ${
              activeTab === 'profile'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <User className="w-4 h-4" />
            <span>مشخصات پروفایل</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-right transition-all ${
              activeTab === 'appearance'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>ظاهر و تم (روشن / تاریک)</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-right transition-all ${
              activeTab === 'notifications'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>تنظیمات اعلان‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-right transition-all ${
              activeTab === 'preferences'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>ترجیحات منطقه‌ای و تاریخ</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-right transition-all ${
              activeTab === 'security'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>امنیت و ذخیره‌سازی داده</span>
          </button>

          <div className="pt-4 border-t border-border/60">
            <button
              onClick={resetToDefaults}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-right"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بازنشانی به تنظیمات پیش‌فرض</span>
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>مشخصات حساب و اطلاعات مدیر</CardTitle>
                <CardDescription>
                  این اطلاعات در نوار بالا و فاکتورهای رسمی صادره نمایش داده می‌شود
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-2">
                      تصویر آواتار حساب
                    </label>
                    <div className="flex items-center gap-3">
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/40 shadow-sm"
                      />
                      <div className="flex items-center gap-2">
                        {avatarPresets.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setAvatar(preset)}
                            className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                              avatar === preset
                                ? 'border-primary ring-2 ring-primary/30'
                                : 'border-border opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={preset} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        نام و نام خانوادگی
                      </label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        آدرس ایمیل کاری
                      </label>
                      <Input
                        type="email"
                        dir="ltr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        شماره تماس مستقیم
                      </label>
                      <Input
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        نقش سازمانی
                      </label>
                      <Input
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      نام شرکت یا سازمان
                    </label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div className="pt-3 border-t border-border/60 flex justify-end">
                    <Button type="submit" size="sm">
                      <Save className="w-4 h-4 ml-1.5" />
                      <span>ذخیره تغییرات پروفایل</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>تنظیمات تم و ظاهر رابط کاربری</CardTitle>
                <CardDescription>
                  رنگ‌بندی مورد علاقه خود را انتخاب کنید (حالت روز روشن یا شب تاریک)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Card */}
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      theme === 'light'
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm'
                        : 'border-border hover:bg-muted/50 bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sun className="w-5 h-5 text-amber-500" />
                        <span className="font-bold text-sm text-foreground">حالت روز (روشن)</span>
                      </div>
                      {theme === 'light' && (
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="h-16 rounded-xl bg-slate-100 border border-slate-200 p-2 flex gap-2">
                      <div className="w-1/3 bg-white rounded-lg shadow-xs" />
                      <div className="flex-1 bg-white rounded-lg shadow-xs" />
                    </div>
                  </button>

                  {/* Dark Card */}
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      theme === 'dark'
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm'
                        : 'border-border hover:bg-muted/50 bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Moon className="w-5 h-5 text-indigo-400" />
                        <span className="font-bold text-sm text-foreground">حالت شب (تاریک)</span>
                      </div>
                      {theme === 'dark' && (
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="h-16 rounded-xl bg-slate-900 border border-slate-800 p-2 flex gap-2">
                      <div className="w-1/3 bg-slate-800 rounded-lg" />
                      <div className="flex-1 bg-slate-800 rounded-lg" />
                    </div>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground leading-relaxed">
                  تم انتخاب شده به صورت پایدار در LocalStorage ذخیره شده و در مراجعات بعدی به صورت خودکار فعال خواهد ماند.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>تنظیمات اطلاع‌رسانی و رویدادها</CardTitle>
                <CardDescription>
                  تعیین دریافت هشدارهای مالی، تمدید اشتراک و گزارش‌های دوره‌ای
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: 'emailReports' as const,
                    title: 'ارسال خلاصه گزارش‌های هفتگی',
                    desc: 'دریافت وضعیت درآمد و مشتریان جدید در قالب ایمیل هفتگی',
                  },
                  {
                    key: 'transactionAlerts' as const,
                    title: 'اعلان لحظه‌ای تراکنش‌های موفق و ناموفق',
                    desc: 'نمایش پوش‌نوتیفیکیشن هنگام ثبت تراکنش در درگاه',
                  },
                  {
                    key: 'subscriptionRenewals' as const,
                    title: 'یادآوری سررسید تمدید اشتراک‌ها',
                    desc: 'ارسال هشدار ۷ روز قبل از پایان دوره اشتراک مشتری',
                  },
                  {
                    key: 'systemNotifications' as const,
                    title: 'هشدارهای فنی و بروزرسانی سیستم',
                    desc: 'اطلاع‌رسانی وضعیت سلامت سرویس و ارتقای ماژول‌ها',
                  },
                  {
                    key: 'securityAlerts' as const,
                    title: 'هشدارهای امنیتی ورود به سامانه',
                    desc: 'اطلاع‌رسانی تلاش‌های مشکوک برای تغییر تنظیمات',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleNotification(item.key)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                        notifications[item.key] ? 'bg-primary' : 'bg-muted border border-border'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                          notifications[item.key] ? '-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>ترجیحات منطقه‌ای، واحد پول و نمایش تاریخ</CardTitle>
                <CardDescription>
                  سفارشی‌سازی فرمت‌بندی اعداد، نمایش تاریخ شمسی و واحد پولی پیش‌فرض
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="واحد پولی نمایش ارقام"
                      value={preferences.currency}
                      onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                    >
                      <option value="IRT">تومان (IRT) - استاندارد تجاری</option>
                      <option value="IRR">ریال (IRR) - استاندارد بانکی</option>
                    </Select>
                  </div>

                  <div>
                    <Select
                      label="فرمت تقویم و نمایش تاریخ"
                      value={preferences.dateFormat}
                      onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                    >
                      <option value="persian">گاه‌شماری هجری خورشیدی (جلالی)</option>
                      <option value="gregorian">گاه‌شماری میلادی (Gregorian)</option>
                    </Select>
                  </div>

                  <div>
                    <Select
                      label="زبان پیش‌فرض رابط کاربری"
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    >
                      <option value="fa">فارسی (Persian / RTL)</option>
                      <option value="en" disabled>English (LTR) - در نسخه بعدی</option>
                    </Select>
                  </div>

                  <div>
                    <Select
                      label="سبک نمایش ارقام و اعداد"
                      value={preferences.numberFormat}
                      onChange={(e) => handlePreferenceChange('numberFormat', e.target.value)}
                    >
                      <option value="persian">اعداد فارسی (۰۱۲۳۴۵۶۷۸۹)</option>
                      <option value="english">اعداد لاتین (0123456789)</option>
                    </Select>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                  کلیه محاسبات داخلی نرم‌افزار به صورت Floating-Point استاندارد نگهداری شده و فرآیند تبدیل زبان و نگاشت ارقام تنها در لایه ارائه (Presentation Layer) صورت می‌گیرد.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>تنظیمات امنیتی و ذخیره‌سازی داده</CardTitle>
                <CardDescription>
                  مدیریت کلیدهای دسترسی API و تنظیمات پایگاه داده محلی (Frontend-Only Architecture)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      محل نگهداری داده‌ها: مرورگر کاربر (HTML5 LocalStorage)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    این نرم‌افزار یک محصول کامل سمت کلاینت (Client-Side SaaS) است. کلیه تراکنش‌ها، رکوردهای مشتریان، اشتراک‌ها و ویرایش‌ها به صورت کاملاً ایزوله در فضای حافظه مرورگر شما ذخیره می‌شوند و نیاز به ارسال به هیچ سرور خارجی ندارند.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-foreground">کلید احراز هویت API شبیه‌سازی شده</span>
                    </div>
                    <Badge variant="outline" size="sm">دمو</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      dir="ltr"
                      value="nexora_live_sk_892348923749823749823"
                      className="font-mono text-xs bg-muted/50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast('info', 'کپی شد', 'کلید دمو در کلیپ‌بورد کپی شد.')}
                    >
                      کپی
                    </Button>
                  </div>
                </div>

                <div className="pt-2 flex justify-start">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={resetToDefaults}
                  >
                    <RotateCcw className="w-4 h-4 ml-1.5" />
                    <span>پاک‌سازی کامل حافظه کش و بازنشانی داده‌ها</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
