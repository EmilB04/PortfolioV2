-- Durable per-IP rate limiting for the `chat` edge function.
--
-- The in-function limiter is per-isolate: Supabase recycles isolates and may run
-- several concurrently, so a distributed caller can exceed the cap. This table
-- moves the counter into Postgres so the limit holds across every isolate.

create table if not exists public.chat_rate_limit (
    ip            text        primary key,
    window_start  timestamptz not null default now(),
    request_count integer     not null default 0
);

-- Supports the sweep in prune_chat_rate_limit().
create index if not exists chat_rate_limit_window_start_idx
    on public.chat_rate_limit (window_start);

-- No policies are defined, so with RLS enabled only the service role (which the
-- edge function uses) can read or write this table.
alter table public.chat_rate_limit enable row level security;

-- Atomically records a hit and reports whether it is within the cap.
-- Returns true when the request is allowed, false when it should be rejected.
-- The whole decision is one upsert, so concurrent requests cannot interleave
-- into a read-then-write race.
create or replace function public.check_chat_rate_limit(
    p_ip     text,
    p_max    integer  default 8,
    p_window interval default '1 minute'
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    v_count integer;
begin
    insert into public.chat_rate_limit as t (ip, window_start, request_count)
    values (p_ip, now(), 1)
    on conflict (ip) do update
        set request_count = case
                when t.window_start < now() - p_window then 1
                else t.request_count + 1
            end,
            window_start = case
                when t.window_start < now() - p_window then now()
                else t.window_start
            end
    returning t.request_count into v_count;

    return v_count <= p_max;
end;
$$;

-- Housekeeping: drop rows whose window has long since expired. Call periodically
-- (pg_cron, or opportunistically from the edge function).
create or replace function public.prune_chat_rate_limit(p_older_than interval default '1 hour')
returns void
language sql
security definer
set search_path = public
as $$
    delete from public.chat_rate_limit where window_start < now() - p_older_than;
$$;

revoke all on function public.check_chat_rate_limit(text, integer, interval) from public, anon, authenticated;
revoke all on function public.prune_chat_rate_limit(interval) from public, anon, authenticated;
