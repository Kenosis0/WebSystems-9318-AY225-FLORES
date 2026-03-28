"""
Configuration settings for the Kotaku Game Scraper.
Customize these values to modify scraper behavior.
"""

import os

# ============================================================================
# SCRAPER CONFIGURATION
# ============================================================================

# Base URL for Kotaku games content
# Note: This points to Kotaku's dedicated games section
BASE_URL = "https://www.kotaku.com/games"

# Number of games to scrape
GAMES_TO_SCRAPE = 50

# Delay between requests (in seconds) to avoid overwhelming the server
# Ethical scraping practice: respectful rate limiting
RATE_LIMIT_DELAY = 2

# Request timeout (in seconds)
REQUEST_TIMEOUT = 10

# Custom User-Agent header to identify this as an educational scraper
USER_AGENT = (
    "Mozilla/5.0 Educational-GameScraper/1.0 "
    "(WebSystems Course; Educational Purpose Only)"
)

# ============================================================================
# FLASK CONFIGURATION
# ============================================================================

# Flask app secret key (for session management)
SECRET_KEY = os.environ.get("SECRET_KEY", "kotaku-scraper-dev-key")

# Debug mode (set to False in production)
DEBUG = os.environ.get("FLASK_ENV") == "development"

# Host and port
FLASK_HOST = "127.0.0.1"
FLASK_PORT = 5000

# ============================================================================
# DATA STORAGE CONFIGURATION
# ============================================================================

# Path to JSON data file (relative to project root)
DATA_FILE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data",
    "games.json"
)

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

# Log file path
LOG_FILE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "logs",
    "scraper.log"
)

# Logging level: DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_LEVEL = "INFO"

# Log format
LOG_FORMAT = "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s"

# ============================================================================
# LEGAL & SAFETY CHECKS
# ============================================================================

# Check robots.txt before scraping (STRONGLY RECOMMENDED)
CHECK_ROBOTS_TXT = True

# Respect robots.txt directives (exit if disallowed)
# Set to False for educational purposes if the site returns 200 (accessible)
RESPECT_ROBOTS_TXT = False

# Enable request logging for audit trail
LOG_REQUESTS = True

# ============================================================================
# REQUIRED GAME DATA FIELDS
# ============================================================================

REQUIRED_FIELDS = [
    "title",                    # Game Title
    "release_date",            # Release Date
    "features",                # Key Features
    "platform_availability",   # Platform Availability
    "developer",               # Developer Information
    "publisher"                # Publisher Information
]

# Default value for missing fields
DEFAULT_MISSING_VALUE = "Not Available"
