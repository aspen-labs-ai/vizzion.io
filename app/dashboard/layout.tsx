import Image from 'next/image';
import { redirect } from 'next/navigation';
import { signOutAction } from '@/app/auth/actions';
import AppNav from '@/components/dashboard/AppNav';
import { createClient } from '@/lib/supabase/server';
import { getMissingSetupRequirements } from '@/lib/vizzion/setup-requirements';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

export const dynamic = 'force-dynamic';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' as const },
  { href: '/dashboard/materials', label: 'Materials', icon: 'materials' as const },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' as const },
  { href: '/dashboard/billing', label: 'Billing', icon: 'billing' as const },
  { href: '/dashboard/leads', label: 'Leads', icon: 'leads' as const },
];

function getStatusLabel(status: string): string {
  if (status === 'active') {
    return 'Active';
  }

  if (status === 'suspended') {
    return 'Suspended';
  }

  return 'Pending Approval';
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in?next=/dashboard');
  }

  const hasSettingsAttention = getMissingSetupRequirements(context.widget).some(
    requirement => requirement.route === '/dashboard/settings',
  );
  const navAlerts: Record<string, boolean> = {
    '/dashboard/settings': hasSettingsAttention,
  };
  const showEditorRoleChip = context.role === 'editor';
  const workspaceDisplayName = context.workspace.company_name ?? context.workspace.name;

  return (
    <div className="h-screen overflow-hidden bg-bg-primary text-text-primary">
      <div className="flex h-full">
        <aside className="hidden h-full w-[280px] shrink-0 flex-col border-r border-border-default bg-bg-tertiary/70 lg:flex">
          <div className="border-b border-border-default px-5 py-6">
            <div className="flex items-center gap-2">
              <Image
                src="/vizzion-logo.png"
                alt="Vizzion logo"
                width={22}
                height={22}
                className="h-[18px] w-auto"
                priority
              />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Vizzion App</p>
            </div>
            <h1 className="mt-3 text-2xl font-semibold leading-tight text-text-primary">
              {workspaceDisplayName}
            </h1>
            {showEditorRoleChip ? (
              <span className="mt-3 inline-flex rounded-full border border-border-default bg-bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                Editor
              </span>
            ) : null}
          </div>

          <div className="px-4 py-5">
            <AppNav items={navItems} alertByHref={navAlerts} />
          </div>

          <div className="mt-auto border-t border-border-default px-4 py-5">
            <div className="mb-3">
              <span className="inline-flex rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                {getStatusLabel(context.workspace.status)}
              </span>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border-default bg-bg-primary/90 px-5 py-4 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/vizzion-logo.png"
                    alt="Vizzion logo"
                    width={18}
                    height={18}
                    className="h-4 w-auto"
                    priority
                  />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Vizzion App</p>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {workspaceDisplayName}
                </p>
                {showEditorRoleChip ? (
                  <span className="mt-2 inline-flex rounded-full border border-border-default bg-bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                    Editor
                  </span>
                ) : null}
              </div>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
                >
                  Sign out
                </button>
              </form>
            </div>

            <div className="mt-4">
              <AppNav items={navItems} orientation="horizontal" alertByHref={navAlerts} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-5 py-6 md:px-7 md:py-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
