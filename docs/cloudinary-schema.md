# Cloudinary Schema

This portfolio uses a stable Cloudinary folder structure so images, branding, and social assets stay organized.

## Folders

- `portfolio/projects/` for project media in general.
- `portfolio/projects/spillarena/` for the live SpillArena showcase assets.
- `portfolio/branding/` for identity assets such as logo variants.
- `portfolio/social/` for Open Graph and share images.
- `portfolio/ui/` for section-specific UI art or decorative media.
- `portfolio/misc/` for any temporary or uncategorized assets.

## Naming Rules

- Project previews should use public IDs like `portfolio/projects/<project-slug>/preview`.
- Project logos or thumbnails should use public IDs like `portfolio/projects/<project-slug>/logo`.
- Branding assets should use public IDs like `portfolio/branding/<name>`.
- Social cards should use public IDs like `portfolio/social/<page-or-route>`.

## Current Mappings

- `/images/projects/SpillArena/spillarena-preview.jpeg` -> `portfolio/projects/spillarena/preview`
- `/images/projects/SpillArena/logo.png` -> `portfolio/projects/spillarena/logo`
- `/assets/icons/eb_black.png` -> `portfolio/branding/eb_black`
- `/assets/icons/eb_whte.png` -> `portfolio/branding/eb_whte`

## Env Vars

- `CLOUDINARY_CLOUD_NAME` is used by the frontend to build delivery URLs.
- `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` should stay server-side and only be used for upload tooling or backend endpoints.
