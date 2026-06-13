alter table public.widgets
  add column if not exists subject_type text not null default 'home';

alter table public.widgets
  drop constraint if exists widgets_subject_type_check;

alter table public.widgets
  add constraint widgets_subject_type_check
  check (
    subject_type in ('home', 'vehicle', 'body', 'yard', 'boat', 'room', 'generic')
  );
