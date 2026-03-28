#!/usr/bin/env python
"""
Kotaku Gaming Web Scraper - One-Click Startup Script
Automatically sets up virtual environment, installs dependencies, and starts the app.
Simply run: python start.py
"""

import os
import sys
import subprocess
import platform
import json
from pathlib import Path

# ==============================================================================
# CONFIGURATION
# ==============================================================================

PROJECT_ROOT = Path(__file__).parent.absolute()
VENV_DIR = PROJECT_ROOT / "venv"
REQUIREMENTS_FILE = PROJECT_ROOT / "requirements.txt"
MAIN_SCRIPT = PROJECT_ROOT / "main.py"

# ==============================================================================
# UTILITY FUNCTIONS
# ==============================================================================

def print_header(message):
    """Print a styled header message."""
    print("\n" + "=" * 80)
    print(f"  {message}")
    print("=" * 80 + "\n")

def print_success(message):
    """Print a success message."""
    print(f"✅ {message}")

def print_error(message):
    """Print an error message."""
    print(f"❌ {message}")

def print_info(message):
    """Print an info message."""
    print(f"ℹ️  {message}")

def get_python_executable():
    """Get the Python executable path for the virtual environment."""
    if platform.system() == "Windows":
        return VENV_DIR / "Scripts" / "python.exe"
    else:
        return VENV_DIR / "bin" / "python"

def get_pip_executable():
    """Get the pip executable path for the virtual environment."""
    if platform.system() == "Windows":
        return VENV_DIR / "Scripts" / "pip.exe"
    else:
        return VENV_DIR / "bin" / "pip"

def venv_exists():
    """Check if virtual environment already exists."""
    return VENV_DIR.exists() and (VENV_DIR / "pyvenv.cfg").exists()

# ==============================================================================
# SETUP FUNCTIONS
# ==============================================================================

def create_virtual_environment():
    """Create a new virtual environment."""
    print_info(f"Creating virtual environment at: {VENV_DIR}")
    try:
        subprocess.check_call([sys.executable, "-m", "venv", str(VENV_DIR)])
        print_success("Virtual environment created successfully")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to create virtual environment: {e}")
        return False

def install_requirements():
    """Install Python dependencies from requirements.txt."""
    if not REQUIREMENTS_FILE.exists():
        print_error(f"requirements.txt not found at: {REQUIREMENTS_FILE}")
        return False
    
    pip_exe = get_pip_executable()
    print_info(f"Installing dependencies from {REQUIREMENTS_FILE}")
    
    try:
        subprocess.check_call([str(pip_exe), "install", "-r", str(REQUIREMENTS_FILE)])
        print_success("Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to install dependencies: {e}")
        return False

def run_application():
    """Run the main Flask application."""
    python_exe = get_python_executable()
    
    if not python_exe.exists():
        print_error(f"Python executable not found at: {python_exe}")
        return False
    
    if not MAIN_SCRIPT.exists():
        print_error(f"main.py not found at: {MAIN_SCRIPT}")
        return False
    
    print_info(f"Starting application with: {python_exe}")
    
    try:
        subprocess.call([str(python_exe), str(MAIN_SCRIPT)])
        return True
    except KeyboardInterrupt:
        print_info("Application stopped by user (Ctrl+C)")
        return True
    except Exception as e:
        print_error(f"Failed to run application: {e}")
        return False

# ==============================================================================
# MAIN STARTUP SEQUENCE
# ==============================================================================

def main():
    """Main startup sequence."""
    print_header("KOTAKU GAMING WEB SCRAPER - AUTOMATIC SETUP")
    
    print_info(f"Project root: {PROJECT_ROOT}")
    print_info(f"Python version: {sys.version}")
    print_info(f"Operating system: {platform.system()}")
    
    # Step 1: Check/Create Virtual Environment
    print_header("STEP 1: VIRTUAL ENVIRONMENT SETUP")
    
    if venv_exists():
        print_success("Virtual environment already exists")
    else:
        print_info("Virtual environment not found, creating one...")
        if not create_virtual_environment():
            print_error("Cannot continue without virtual environment")
            sys.exit(1)
    
    # Step 2: Install Dependencies
    print_header("STEP 2: INSTALLING DEPENDENCIES")
    
    if not install_requirements():
        print_error("Cannot continue without dependencies")
        sys.exit(1)
    
    # Step 3: Run Application
    print_header("STEP 3: STARTING APPLICATION")
    print_info("The Flask server will start on http://localhost:5000")
    print_info("First startup may take 1-2 minutes while scraping games from Kotaku...")
    print_info("Press Ctrl+C to stop the server\n")
    
    if not run_application():
        print_error("Failed to start application")
        sys.exit(1)

# ==============================================================================
# ENTRY POINT
# ==============================================================================

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✅ Application stopped gracefully")
        sys.exit(0)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)
