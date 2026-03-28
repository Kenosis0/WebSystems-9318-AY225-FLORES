# Kotaku Gaming Web Scraper

Simple web scraper that extracts 25 games from Kotaku and displays them in an interactive carousel organized by genre.

## Quick Start

```bash
python start.py
```

That's it! The script will:
- Create virtual environment
- Install dependencies
- Scrape 25 games from Kotaku
- Start Flask server at http://localhost:5000

## What You Get

- 25 games with 7 data fields each
- Genre-based carousel interface
- Real-time search functionality
- Responsive dark gaming theme
- All data scraped (zero hardcoded)

## Project Structure

```
FLORES-MIDTERMLAB/
├── start.py              # Run this to start everything
├── main.py               # Flask app entry point
├── requirements.txt      # Python dependencies
├── app/                  # Application code
│   ├── scraper.py        # Web scraper
│   ├── app.py            # Flask server
│   └── config.py         # Configuration
├── templates/            # HTML templates
├── static/               # CSS & JavaScript
└── data/games.json       # Scraped game data (auto-generated)
```

## Requirements

- Python 3.8 or higher
- Internet connection (for scraping)

## Troubleshooting

**Port 5000 already in use?**
```bash
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# macOS/Linux
lsof -i :5000
kill -9 [PID]
```

**Missing dependencies?**
```bash
pip install -r requirements.txt
```

**No games showing up?**
Wait 2 minutes on first run for scraper to complete, then refresh the page.

## Course Info

**Course**: WebSystems-9318-AY225 (FABREGAS)  
**Assignment**: Midterm Lab - Gaming Industry Web Scraper  
**Status**: Ready for Submission
