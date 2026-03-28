"""
Kotaku Gaming Web Scraper - Module Entry Point
Allows running the Flask app as a module: python -m app
"""

from app.app import app, logger

if __name__ == '__main__':
    logger.info("Starting Flask app...")
    app.run()
