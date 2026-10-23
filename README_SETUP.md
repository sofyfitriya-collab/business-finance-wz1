# Business Finance - WZ1

A mobile-responsive Next.js starter for WZ Barbershop's owner finance dashboard.

## Included in this starter

- Dashboard with service customer counts, service income, QRIS, automatic cash calculation, expenses, salary payments and net balance.
- Daily report preview.
- Monthly summary view and history navigation.
- Expense categories: Listrik, Air, WiFi, Sampah, Perlengkapan cukur, Pengeluaran lainnya.
- Separate salary payment records, so salary is not subtracted twice.
- Editable service prices.
- Supabase SQL schema with Row Level Security (RLS) and explicit Owner/Admin allow-list.

## Important current limitation

This first package is a **front-end starter/demo**. Form changes currently live in browser memory and reset when the page reloads. It does **not yet provide a working login or persistent cloud storage**. Configure Supabase and implement the authentication/data adapter before using real financial data. The "Database online" label is visual demo content, not proof of a live connection.

## Run locally

1. Install Node.js 20 or later.
2. Extract the ZIP and open a terminal in this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Fill in your Supabase Project URL and anon/public key.
6. Run `npm run dev` and open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication, enable email/password sign-in.
4. Create the Owner account in Supabase Auth.
5. Copy that account's user UUID and run:
   ```sql
   insert into public.finance_admins (user_id, role)
   values ('YOUR-AUTH-USER-UUID', 'owner');
   ```
6. The app still needs its login page and Supabase read/write integration added before this is production-ready.

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Import the repository into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.
4. Deploy after the Supabase Auth and data integration is completed.

## Financial rules to preserve

- Service income = sum of service price × customer count.
- Cash = service income − QRIS.
- QRIS must not exceed service income.
- Net = income − non-salary expenses − salary payments.
- Salary payments are stored separately and must not also be recorded as expenses.
- Previous months must remain in the database and must not be deleted when a new month starts.
- Monthly comparison must use actual saved report data; never show hard-coded sample changes as real performance.

## Before real-world use

- Replace all demo/sample data.
- Implement Supabase Auth login and route protection.
- Implement save/load/update flows for daily reports, expenses, salaries, and service prices.
- Test RLS using an authenticated Owner/Admin and a non-admin account.
- Add month-over-month comparison using saved database records.
- Do not use this demo for actual financial records until these items are completed.
