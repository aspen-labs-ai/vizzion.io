import sharp from 'sharp';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Composites a customer's logo as a subtle bottom-right watermark onto a render.
 *
 * The logo sits on a low-opacity rounded "plate" whose color is chosen from the
 * logo's own average ink luminance — a dark plate behind light logos, a light
 * plate behind dark logos — so the mark stays legible over any photo and for
 * any logo color. If anything goes wrong, the caller should fall back to the
 * un-watermarked image.
 */
export async function applyLogoWatermark(baseBuffer: Buffer, logoBuffer: Buffer): Promise<Buffer> {
  const base = sharp(baseBuffer, { failOn: 'none' });
  const meta = await base.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) {
    return baseBuffer;
  }

  // Keep the watermark modest relative to the render.
  const boxWidth = Math.round(clamp(width * 0.16, 110, 320));
  const boxHeight = Math.round(clamp(height * 0.16, 80, 220));

  const { data: logoData, info: logoInfo } = await sharp(logoBuffer, { failOn: 'none' })
    .resize({ width: boxWidth, height: boxHeight, fit: 'inside', withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const lw = logoInfo.width;
  const lh = logoInfo.height;
  if (!lw || !lh) {
    return baseBuffer;
  }

  // Average the visible ink (weighted by alpha) to learn if the logo is light or
  // dark, then fade the logo a touch so it reads as a watermark.
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let aSum = 0;
  const faded = Buffer.from(logoData);
  const logoOpacity = 0.92;
  for (let i = 0; i < faded.length; i += 4) {
    const alpha = faded[i + 3] / 255;
    rSum += faded[i] * alpha;
    gSum += faded[i + 1] * alpha;
    bSum += faded[i + 2] * alpha;
    aSum += alpha;
    faded[i + 3] = Math.round(faded[i + 3] * logoOpacity);
  }

  const hasInk = aSum > 0;
  const avgR = hasInk ? rSum / aSum : 255;
  const avgG = hasInk ? gSum / aSum : 255;
  const avgB = hasInk ? bSum / aSum : 255;
  const luminance = (0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB) / 255;
  const logoIsLight = luminance > 0.6;

  const logoPng = await sharp(faded, { raw: { width: lw, height: lh, channels: 4 } })
    .png()
    .toBuffer();

  const pad = Math.round(Math.max(lw, lh) * 0.16) + 8;
  const margin = Math.round(clamp(Math.min(width, height) * 0.03, 12, 48));
  const plateW = lw + pad * 2;
  const plateH = lh + pad * 2;
  const plateX = clamp(width - margin - plateW, 0, Math.max(0, width - plateW));
  const plateY = clamp(height - margin - plateH, 0, Math.max(0, height - plateH));
  const radius = Math.round(Math.min(plateW, plateH) * 0.26);

  const plateFill = logoIsLight ? 'rgba(15,23,42,0.42)' : 'rgba(255,255,255,0.6)';
  const plateStroke = logoIsLight ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)';

  const plateSvg = Buffer.from(
    `<svg width="${plateW}" height="${plateH}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect x="0.75" y="0.75" width="${plateW - 1.5}" height="${plateH - 1.5}" ` +
      `rx="${radius}" ry="${radius}" fill="${plateFill}" stroke="${plateStroke}" stroke-width="1.5"/>` +
      `</svg>`,
  );

  return base
    .composite([
      { input: plateSvg, left: plateX, top: plateY },
      { input: logoPng, left: plateX + pad, top: plateY + pad },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}
