#!/usr/bin/env python
"""
Kotaku Gaming Web Scraper - Main Entry Point for Flask Server
Start the web server: python main.py
"""

import os
import sys

# Add project root to Python path
sys.path.insert(0, os.path.dirname(__file__))

from app.app import app, logger

if __name__ == '__main__':
    logger.info("=" * 70)
    logger.info("Starting Kotaku Gaming Web Scraper Flask Server")
    logger.info("=" * 70)
    logger.info("Open your browser to: http://localhost:5000")
    
    app.run(host='127.0.0.1', port=5000, debug=False)
