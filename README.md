# Pennywise Frontend

> **Personal Expense Management & Financial Insights System**  
> *"Your money, a little more manageable."*

---

## 📌 Overview

Pennywise is an approachable, modern personal finance web application built with React, Vite, and Tailwind CSS. It is designed to help students, young adults, and working professionals track expenses, manage category budgets, and understand spending patterns without confusing corporate financial jargon.

This repository contains the standalone React frontend, designed to integrate with the [Pennywise Backend](https://github.com/srihasinikodipaka/pennywise-backend) REST API.

---

## 🚀 Implemented Features

1. **Intuitive Financial Dashboard**:
   - Immediate visibility into **"Available to spend"** (current net balance).
   - Balanced KPI cards for total monthly income and expenses.
   - Recent transactions feed with category badges and payment modes.
   - Dynamic, plain-language insights banner based on actual activity.
   - Optional collapsible 6-month income vs. expense trend chart (Recharts).

2. **Expense & Income Ledger**:
   - Full CRUD: Record, edit, and delete transactions.
   - Search across titles, notes, and categories with debounced input.
   - Filter by transaction type (All, Expense, Income) and category.
   - Real-time explainable auto-categorization badge.

3. **Category Budget Management**:
   - Set monthly spending limits per category.
   - Visual progress indicators with calm status badges (`Normal`, `Caution`, `Overrun`).
   - Non-punitive overspending alerts and real-time remaining calculations.

4. **Financial Insights**:
   - **Spending estimate for this month** (projected month-end expenditure).
   - **Average spent per day** (daily pace calculation).
   - Interactive category spending breakdown (Donut chart).
   - Statistical unusual spending detection.

5. **"Ask Pennywise" Financial Assistant**:
   - Interactive conversational assistant powered by live backend analytics.
   - Quick-select prompt chips for common spending questions.
   - Clear distinction between historical facts and estimates.

6. **Authentication & Session Management**:
   - Stateless JWT authentication with Bearer token interceptor.
   - 1-Click Evaluation Demo login (`demo`) for instant evaluator exploration.
   - Functional **Sign Out** button that wipes session state, clears storage, and redirects to sign-in.
   - Route guards preventing unauthenticated access to protected financial screens.

7. **Currency Customization**:
   - Multi-currency support (`₹`, `$`, `€`, `£`) switchable from the navbar or settings page.

---

## 🛠️ Technology Stack

- **Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite 5](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) with a custom fintech design system (`#FAF9F5` warm ivory, `#477EAD` action blue, `#E8F3FF` light blue)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Visualization:** [Recharts 2](https://recharts.org/)
- **HTTP Client:** [Axios](https://axios-http.com/) with request/response JWT interceptors

---

## ⚙️ Environment Configuration

| Variable | Description | Local Default | Production Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:8080/api` | `https://pennywise-backend.onrender.com/api` |

Create a `.env` file in the `frontend/` directory (see `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 💻 Local Setup & Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps
1. Clone the repository and navigate to the frontend directory:
   ```bash
   git clone https://github.com/srihasinikodipaka/pennywise-frontend.git
   cd pennywise-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 📦 Production Build

To create an optimized production bundle:
```bash
npm run build
```
Build output is generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Deployment (Render Static Site)

1. Connect this GitHub repository (`pennywise-frontend`) to **Render**.
2. Create a new **Static Site**.
3. Set the following build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add the Environment Variable in the Render dashboard:
   - `VITE_API_BASE_URL`: `https://<your-backend-service-name>.onrender.com/api`
5. Configure Rewrite Rules in Render (Redirects/Rewrites tab) for SPA routing:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`

---

## 🔗 Live Application

- **Frontend Repository:** https://github.com/srihasinikodipaka/pennywise-frontend
- **Backend Repository:** https://github.com/srihasinikodipaka/pennywise-backend
- **Live Render App:** *(Pending initial deployment verification)*
