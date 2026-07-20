# Prep Desk — Placement Preparation Portal

An offline-first static portal for Quantitative Aptitude, Logical Reasoning, and English.

## Run locally

Open `index.html` directly, or for the smoothest Markdown links use a local static server:

```powershell
cd Aptitude/placement-portal
python -m http.server 8080
```

Then visit `http://localhost:8080`. Select any topic to open its formatted learning page with all questions and solutions.

## Regenerate content

```powershell
npm run generate
```

This rebuilds all 53 topic Markdown modules, the browser topic registry, and the search index. Progress, bookmarks, weak topics, and error notes are stored only in this browser's LocalStorage.
