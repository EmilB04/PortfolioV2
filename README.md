# Portfolio V2

A modern personal portfolio built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend & database
- **React Router v7** - Routing
- **Framer Motion** - Animations
- **i18next** - Internationalization
- **Lucide React** - Icon library

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Add your Cloudinary settings for images and media:
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The frontend only reads `CLOUDINARY_CLOUD_NAME`. Keep the API key and secret out of the client bundle and use them only in backend upload tooling or server-side code. If you keep your Cloudinary public IDs aligned with the current `/images/...` paths, the app will use Cloudinary in production and fall back to local assets in development.

The recommended folder schema lives in [docs/cloudinary-schema.md](docs/cloudinary-schema.md).

5. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
  components/
    HeaderSection.tsx    # Navigation with i18n & lucide icons
    FooterSection.tsx    # Footer with social links
    ProjectCard.tsx      # Project card component
    _layout.tsx          # Layout wrapper
  pages/                 # Page components
  lib/
    supabase.ts         # Supabase client
    i18n.ts             # i18n configuration
    animations.ts       # Framer Motion presets
    icons.ts            # Lucide icon exports
  hooks/
    useProjects.ts      # Fetch projects from Supabase
  App.tsx               # Main app routes
  main.tsx              # Entry point
  index.css             # Tailwind imports
```

## Features

- **Multi-language support** - English & Spanish (easily extendable)
- **Smooth animations** - Using Framer Motion
- **Icons** - Lucide React icons throughout
- **Mobile responsive** - Mobile-first design
- **Dark mode ready** - Tailwind configuration supports dark mode
- **Supabase integration** - Database for projects and contact messages

## Usage

### Add Animations

Use animations from `src/lib/animations.ts`:
```tsx
import { motion, fadeIn } from '@/lib/animations'

<motion.div {...fadeIn}>
  Content
</motion.div>
```

### Use Icons

Import from lucide-react or from `src/lib/icons.ts`:
```tsx
import { Code, GitHub } from 'lucide-react'

<Code size={24} />
```

### Translations

Add translation keys to `src/lib/i18n.ts` and use with `useTranslation()`:
```tsx
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()

<p>{t('nav.projects')}</p>
```

## Build & Deploy

```bash
npm run build
npm run preview
```

Deploy to Cloudflare Pages:
1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `dist`

## License

MIT
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
