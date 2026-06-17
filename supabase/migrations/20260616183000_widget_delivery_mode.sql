alter table public.widgets
  add column if not exists delivery_mode text not null default 'instant';

alter table public.widgets
  drop constraint if exists widgets_delivery_mode_check;

alter table public.widgets
  add constraint widgets_delivery_mode_check
  check (delivery_mode in ('instant', 'email'));
