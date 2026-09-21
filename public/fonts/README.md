# Self-hosted fonts

Bricolage Grotesque and Newsreader, served from this origin so that loading a
page contacts no Google host. The files are the variable woff2 subsets Google
Fonts serves to current browsers.

To refresh them (new version, extra subset, changed axes):

```sh
curl -A "Mozilla/5.0 Chrome/120" \
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&display=swap"
```

Download each `https://fonts.gstatic.com/...woff2` it lists into this folder,
then update `src/styles/fonts.css` with the local paths, keeping each block's
`unicode-range`. Both families are licensed under the SIL Open Font License 1.1.
