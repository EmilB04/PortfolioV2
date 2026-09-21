# Brand mark

Downscaled copies of `src/assets/icons/eb_black.png` and `eb_whte.png`, which
are 1024x1024 and about 1.4 MB each. The header renders the mark at 28 CSS px,
so shipping the originals cost roughly a megabyte per page view.

- `eb-dark-*.png` — dark monogram, used on light backgrounds
- `eb-light-*.png` — light monogram, used on dark backgrounds
- `96` for the header and favicon, `192` for the apple-touch icon

To regenerate after changing the source art, scale the square source down to
96 and 192 px with any image tool, keeping transparency, e.g.:

```sh
magick src/assets/icons/eb_black.png -resize 96x96 public/brand/eb-dark-96.png
magick src/assets/icons/eb_black.png -resize 192x192 public/brand/eb-dark-192.png
magick src/assets/icons/eb_whte.png  -resize 96x96 public/brand/eb-light-96.png
magick src/assets/icons/eb_whte.png  -resize 192x192 public/brand/eb-light-192.png
```
