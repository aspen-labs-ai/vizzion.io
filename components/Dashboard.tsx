'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/* ── constants ─────────────────────────────────────────── */
const TABS = ['dashboard', 'materials', 'settings'] as const;
type Tab = (typeof TABS)[number];
const TAB_MS = 5000; // 5 s per tab → 15 s full cycle

const TAB_LABELS: Record<Tab, string> = {
  dashboard: 'Dashboard',
  materials: 'Materials',
  settings: 'Settings',
};

/* ── data ──────────────────────────────────────────────── */
const barHeights = [60, 75, 55, 80, 70, 90, 85, 95, 88, 92, 87, 98];

const popularProducts = [
  { name: 'Midnight Black', pct: 85, count: '1,247' },
  { name: 'Arctic White', pct: 68, count: '992' },
  { name: 'Coastal Gray', pct: 42, count: '608' },
];

const materialCards = [
  { name: 'Midnight Black', variants: 8, views: '1,247', conv: 31, color: '#1a1a2e' },
  { name: 'Arctic White', variants: 6, views: '992', conv: 28, color: '#e2e2e2' },
  { name: 'Coastal Gray', variants: 5, views: '608', conv: 24, color: '#7f8c8d' },
  { name: 'Warm Bronze', variants: 4, views: '445', conv: 22, color: '#b87333' },
];

const widgetToggles = [
  { label: 'Require Email', desc: 'Collect email before showing preview', on: true },
  { label: 'Auto-Open Widget', desc: 'Open widget automatically on page load', on: false },
  { label: 'Show Product Names', desc: 'Display material names inside the widget', on: true },
];

/* ── hooks ─────────────────────────────────────────────── */
function useCountUp(target: number, ms: number, go: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!go) return;
    setV(0);
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / ms, 1);
      setV(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, go]);
  return v;
}

/* ── inline SVG icons ──────────────────────────────────── */
function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function MaterialsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  dashboard: <DashboardIcon />,
  materials: <MaterialsIcon />,
  settings: <SettingsIcon />,
};

function UpArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── component ─────────────────────────────────────────── */
export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [auto, setAuto] = useState(true);
  const [cycle, setCycle] = useState(0);

  /* auto-rotation */
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setTab(p => TABS[(TABS.indexOf(p) + 1) % TABS.length]);
      setCycle(c => c + 1);
    }, TAB_MS);
    return () => clearInterval(id);
  }, [auto]);

  /* resume auto-play 10 s after manual click */
  useEffect(() => {
    if (auto) return;
    const id = setTimeout(() => setAuto(true), 10_000);
    return () => clearTimeout(id);
  }, [auto]);

  const click = useCallback((t: Tab) => {
    setTab(t);
    setAuto(false);
    setCycle(c => c + 1);
  }, []);

  /* count-up values (only animate when dashboard visible) */
  const isDash = tab === 'dashboard';
  const vizN = useCountUp(2847, 1400, isDash);
  const convN = useCountUp(243, 1400, isDash);
  const leadN = useCountUp(142, 1400, isDash);

  return (
    <section className="py-24 px-6 bg-bg-secondary" id="dashboard">
      <div className="max-w-[1400px] mx-auto">
        {/* ── Section Header ── */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Powerful dashboard to track what matters
          </h2>
          <p className="text-xl text-text-secondary">
            Monitor conversions, manage your product catalog, and white-label
            everything&mdash;all from one interface.
          </p>
        </div>

        {/* ── Dashboard Mockup ── */}
        <div className="mb-16">
          <div className="bg-bg-secondary rounded-2xl shadow-2xl overflow-hidden border border-border-default max-w-6xl mx-auto">
            {/* Window chrome */}
            <div className="bg-bg-tertiary px-4 py-3 flex items-center gap-2 border-b border-border-subtle">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-4 text-sm text-text-tertiary">Vizzion Dashboard</span>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* ── Sidebar (desktop) ── */}
              <div className="hidden md:block md:w-56 bg-bg-tertiary border-r border-border-default p-4">
                <nav className="space-y-1">
                  {TABS.map(t => (
                    <button
                      key={t}
                      onClick={() => click(t)}
                      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all overflow-hidden ${
                        tab === t
                          ? 'bg-accent/10 text-accent'
                          : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                      }`}
                    >
                      {TAB_ICONS[t]}
                      <span>{TAB_LABELS[t]}</span>
                      {auto && tab === t && (
                        <motion.div
                          key={`prog-${cycle}`}
                          className="absolute bottom-0 left-0 h-0.5 bg-accent/40 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: TAB_MS / 1000, ease: 'linear' }}
                        />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* ── Main Content ── */}
              <div className="flex-1 min-h-[520px] bg-bg-primary relative overflow-hidden">
                {/* Mobile tab strip */}
                <div className="md:hidden flex border-b border-border-subtle">
                  {TABS.map(t => (
                    <button
                      key={t}
                      onClick={() => click(t)}
                      className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                        tab === t
                          ? 'text-accent border-b-2 border-accent'
                          : 'text-text-tertiary'
                      }`}
                    >
                      {TAB_LABELS[t]}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 md:p-8"
                  >
                    {/* ═══════════ DASHBOARD TAB ═══════════ */}
                    {tab === 'dashboard' && (
                      <>
                        {/* Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                          <div className="p-5 bg-bg-secondary border border-border-default rounded-xl">
                            <div className="text-sm text-text-tertiary mb-2">
                              Total Visualizations
                            </div>
                            <div className="text-3xl font-bold text-text-primary mb-2">
                              {vizN.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-accent">
                              <UpArrow />
                              <span>12.5% vs last month</span>
                            </div>
                          </div>

                          <div className="p-5 bg-accent/10 border border-accent rounded-xl shadow-lg shadow-accent/20">
                            <div className="text-sm text-text-tertiary mb-2">
                              Conversion Rate
                            </div>
                            <div className="text-3xl font-bold text-text-primary mb-2">
                              {(convN / 10).toFixed(1)}%
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-accent">
                              <UpArrow />
                              <span>8.2% vs last month</span>
                            </div>
                          </div>

                          <div className="p-5 bg-bg-secondary border border-border-default rounded-xl">
                            <div className="text-sm text-text-tertiary mb-2">
                              Active Leads
                            </div>
                            <div className="text-3xl font-bold text-text-primary mb-2">
                              {leadN}
                            </div>
                            <div className="text-sm text-text-tertiary">
                              2 new today
                            </div>
                          </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="bg-bg-secondary border border-border-default rounded-xl p-6 mb-6 md:mb-8">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 mb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-text-primary">
                              Visualizations Over Time
                            </h3>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 text-sm rounded bg-bg-tertiary text-text-secondary">
                                7D
                              </span>
                              <span className="px-3 py-1 text-sm rounded bg-accent text-primary">
                                30D
                              </span>
                              <span className="px-3 py-1 text-sm rounded bg-bg-tertiary text-text-secondary">
                                90D
                              </span>
                            </div>
                          </div>
                          <div className="h-32 flex items-end gap-2">
                            {barHeights.map((h, i) => (
                              <motion.div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-accent to-accent/60 rounded-t"
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{
                                  duration: 0.6,
                                  delay: i * 0.04,
                                  ease: 'easeOut',
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Popular Products */}
                        <div className="bg-bg-secondary border border-border-default rounded-xl p-6">
                          <h3 className="text-lg font-semibold mb-6 text-text-primary">
                            Most Popular Products
                          </h3>
                          <div className="space-y-4">
                            {popularProducts.map((m, i) => (
                              <div key={m.name} className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-28 text-sm text-text-secondary">
                                  {m.name}
                                </div>
                                <div className="flex-1 h-8 bg-bg-tertiary rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full shadow-lg shadow-accent/30"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${m.pct}%` }}
                                    transition={{
                                      duration: 0.8,
                                      delay: 0.3 + i * 0.12,
                                      ease: 'easeOut',
                                    }}
                                  />
                                </div>
                                <div className="flex-shrink-0 w-16 text-sm font-semibold text-right text-text-primary">
                                  {m.count}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* ═══════════ MATERIALS TAB ═══════════ */}
                    {tab === 'materials' && (
                      <>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-text-primary">
                            Product Library
                          </h3>
                          <span className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold text-sm">
                            + Upload Material
                          </span>
                        </div>

                        {/* Upload Dropzone */}
                        <div className="border-2 border-dashed border-border-default rounded-xl p-6 mb-6 flex flex-col items-center justify-center text-center">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-text-tertiary mb-2"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <p className="text-text-secondary text-sm">
                            Drag &amp; drop product images or click to browse
                          </p>
                          <p className="text-text-tertiary text-xs mt-1">
                            PNG, JPG up to 10MB each
                          </p>
                        </div>

                        {/* Material Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {materialCards.map((c, i) => (
                            <motion.div
                              key={c.name}
                              className="bg-bg-secondary border border-border-default rounded-xl p-5 hover:border-accent transition-all"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.08 }}
                            >
                              <div className="flex gap-4">
                                <div
                                  className="w-14 h-14 rounded-lg flex-shrink-0 border border-border-subtle"
                                  style={{ backgroundColor: c.color }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold text-text-primary text-sm">
                                        {c.name}
                                      </h4>
                                      <p className="text-xs text-text-tertiary">
                                        {c.variants} variants
                                      </p>
                                    </div>
                                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded flex-shrink-0">
                                      Active
                                    </span>
                                  </div>
                                  <div className="flex gap-4 mt-3 text-xs">
                                    <span className="text-text-tertiary">
                                      {c.views} views
                                    </span>
                                    <span className="text-accent font-medium">
                                      {c.conv}% conv.
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* ═══════════ SETTINGS TAB ═══════════ */}
                    {tab === 'settings' && (
                      <>
                        <h3 className="text-xl font-bold text-text-primary mb-6">
                          Widget Settings
                        </h3>

                        {/* White-Label Branding */}
                        <div className="bg-bg-secondary border border-border-default rounded-xl p-6 mb-5">
                          <h4 className="text-sm font-semibold text-text-primary mb-4">
                            White-Label Branding
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-text-tertiary mb-1.5 block">
                                Company Name
                              </label>
                              <div className="bg-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary border border-border-subtle">
                                Greenfield Pools &amp; Spas
                              </div>
                            </div>
                            <div className="flex gap-6">
                              <div>
                                <label className="text-xs text-text-tertiary mb-1.5 block">
                                  Logo
                                </label>
                                <div className="bg-bg-tertiary rounded-lg w-14 h-14 border border-border-subtle flex items-center justify-center">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-text-tertiary"
                                  >
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-text-tertiary mb-1.5 block">
                                  Brand Color
                                </label>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-accent border border-border-subtle" />
                                  <div className="bg-bg-tertiary rounded-lg px-3 py-2 text-sm text-text-secondary border border-border-subtle font-mono">
                                    #10B981
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Embed Code */}
                        <div className="bg-bg-secondary border border-border-default rounded-xl p-6 mb-5">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-semibold text-text-primary">
                              Embed Code
                            </h4>
                            <span className="px-3 py-1 bg-bg-tertiary text-text-secondary text-xs rounded cursor-default">
                              Copy
                            </span>
                          </div>
                          <div className="bg-bg-primary rounded-lg p-4 font-mono text-xs text-text-secondary overflow-x-auto border border-border-subtle leading-relaxed">
                            <span className="text-accent">{'<script'}</span>
                            {' src'}
                            <span className="text-text-tertiary">={'"'}https://cdn.vizzion.io/widget.js{'"'}</span>
                            <br />
                            {'  data-key'}
                            <span className="text-text-tertiary">={'"'}vz_live_abc123{'"'}</span>
                            <br />
                            {'  data-theme'}
                            <span className="text-text-tertiary">={'"'}dark{'"'}</span>
                            <span className="text-accent">{'>'}</span>
                            <br />
                            <span className="text-accent">{'</script>'}</span>
                          </div>
                        </div>

                        {/* Widget Configuration */}
                        <div className="bg-bg-secondary border border-border-default rounded-xl p-6">
                          <h4 className="text-sm font-semibold text-text-primary mb-4">
                            Widget Configuration
                          </h4>
                          <div className="space-y-5">
                            {widgetToggles.map(t => (
                              <div
                                key={t.label}
                                className="flex items-center justify-between gap-4"
                              >
                                <div>
                                  <div className="text-sm text-text-primary">
                                    {t.label}
                                  </div>
                                  <div className="text-xs text-text-tertiary">
                                    {t.desc}
                                  </div>
                                </div>
                                <div
                                  className={`w-10 h-6 rounded-full relative flex-shrink-0 transition-colors ${
                                    t.on ? 'bg-accent' : 'bg-bg-tertiary'
                                  }`}
                                >
                                  <div
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                                      t.on ? 'right-1' : 'left-1'
                                    }`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">Real-Time Analytics</h3>
            <p className="text-text-secondary">
              Monitor visualizations, conversions, and lead quality as they happen.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">Product Management</h3>
            <p className="text-text-secondary">
              Upload materials, organize variants, and track which products convert best.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">White-Label Everything</h3>
            <p className="text-text-secondary">
              Your brand, your colors, your domain. Customers never see Vizzion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
