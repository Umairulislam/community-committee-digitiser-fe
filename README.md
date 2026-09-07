# 🤝 Trust Kameti

[![Next.js](https://img.shields.io/badge/Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

The web frontend for **Trust Kameti** — a transparent and auditable digital committee (kameti) platform. Members track their committees, contributions, payouts and lottery results, while admins manage committees, members, cycles and reports. All data is served by a secure [NestJS backend](https://github.com/Umairulislam/trust-kameti-web), which remains the single source of truth.

## 🎥 Demo

![Trust Kameti demo](project-demo.gif)

## 💡 Features

**👤 User**

- Authentication (register / login)
- Dashboard with committee, contribution and payout summaries
- Committee details: members, cycles, contributions, payouts and lottery history
- Payment history and payout tracking
- Notifications and profile settings
- AI Committee Assistant

**🛡️ Admin**

- Admin dashboard
- Committee and member management
- Contribution and payment verification
- Cycle, lottery and payout management
- Notifications, audit logs/timeline and reports

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| [Next.js 16](https://nextjs.org/) (App Router) | Framework, routing and server-side rendering |
| [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | UI development |
| [Redux Toolkit](https://redux-toolkit.js.org/) + RTK Query | State management and API communication |
| [Material UI](https://mui.com/) | Component library and theming |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form handling and validation |

## 📁 Project Structure

```
src/
├── app/          # App Router pages and layouts
├── components/   # Reusable UI and layout components
├── features/     # Feature modules (auth, committees, dashboard, payments, ...)
├── api/          # RTK Query base API
├── store/        # Redux store setup
├── theme/        # MUI theme and design tokens
├── types/        # Shared TypeScript types
└── proxy.ts      # Role-based route protection
```

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js 20+
- The [Trust Kameti backend API](https://github.com/Umairulislam/trust-kameti-web) running locally (NestJS + PostgreSQL + Redis)

### ⚙️ Installation

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment example and point it at your backend:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## 🔗 Backend API

This frontend consumes the Trust Kameti REST API, built with NestJS:

**Repository:** [https://github.com/Umairulislam/trust-kameti-web](https://github.com/Umairulislam/trust-kameti-web)
