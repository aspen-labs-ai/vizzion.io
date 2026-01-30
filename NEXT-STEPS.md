# Next Steps - Building on Your New Foundation

## Adding New Pages

### Blog Page Example

```bash
# Create blog directory
mkdir -p app/blog

# Create blog page
touch app/blog/page.tsx
```

```typescript
// app/blog/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Blog() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-5xl font-bold mb-8">Blog</h1>
          {/* Your blog content */}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

### Dashboard App Example

```bash
# Create dashboard directory
mkdir -p app/dashboard

# Create dashboard page
touch app/dashboard/page.tsx
```

## Modifying Components

### Changing Colors

Edit `app/globals.css`:

```css
--color-accent: #FF5733;  /* Change accent color */
--color-primary: #1A1A2E; /* Change primary color */
```

### Updating Content

Edit the component directly:

```typescript
// components/Hero.tsx
<h1>Your new headline here</h1>
```

### Adding New Sections

1. Create new component in `components/`
2. Import in `app/page.tsx`
3. Add between existing sections

Example:

```typescript
// components/Testimonials.tsx
export default function Testimonials() {
  return (
    <section className="py-24 px-6">
      {/* Your testimonials */}
    </section>
  );
}

// app/page.tsx
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ThreeSteps />
        <Testimonials />  {/* New section */}
        <Platforms />
        {/* ... rest of sections */}
      </main>
      <Footer />
    </>
  );
}
```

## Adding Features

### Form Integration

```bash
# Install form library
npm install react-hook-form
```

```typescript
'use client';
import { useForm } from 'react-hook-form';

export default function ContactForm() {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = (data) => {
    // Send to your API
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Analytics

```bash
# Install analytics
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### API Routes

```bash
# Create API route
mkdir -p app/api/contact
touch app/api/contact/route.ts
```

```typescript
// app/api/contact/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // Process contact form
  // Send email, save to database, etc.
  
  return Response.json({ success: true });
}
```

## Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git remote add origin git@github.com:yourusername/vizzion-nextjs.git
   git push -u origin nextjs-migration
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

3. **Environment Variables:**
   - Set in Vercel dashboard
   - Access via `process.env.YOUR_VAR`

### Other Platforms

- **Netlify:** `npm run build` → Deploy `out/` folder
- **AWS Amplify:** Connect GitHub repo
- **Railway:** Connect GitHub repo
- **Self-hosted:** Use `npm run build && npm start`

## Performance Optimization

### Image Optimization

Already configured with Next.js Image component:

```typescript
import Image from 'next/image';

<Image 
  src="/images/demo.png" 
  alt="Demo" 
  width={600} 
  height={400}
  priority  // For above-the-fold images
/>
```

### Code Splitting

Next.js automatically code-splits by route. For lazy loading:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>
});
```

### SEO Optimization

```typescript
// app/page.tsx
export const metadata = {
  title: 'Your Page Title',
  description: 'Your description',
  openGraph: {
    images: ['/og-image.png'],
  },
};
```

## Testing

### Install Testing Tools

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Example Test

```typescript
// components/__tests__/Header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from '../Header';

test('renders Vizzion logo', () => {
  render(<Header />);
  expect(screen.getByText('Vizzion')).toBeInTheDocument();
});
```

## Database Integration

### Prisma Example

```bash
npm install prisma @prisma/client
npx prisma init
```

```prisma
// prisma/schema.prisma
model Lead {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  createdAt DateTime @default(now())
}
```

## Authentication

### NextAuth.js

```bash
npm install next-auth
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## State Management

### Zustand (Lightweight)

```bash
npm install zustand
```

```typescript
// store/useStore.ts
import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## Best Practices

1. **Keep components small** - One responsibility per component
2. **Use TypeScript** - Catch errors early
3. **Optimize images** - Use Next.js Image component
4. **Follow naming conventions** - PascalCase for components
5. **Add loading states** - Improve perceived performance
6. **Error boundaries** - Handle errors gracefully
7. **Accessibility** - Use semantic HTML and ARIA labels
8. **Mobile-first** - Design for mobile, enhance for desktop

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)

## Need Help?

- Original HTML reference: `~/clawd/vizzion-project/`
- Component examples: Look at existing components
- Tailwind classes: Check `app/globals.css` for design tokens

---

**Ready to build something amazing! 🚀**
