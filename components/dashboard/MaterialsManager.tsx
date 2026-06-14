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
  widgetId: string;
  canManage: boolean;
  error: string | null;
  saved: boolean;
  deleted: boolean;
  onCreate: MaterialAction;
  onUpdate: MaterialAction;
  onDelete: MaterialAction;
}

function truncateText(value: string | null, maxLength = 64): string {
  if (!value) {
    return '—';
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

export default function MaterialsManager({
  materials,
  materialsQuota,
  planName,
  widgetId,
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
                The looks customers can preview in your widget.
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
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sort</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default bg-bg-secondary">
                {materials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center">
                      <p className="text-sm font-medium text-text-secondary">No materials yet</p>
                      <p className="mx-auto mt-1 max-w-sm text-xs text-text-tertiary">
                        Materials are the looks customers preview. Add one with a photo or a short
                        description to start capturing leads.
                      </p>
                    </td>
                  </tr>
                ) : (
                  materials.map(material => (
                    <tr key={material.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <MaterialThumb url={material.swatch_url} name={material.name} />
                          <span className="max-w-[14rem] truncate font-medium text-text-primary">
                            {material.name}
                          </span>
                        </div>
                      </td>
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
                      <td className="max-w-[22rem] truncate px-4 py-3 text-text-secondary">
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
          title="Add Material"
          submitLabel="Add Material"
          widgetId={widgetId}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={onCreate}
        />
      ) : null}

      {canManage && editingMaterial ? (
        <MaterialModal
          key={editingMaterial.id}
          title={`Edit ${editingMaterial.name}`}
          submitLabel="Save Changes"
          widgetId={widgetId}
          onClose={() => setEditingMaterialId(null)}
          onSubmit={onUpdate}
          onDelete={onDelete}
          material={editingMaterial}
        />
      ) : null}
    </>
  );
}

function MaterialThumb({ url, name }: { url: string | null; name: string }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- public swatch URL, may be external
      <img
        src={url}
        alt={name}
        className="h-9 w-9 shrink-0 rounded-md border border-border-default object-cover"
      />
    );
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-default bg-bg-primary text-xs font-semibold text-text-tertiary">
      {(name.trim()[0] ?? '?').toUpperCase()}
    </span>
  );
}

function MaterialModal({
  title,
  submitLabel,
  widgetId,
  onClose,
  onSubmit,
  onDelete,
  material,
}: {
  title: string;
  submitLabel: string;
  widgetId: string;
  onClose: () => void;
  onSubmit: MaterialAction;
  onDelete?: MaterialAction;
  material?: MaterialItem;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-default bg-bg-secondary shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border-default bg-bg-secondary px-5 py-4">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
          >
            Close
          </button>
        </div>

        <form action={onSubmit} className="space-y-5 px-5 py-5">
          <input type="hidden" name="widget_id" value={widgetId} />
          {material ? <input type="hidden" name="material_id" value={material.id} /> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <InputField label="Name" name="name" required defaultValue={material?.name ?? ''} placeholder="e.g. Charcoal Asphalt Shingles" />
            <InputField
              label="Sort Order"
              name="sort_order"
              type="number"
              defaultValue={material ? material.sort_order.toString() : '0'}
            />
          </div>

          <ImageUploadField existingUrl={material?.swatch_url ?? null} />

          <DescriptionField defaultValue={material?.prompt_modifier ?? ''} />

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

function ImageUploadField({ existingUrl }: { existingUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(existingUrl);
  const [pickedNew, setPickedNew] = useState(false);
  const [removeExisting, setRemoveExisting] = useState(false);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setPickedNew(true);
      setRemoveExisting(false);
    }
  }

  function clearImage() {
    setPreview(null);
    setPickedNew(false);
    if (existingUrl) {
      setRemoveExisting(true);
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-text-secondary">Material photo</span>
      <p className="text-xs text-text-tertiary">
        Optional, but the best way to get an accurate match. Upload a flat, straight-on photo of the
        material, evenly lit and filling the frame, with colors true to real life. Avoid steep angles,
        harsh shadows, or busy backgrounds.
      </p>

      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL or public swatch URL
          <img
            src={preview}
            alt="Material preview"
            className="h-20 w-20 shrink-0 rounded-lg border border-border-default object-cover"
          />
        ) : (
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-border-default bg-bg-primary text-center text-[10px] leading-tight text-text-tertiary">
            No photo
          </span>
        )}

        <div className="space-y-2">
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary">
            {preview ? 'Replace photo' : 'Upload photo'}
            <input
              type="file"
              name="image_file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFile}
              className="sr-only"
            />
          </label>
          {preview ? (
            <button
              type="button"
              onClick={clearImage}
              className="ml-2 text-xs font-medium text-text-tertiary underline-offset-2 hover:text-red-300 hover:underline"
            >
              Remove
            </button>
          ) : null}
          <p className="text-[11px] text-text-tertiary">JPG, PNG, or WebP · up to 8 MB</p>
        </div>
      </div>

      {/* Tells the server action to clear the saved image when the existing one
          was removed and no replacement was chosen. */}
      {removeExisting && !pickedNew ? <input type="hidden" name="remove_image" value="on" /> : null}
    </div>
  );
}

function DescriptionField({ defaultValue }: { defaultValue: string }) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-text-secondary">Description</span>
      <textarea
        name="description"
        rows={3}
        defaultValue={defaultValue}
        placeholder="e.g. Dark charcoal architectural asphalt shingles"
        className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent/60"
      />
      <p className="text-xs text-text-tertiary">
        Describe the material in a few plain words — its color, finish, and texture. Great on its own,
        or alongside a photo for extra accuracy.
      </p>
      <details className="group rounded-lg border border-border-default bg-bg-primary/40 px-3 py-2">
        <summary className="cursor-pointer list-none text-xs font-semibold text-accent">
          See examples
        </summary>
        <ul className="mt-2 space-y-1.5 text-xs text-text-secondary">
          <li>&ldquo;Dark charcoal architectural asphalt shingles&rdquo;</li>
          <li>&ldquo;Warm, weathered cedar lap siding&rdquo;</li>
          <li>&ldquo;Glossy midnight-blue finish&rdquo;</li>
          <li>&ldquo;Lush, natural-green artificial turf&rdquo;</li>
          <li>&ldquo;Rich espresso-brown composite decking&rdquo;</li>
        </ul>
      </details>
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
