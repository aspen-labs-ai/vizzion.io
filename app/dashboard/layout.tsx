import Image from 'next/image';
import { signOutAction } from '@/app/auth/actions';
import AppNav from '@/components/dashboard/AppNav';
import SubmitButton from '@/components/dashboard/SubmitButton';
import Topbar from '@/components/dashboard/Topbar';
import WidgetSwitcher from '@/components/dashboard/WidgetSwitcher';
import { createClient } from '@/lib/supabase/server';
import { getOnboardingNavAlerts } from '@/lib/vizzion/onboarding';
import { getWorkspaceWidgets } from '@/lib/vizzion/portfolio';
import { getWorkspaceContext, listWorkspaceWidgets } from '@/lib/vizzion/workspace';

export const dynamic = 'force-dynamic';

function getStatusLabel(status: string): string {
  if (status === 'suspended') {
    return 'Suspended';
  }

  // Self-serve: workspaces are active immediately. Legacy 'pending' rows are
  // treated as active rather than surfacing a non-existent approval gate.
  return 'Active';
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-primary px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border-default bg-bg-secondary p-7 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Vizzion App</p>
          <h1 className="mt-3 text-2xl font-bold text-text-primary">Sign in required</h1>
          <p className="mt-2 text-sm text-text-secondary">
            You need an active dashboard session to view this page.
          </p>
          <form action="/auth/sign-in" method="get" className="mt-5">
            <button
              type="submit"
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover"
            >
              Go to sign in
            </button>
          </form>
        </div>
      </main>
    );
  }

  const activeMaterialsResult = await supabase
    .from('materials')
    .select('swatch_url')
    .eq('widget_id', context.widget.id)
    .eq('is_active', true);
  const activeMaterialRows = (activeMaterialsResult.data ?? []) as Array<{ swatch_url: string | null }>;
  const activeMaterialCount = activeMaterialRows.length;
  const materialsMissingImageCount = activeMaterialRows.filter(material => !material.swatch_url).length;

  const navAlerts = getOnboardingNavAlerts({
    widgetId: context.widget.id,
    subjectType: context.widget.subject_type,
    targetSurface: context.widget.target_surface,
    domainAllowlist: context.widget.domain_allowlist,
    isActive: context.widget.is_active,
    activeMaterialCount,
    materialsMissingImageCount,
    brandCustomized: false,
    hasLogo: Boolean(context.workspace.logo_url),
  });
  const showEditorRoleChip = context.role === 'editor';
  const workspaceDisplayName = context.workspace.company_name ?? context.workspace.name;
  const statusLabel = getStatusLabel(context.workspace.status);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userEmail = user?.email ?? '';
  const workspaceWidgets = await getWorkspaceWidgets(supabase, context.workspace.id);
  const showPortfolioNav = workspaceWidgets.length > 1;
  const widgetOptions = await listWorkspaceWidgets(supabase, context.workspace.id);

  const navGroups = [
    {
      label: 'Analyze',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' as const },
        ...(showPortfolioNav
          ? [{ href: '/dashboard/portfolio', label: 'Portfolio', icon: 'portfolio' as const }]
          : []),
        { href: '/dashboard/leads', label: 'Leads', icon: 'leads' as const },
      ],
    },
    {
      label: 'Configure',
      items: [
        { href: '/dashboard/materials', label: 'Materials', icon: 'materials' as const },
        { href: '/dashboard/settings', label: 'Setup', icon: 'settings' as const },
      ],
    },
    {
      label: 'Account',
      items: [
        { href: '/dashboard/workspace', label: 'Workspace', icon: 'workspace' as const },
        { href: '/dashboard/billing', label: 'Billing', icon: 'billing' as const },
      ],
    },
  ];

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

          <div className="border-b border-border-default px-4 py-4">
            <WidgetSwitcher widgets={widgetOptions} defaultWidgetId={context.widget.id} />
          </div>

          <div className="px-4 py-5">
            <AppNav groups={navGroups} alertByHref={navAlerts} />
          </div>

          <div className="mt-auto space-y-3 border-t border-border-default px-4 py-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                {(userEmail[0] ?? 'U').toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{userEmail || 'Signed in'}</p>
                <span className="text-[11px] font-semibold text-text-tertiary">{statusLabel}</span>
              </div>
            </div>
            <form action={signOutAction}>
              <SubmitButton
                pendingLabel="Signing out…"
                className="w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
              >
                Sign out
              </SubmitButton>
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
                <SubmitButton
                  pendingLabel="Signing out…"
                  className="rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
                >
                  Sign out
                </SubmitButton>
              </form>
            </div>

            <div className="mt-4">
              <WidgetSwitcher widgets={widgetOptions} defaultWidgetId={context.widget.id} />
            </div>

            <div className="mt-4">
              <AppNav groups={navGroups} orientation="horizontal" alertByHref={navAlerts} />
            </div>
          </header>

          <Topbar />

          <main className="flex-1 overflow-y-auto px-5 py-6 md:px-7 md:py-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
