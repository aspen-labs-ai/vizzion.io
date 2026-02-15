#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function fail(list, message) {
  list.push(message);
}

const failures = [];

const homePage = read('app/page.tsx');
const homeTitle = homePage.match(/title:\s*'([^']+)'/)?.[1] ?? '';
const homeDescription = homePage.match(/description:\s*'([^']+)'/)?.[1] ?? '';

if (!homeTitle.includes('Visualizer Widget')) {
  fail(failures, `Homepage title missing "Visualizer Widget": ${homeTitle}`);
}

if (homeDescription.length > 160) {
  fail(failures, `Homepage meta description too long (${homeDescription.length} chars)`);
}

const hero = read('components/Hero.tsx');
if (!hero.includes('Embeddable Visualizer Widget for Your Website')) {
  fail(failures, 'Homepage H1 does not contain expected visualizer-first text.');
}

const hubPage = read('app/industries/page.tsx');
const hubTitle = hubPage.match(/title:\s*'([^']+)'/)?.[1] ?? '';
const hubDescription = hubPage.match(/description:\s*'([^']+)'/)?.[1] ?? '';

if (!hubTitle.includes('Visualizer Widget')) {
  fail(failures, `Industries hub title missing "Visualizer Widget": ${hubTitle}`);
}

if (hubDescription.length > 160) {
  fail(failures, `Industries hub meta description too long (${hubDescription.length} chars)`);
}

if (!hubPage.includes('Visualizer Widgets for Industries That Sell Visual Transformations')) {
  fail(failures, 'Industries hub H1 does not contain expected visualizer-first text.');
}

const keywordsConfig = read('lib/seo/industry-keywords.ts');
const keywordTitles = [...keywordsConfig.matchAll(/title:\s*'([^']+)'/g)].map((m) => m[1]);

if (keywordTitles.length !== 17) {
  fail(failures, `Expected 17 industry title entries in keyword config, found ${keywordTitles.length}.`);
}

for (const title of keywordTitles) {
  if (!title.includes('Visualizer Widget')) {
    fail(failures, `Industry keyword config title missing "Visualizer Widget": ${title}`);
  }
}

const industryDir = path.join(root, 'data/industries');
const industryFiles = fs
  .readdirSync(industryDir)
  .filter((file) => file.endsWith('.ts') && file !== 'types.ts')
  .sort();

if (industryFiles.length !== 17) {
  fail(failures, `Expected 17 industry data files, found ${industryFiles.length}.`);
}

for (const file of industryFiles) {
  const relPath = path.join('data/industries', file);
  const source = read(relPath);

  const metaTitle = source.match(/metaTitle:\s*"([^"]+)"/)?.[1] ?? '';
  const metaDescription = source.match(/metaDescription:\s*"([^"]+)"/)?.[1] ?? '';
  const headerHeadline = source.match(/header:\s*\{[\s\S]*?headline:\s*"([^"]+)"/)?.[1] ?? '';
  const howToHeadline = source.match(/howItWorks:\s*\{[\s\S]*?headline:\s*"([^"]+)"/)?.[1] ?? '';

  if (!metaTitle.includes('Visualizer Widget')) {
    fail(failures, `${relPath}: metaTitle missing "Visualizer Widget".`);
  }

  if (metaDescription.length > 160) {
    fail(failures, `${relPath}: metaDescription too long (${metaDescription.length} chars).`);
  }

  if (!headerHeadline.includes('Visualizer Widget')) {
    fail(failures, `${relPath}: header.headline missing "Visualizer Widget".`);
  }

  if (!howToHeadline.startsWith('How to Add')) {
    fail(failures, `${relPath}: howItWorks.headline must start with "How to Add".`);
  }
}

if (failures.length > 0) {
  console.error('SEO keyword coverage check failed:');
  failures.forEach((entry, index) => {
    console.error(`${index + 1}. ${entry}`);
  });
  process.exit(1);
}

console.log('SEO keyword coverage check passed.');
console.log(`Checked: homepage, industries hub, keyword config, and ${industryFiles.length} industry data files.`);
