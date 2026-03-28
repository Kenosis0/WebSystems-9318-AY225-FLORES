"""
Kotaku Gaming Web Scraper - Flask Application Package
Educational project for WebSystems course
"""

from flask import Flask

def create_app():
    """Application factory for Flask app creation."""
    app = Flask(__name__)
    return app
