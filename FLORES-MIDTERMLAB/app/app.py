"""
Kotaku Gaming Web Scraper - Flask Web Application

Main Flask app with routes for serving the web interface and JSON API.
Educational use only - see SCRAPING_NOTICE.md
"""

import logging
import os
import json
import sys
from datetime import datetime
from flask import Flask, render_template, jsonify, request
from app.config import (
    SECRET_KEY,
    FLASK_HOST,
    FLASK_PORT,
    DEBUG,
    LOG_FILE_PATH,
    LOG_FORMAT,
    LOG_LEVEL,
    DATA_FILE_PATH
)
from app.scraper import load_games_from_json, KotakuGameScraper

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

def setup_app_logging():
    """Configure logging for Flask app."""
    os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)
    
    logging.basicConfig(
        level=getattr(logging, LOG_LEVEL),
        format=LOG_FORMAT,
        handlers=[
            logging.FileHandler(LOG_FILE_PATH),
            logging.StreamHandler()
        ]
    )

setup_app_logging()
logger = logging.getLogger(__name__)

# ============================================================================
# FLASK APP INITIALIZATION WITH CORRECT PATHS
# ============================================================================

# Get project root directory (parent of the 'app' directory)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE_DIR = os.path.join(PROJECT_ROOT, 'templates')
STATIC_DIR = os.path.join(PROJECT_ROOT, 'static')

# Log paths for debugging
logger.info(f"Project root: {PROJECT_ROOT}")
logger.info(f"Template dir: {TEMPLATE_DIR}")
logger.info(f"Static dir: {STATIC_DIR}")

# Initialize Flask with explicit paths
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['JSON_SORT_KEYS'] = False

logger.info(f"Flask app initialized on {FLASK_HOST}:{FLASK_PORT}")

# ============================================================================
# AUTO-RUN SCRAPER ON STARTUP IF NO DATA
# ============================================================================

def auto_run_scraper_if_empty():
    """
    Automatically run web scraper on app startup if games.json is empty.
    This ensures data is scraped (not hardcoded) when the app starts.
    """
    games = load_games_from_json(DATA_FILE_PATH)
    
    if not games or len(games) == 0:
        logger.info("No game data found. Attempting to run web scraper from Kotaku.com/games...")
        logger.info("=" * 70)
        logger.info("INITIATING WEB SCRAPE - Data will be downloaded from Kotaku.com")
        logger.info("=" * 70)
        
        try:
            from app.config import BASE_URL
            scraper = KotakuGameScraper(BASE_URL)
            scraped_games = scraper.scrape()
            
            if scraped_games and len(scraped_games) > 0:
                logger.info(f"Successfully scraped {len(scraped_games)} games from Kotaku.com")
            else:
                logger.warning("Scraper ran but returned no games (Kotaku may have blocked scraping)")
        except Exception as e:
            logger.error(f"Scraper failed: {e}")
            logger.info("This is expected if Kotaku's robots.txt or other restrictions prevent scraping.")
            logger.info("The application will continue with empty data.")
    else:
        logger.info(f"Game data loaded: {len(games)} games available")

# Run scraper check on startup
auto_run_scraper_if_empty()


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_game_data():
    """
    Load game data from JSON file.
    
    Returns:
        list: List of game dictionaries
    """
    games = load_games_from_json(DATA_FILE_PATH)
    
    if not games:
        logger.warning(f"No game data found. Run scraper first: python -m app.scraper")
    
    return games


# ============================================================================
# ROUTES
# ============================================================================

@app.route('/')
def index():
    """
    Main page route - displays game listing interface.
    
    Returns:
        Rendered HTML template with game data embedded
    """
    try:
        games = get_game_data()
        
        if not games:
            logger.warning("No games loaded - scraper may not have run yet")
            return render_template('index.html', games=[], message="No games found. Please run the scraper first.")
        
        logger.info(f"Rendering homepage with {len(games)} games")
        return render_template('index.html', games=games)
    
    except FileNotFoundError:
        logger.error("Template index.html not found")
        return "Error: index.html template not found", 500
    
    except Exception as e:
        logger.error(f"Error rendering homepage: {e}")
        return f"Error: {e}", 500


