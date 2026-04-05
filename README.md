# WevoaWeb Website

This is the official WevoaWeb website built with Wevoa itself.

Prerequisite:

```text
wevoa --version
```

Run it locally:

```text
wevoa start
```

Open:

```text
http://localhost:786
```

Build for production:

```text
wevoa build
wevoa serve
```

Build a static export:

```text
wevoa build --static
```

The static site is written to:

```text
build/static
```

Static export note:

The static export uses Wevoa to render pages at build time. If a page fetches live data from GitHub, that data is captured during the build and stays fixed until the next rebuild/deploy.

Vercel deployment:

```text
vercel
```

This repo includes `vercel.json`, which builds the site with the bundled Linux Wevoa runtime and deploys the static output directory.
