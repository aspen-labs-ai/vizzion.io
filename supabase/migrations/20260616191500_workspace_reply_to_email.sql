alter table public.workspaces
  add column if not exists reply_to_email text;
