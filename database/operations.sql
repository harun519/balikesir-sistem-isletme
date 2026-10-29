-- Small shared operational records. Opened on demand; no polling or subscriptions.
create table if not exists public.portal_operations2026 (
 id uuid primary key default gen_random_uuid(),kind text not null check(kind in ('task','asset')),
 title text not null check(length(title) between 1 and 160),status text not null default 'open' check(status in ('open','progress','done')),
 assigned_to uuid references auth.users(id),payload jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
alter table public.portal_operations2026 enable row level security;
grant select,insert,update,delete on public.portal_operations2026 to authenticated;
create index if not exists portal_ops_assignee2026 on public.portal_operations2026(assigned_to,updated_at desc);
create policy portal_ops_read2026 on public.portal_operations2026 for select to authenticated using ((select private.current_app_role())='admin' or (exists(select 1 from public.app_users u where u.id=(select auth.uid())) and (kind='asset' or assigned_to=(select auth.uid()))));
create policy portal_ops_write2026 on public.portal_operations2026 for all to authenticated using ((select private.current_app_role())='admin') with check ((select private.current_app_role())='admin');
