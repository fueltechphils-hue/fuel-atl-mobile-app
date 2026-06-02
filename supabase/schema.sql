create table if not exists public.fuel_app_state (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.fuel_app_state enable row level security;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.fuel_app_state to service_role;

insert into public.fuel_app_state (id, payload)
values (
  'default',
  '{"purchases":[],"funds":{"ugtCash":0,"bankBalance":0,"salesForDeposit":0,"updatedAt":""}}'::jsonb
)
on conflict (id) do nothing;
