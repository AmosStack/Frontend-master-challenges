# REST Countries Explorer

Production-ready solution for the Frontend Mentor REST Countries challenge.

## Features

- Country list view with responsive cards
- Search by country name
- Region filter (Africa, Americas, Asia, Europe, Oceania)
- Country detail page with:
  - Native name
  - Population
  - Region and sub-region
  - Capital
  - Top-level domain
  - Currencies
  - Languages
- Border-country navigation
- Light and dark theme toggle with persistence in local storage
- URL-based detail state using `?country=CODE`

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Local dataset: `data.json`

## Run Locally

This app must be served from a local HTTP server (not `file://`) because it fetches `data.json`.

### Option 1: Python

```bash
cd rest-countries-api-with-color-theme-switcher-master
py -m http.server 5500
```

Open: `http://localhost:5500`

### Option 2: Node

```bash
cd rest-countries-api-with-color-theme-switcher-master
npx serve .
```

Open the localhost URL shown in terminal.

## Production Notes

- Data loading now includes clearer error handling for `file://` usage.
- Startup shows a loading state before data arrives.
- Country names and metadata are escaped before rendering to prevent unsafe HTML injection.
- Filtered results are sorted alphabetically for consistent UX.
- Responsive behavior works across mobile and desktop layouts.

## Accessibility

- Semantic structure with clear sections for list and detail views.
- Keyboard-accessible interactive controls.
- Focus-visible styles for controls and action buttons.
- `aria-live` result summary updates on filtering.

## Project Structure

```text
.
|-- data.json
|-- index.html
|-- script.js
|-- styles.css
|-- design/
|-- style-guide.md
```

## Deployment

You can deploy as a static site on:

- GitHub Pages
- Netlify
- Vercel

Ensure these files are in the deploy root:

- `index.html`
- `styles.css`
- `script.js`
- `data.json`

## Challenge Reference

Frontend Mentor challenge: REST Countries API with color theme switcher.
