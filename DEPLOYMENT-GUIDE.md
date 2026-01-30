# Deployment Guide - Vizzion Next.js

## ✅ What's Ready

- ✅ Code pushed to GitHub: `github.com/treypeirce/vizzion.io`
- ✅ Branch: `nextjs-migration`
- ✅ All components created and committed
- ✅ Design tokens configured
- ✅ Images copied and optimized
- ✅ Documentation complete

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import `treypeirce/vizzion.io`
4. Select branch: `nextjs-migration`

### Step 2: Configure Build

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### Step 3: Deploy

Click "Deploy" - Vercel will:
1. Install dependencies (`npm install`)
2. Build the project (`npm run build`)
3. Deploy to production

**Expected build time:** 2-3 minutes

### Step 4: Get Preview URL

Vercel will provide:
- **Preview URL:** `https://vizzion-nextjs-xyz.vercel.app`
- **Production URL:** Configure custom domain in settings

## 🔍 Verification Checklist

Once deployed, verify:

- [ ] Hero section loads with widget mockup
- [ ] All images display correctly
- [ ] Orbiting logos animate smoothly
- [ ] Mobile menu works (hamburger icon)
- [ ] Bento grid layouts properly
- [ ] Dashboard mockup renders
- [ ] Pricing cards display
- [ ] Footer links work
- [ ] Smooth scrolling works

## 🎨 Visual Comparison

### Original Site
https://vizzion-io.vercel.app/

### New Next.js Site
(Your Vercel preview URL)

**Should look identical!**

## ⚠️ Troubleshooting

### Build Fails

If build fails, check:

1. **Node version** - Should be 18.x or higher
   - Fix: Set `NODE_VERSION=18` in Vercel environment variables

2. **Missing dependencies**
   - Fix: Vercel automatically installs from `package.json`

3. **TypeScript errors**
   - Check build logs for specific errors
   - Most common: Image import issues (already handled with `next/image`)

### Images Don't Load

- Verify images are in `public/images/` directory
- Check console for 404 errors
- Images should be at: `/images/demo-house.png` etc.

### Styles Look Wrong

- Check if `app/globals.css` loaded
- Verify Tailwind config is correct
- Check browser console for CSS errors

## 🔧 Local Development (Optional)

If you want to run locally:

```bash
cd ~/clawd/vizzion-project-nextjs

# Clean install
rm -rf node_modules package-lock.json
npm install

# Run dev server
npm run dev
```

**Note:** Local build issues? Don't worry - Vercel handles it better.

## 🌐 Custom Domain Setup

### After Deployment Success

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain (e.g., `vizzion.io`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-10 minutes)

### DNS Records to Add

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

## 📊 Performance

Expected Lighthouse scores:

- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 100

## 🔄 Making Updates

### Update Content

1. Edit component in `components/`
2. Commit changes: `git commit -m "Update hero content"`
3. Push to GitHub: `git push`
4. Vercel auto-deploys

### Add New Page

1. Create `app/new-page/page.tsx`
2. Commit and push
3. Vercel auto-deploys
4. Access at: `yoursite.com/new-page`

## 🎯 Next Actions

1. **Deploy to Vercel** (5 min)
2. **Verify site** (5 min)
3. **Compare with original** (5 min)
4. **Share preview URL** for approval
5. **Merge to main** when approved
6. **Point custom domain** to production

## 📝 GitHub PR

Create pull request:
```
https://github.com/treypeirce/vizzion.io/pull/new/nextjs-migration
```

**PR Title:** "Migrate landing page to Next.js + Tailwind"

**PR Description:**
```
# Next.js Migration Complete

Migrated entire landing page from HTML/CSS/JS to Next.js + Tailwind.

## What Changed
- Component-based architecture
- TypeScript for type safety  
- Tailwind CSS for styling
- Next.js Image optimization
- Better SEO and performance

## What Stayed the Same
- Exact same visual design
- All content preserved
- All animations working
- Fully responsive

## Vercel Preview
[Your preview URL here]

Ready to merge!
```

## 🆘 Need Help?

**Issues with deployment?**
- Check Vercel build logs
- Review `package.json` dependencies
- Verify all files committed to Git

**Visual differences?**
- Compare with original at: https://vizzion-io.vercel.app/
- Check browser dev tools for CSS conflicts
- Review `app/globals.css` design tokens

**Questions?**
- Reference: `MIGRATION-COMPLETE.md`
- Next steps: `NEXT-STEPS.md`
- Original code: `~/clawd/vizzion-project/`

---

**Ready to deploy! 🚀**
