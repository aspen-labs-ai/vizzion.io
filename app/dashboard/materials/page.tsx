import { redirect } from 'next/navigation';
import {
  createMaterialAction,
  deleteMaterialAction,
  updateMaterialAction,
} from '@/app/dashboard/actions';
import MaterialsManager from '@/components/dashboard/MaterialsManager';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceBillingSummary } from '@/lib/vizzion/billing';
import { getWidgetMaterials, getWorkspaceContext } from '@/lib/vizzion/workspace';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }
  return null;
}

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in');
  }

  const materials = await getWidgetMaterials(supabase, context.widget.id);
  const billingSummary = await getWorkspaceBillingSummary(supabase, context.workspace.id);
  const resolvedParams = await searchParams;
  const error = getSingleParam(resolvedParams.error);
  const saved = getSingleParam(resolvedParams.saved) === '1';
  const deleted = getSingleParam(resolvedParams.deleted) === '1';

  return (
    <MaterialsManager
      materials={materials}
      materialsQuota={billingSummary?.plan.materials_quota ?? null}
      planName={billingSummary?.plan.name ?? null}
      canManage={context.role === 'owner'}
      error={error}
      saved={saved}
      deleted={deleted}
      onCreate={createMaterialAction}
      onUpdate={updateMaterialAction}
      onDelete={deleteMaterialAction}
    />
  );
}
