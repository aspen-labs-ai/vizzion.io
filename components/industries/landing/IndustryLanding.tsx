'use client';

import { Fragment, useEffect, useRef } from 'react';
import WidgetMockup from '@/components/WidgetMockup';
import SignupSection from '@/components/SignupSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IndustryRelatedPages from '@/components/industries/IndustryRelatedPages';
import type { IndustryData } from '@/data/industries/types';
import type { IndustryLandingData, LandingStat } from '@/data/industries/landing/types';
import './landing.css';

// Bump only on substantive content edits (feeds WebPage.dateModified / freshness).
const CONTENT_UPDATED = '2026-06-19';

const TRUST = ['1 line of code', 'Live in 5 minutes', 'No developer needed'];
const PILLS = ['1 line of code', 'Live in 5 minutes', 'Works on WordPress, Wix & Squarespace', 'Matches your brand colors'];

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg className="ico ico-check" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg className="ico ico-x" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

function fmtStat(s: LandingStat) {
  return `${s.prefix ?? ''}${s.target.toFixed(s.dec ?? 0)}${s.suffix ?? ''}`;
}

function highlightBody(body: string, highlights?: string[]) {
  if (!highlights || highlights.length === 0) return body;
  const pattern = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const parts = body.split(new RegExp(`(${pattern})`, 'g'));
  return parts.map((part, i) =>
    highlights.includes(part) ? <span key={i} className="hl">{part}</span> : <Fragment key={i}>{part}</Fragment>,
  );
}

