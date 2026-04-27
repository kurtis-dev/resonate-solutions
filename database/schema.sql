create table if not exists intake_requests (
  id text primary key,
  created_at timestamptz not null,
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  business_type text not null,
  city text not null,
  current_menu_link text,
  main_need text not null,
  package_interest text not null,
  notes text,
  source text not null default 'website'
);

create table if not exists customer_subscriptions (
  stripe_customer_id text primary key,
  stripe_subscription_id text,
  stripe_checkout_session_id text,
  customer_email text,
  plan_id text,
  status text not null,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists payment_events (
  stripe_event_id text primary key,
  stripe_customer_id text,
  stripe_subscription_id text,
  customer_email text,
  type text not null,
  status text not null,
  amount_paid integer,
  currency text,
  created_at timestamptz not null default now()
);

create index if not exists intake_requests_email_idx on intake_requests (email);
create index if not exists customer_subscriptions_status_idx on customer_subscriptions (status);
create index if not exists payment_events_customer_idx on payment_events (stripe_customer_id);
