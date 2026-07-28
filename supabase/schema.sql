-- ============================================================
--  THE TONALITY GYM — Supabase schema
--
--  Design notes:
--   · No audio is ever stored. Derived numbers only.
--   · Every table is RLS-protected. A rep can only ever touch
--     their own rows; an admin can read (never write) rows
--     belonging to their own org.
--   · Progress is stored as one jsonb blob so the client schema
--     can evolve without migrations. Telemetry is normalised
--     because it needs to be queried.
-- ============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text,
  username      text unique,
  full_name     text,
  phone         text,
  org           text not null default 'sprk',
  role          text not null default 'rep' check (role in ('rep','admin')),
  created_at    timestamptz not null default now(),
  last_seen     timestamptz
);
alter table public.profiles enable row level security;

-- ---------- helpers ----------
-- security definer so RLS policies can call them without recursing
create or replace function public.my_org() returns text
  language sql stable security definer set search_path = public as $$
  select org from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false)
$$;

-- ---------- progress (one blob per user) ----------
create table if not exists public.progress (
  user_id     uuid primary key references auth.users on delete cascade,
  payload     jsonb not null default '{}'::jsonb,
  xp          int  not null default 0,
  level       int  not null default 1,
  reps        int  not null default 0,
  streak      int  not null default 0,
  updated_at  timestamptz not null default now()
);
alter table public.progress enable row level security;

-- ---------- voice profile ----------
create table if not exists public.voice_profiles (
  user_id     uuid primary key references auth.users on delete cascade,
  payload     jsonb not null default '{}'::jsonb,
  modal_hz    numeric,
  low_hz      numeric,
  high_hz     numeric,
  flat_span   numeric,
  nat_span    numeric,
  ceil_span   numeric,
  updated_at  timestamptz not null default now()
);
alter table public.voice_profiles enable row level security;

-- ---------- per-rep telemetry ----------
create table if not exists public.reps (
  id           bigserial primary key,
  user_id      uuid not null references auth.users on delete cascade,
  tone         text,
  drill        text,
  score        int,
  wpm          numeric,
  span         numeric,
  term         numeric,
  dyn          numeric,
  pause_frac   numeric,
  floor_drop   numeric,
  fry_pct      numeric,
  base_hz      numeric,
  personalised boolean default false,
  created_at   timestamptz not null default now()
);
alter table public.reps enable row level security;
create index if not exists reps_user_created on public.reps(user_id, created_at desc);
create index if not exists reps_tone on public.reps(tone);

-- ---------- "was that score fair?" ----------
create table if not exists public.fairness_flags (
  id          bigserial primary key,
  user_id     uuid not null references auth.users on delete cascade,
  rep_id      bigint references public.reps on delete set null,
  verdict     text not null check (verdict in ('too_low','too_high','about_right')),
  tone        text,
  score       int,
  acoustics   jsonb,
  note        text,
  created_at  timestamptz not null default now()
);
alter table public.fairness_flags enable row level security;

-- ---------- advisor misses ----------
create table if not exists public.advisor_misses (
  id           bigserial primary key,
  user_id      uuid not null references auth.users on delete cascade,
  stage        text,
  line         text,
  mods         text[],
  recommended  text,
  expected     text,
  created_at   timestamptz not null default now()
);
alter table public.advisor_misses enable row level security;

-- ---------- free-text feedback ----------
create table if not exists public.feedback (
  id          bigserial primary key,
  user_id     uuid not null references auth.users on delete cascade,
  page        text,
  message     text not null,
  context     jsonb,
  created_at  timestamptz not null default now()
);
alter table public.feedback enable row level security;

-- ============================================================
--  POLICIES
-- ============================================================

-- profiles: read own + (admin) same-org; write own only
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or (public.is_admin() and org = public.my_org()));

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- generic owner-or-admin-read policy for the rest
do $$
declare t text;
begin
  foreach t in array array['progress','voice_profiles','reps','fairness_flags','advisor_misses','feedback']
  loop
    execute format('drop policy if exists %I_select on public.%I', t, t);
    execute format($f$create policy %I_select on public.%I for select
      using (user_id = auth.uid() or (public.is_admin()
             and exists (select 1 from public.profiles p
                         where p.id = %I.user_id and p.org = public.my_org())))$f$, t, t, t);

    execute format('drop policy if exists %I_insert on public.%I', t, t);
    execute format('create policy %I_insert on public.%I for insert with check (user_id = auth.uid())', t, t);

    execute format('drop policy if exists %I_update on public.%I', t, t);
    execute format('create policy %I_update on public.%I for update using (user_id = auth.uid()) with check (user_id = auth.uid())', t, t);

    execute format('drop policy if exists %I_delete on public.%I', t, t);
    execute format('create policy %I_delete on public.%I for delete using (user_id = auth.uid())', t, t);
  end loop;
end $$;

-- ============================================================
--  AUTO-CREATE PROFILE ON SIGNUP
--  Metadata comes from the signUp() options.data payload.
-- ============================================================
create or replace function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, username, full_name, phone, org, role)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'username',''),
    nullif(new.raw_user_meta_data->>'full_name',''),
    nullif(new.raw_user_meta_data->>'phone',''),
    coalesce(nullif(new.raw_user_meta_data->>'org',''),'sprk'),
    'rep'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  TEAM DASHBOARD VIEW  (admins only, enforced by the
--  underlying table policies)
-- ============================================================
create or replace view public.team_overview
with (security_invoker = true) as
select
  p.id, p.username, p.full_name, p.email, p.org, p.role, p.last_seen,
  coalesce(pr.xp,0)     as xp,
  coalesce(pr.level,1)  as level,
  coalesce(pr.reps,0)   as reps,
  coalesce(pr.streak,0) as streak,
  vp.modal_hz, vp.flat_span, vp.nat_span, vp.ceil_span,
  (select count(*) from public.reps r where r.user_id = p.id
     and r.created_at > now() - interval '7 days')            as reps_7d,
  (select round(avg(r.score)) from public.reps r where r.user_id = p.id
     and r.created_at > now() - interval '30 days')           as avg_30d,
  (select round(avg(r.term)::numeric, 2) from public.reps r where r.user_id = p.id
     and r.created_at > now() - interval '30 days')           as avg_term_30d,
  (select round(avg(r.span)::numeric, 2) from public.reps r where r.user_id = p.id
     and r.created_at > now() - interval '30 days')           as avg_span_30d
from public.profiles p
left join public.progress pr on pr.user_id = p.id
left join public.voice_profiles vp on vp.user_id = p.id;

-- weakest tones per user, for the coaching view
create or replace view public.team_weak_tones
with (security_invoker = true) as
select user_id, tone,
       count(*)                      as n,
       round(avg(score))             as avg_score,
       round(avg(term)::numeric,2)   as avg_term
from public.reps
where tone is not null and tone not like '\_\_%' and score is not null
  and created_at > now() - interval '30 days'
group by user_id, tone
having count(*) >= 3;

-- ============================================================
--  DONE. Remaining manual step in the dashboard:
--    Authentication → Sign In / Providers → Email:
--      · "Confirm email"        OFF   (instant signup, no verify mail)
--      · "Minimum password length" = 6
--    Then promote yourself:
--      update public.profiles set role='admin' where email='YOUR@EMAIL';
-- ============================================================
