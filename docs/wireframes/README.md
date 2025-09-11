# TSX.AI Dashboard Prototype

A lightweight, GitHub Pages-compatible frontend prototype for the TSX.AI market intelligence platform.

## Features

- **Home Dashboard**: Main interface with quick actions for stock monitoring
- **Library**: Pre-built analysis templates and reports
- **My Watchlists**: Monitor favorite Canadian stocks
- **Market Intelligence**: Real-time sentiment analysis dashboard
- **Monitoring Schedule**: Automated tasks and scheduled reports
- **Integrations**: Connect with Twitter, Reddit, StockTwits, and more

## Local Development

To run locally:
1. Open `index.html` in a web browser
2. Navigate through the different pages using the sidebar

## GitHub Pages Deployment

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the `/wireframes` folder as the source
4. Access at: `https://[username].github.io/[repository]/wireframes/`

## Technology Stack

- Pure HTML5
- CSS3 with modern flexbox/grid layouts
- Vanilla JavaScript
- No external dependencies (fully self-contained)
- Mobile responsive design

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Structure

```
wireframes/
├── index.html          # Main dashboard
├── styles.css          # Global styles
├── script.js           # Main JavaScript
├── pages/              # Individual page templates
│   ├── library.html
│   ├── watchlists.html
│   ├── intelligence.html
│   ├── schedule.html
│   ├── integrations.html
│   └── page-styles.css
└── _config.yml         # GitHub Pages configuration
```