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

create table if not exists businesses (
  id text primary key,
  slug text not null unique,
  business_name text not null,
  business_type text not null,
  description text,
  city text,
  status_note text,
  hours_summary text,
  location_summary text,
  address text,
  ordering_url text,
  review_url text,
  instagram_url text,
  phone text,
  hero_image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_sections (
  id text primary key,
  business_id text not null references businesses(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0
);

create table if not exists menu_items (
  id text primary key,
  business_id text not null references businesses(id) on delete cascade,
  section_id text references menu_sections(id) on delete set null,
  name text not null,
  description text,
  price text,
  image_url text,
  badge text,
  is_sold_out boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists menu_item_questions (
  id text primary key,
  created_at timestamptz not null default now(),
  business_slug text not null,
  business_name text not null,
  item_id text,
  item_name text not null,
  customer_name text,
  customer_email text,
  comment text not null,
  source text not null default 'public_menu'
);

create index if not exists businesses_slug_idx on businesses (slug);
create index if not exists businesses_published_idx on businesses (is_published);
create index if not exists menu_sections_business_idx on menu_sections (business_id);
create index if not exists menu_items_business_idx on menu_items (business_id);
create index if not exists menu_item_questions_business_idx on menu_item_questions (business_slug);
