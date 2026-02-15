'use client';

import { useMemo, useState } from 'react';

interface MaterialItem {
  id: string;
  name: string;
  swatch_url: string | null;
  texture_url: string | null;
  prompt_modifier: string | null;
  sort_order: number;
  is_active: boolean;
}

type MaterialAction = (formData: FormData) => void | Promise<void>;

interface MaterialsManagerProps {
  materials: MaterialItem[];
  materialsQuota: number | null;
  planName: string | null;
  canManage: boolean;
  error: string | null;
  saved: boolean;
  deleted: boolean;
  onCreate: MaterialAction;
  onUpdate: MaterialAction;
  onDelete: MaterialAction;
}

function truncateText(value: string | null, maxLength = 56): string {
  if (!value) {
    return '—';
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

function formatUrlValue(value: string | null): string {
  if (!value) {
    return '—';
  }

  try {
    const url = new URL(value);
    return `${url.hostname}${url.pathname === '/' ? '' : url.pathname}`;
  } catch {
    return value;
  }
}

export default function MaterialsManager({
  materials,
  materialsQuota,
  planName,
  canManage,
  error,
  saved,
  deleted,
  onCreate,
  onUpdate,
  onDelete,
}: MaterialsManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const materialsUsed = materials.length;
  const hasMaterialsQuota = materialsQuota !== null;
  const materialsRemaining =
    hasMaterialsQuota && materialsQuota !== null
      ? Math.max(materialsQuota - materialsUsed, 0)
      : null;
  const isMaterialLimitReached =
    hasMaterialsQuota && materialsQuota !== null && materialsUsed >= materialsQuota;
  const canCreateMaterial = canManage && !isMaterialLimitReached;

  const editingMaterial = useMemo(
    () => materials.find(material => material.id === editingMaterialId) ?? null,
    [materials, editingMaterialId],
  );

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border-default bg-bg-secondary p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Materials</h2>
              <p className="text-sm text-text-secondary">
                Manage the materials available in your widget.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-border-default bg-bg-primary px-3 py-1 text-xs text-text-secondary">
                <span className="font-medium text-text-primary">Usage:</span>{' '}
                {hasMaterialsQuota && materialsQuota !== null ? (
                  <>
                    {materialsUsed.toLocaleString('en-US')} / {materialsQuota.toLocaleString('en-US')} materials
                    {planName ? ` (${planName})` : ''}
                  </>
                ) : (
                  <>Unlimited materials{planName ? ` on ${planName}` : ''}</>
                )}
              </div>

              {materialsRemaining !== null ? (
                <span className="text-xs text-text-tertiary">
                  {materialsRemaining.toLocaleString('en-US')} remaining
                </span>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  if (canCreateMaterial) {
                    setIsCreateOpen(true);
                  }
                }}
                disabled={!canCreateMaterial}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!canManage
                  ? 'Owner Only'
                  : isMaterialLimitReached
                    ? 'Material Limit Reached'
                    : 'Add Material'}
              </button>
            </div>
          </div>

          {!canManage ? (
            <p className="mb-4 rounded-lg border border-border-default bg-bg-primary px-4 py-3 text-xs text-text-tertiary">
              You have view-only access. Only workspace owners can create or edit materials.
            </p>
          ) : null}

          {error ? (
            <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          {saved ? (
            <p className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
              Material saved.
            </p>
          ) : null}

          {deleted ? (
            <p className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
              Material deleted.
            </p>
          ) : null}

          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="min-w-full divide-y divide-border-default text-sm">
              <thead className="bg-bg-primary text-left text-xs uppercase tracking-wide text-text-tertiary">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sort</th>
                  <th className="px-4 py-3">Swatch</th>
                  <th className="px-4 py-3">Texture</th>
                  <th className="px-4 py-3">Prompt</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default bg-bg-secondary">
                {materials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-text-tertiary">
                      No materials yet.
                    </td>
                  </tr>
                ) : (
                  materials.map(material => (
                    <tr key={material.id}>
                      <td className="max-w-[15rem] truncate px-4 py-3 text-text-primary">{material.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
                            material.is_active
                              ? 'border-accent/40 bg-accent/10 text-accent'
                              : 'border-border-default bg-bg-primary text-text-secondary'
                          }`}
                        >
                          {material.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{material.sort_order}</td>
                      <td className="max-w-[12rem] truncate px-4 py-3 text-text-secondary">
                        {formatUrlValue(material.swatch_url)}
                      </td>
                      <td className="max-w-[12rem] truncate px-4 py-3 text-text-secondary">
                        {formatUrlValue(material.texture_url)}
                      </td>
                      <td className="max-w-[18rem] truncate px-4 py-3 text-text-secondary">
                        {truncateText(material.prompt_modifier)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {canManage ? (
                          <button
                            type="button"
                            onClick={() => setEditingMaterialId(material.id)}
                            className="rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
                          >
                            Edit
                          </button>
                        ) : (
                          <span className="text-xs text-text-tertiary">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {canManage && isCreateOpen ? (
        <MaterialModal
          title="Create Material"
          submitLabel="Create Material"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={onCreate}
        />
      ) : null}

      {canManage && editingMaterial ? (
        <MaterialModal
          key={editingMaterial.id}
          title={`Edit ${editingMaterial.name}`}
          submitLabel="Save Changes"
          onClose={() => setEditingMaterialId(null)}
          onSubmit={onUpdate}
          onDelete={onDelete}
          material={editingMaterial}
        />
      ) : null}
    </>
  );
}

function MaterialModal({
  title,
  submitLabel,
  onClose,
  onSubmit,
  onDelete,
  material,
}: {
  title: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: MaterialAction;
  onDelete?: MaterialAction;
  material?: MaterialItem;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-border-default bg-bg-secondary shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
          >
            Close
          </button>
        </div>

        <form action={onSubmit} className="space-y-4 px-5 py-5">
          {material ? <input type="hidden" name="material_id" value={material.id} /> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <InputField label="Name" name="name" required defaultValue={material?.name ?? ''} />
            <InputField
              label="Sort Order"
              name="sort_order"
              type="number"
              defaultValue={material ? material.sort_order.toString() : '0'}
            />
            <InputField
              label="Swatch URL"
              name="swatch_url"
              defaultValue={material?.swatch_url ?? ''}
              placeholder="https://..."
            />
            <InputField
              label="Texture URL"
              name="texture_url"
              defaultValue={material?.texture_url ?? ''}
              placeholder="https://..."
            />
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-secondary">Prompt Modifier</span>
            <textarea
              name="prompt_modifier"
              rows={4}
              defaultValue={material?.prompt_modifier ?? ''}
              placeholder="Use this material for high-contrast roof surfaces..."
              className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent/60"
            />
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={material ? material.is_active : true}
              className="h-4 w-4 rounded border-border-default bg-bg-primary text-accent focus:ring-accent"
            />
            Active in widget
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-4">
            <div>
              {material && onDelete ? (
                <button
                  type="submit"
                  formAction={onDelete}
                  formNoValidate
                  className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  Delete Material
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60"
      />
    </label>
  );
}
