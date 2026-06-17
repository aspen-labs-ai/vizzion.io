alter table public.generated_previews
  add column if not exists share_token text,
  add column if not exists share_expires_at timestamptz;

create unique index if not exists generated_previews_share_token_idx
  on public.generated_previews (share_token)
  where share_token is not null;
