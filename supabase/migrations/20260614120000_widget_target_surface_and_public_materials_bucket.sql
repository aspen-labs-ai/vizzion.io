-- Materials redesign support.
--
-- 1. widgets.target_surface: a short, plain phrase describing WHAT the widget
--    changes (e.g. "the roof", "the siding", "the driveway"). Set once per
--    widget so individual materials only need a name/photo/description — the
--    generation worker combines this surface with the chosen material when
--    building the model payload.
--
-- 2. Make the 'materials' bucket public. Material swatch images are generic,
--    non-sensitive product textures that must be displayable in the embedded
--    widget (browser) and fetchable by the generation worker as a reference
--    image. Writes remain gated by the existing owner-only RLS policy
--    (storage_write_owner_files); only public READ is enabled.

alter table public.widgets
  add column if not exists target_surface text;

update storage.buckets
  set public = true
  where id = 'materials';
