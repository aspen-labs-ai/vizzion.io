# Vizzion Landing Page - Next.js

Modern, component-based landing page built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# http://localhost:3000
```

## 📦 What's Inside

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS v4** - Utility-first styling
- **Component-based** - Modular, maintainable architecture

## 📂 Project Structure

```
├── app/
│   ├── globals.css       # Tailwind + design tokens
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── Header.tsx        # Navigation
│   ├── Hero.tsx          # Hero section
│   ├── ThreeSteps.tsx    # Process steps
│   ├── Platforms.tsx     # Platform integrations
│   ├── Industries.tsx    # Industry cards
│   ├── Dashboard.tsx     # Dashboard preview
│   ├── Pricing.tsx       # Pricing tiers
│   ├── CTA.tsx           # Call to action
│   └── Footer.tsx        # Footer
└── public/
    └── images/           # Images and assets
```

## 🎨 Design System

All design tokens configured in `app/globals.css`:

- **Primary:** `#0A1628` (Deep blue)
- **Accent:** `#00D9C0` (Teal)
- **Fonts:** Space Grotesk (headings), Inter (body)

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📖 Documentation

- **[MIGRATION-COMPLETE.md](./MIGRATION-COMPLETE.md)** - Migration details
- **[NEXT-STEPS.md](./NEXT-STEPS.md)** - How to extend and customize

## 🚀 Deploy

### Vercel (Recommended)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Deploy automatically

### Manual Deploy

```bash
npm run build
npm start
```

## 📝 License

Proprietary - Vizzion

---

**Built with ❤️ using Next.js**
