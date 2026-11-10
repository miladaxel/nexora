# Nexora – Persian SaaS Business Analytics Platform

![Nexora Platform Banner](public/logo.svg)

> **Nexora (نکسورا)** is a high-performance, commercial-grade Persian SaaS Business Analytics and Subscription Intelligence platform crafted for small and medium-sized businesses (SMBs).
> Designed as a flagship frontend portfolio showcase for a **Python / Django Backend Engineer**, demonstrating high-standard frontend craftsmanship, clean React & TypeScript architecture, polished UI/UX design (inspired by Stripe, Linear, and Vercel), and native Persian (RTL) localization.

[![Deploy to GitHub Pages](https://github.com/miladaxel/nexora/actions/workflows/deploy.yml/badge.svg)](https://github.com/miladaxel/nexora/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-4F46E5?style=flat&logo=github)](https://miladaxel.github.io/nexora/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌐 Live Demo

- **URL:** [https://miladaxel.github.io/nexora/](https://miladaxel.github.io/nexora/)
- **Repository:** [https://github.com/miladaxel/nexora](https://github.com/miladaxel/nexora)
- **Deployment Platform:** GitHub Pages (automated via GitHub Actions CI/CD)

---

## 💡 Key Highlights & Architecture

### 1. Completely Frontend-Only & Zero-Backend Architecture
- **Browser-Native Execution:** The entire application operates 100% inside the client browser. No external database, Django server, Node.js API, or cloud infrastructure is required.
- **LocalStorage State Persistence:** All CRUD operations (adding/editing/deleting customers, modifying subscription statuses, filtering transactions, switching themes, updating user preferences) persist seamlessly in HTML5 LocalStorage via a centralized storage service (`src/services/storage.ts`).
- **Realistic Demonstration Datasets:** Seeded with 40+ Iranian customer profiles, 35+ SaaS subscriptions, 50+ payment gateway transactions, 12-month revenue time series, and cohort retention models.
- **Data Reset Capability:** A dedicated button allows users to restore demo seed data instantly.

### 2. Native Persian (Farsi) & RTL Localization
- Configured with `<html lang="fa" dir="rtl">` for true right-to-left layout hierarchy.
- **Vazirmatn Typography:** Standard modern Persian web font optimized for legible user interface design.
- **Jalali / Solar Hijri Calendar:** Real-time dates rendered using native browser `Intl.DateTimeFormat('fa-IR-u-ca-persian')`.
- **Persian Currency & Numbers:** Financial numbers cleanly formatted in **Toman (تومان)** with thousands separators and Eastern Arabic / Persian numerals (`Intl.NumberFormat('fa-IR')`).
- **100% Persian User Interface:** Every button, table header, form label, error validation message, chart tooltip, modal, and empty state is in natural, professional Persian.

### 3. Visual & Interaction Design
- **Theme Support:** Polished **Light Mode** and **Dark Mode** with persistent LocalStorage state and smooth transitions.
- **Command Palette (Quick Search):** Accessible via `Ctrl+K` / `Cmd+K` or search trigger to instantly jump between pages, customers, and transactions.
- **Toast Notifications:** Accessible feedback toast system notifying users of mutations and actions.
- **Export to CSV:** Client-side CSV generation with UTF-8 BOM (`\uFEFF`) ensuring Microsoft Excel, Google Sheets, and LibreOffice open Persian text without garbled characters.

---

## 📊 Application Pages & Modules

### 1. Overview Dashboard (نمای کلی)
- **4 Key Business Metric Cards:**
  - مجموع درآمد (Total Revenue)
  - مشتریان فعال (Active Customers)
  - تعداد تراکنش‌ها (Total Transactions)
  - درآمد ماهانه تکرارشونده (MRR – Monthly Recurring Revenue)
- **Interactive Visualizations:**
  - **Revenue Overview (Area Chart):** Realized revenue plotted against sales targets.
  - **Revenue by Category (Donut Chart):** Plan contribution breakdown (پایه, حرفه‌ای, سازمانی).
  - **Customer Growth (Line Chart):** Active subscribers vs new user acquisition.
- **Supporting Panels:** Real-time Activity Stream, Top Customers Ranking, Recent Transactions table with modal receipts.

### 2. Analytics Page (تحلیل و آمار)
- Comprehensive SaaS performance metrics:
  - **CVR (Conversion Rate):** Free-to-paid conversion efficiency.
  - **Churn Rate:** Monthly subscriber attrition tracking.
  - **LTV to CAC:** Customer lifetime value vs customer acquisition cost.
- **Time Range Filters:** Instant dataset recalibration for امروز (Today), ۷ روز گذشته (7 Days), ۳۰ روز گذشته (30 Days), ۳ ماه گذشته (3 Months), ۶ ماه گذشته (6 Months), and یک سال گذشته (1 Year).
- **Cohort Retention Matrix:** 6-month retention drop-off progression.

### 3. Customers Management (مشتریان)
- Responsive data table with sortable columns (Name, Total Spent, Join Date, Status).
- Live search by customer name, company, email, or mobile number.
- Status filters (`فعال`, `در انتظار`, `غیرفعال`).
- Full CRUD operations:
  - **Add Customer Form:** Validated with **React Hook Form** + **Zod**.
  - **Edit Customer:** Real-time state synchronization across subscriptions and transactions.
  - **Customer Detail Modal:** Profile preview, spending stats, notes.
  - **Delete Customer:** Safe confirmation dialog with irreversible action warning.
- Pagination controls with Persian numerals.

### 4. Subscriptions Management (اشتراک‌ها)
- **Summary Metrics:** Active, Canceled, Trialing, and MRR.
- **Subscription Table:** Customer name, plan tier, billing cycle (monthly/yearly), start date, next billing date, and status badges.
- **Subscription Management Modal:** Allows upgrading, changing status (فعال, آزمایشی, معوقه, لغو شده), and simulating service cancellation.

### 5. Transactions Page (تراکنش‌ها)
- Complete transaction log with unique transaction IDs and Shaparak tracking codes.
- Filter by payment status (`موفق`, `در انتظار`, `ناموفق`, `مسترد شده`) and payment method (شاپرک, کارت به کارت, پایا/ساتنا, کیف پول).
- **Printable Payment Receipt Modal:** Detailed electronic invoice breakdown with print dialog integration.

### 6. Reports & Data Export (گزارش‌ها)
- Four specialized report generators:
  - **گزارش درآمد (Revenue Report)**
  - **گزارش مشتریان (Customers Report)**
  - **گزارش اشتراک‌ها (Subscriptions Report)**
  - **گزارش تراکنش‌ها (Transactions Report)**
- One-click CSV export with UTF-8 BOM encoding for seamless Persian character display in spreadsheet applications.

### 7. Settings Page (تنظیمات)
- **Profile Settings:** Full name, corporate email, phone, role, company name, and avatar presets.
- **Appearance:** Light Mode and Dark Mode toggles.
- **Notification Preferences:** Email summaries, real-time alerts, renewal reminders.
- **Regional Preferences:** Currency format (`IRT` / `IRR`), calendar system (`Jalali` / `Gregorian`).
- **Security & Data Management:** Demonstration API tokens and one-click LocalStorage cache reset.

---

## 🛠️ Technology Stack

| Technology | Role |
| :--- | :--- |
| **React 18** | Modern component-driven UI architecture with hooks and lazy-loaded routes |
| **Vite 6** | Ultra-fast development server and optimized Rollup production bundler |
| **TypeScript 5.6** | Strict type-safety, strong interfaces, and compile-time guarantees |
| **Tailwind CSS 3.4** | Utility-first styling with comprehensive dark mode and RTL utilities |
| **shadcn/ui Principles** | Accessible, headless primitives and refined UI patterns |
| **React Router v6** | HashRouter navigation preventing 404s on GitHub Pages static routing |
| **Recharts 2.13** | Composable, responsive SVG charts with custom Persian tooltips |
| **React Hook Form** | High-performance form state management |
| **Zod** | Schema-based validation with custom Persian error messages |
| **Lucide React** | Clean, consistent icons |

---

## 📂 Project Structure

```text
nexora/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   └── logo.svg                # Nexora application brand icon
├── src/
│   ├── components/
│   │   ├── charts/             # Recharts visualizations
│   │   │   ├── CategoryDonutChart.tsx
│   │   │   ├── CustomerGrowthLineChart.tsx
│   │   │   ├── MonthlyBarChart.tsx
│   │   │   └── RevenueAreaChart.tsx
│   │   ├── layout/             # Core layout structures
│   │   │   ├── AppLayout.tsx   # Shell combining Sidebar, Header & Content
│   │   │   ├── Header.tsx      # Top bar with Search, Theme toggle & Notifications
│   │   │   └── Sidebar.tsx     # RTL Collapsible sidebar with active indicators
│   │   ├── modals/             # Modal dialogs & forms
│   │   │   ├── CustomerDetailModal.tsx
│   │   │   ├── CustomerModal.tsx
│   │   │   ├── SearchPaletteModal.tsx
│   │   │   ├── SubscriptionDetailModal.tsx
│   │   │   └── TransactionDetailModal.tsx
│   │   └── ui/                 # Reusable UI primitives
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Pagination.tsx
│   │       └── Select.tsx
│   ├── context/
│   │   ├── DataContext.tsx     # Centralized state management & CRUD logic
│   │   ├── ThemeContext.tsx    # Light/Dark mode state synchronization
│   │   └── ToastContext.tsx    # Persian feedback notifications
│   ├── data/
│   │   └── mockData.ts         # Realistic Persian SaaS seed data
│   ├── lib/
│   │   ├── csvExport.ts        # UTF-8 BOM CSV generation & download
│   │   ├── formatters.ts       # Persian date, currency, and number formatters
│   │   └── utils.ts            # Tailwind clsx/twMerge helper
│   ├── pages/
│   │   ├── Analytics/          # Advanced SaaS metrics & cohort analysis
│   │   ├── Customers/          # Customer table, search, filters & CRUD
│   │   ├── Overview/           # Main executive dashboard
│   │   ├── Reports/            # Exportable reports & charts
│   │   ├── Settings/           # Profile, theme & preferences
│   │   ├── Subscriptions/      # Recurring billing & plan lifecycle
│   │   └── Transactions/       # Payment records & printable receipts
│   ├── services/
│   │   └── storage.ts          # HTML5 LocalStorage persistence abstraction
│   ├── types/
│   │   └── index.ts            # Shared TypeScript domain models & types
│   ├── App.tsx                 # HashRouter setup with code-splitting
│   ├── index.css               # Design tokens, CSS variables & typography
│   └── main.tsx                # React DOM entry point
├── index.html                  # HTML entry point with RTL and Vazirmatn font
├── package.json                # Project dependencies & scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind theme & design tokens
├── tsconfig.json               # TypeScript configuration with path aliases
└── vite.config.ts              # Vite configuration with chunk splitting & base path
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/miladaxel/nexora.git
   cd nexora
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` (or the terminal URL) to explore the platform.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This compiles TypeScript, bundles static assets into `dist/`, and applies automatic vendor/chart chunk splitting.

To preview the production build locally:

```bash
npm run preview
```

---

## 🚢 GitHub Pages Deployment

The application is configured to deploy automatically to GitHub Pages at:

`https://miladaxel.github.io/nexora/`

### 1. Automated Deployment via GitHub Actions
Every push to the `main` branch triggers `.github/workflows/deploy.yml`:
1. Checks out the code.
2. Installs dependencies using `npm ci`.
3. Runs `npm run build` with `NODE_ENV=production` (which sets Vite's base path to `/nexora/`).
4. Uploads build artifacts using `actions/upload-pages-artifact@v3`.
5. Deploys directly to GitHub Pages using `actions/deploy-pages@v4`.

### 2. Enabling GitHub Pages on the Repository
To enable deployment in your repository settings:
1. Navigate to your repository on GitHub: `https://github.com/miladaxel/nexora`.
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Future commits to `main` will automatically build and publish the live site.

---

## 👨‍💻 Author & Portfolio Context

Developed by **Milad Naseri** ([@miladaxel](https://github.com/miladaxel)) as a professional frontend portfolio demonstration.

- **Objective:** Demonstrating that a backend engineer has deep architectural mastery of modern frontend ecosystems, component modularity, design systems, and responsive user experiences.
- **Inquiries & Feedback:** Feel free to open an issue or connect on GitHub!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
