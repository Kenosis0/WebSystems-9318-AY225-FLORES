"""
Kotaku Game Scraper using BeautifulSoup4 - CORRECTED

Scrapes actual game article pages from Kotaku for complete game information.

Educational Use Only
"""

import logging
import json
import time
import os
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from app.config import (
    BASE_URL,
    GAMES_TO_SCRAPE,
    RATE_LIMIT_DELAY,
    REQUEST_TIMEOUT,
    USER_AGENT,
    DATA_FILE_PATH,
    LOG_FILE_PATH,
    LOG_LEVEL,
    LOG_FORMAT,
    REQUIRED_FIELDS,
    DEFAULT_MISSING_VALUE
)
from app.permission_checker import validate_scraping_permission, log_request

# ============================================================================
# LOGGING SETUP
# ============================================================================

def setup_logging():
    """Configure logging for the scraper."""
    os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)
    
    logging.basicConfig(
        level=getattr(logging, LOG_LEVEL),
        format=LOG_FORMAT,
        handlers=[
            logging.FileHandler(LOG_FILE_PATH),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)

logger = setup_logging()

# ============================================================================
# KOTAKU GAME SCRAPER
# ============================================================================

class KotakuGameScraper:
    """
    Scrapes game information from Kotaku gaming articles.
    
    Two-stage process:
    1. Find game article links on /games page
    2. Visit each article and extract detailed game information
    """
    
    def __init__(self, base_url):
        self.base_url = base_url
        self.games = []
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})
        
    def fetch_page(self, url):
        """Fetch and parse a web page."""
        try:
            logger.info(f"Fetching: {url}")
            response = self.session.get(url, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            log_request(url, status_code=response.status_code, elapsed_time=response.elapsed.total_seconds())
            time.sleep(RATE_LIMIT_DELAY)
            return BeautifulSoup(response.content, 'html.parser')
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
    
    def find_game_links(self, soup):
        """
        Find all game article links on the main games page.
        
        Looks for: div.overflow-x-scroll > a.block.relative.group
        
        Returns:
            list: URLs of game articles
        """
        game_links = []
        
        # Find all carousel containers with overflow-x-scroll
        carousels = soup.find_all('div', class_=lambda x: x and 'overflow-x-scroll' in x if x else False)
        
        logger.info(f"Found {len(carousels)} carousel containers")
        
        for carousel in carousels:
            # Find all game links within each carousel
            links = carousel.find_all('a', class_='block')
            
            for link in links:
                href = link.get('href', '')
                if href and ('kotaku.com' in href or href.startswith('/')):
                    if not href.startswith('http'):
                        href = 'https://kotaku.com' + href
                    # Avoid duplicates
                    if href not in game_links:
                        game_links.append(href)
        
        logger.info(f"Found {len(game_links)} unique game article links")
        return game_links
    
    def extract_game_from_article(self, article_soup, article_url):
        """
        Extract game information from an individual article page.
        
        Uses exact CSS selectors from Kotaku article structure:
        - Title: h1.mb-2
        - Game data: div.game-data with h3 (key) + p.line-clamp-1 (value) pairs
        - Features: div.prose p element
        - Platforms: ul.inline-flex
        - Image: img tag
        
        Returns:
            dict: Game data or None if extraction fails
        """
        try:
            game = {}
            
            # TITLE: h1.mb-2.text-2xl...
            title_elem = article_soup.find('h1', class_='mb-2')
            if not title_elem:
                logger.warning(f"No title found for {article_url}")
                return None
            game['title'] = title_elem.get_text(strip=True)[:100]
            
            # PLATFORMS: ul.inline-flex.items-center.gap-2.ml-1
            platforms = []
            ul_elem = article_soup.find('ul', class_='inline-flex')
            if ul_elem:
                for li in ul_elem.find_all('li'):
                    platform = li.get_text(strip=True)
                    if platform:
                        platforms.append(platform)
            game['platform_availability'] = ', '.join(platforms) if platforms else DEFAULT_MISSING_VALUE
            
            # GAME DATA: div.game-data.grid...
            # Extract key-value pairs: h3 (key) + p.line-clamp-1 (value)
            game_data_elem = article_soup.find('div', class_='game-data')
            developer = DEFAULT_MISSING_VALUE
            publisher = DEFAULT_MISSING_VALUE
            release_date = DEFAULT_MISSING_VALUE
            genre = DEFAULT_MISSING_VALUE
            
            if game_data_elem:
                # Find all h3 elements (keys)
                h3_elements = game_data_elem.find_all('h3', class_='font-bold')
                
                for h3 in h3_elements:
                    key = h3.get_text(strip=True)
                    
                    # Find the corresponding p element (value) - should be near h3
                    # Look for p.line-clamp-1 in the parent or sibling context
                    p_elem = h3.find_next('p', class_='line-clamp-1')
                    
                    if p_elem:
                        value = p_elem.get_text(strip=True)
                        
                        # Map keys to game fields
                        if 'Developer' in key:
                            developer = value[:100] if value else DEFAULT_MISSING_VALUE
                        elif 'Publisher' in key:
                            publisher = value[:100] if value else DEFAULT_MISSING_VALUE
                        elif 'Release' in key:
                            release_date = value[:100] if value else DEFAULT_MISSING_VALUE
                        elif 'Genre' in key:
                            genre = value[:100] if value else DEFAULT_MISSING_VALUE
            
            game['developer'] = developer
            game['publisher'] = publisher
            game['release_date'] = release_date
            # Store genre as additional data (bonus field beyond 6 required)
            if genre != DEFAULT_MISSING_VALUE:
                game['genre'] = genre
            
            # FEATURES: div.mt-6.mb-10.prose.dark:prose-invert...
            # Find prose divs that actually contain <p> elements with content
            game_features = DEFAULT_MISSING_VALUE
            prose_divs = article_soup.find_all('div', class_=lambda x: x and 'prose' in x if x else False)
            
            for div in prose_divs:
                p = div.find('p')
                if p:
                    features_text = p.get_text(strip=True)
                    if features_text and len(features_text) > 20:  # Only accept non-empty paragraphs
                        game_features = features_text[:300]
                        break
            
            game['features'] = game_features
            
            # Ensure all required fields exist
            for field in REQUIRED_FIELDS:
                if field not in game:
                    game[field] = DEFAULT_MISSING_VALUE
            
            return game
            
        except Exception as e:
            logger.warning(f"Error extracting game from {article_url}: {e}")
            return None
    
    def scrape(self):
        """
        Main scraping orchestration.
        
        Returns:
            list: List of game dictionaries
        """
        logger.info("")
        logger.info("=" * 70)
        logger.info("KOTAKU GAME SCRAPER - START")
        logger.info("=" * 70)
        logger.info(f"Target: {self.base_url}")
        logger.info(f"Games to scrape: {GAMES_TO_SCRAPE}")
        logger.info(f"Starting at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info("")
        
        # Step 1: Validate scraping permission
        if not validate_scraping_permission(self.base_url):
            logger.error("Scraping permission denied. Exiting.")
            return []
        
        # Step 2: Fetch main games page
        logger.info("Fetching main games page...")
        soup = self.fetch_page(self.base_url)
        if not soup:
            logger.error("Failed to fetch main games page")
            return []
        
        # Step 3: Find game article links
        game_links = self.find_game_links(soup)
        if not game_links:
            logger.error("No game links found on page")
            return []
        
        # Step 4: Visit each game article and extract data
        logger.info(f"Scraping detailed information from {len(game_links)} games...")
        for i, link in enumerate(game_links):
            if len(self.games) >= GAMES_TO_SCRAPE:
                logger.info(f"Reached target of {GAMES_TO_SCRAPE} games. Stopping.")
                break
            
            article_soup = self.fetch_page(link)
            if not article_soup:
                logger.warning(f"Failed to fetch {link}")
                continue
            
            game = self.extract_game_from_article(article_soup, link)
            if game:
                self.games.append(game)
                logger.info(f"[{len(self.games)}/{GAMES_TO_SCRAPE}] Added: {game['title'][:60]}")
            else:
                logger.warning(f"Could not extract game data from {link}")
        
        logger.info("")
        logger.info(f"Scraping complete. Extracted {len(self.games)} games")
        logger.info(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info("=" * 70)
        
        return self.games


# ============================================================================
# FILE OPERATIONS
# ============================================================================

def save_games_to_json(games, filepath=DATA_FILE_PATH):
    """Save games to JSON file."""
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        data = {
            'metadata': {
                'source': 'Kotaku',
                'scraped_at': datetime.now().isoformat(),
                'total_games': len(games),
                'game_count': len(games)
            },
            'games': games
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"[SUCCESS] Saved {len(games)} games to {filepath}")
        return True
    
    except IOError as e:
        logger.error(f"Error writing to {filepath}: {e}")
        return False


def load_games_from_json(filepath=DATA_FILE_PATH):
    """Load games from JSON file."""
    try:
        if not os.path.exists(filepath):
            logger.warning(f"Data file not found: {filepath}")
            return []
        
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        games = data.get('games', []) if isinstance(data, dict) else data
        logger.info(f"Loaded {len(games)} games from {filepath}")
        return games
    
    except (IOError, json.JSONDecodeError) as e:
        logger.error(f"Error reading {filepath}: {e}")
        return []


# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    scraper = KotakuGameScraper(BASE_URL)
    games = scraper.scrape()
    
    if games:
        success = save_games_to_json(games)
        if success:
            logger.info(f"\n[SUCCESS] Scraped {len(games)} games and saved to data/games.json")
        else:
            logger.error("Failed to save games to JSON")
    else:
        logger.error("[ERROR] No games were scraped. Check logs and verify Kotaku structure.")
