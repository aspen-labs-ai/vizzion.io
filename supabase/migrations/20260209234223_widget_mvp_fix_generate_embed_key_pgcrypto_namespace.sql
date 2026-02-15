create or replace function public.generate_embed_key()
returns text
language plpgsql
set search_path = public
as $$
begin
  return 'vwk_' || encode(extensions.gen_random_bytes(18), 'hex');
end;
$$;
