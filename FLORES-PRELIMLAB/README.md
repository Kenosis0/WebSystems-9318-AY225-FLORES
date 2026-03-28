# WebSystems-9318-AY225 — Bayanihan Relief Corps

A fully responsive NGO website built for the **Web Systems** course (9318-AY225) preliminary exam — **EXAM SET D: NGO**.

> **Disclaimer:** This website and its contents were created solely for educational purposes as a course requirement. All organization details, names, events, and data presented are not representative of any real entity.

---

## � Prepared By

- **Name:** John Romel Flores  
- **Course:** BSIT-GD 2nd Year  
- **GitHub:** [Kenosis0](https://github.com/Kenosis0)

---

## �📄 Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Hero carousel, live statistics, featured campaigns, services grid |
| **About** | `about.html` | Organization history timeline, mission/vision/values, leadership team |
| **Programs** | `programs.html` | 6 program showcases with category filtering, expandable details, donation allocation |
| **Events** | `events.html` | Upcoming/past event tabs with search & filter, registration modal, photo gallery |
| **Volunteer** | `volunteer.html` | Multi-step registration form with validation and volunteer ID card generation |
| **Contact** | `contact.html` | Contact form with department routing, regional offices, interactive Leaflet.js map |
| **Admin** | `admin.html` | Password-protected dashboard to view, search, and export all submitted data |

---

## ✨ Key Features

- **Hero Carousel** — Auto-playing image slider with touch/swipe support and keyboard navigation  
- **Animated Statistics** — Scroll-triggered counters using `IntersectionObserver`  
- **Multi-Step Forms** — Step-by-step volunteer registration with real-time validation  
- **Interactive Map** — Leaflet.js map of the Philippines showing offices, operations, and medical missions  
- **LocalStorage Persistence** — All form submissions (volunteers, events, contacts, donations) saved client-side  
- **Admin Dashboard** — Login-protected panel with tabbed data views, search, CSV/JSON export, and password management  
- **Category Filtering** — Filter programs and events by category with live search  
- **Responsive Design** — Fully mobile-friendly layout with hamburger navigation  

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic page structure |
| **CSS3** | Custom design system with CSS variables, animations, and media queries |
| **Vanilla JavaScript** | All interactivity — no frameworks |
| **Leaflet.js 1.9.4** | Interactive map (CDN) |
| **Font Awesome 6.4.0** | Icon library (CDN) |
| **localStorage API** | Client-side data persistence |

---

## 📁 Project Structure

```
├── index.html              # Home page
├── about.html              # About page
├── programs.html           # Programs & services
├── events.html             # Events & campaigns
├── volunteer.html          # Volunteer registration
├── contact.html            # Contact & map
├── admin.html              # Admin dashboard
├── css/
│   └── style.css           # Complete design system (~2600+ lines)
├── js/
│   ├── storage.js          # LocalStorage CRUD & data export
│   ├── main.js             # Navigation, modals, scroll animations
│   ├── carousel.js         # Hero carousel with autoplay & swipe
│   ├── stats.js            # Animated stat counters
│   ├── forms.js            # Form handling & validation
│   ├── programs.js         # Program filtering & donation tracking
│   ├── events.js           # Event tabs, search, filter & gallery
│   ├── map.js              # Leaflet.js interactive map
│   └── admin.js            # Dashboard login, data display & export
├── data/
│   ├── programs.json       # Program metadata
│   ├── events.json         # Event listings & campaigns
│   └── team.json           # Leadership, timeline & office data
└── assets/
    └── images/             # Hero slides, program cards, event gallery, portraits
```

---

## 🔐 Admin Access

- **Default Password:** `admin123`
- Navigate to the **Admin** page and enter the password to access the dashboard.
- The password can be changed from within the dashboard.

---

## 📝 License

This project is for **educational purposes only** as part of the Web Systems preliminary examination. No real-world affiliation is intended or implied.