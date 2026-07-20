# MEDITATIONS 

App for reading the ancient stoic texts.

Uses AI for conversation component.

## Running locally

The web app loads its library data with `fetch`, so it must be served over HTTP rather
than opened as `file://`. From the repository root:

```bash
cd web
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser.
