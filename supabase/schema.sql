-- Run this in the Supabase SQL editor to create the site_data table.
-- Then create a public storage bucket named "uploads" with public read access.

create table if not exists public.site_data (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

-- Allow public read (site reads without auth). Adjust RLS as needed.
alter table public.site_data enable row level security;

create policy "Public read site_data"
  on public.site_data for select
  using (true);

create policy "Service role write site_data"
  on public.site_data for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Storage bucket for uploads (create via dashboard or CLI):
-- insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true);
