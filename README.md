# Web Systems - FLORES Portfolio

This repository contains course projects for Web Systems (CCS 9318 AY225) by John Romel Flores.

## Folder Structure

### 📁 FLORES-PRELIMLAB
**Bayanihan Relief Corps - NGO Website**
- A fully responsive website built for an educational NGO organization
- Includes pages for Home, About, Programs, Events, Volunteer Registration, Contact, and Admin Dashboard
- Built with HTML5, CSS3, and vanilla JavaScript with advanced interactive features

**Key Files:**
- `index.html` - Main homepage with hero carousel and statistics
- `about.html` - Organization history and leadership team
- `programs.html` - Program showcases with category filtering
- `events.html` - Event listings with search and registration modal
- `volunteer.html` - Multi-step registration form with ID card generation
- `contact.html` - Contact form with interactive Leaflet.js map
- `admin.html` - Password-protected admin dashboard for data management
- `css/` - Custom CSS styling with CSS variables and animations
- `js/` - JavaScript modules for carousel, forms, storage, maps, and more
- `data/` - JSON data files for events, programs, and team information
- `README.md` - Project-specific documentation

**Features:**
- Auto-playing hero carousel with touch/swipe support
- Animated statistics with scroll-triggered counters
- Multi-step volunteer registration with validation
- LocalStorage persistence for all form submissions
- Admin dashboard with login protection and CSV/JSON export
- Interactive map using Leaflet.js
- Mobile-responsive design with hamburger navigation

---

### 📁 FLORES-MIDTERMLAB
**Kotaku Gaming Web Scraper**
- A web scraping project that extracts game data from Kotaku
- Built with Python Flask backend and vanilla JavaScript frontend
- Features interactive carousel, real-time search, and responsive gaming theme

**Key Files:**
- `start.py` - Automatic setup and startup script (run this first!)
- `main.py` - Flask application entry point
- `app/app.py` - Flask server with API endpoints
- `app/scraper.py` - Web scraping logic using BeautifulSoup4
- `app/config.py` - Configuration settings
- `app/permission_checker.py` - Permission and validation utilities
- `requirements.txt` - Python dependencies
- `templates/index.html` - Web interface template
- `static/js/script.js` - Client-side functionality
- `static/style.css` - Responsive styling with dark gaming theme
- `data/games.json` - Scraped game data (auto-generated)
- `README.md` - Project-specific documentation

**Features:**
- 25 games scraped from Kotaku with 7 data fields each
- Genre-based carousel interface
- Real-time search functionality
- Responsive dark gaming theme
- One-command startup with automatic virtual environment setup

---

## Technologies Used

### FLORES-PRELIMLAB
- HTML5
- CSS3 (with CSS Variables and Animations)
- JavaScript (Vanilla) - ES6+
- Leaflet.js (Interactive Maps)
- LocalStorage (Client-side Persistence)

### FLORES-MIDTERMLAB
- Python 3.8+
- Flask 2.3.3
- BeautifulSoup4 4.12.2
- Requests 2.31.0
- Vanilla JavaScript

---

## How to Use

### Running the Bayanihan Relief Corps Website
1. Navigate to the FLORES-PRELIMLAB folder
2. Open `index.html` in a web browser
3. No installation required - all features work client-side

### Running the Kotaku Gaming Web Scraper
1. Navigate to the FLORES-MIDTERMLAB folder
2. Run the startup script:
   ```bash
   python start.py
   ```
3. The script will automatically:
   - Create a virtual environment
   - Install dependencies from `requirements.txt`
   - Scrape 25 games from Kotaku
   - Start the Flask server at `http://localhost:5000`

4. Open your browser and visit `http://localhost:5000` to view the scraper interface

**Alternative Manual Setup:**
```bash
cd FLORES-MIDTERMLAB
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python main.py
```

---

## Course Information
- **Course:** Web Systems (CCS 9318 AY225)
- **Institution:** UPHSD Molino
- **Student:** John Romel Flores
- **GitHub:** [Kenosis0](https://github.com/Kenosis0)
- **Program:** BSIT-GD 2nd Year

---

## Additional Notes

- **Disclaimer:** The Bayanihan Relief Corps website and its contents were created solely for educational purposes as a course requirement. All organization details, names, events, and data presented are not representative of any real entity.

- **Port Issues:** If port 5000 is already in use when running the scraper, modify the port in `app/app.py` or check the project's detailed README for troubleshooting steps.

- **Data Persistence:** The NGO website uses browser LocalStorage to save volunteer registrations, event participation, donations, and contact submissions. Clear browser cache to reset stored data.
