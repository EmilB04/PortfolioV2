<h1 align="center">Portfolio V2</h1>

<p align="center"><strong>My personal portfolio.</strong><br />
Projects, contact and a bit of personality, in three languages.</p>

<p align="center">
  <a href="https://emilb.no">emilb.no</a> ·
  <a href="docs/cloudinary-schema.md">Cloudinary schema</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Pages" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT licence" />
</p>

## Highlights

- **Projects from Supabase.** The project list and contact messages live in a database.
- **Three languages.** Norwegian, English and Spanish through i18next, easy to extend.
- **Smooth motion** with Framer Motion presets, and Lucide icons throughout.
- **Mobile-first**, with a Tailwind setup that supports dark mode.
- **Fast media.** Images come from Cloudinary in production and fall back to local assets in development.
- **Prerendered pages** for search engines.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Fill in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

The frontend only reads `CLOUDINARY_CLOUD_NAME`. Keep the Cloudinary API key and secret out of the client bundle and use them only in server-side code or upload tooling. If your Cloudinary public IDs match the `/images/...` paths, the app uses Cloudinary in production. See the [folder schema](docs/cloudinary-schema.md).

```bash
npm run lint
npm run build      # type-check, client build, SSR build and prerender
npm run preview
```

## Built with

React · TypeScript · Vite · Tailwind CSS · Supabase · React Router · Framer Motion · i18next · Lucide

```text
src/
  components/   Header, footer, project card and layout
  pages/        Home, projects, project detail and contact
  lib/          Supabase client, i18n, animation presets, icons
  hooks/        useProjects and other data hooks
functions/      Cloudflare Pages Functions
workers/        Cloudflare Workers
supabase/       Database setup
docs/           Cloudinary folder schema
```

## Deploy

Connect the repo to Cloudflare Pages with build command `npm run build` and output directory `dist`.

## License

MIT

---

Created by [Emil Berglund](https://github.com/EmilB04)
