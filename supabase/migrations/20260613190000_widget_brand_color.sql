-- Per-widget brand/accent color so each embedded widget can match its host site.
-- Previously the accent came from workspaces.brand_color (one per account); this
-- moves it to the widget level. workspaces.brand_color is retained as a fallback.

alter table public.widgets
  add column if not exists brand_color text not null default '#10B981';

-- Backfill widgets that are still on the default from their workspace's color.
update public.widgets w
set brand_color = ws.brand_color
from public.workspaces ws
where ws.id = w.workspace_id
  and ws.brand_color is not null
  and ws.brand_color <> ''
  and w.brand_color = '#10B981';
