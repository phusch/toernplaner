-- Törnplaner / Chillout Pirates Kalkulation
-- Supabase Migration 001: sichere Sync-Grundlage für V1.0 stabil
-- Zweck: Local-first JSONB-Speicherung ohne Änderung der bestehenden Rechenlogik

begin;

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Hilfsfunktion: updated_at automatisch setzen
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Hilfsfunktion: trip_states revision bei Updates erhöhen
-- -----------------------------------------------------------------------------
create or replace function public.bump_trip_state_revision()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if tg_op = 'UPDATE' then
    new.revision = old.revision + 1;
  end if;
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Nutzerprofil, abgesicherte Ergänzung zu auth.users
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Törn-Kopfdaten
-- -----------------------------------------------------------------------------
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  legacy_local_id text,
  name text not null default 'Neuer Törn',
  notes text not null default '',
  start_date date,
  end_date date,
  is_active boolean not null default true,
  client_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint trips_owner_legacy_unique unique (owner_id, legacy_local_id)
);

create index if not exists idx_trips_owner_updated
on public.trips(owner_id, updated_at desc);

create index if not exists idx_trips_owner_active
on public.trips(owner_id, is_active)
where deleted_at is null;

create trigger trg_trips_updated_at
before update on public.trips
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Vollständiger V1.0-Zustand je Törn als JSONB
-- -----------------------------------------------------------------------------
create table if not exists public.trip_states (
  trip_id uuid primary key references public.trips(id) on delete cascade,
  schema_version integer not null default 1,
  app_version text not null default 'v1.0-stabil',
  state_json jsonb not null default '{}'::jsonb,
  state_hash text,
  client_id text,
  client_updated_at timestamptz,
  revision bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_trip_states_updated
on public.trip_states(updated_at desc);

create index if not exists idx_trip_states_json_gin
on public.trip_states using gin (state_json);

create trigger trg_trip_states_revision
before update on public.trip_states
for each row execute function public.bump_trip_state_revision();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_states enable row level security;

-- -----------------------------------------------------------------------------
-- Rechte: nur authentifizierte Nutzer, keine anonymous Direktnutzung
-- -----------------------------------------------------------------------------
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.trips to authenticated;
grant select, insert, update, delete on public.trip_states to authenticated;

-- -----------------------------------------------------------------------------
-- Policies profiles
-- -----------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- Policies trips
-- -----------------------------------------------------------------------------
drop policy if exists "trips_select_own" on public.trips;
create policy "trips_select_own"
on public.trips
for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "trips_insert_own" on public.trips;
create policy "trips_insert_own"
on public.trips
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "trips_update_own" on public.trips;
create policy "trips_update_own"
on public.trips
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "trips_delete_own" on public.trips;
create policy "trips_delete_own"
on public.trips
for delete
to authenticated
using (owner_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Policies trip_states
-- Zugriff nur, wenn der zugehörige Törn dem Nutzer gehört
-- -----------------------------------------------------------------------------
drop policy if exists "trip_states_select_own" on public.trip_states;
create policy "trip_states_select_own"
on public.trip_states
for select
to authenticated
using (
  exists (
    select 1
    from public.trips t
    where t.id = trip_states.trip_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "trip_states_insert_own" on public.trip_states;
create policy "trip_states_insert_own"
on public.trip_states
for insert
to authenticated
with check (
  exists (
    select 1
    from public.trips t
    where t.id = trip_states.trip_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "trip_states_update_own" on public.trip_states;
create policy "trip_states_update_own"
on public.trip_states
for update
to authenticated
using (
  exists (
    select 1
    from public.trips t
    where t.id = trip_states.trip_id
      and t.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.trips t
    where t.id = trip_states.trip_id
      and t.owner_id = auth.uid()
  )
);

drop policy if exists "trip_states_delete_own" on public.trip_states;
create policy "trip_states_delete_own"
on public.trip_states
for delete
to authenticated
using (
  exists (
    select 1
    from public.trips t
    where t.id = trip_states.trip_id
      and t.owner_id = auth.uid()
  )
);

commit;
