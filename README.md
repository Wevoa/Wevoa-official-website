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

Vercel deployment:

```text
vercel
```

This repo includes `vercel.json`, which builds the site with the bundled Linux Wevoa runtime and deploys the static output directory.
