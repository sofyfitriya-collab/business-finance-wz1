-- Business Finance - WZ1
-- Run this in Supabase SQL Editor after creating a project.
-- Keep all financial tables private to authenticated Owner/Admin users.
create extension if not exists pgcrypto;

create table if not exists public.service_prices (
  id uuid primary key default gen_random_uuid(),
  service_key text not null unique check (service_key in ('haircut','keramas','hairstyling','shaving','tonic')),
  service_name text not null,
  price bigint not null check (price >= 0),
  updated_at timestamptz not null default now()
);

insert into public.service_prices (service_key, service_name, price) values
('haircut','Haircut',20000),('keramas','Keramas',5000),
('hairstyling','Hairstyling',5000),('shaving','Shaving',5000),('tonic','Hair Tonic',10000)
on conflict (service_key) do nothing;

create table if not exists public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date not null unique,
  qris_amount bigint not null default 0 check (qris_amount >= 0),
  service_income bigint not null default 0 check (service_income >= 0),
  cash_amount bigint generated always as (service_income - qris_amount) stored,
  total_customers integer not null default 0 check (total_customers >= 0),
  note text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (qris_amount <= service_income)
);

create table if not exists public.daily_report_services (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.daily_reports(id) on delete cascade,
  service_key text not null check (service_key in ('haircut','keramas','hairstyling','shaving','tonic')),
  service_name text not null,
  unit_price bigint not null check (unit_price >= 0),
  customer_count integer not null default 0 check (customer_count >= 0),
  line_total bigint generated always as (unit_price * customer_count) stored,
  unique(report_id, service_key)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  category text not null check (category in ('Listrik','Air','WiFi','Sampah','Perlengkapan cukur','Pengeluaran lainnya')),
  description text not null default '',
  amount bigint not null check (amount > 0),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

-- Salary payments are stored separately and are intentionally excluded from expenses.
create table if not exists public.salary_payments (
  id uuid primary key default gen_random_uuid(),
  payment_date date not null,
  description text not null default '',
  amount bigint not null check (amount > 0),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

-- Only users explicitly listed here are allowed to use the finance application.
create table if not exists public.finance_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_finance_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.finance_admins where user_id = auth.uid()); $$;

alter table public.finance_admins enable row level security;
alter table public.service_prices enable row level security;
alter table public.daily_reports enable row level security;
alter table public.daily_report_services enable row level security;
alter table public.expenses enable row level security;
alter table public.salary_payments enable row level security;

create policy "admin can read own admin record" on public.finance_admins
for select to authenticated using (user_id = auth.uid());

create policy "finance admins manage service prices" on public.service_prices
for all to authenticated using (public.is_finance_admin()) with check (public.is_finance_admin());
create policy "finance admins manage daily reports" on public.daily_reports
for all to authenticated using (public.is_finance_admin()) with check (public.is_finance_admin());
create policy "finance admins manage daily report services" on public.daily_report_services
for all to authenticated using (public.is_finance_admin()) with check (public.is_finance_admin());
create policy "finance admins manage expenses" on public.expenses
for all to authenticated using (public.is_finance_admin()) with check (public.is_finance_admin());
create policy "finance admins manage salary payments" on public.salary_payments
for all to authenticated using (public.is_finance_admin()) with check (public.is_finance_admin());

-- IMPORTANT: after signing up the Owner account in Supabase Auth, insert its UUID:
-- insert into public.finance_admins (user_id, role) values ('YOUR-AUTH-USER-UUID', 'owner');
-- Never expose the service_role key in the browser or commit it to GitHub.