export default function IndustryLanding({ data }: { data: IndustryLandingData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { hero, gap, steps, vs, materials, proof, faq } = data;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];

    /* Materials switcher */
    const matTabs = root.querySelectorAll<HTMLElement>('.mat-tab');
    const matImgs = root.querySelectorAll<HTMLElement>('.mat-img');
    const matNow = root.querySelector<HTMLElement>('#matNow');
    const matHandlers: Array<[HTMLElement, () => void]> = [];
    matTabs.forEach((tab) => {
      const h = () => {
        const mat = tab.getAttribute('data-mat');
        matTabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-pressed', 'true');
        matImgs.forEach((img) => img.classList.toggle('show', img.getAttribute('data-mat') === mat));
        if (matNow) matNow.textContent = tab.getAttribute('data-name');
      };
      tab.addEventListener('click', h);
      matHandlers.push([tab, h]);
    });
    cleanups.push(() => matHandlers.forEach(([t, h]) => t.removeEventListener('click', h)));

    /* FAQ accordion */
    const faqHandlers: Array<[HTMLElement, () => void]> = [];
    root.querySelectorAll<HTMLElement>('.faq-q').forEach((q) => {
      const h = () => {
        const item = q.parentElement;
        const ans = q.nextElementSibling as HTMLElement | null;
        const isOpen = !!item && item.classList.contains('open');
        root.querySelectorAll<HTMLElement>('.faq-item').forEach((i) => {
          i.classList.remove('open');
          const a = i.querySelector<HTMLElement>('.faq-a');
          if (a) a.style.maxHeight = '';
        });
        if (!isOpen && item && ans) {
          item.classList.add('open');
          ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      };
      q.addEventListener('click', h);
      faqHandlers.push([q, h]);
    });
    cleanups.push(() => faqHandlers.forEach(([q, h]) => q.removeEventListener('click', h)));

    /* Count-up stats */
    const decode = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const runCount = (el: HTMLElement) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      const suffix = decode(el.getAttribute('data-suffix') || '');
      const prefix = decode(el.getAttribute('data-prefix') || '');
      let t0: number | null = null;
      const dur = 1300;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target.toFixed(dec) + suffix;
      };
      requestAnimationFrame(step);
    };

    /* Reveal on scroll + trigger counts */
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            en.target.querySelectorAll<HTMLElement>('.n[data-target]').forEach((n) => {
              if (!n.dataset.done) { n.dataset.done = '1'; runCount(n); }
            });
            obs.unobserve(en.target);
          }
        });
      }, { threshold: 0.18 });
      root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => obs.observe(el));
      cleanups.push(() => obs.disconnect());
    } else {
      root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => el.classList.add('in'));
      root.querySelectorAll<HTMLElement>('.n[data-target]').forEach(runCount);
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  /* ---- Structured data: one linked @graph, server-rendered ---- */
  const SITE = 'https://vizzion.io';
  const pageUrl = `${SITE}/industries/${data.slug}`;
  const appRest: Record<string, unknown> = { ...(data.schema ?? {}) };
  delete appRest['@context'];
  const appNode =
    Object.keys(appRest).length > 0
      ? { ...appRest, '@id': `${pageUrl}#app`, url: pageUrl, publisher: { '@id': `${SITE}/#organization` } }
      : null;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${data.name} Visualizer | Vizzion`,
        description: hero.sub,
        inLanguage: 'en-US',
        isPartOf: { '@id': `${SITE}/#website` },
        ...(appNode ? { about: { '@id': `${pageUrl}#app` } } : {}),
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/images/industries/${data.slug}.png` },
        dateModified: CONTENT_UPDATED,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Industries', item: `${SITE}/industries` },
          { '@type': 'ListItem', position: 3, name: data.name, item: pageUrl },
        ],
      },
      ...(appNode ? [appNode] : []),
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'HowTo',
        '@id': `${pageUrl}#howto`,
        name: `How to add the Vizzion ${data.name} visualizer to your website`,
        step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <Header />
      <div ref={rootRef} className="rv3">
        {/* HERO */}
        <section className="hero pad-y" id="top">
          <div className="wrap hero-grid">
            <div className="reveal in">
              <span className="eyebrow on-dark">{hero.eyebrow}</span>
              <h1>{hero.headline} <span className="hl">{hero.headlineAccent}</span></h1>
              <p className="sub">{hero.sub}</p>
              <div className="hero-cta">
                <a href="#signup" className="btn btn-primary btn-lg">Get Started Free</a>
                <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
              </div>
              <div className="hero-trust">
                {TRUST.map((t) => (
                  <span key={t}><span className="ck"><CheckIcon /></span> {t}</span>
                ))}
              </div>
            </div>

            <div className="reveal in hero-demo">
              {hero.demo === 'widget' ? (
                <WidgetMockup />
              ) : (
                <div className="widget">
                  <div className="widget-bar">
                    <span className="dots"><i /><i /><i /></span>
                    <span className="addr">{hero.demoAddress ?? 'your-website.com'} <b><span className="dot" style={{ width: '8px', height: '8px', background: 'var(--emerald)', borderRadius: '2px', display: 'inline-block' }} /> Vizzion live</b></span>
                  </div>
                  <div className="widget-photo">
                    <img src={`/images/industries/${data.slug}.png`} alt={`${data.name} preview`} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PROBLEM / GAP */}
        <section className="gap pad-y" id="gap">
          <div className="wrap gap-grid">
            <div className="reveal">
              <span className="eyebrow">{gap.eyebrow}</span>
              <h2>Why do {data.shortName.toLowerCase()} website visitors leave without a quote?</h2>
              <p className="subhead">{gap.headline} <span className="em">{gap.headlineAccent}</span></p>
              <p>{highlightBody(gap.body, gap.bodyHighlights)}</p>
            </div>

            <div className="reveal media-col">
              <div className="media-frame">
                {gap.video ? (
                  <div className="ratio">
                    <video autoPlay loop muted playsInline preload="metadata" poster={gap.video.poster} aria-label={`${data.name} visualization preview`}>
                      <source src={gap.video.src} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <div className="ratio media-placeholder"><span>Visual preview</span></div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="steps pad-y" id="how">
          <div className="wrap">
            <div className="head reveal">
              <span className="eyebrow">How it works</span>
              <h2>How does the {data.shortName} visualizer work on your website?</h2>
              <p className="subhead">From photo to qualified lead in <span className="em">seconds.</span></p>
              <p>A homeowner uploads a photo, previews your products on their own {data.shortName.toLowerCase()} project, and enters their email to save it — and that becomes an exclusive lead in your inbox, all on the website you already own.</p>
            </div>
            <div className="step-grid">
              {steps.map((s, i) => (
                <div className="step reveal" key={i}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  {s.badge ? <span className="badge">{s.badge}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VS */}
        <section className="vs pad-y">
          <div className="wrap">
            <div className="head reveal">
              <span className="eyebrow on-dark" style={{ justifyContent: 'center' }}>Two ways to fill the pipeline</span>
              <h2>Why capture leads on your own site instead of buying them?</h2>
              <p className="subhead">The old way vs. <span className="em">the Vizzion way.</span></p>
              <p>One drains your margin. The other turns the traffic you already pay for into jobs you actually win.</p>
            </div>
            <div className="vs-grid">
              <div className="vs-col vs-old reveal">
                <span className="vs-tag">Buying shared leads</span>
                <h3>The old way</h3>
                <ul className="vs-list">
                  {vs.old.map((item, i) => (
                    <li key={i}><span className="ic"><XIcon /></span> {item}</li>
                  ))}
                </ul>
              </div>
              <div className="vs-col vs-new reveal">
                <span className="vs-tag">Your own website</span>
                <h3>The Vizzion way</h3>
                <ul className="vs-list">
                  {vs.new.map((item, i) => (
                    <li key={i}><span className="ic"><CheckIcon size={15} /></span> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MATERIALS (optional) */}
        {materials ? (
          <section className="materials pad-y" id="materials">
            <div className="wrap">
              <div className="head reveal">
                <span className="eyebrow">{materials.eyebrow}</span>
                <h2>Which {data.shortName.toLowerCase()} materials can homeowners preview?</h2>
                <p className="subhead">{materials.headline} <span className="em">{materials.headlineAccent}</span></p>
                <p>{materials.body}</p>
              </div>

              <div className="switcher reveal">
                <div className="mat-tabs" role="tablist" aria-label="Choose a material">
                  {materials.items.map((m, i) => (
                    <button key={m.key} className={`mat-tab${i === 0 ? ' active' : ''}`} data-mat={m.key} data-name={m.name} type="button" aria-pressed={i === 0}>
                      <span className="sw" style={{ background: m.swatch }} />
                      <span className="mt-name">{m.name}</span>
                    </button>
                  ))}
                </div>

                <div className="switch-frame">
                  <span className="now" id="matNow">{materials.items[0]?.name}</span>
                  <div className="ratio" id="matStage">
                    {materials.items.map((m, i) => (
                      <img key={m.key} className={`mat-img${i === 0 ? ' show' : ''}`} data-mat={m.key} src={m.image} alt={`Home shown with ${m.name}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* PROOF */}
        <section className="proof pad-y">
          <div className="wrap">
            <div className="head reveal">
              <h2>Does a visualizer really turn visitors into leads?</h2>
              <p className="subhead">Show it. Sell it. Book it.</p>
              <p>When homeowners can see the upgrade, the conversation changes. Figures below are directional and for illustration, not a guarantee.</p>
            </div>
            <div className="stat-grid">
              {proof.stats.map((s, i) => (
                <div className="stat reveal" key={i}>
                  <div className="n" data-target={s.target} data-prefix={s.prefix ?? ''} data-suffix={s.suffix ?? ''} data-dec={s.dec ?? 0}>{fmtStat(s)}</div>
                  <div className="l">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="proof-truths reveal">
              {PILLS.map((p) => (
                <span className="truth-pill" key={p}><span className="ck"><CheckIcon size={15} /></span> {p}</span>
              ))}
            </div>
            <p className="proof-note">Illustrative figures shown to convey direction and intent. Your results depend on your traffic and offer.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq pad-y" id="faq">
          <div className="wrap">
            <div className="head reveal">
              <span className="eyebrow" style={{ justifyContent: 'center' }}>Quick answers</span>
              <h2>Questions, handled.</h2>
            </div>
            <div className="faq-list">
              {faq.map((f, i) => (
                <div className="faq-item reveal" key={i}>
                  <button className="faq-q" type="button">{f.q} <span className="pm">+</span></button>
                  <div className="faq-a"><p>{f.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SIGNUP FORM */}
        <SignupSection defaultIndustry={data.shortName} />

        {/* RELATED INDUSTRIES */}
        <IndustryRelatedPages data={{ slug: data.slug } as unknown as IndustryData} />
      </div>

      {/* SITE-WIDE FOOTER */}
      <Footer />
    </>
  );
}