@app.route('/api/games')
def api_games():
    """
    API endpoint - returns all games as JSON.
    
    This endpoint is used by JavaScript for dynamic filtering/searching.
    
    Returns:
        JSON response with game data and metadata
    """
    try:
        games = get_game_data()
        
        response = {
            'status': 'success',
            'data': {
                'games': games,
                'count': len(games),
                'timestamp': datetime.now().isoformat()
            },
            'error': None
        }
        
        logger.info(f"API: Returning {len(games)} games")
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error in /api/games endpoint: {e}")
        return jsonify({
            'status': 'error',
            'data': None,
            'error': str(e)
        }), 500


@app.route('/api/games/<int:game_id>')
def api_game_detail(game_id):
    """
    API endpoint - returns a single game by index.
    
    Args:
        game_id (int): Index of the game in the list
        
    Returns:
        JSON response with single game data, or 404 if not found
    """
    try:
        games = get_game_data()
        
        if 0 <= game_id < len(games):
            logger.info(f"API: Returning game #{game_id}")
            return jsonify({
                'status': 'success',
                'data': games[game_id],
                'error': None
            })
        else:
            logger.warning(f"API: Game #{game_id} not found (total: {len(games)})")
            return jsonify({
                'status': 'error',
                'data': None,
                'error': f'Game not found (ID {game_id} out of range)'
            }), 404
    
    except Exception as e:
        logger.error(f"Error in /api/games/{game_id} endpoint: {e}")
        return jsonify({
            'status': 'error',
            'data': None,
            'error': str(e)
        }), 500


@app.route('/api/stats')
def api_stats():
    """
    API endpoint - returns statistics about scraped games.
    
    Returns:
        JSON response with data statistics
    """
    try:
        games = get_game_data()
        
        # Calculate statistics
        stats = {
            'total_games': len(games),
            'fields_per_game': len(games[0]) if games else 0,
            'data_available': bool(games),
            'last_updated': datetime.now().isoformat() if games else None,
            'platforms': list(set(
                platform.strip() 
                for game in games 
                for platform in game.get('platform_availability', '').split(',')
                if platform.strip() != 'Not Available'
            )) if games else []
        }
        
        logger.info(f"API: Returning statistics for {stats['total_games']} games")
        return jsonify({
            'status': 'success',
            'data': stats,
            'error': None
        })
    
    except Exception as e:
        logger.error(f"Error in /api/stats endpoint: {e}")
        return jsonify({
            'status': 'error',
            'data': None,
            'error': str(e)
        }), 500


@app.route('/health')
def health_check():
    """
    Health check endpoint for monitoring.
    
    Returns:
        JSON response indicating app status
    """
    games = get_game_data()
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'games_loaded': len(games) > 0,
        'game_count': len(games)
    })


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    logger.warning(f"404 Error: {error}")
    return jsonify({
        'status': 'error',
        'error': 'Route not found',
        'path': request.path
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    logger.error(f"500 Error: {error}")
    return jsonify({
        'status': 'error',
        'error': 'Internal server error'
    }), 500


# ============================================================================
# APP CONTEXT & SETUP
# ============================================================================

@app.before_request
def before_request():
    """Log incoming requests."""
    logger.debug(f"{request.method} {request.path}")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == '__main__':
    """
    Run the Flask development server.
    
    Usage:
        python app/app.py
        
    Then open: http://localhost:5000
    """
    logger.info("")
    logger.info("=" * 70)
    logger.info("KOTAKU GAME SCRAPER - WEB SERVER START")
    logger.info("=" * 70)
    logger.info(f"Starting Flask server on http://{FLASK_HOST}:{FLASK_PORT}")
    logger.info(f"Debug mode: {DEBUG}")
    logger.info("Press CTRL+C to stop the server")
    logger.info("=" * 70)
    logger.info("")
    
    # Note: For production, use proper WSGI server like gunicorn
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=DEBUG)
