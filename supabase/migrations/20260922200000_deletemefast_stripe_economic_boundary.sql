-- DeleteMeFast Stripe economic boundary.
-- Run this migration against the dedicated DeleteMeFast Supabase project before enabling the Stripe webhook.

create table if not exists public.dmf_stripe_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  checkout_session_id text,
  payment_intent_id text,
  customer_id uuid,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists dmf_stripe_events_customer_idx
  on public.dmf_stripe_events(customer_id, created_at desc);

alter table public.dmf_service_receipts
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_customer_id text;

create unique index if not exists dmf_service_receipts_stripe_checkout_session_uidx
  on public.dmf_service_receipts(stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

alter table public.dmf_cases
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text;

create unique index if not exists dmf_cases_stripe_checkout_session_uidx
  on public.dmf_cases(stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

alter table public.dmf_stripe_events enable row level security;

revoke all on public.dmf_stripe_events from anon, authenticated;
grant all on public.dmf_stripe_events to service_role;

create policy "deny anon stripe events"
  on public.dmf_stripe_events as restrictive
  for all to anon using (false) with check (false);

create policy "deny authenticated stripe events"
  on public.dmf_stripe_events as restrictive
  for all to authenticated using (false) with check (false);
