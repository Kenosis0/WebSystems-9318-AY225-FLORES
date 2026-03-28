/**
 * Kotaku Gaming Web Scraper - Frontend JavaScript
 * Handles game card rendering, search/filtering, and interactions
 */

// Store original games data for filtering
let allGames = [];

/**
 * Initialize the application with game data
 * @param {Array} gamesData - Array of game objects from the server
 */
function initializeApp(gamesData) {
    console.log('🎮 initializeApp called with:', gamesData);
    allGames = gamesData || [];
    
    console.log('📊 allGames array length:', allGames.length);
    
    if (allGames.length === 0) {
        console.log('No games loaded. Scraper may not have run yet.');
        return;
    }
    
    // Check container exists
    const container = document.getElementById('genresContainer');
    console.log('🎯 Container found:', !!container);
    
    // Render initial game cards
    console.log('🎨 Calling renderGameCards...');
    renderGameCards(allGames);
    
    // Attach event listeners
    attachEventListeners();
    
    console.log(`✅ Initialized with ${allGames.length} games`);
    console.log('🎮 Sample game:', allGames[0]);
}

/**
 * Attach event listeners for search and interactions
 */
function attachEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    
    if (searchInput) {
        // Use debouncing to prevent excessive filtering
        let timeoutId;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                filterGames(e.target.value);
            }, 300); // 300ms debounce
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
                filterGames('');
            }
        });
    }
    
    // Initialize modal listeners
    initializeModalListeners();
}

/**
 * Filter games based on search term
 * Searches across all game fields for matches
 * @param {String} searchTerm - The search query
 */
function filterGames(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    let filteredGames;
    
    if (term === '') {
        // No search term - show all games
        filteredGames = allGames;
    } else {
        // Filter games by matching search term in any field
        filteredGames = allGames.filter(game => {
            // Search across all game fields
            return Object.values(game).some(value => {
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(term);
            });
        });
    }
    
    // Update results count
    updateResultsCount(filteredGames.length);
    
    // Re-render cards with filtered results
    renderGameCards(filteredGames);
    
    console.log(`Filtered to ${filteredGames.length} games matching "${term}"`);
}

/**
 * Update the results count display
 * @param {Number} count - Number of games to display
 */
function updateResultsCount(count) {
    const gameCountEl = document.getElementById('gameCount');
    if (gameCountEl) {
        gameCountEl.textContent = count;
    }
}

/**
 * Render game cards organized by genre in carousel format
 * @param {Array} games - Array of game objects to render
 */
function renderGameCards(games) {
    const container = document.getElementById('genresContainer');
    
    if (!container) {
        console.error('❌ Genres container element not found');
        return;
    }
    
    console.log('📝 renderGameCards: container found, games count:', games.length);
    
    // Clear existing content
    container.innerHTML = '';
    
    if (games.length === 0) {
        console.log('⚠️  No games to render');
        // Show empty state message
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: var(--color-text-secondary);">
                    No games found matching your search. Try different keywords.
                </p>
            </div>
        `;
        return;
    }
    
    // Group games by individual genres (split by comma)
    const gamesByGenre = {};
    games.forEach(game => {
        const genreString = game.genre || 'Other';
        
        // Split genres by comma and trim whitespace
        const genres = genreString
            .split(',')
            .map(g => g.trim())
            .filter(g => g && g !== 'Not Available');
        
        // Add game to each of its genres
        genres.forEach(genre => {
            if (!gamesByGenre[genre]) {
                gamesByGenre[genre] = [];
            }
            gamesByGenre[genre].push(game);
        });
        
        // If no valid genres, add to 'Other'
        if (genres.length === 0) {
            if (!gamesByGenre['Other']) {
                gamesByGenre['Other'] = [];
            }
            gamesByGenre['Other'].push(game);
        }
    });
    
    console.log('🏆 Genre distribution:', Object.keys(gamesByGenre).map(g => `${g}: ${gamesByGenre[g].length}`));
    
    // Sort genres and render sections
    const sortedGenres = Object.keys(gamesByGenre).sort();
    
    console.log('🎮 Rendering', sortedGenres.length, 'genres:', sortedGenres);
    
    sortedGenres.forEach(genre => {
        const genreGames = gamesByGenre[genre];
        
        // Create genre carousel section
        const genreSection = document.createElement('div');
        genreSection.className = 'genre-carousel-section';
        
        // Add genre header with title and navigation
        const headerDiv = document.createElement('div');
        headerDiv.className = 'genre-carousel-header';
        
        const titleDiv = document.createElement('h2');
        titleDiv.className = 'genre-carousel-title';
        titleDiv.textContent = genre;
        headerDiv.appendChild(titleDiv);
        
        const navDiv = document.createElement('div');
        navDiv.className = 'carousel-nav';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn carousel-prev';
        prevBtn.textContent = '‹';
        prevBtn.setAttribute('aria-label', `Previous ${genre} game`);
        prevBtn.setAttribute('data-genre', genre);
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn carousel-next';
        nextBtn.textContent = '›';
        nextBtn.setAttribute('aria-label', `Next ${genre} game`);
        nextBtn.setAttribute('data-genre', genre);
        
        navDiv.appendChild(prevBtn);
        navDiv.appendChild(nextBtn);
        headerDiv.appendChild(navDiv);
        
        genreSection.appendChild(headerDiv);
        
        // Create carousel wrapper
        const carouselWrapper = document.createElement('div');
        carouselWrapper.className = 'carousel-wrapper';
        
        const carousel = document.createElement('div');
        carousel.className = 'carousel';
        carousel.setAttribute('data-genre', genre);
        
        // Add game cards to carousel
        genreGames.forEach((game) => {
            const card = createCarouselCard(game);
            carousel.appendChild(card);
        });
        
        carouselWrapper.appendChild(carousel);
        genreSection.appendChild(carouselWrapper);
        
        container.appendChild(genreSection);
    });
    
    // Initialize carousel navigation
    initializeCarouselNav();
    console.log('✅ Carousel rendering complete');
}

/**
 * Create a carousel card for a game
 * @param {Object} game - Game object
 * @returns {HTMLElement} Card element
 */
function createCarouselCard(game) {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    
    // Image section removed - keeping data display only
    
    // Create content section
    const contentDiv = document.createElement('div');
    contentDiv.className = 'carousel-card-content';
    
    // Title
    const titleDiv = document.createElement('h3');
    titleDiv.className = 'carousel-card-title';
    titleDiv.textContent = escapeHtml(game.title || 'Unknown Title');
    contentDiv.appendChild(titleDiv);
    
    // Release Date
    if (game.release_date && game.release_date !== 'Not Available') {
        contentDiv.appendChild(createCarouselCardField('Release', game.release_date));
    }
    
    // Developer
    if (game.developer && game.developer !== 'Not Available') {
        contentDiv.appendChild(createCarouselCardField('Developer', game.developer));
    }
    
    // Publisher
    if (game.publisher && game.publisher !== 'Not Available') {
        contentDiv.appendChild(createCarouselCardField('Publisher', game.publisher));
    }
    
    // Platforms
    if (game.platform_availability && game.platform_availability !== 'Not Available') {
        const platformField = document.createElement('div');
        platformField.className = 'carousel-card-field';
        const platformLabel = document.createElement('div');
        platformLabel.className = 'carousel-card-label';
        platformLabel.textContent = 'Platforms';
        platformField.appendChild(platformLabel);
        
        const platformsDiv = document.createElement('div');
        platformsDiv.className = 'carousel-platforms';
        
        const platforms = game.platform_availability
            .split(',')
            .map(p => p.trim())
            .filter(p => p && p !== 'Not Available');
        
        platforms.forEach(platform => {
            const badge = document.createElement('span');
            badge.className = 'carousel-platform-badge';
            badge.textContent = escapeHtml(platform);
            platformsDiv.appendChild(badge);
        });
        
        platformField.appendChild(platformsDiv);
        contentDiv.appendChild(platformField);
    }
    
    // Features (truncated)
    if (game.features && game.features !== 'Not Available') {
        const featuresDiv = document.createElement('div');
        featuresDiv.className = 'carousel-card-features';
        featuresDiv.textContent = escapeHtml(game.features);
        contentDiv.appendChild(featuresDiv);
    }
    
    card.appendChild(contentDiv);
    
    // Add click handler to open modal
    card.addEventListener('click', function() {
        openModal(game);
    });
    
    return card;
}

/**
 * Create a field within a carousel card
 * @param {String} label - Field label
 * @param {String} value - Field value
 * @returns {HTMLElement} Field element
 */
function createCarouselCardField(label, value) {
    const field = document.createElement('div');
    field.className = 'carousel-card-field';
    
    const labelSpan = document.createElement('div');
    labelSpan.className = 'carousel-card-label';
    labelSpan.textContent = label;
    field.appendChild(labelSpan);
    
    const valueSpan = document.createElement('div');
    valueSpan.className = 'carousel-card-value';
    valueSpan.textContent = escapeHtml(value || 'Not Available');
    field.appendChild(valueSpan);
    
    return field;
}

/**
 * Initialize carousel navigation
 */
function initializeCarouselNav() {
    const prevBtns = document.querySelectorAll('.carousel-prev');
    const nextBtns = document.querySelectorAll('.carousel-next');
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const genre = this.getAttribute('data-genre');
            const carousel = document.querySelector(`.carousel[data-genre="${genre}"]`);
            if (carousel) {
                carousel.scrollBy({ left: -550, behavior: 'smooth' });
                updateCarouselNavigation(carousel);
            }
        });
    });
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const genre = this.getAttribute('data-genre');
            const carousel = document.querySelector(`.carousel[data-genre="${genre}"]`);
            if (carousel) {
                carousel.scrollBy({ left: 550, behavior: 'smooth' });
                updateCarouselNavigation(carousel);
            }
        });
    });
    
    // Update navigation buttons on scroll
    document.querySelectorAll('.carousel').forEach(carousel => {
        carousel.addEventListener('scroll', function() {
            updateCarouselNavigation(this);
        });
        // Initial update
        updateCarouselNavigation(carousel);
    });
}

/**
 * Update carousel navigation button states
 * @param {HTMLElement} carousel - Carousel element
 */
function updateCarouselNavigation(carousel) {
    const genre = carousel.getAttribute('data-genre');
    const prevBtn = document.querySelector(`.carousel-prev[data-genre="${genre}"]`);
    const nextBtn = document.querySelector(`.carousel-next[data-genre="${genre}"]`);
    
    const isAtStart = carousel.scrollLeft <= 0;
    const isAtEnd = carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 10);
    
    if (prevBtn) prevBtn.disabled = isAtStart;
    if (nextBtn) nextBtn.disabled = isAtEnd;
}

/**
 * Initialize modal event listeners for game cards and modal controls
 */
function initializeModalListeners() {
    const modal = document.getElementById('gameModal');
    const modalClose = document.getElementById('modalClose');
    
    // Note: Game cards already have click handlers attached in createGameCard()
    // No need to attach duplicate handlers here
    
    // Close button handler
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            closeModal();
        });
    }
    
    // Background click handler (close when clicking outside modal)
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Keyboard: ESC to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }
}

/**
 * Open modal with game details
 * @param {Object} game - Game object to display
 */
function openModal(game) {
    const modal = document.getElementById('gameModal');
    if (!modal) return;
    
    // Populate modal content
    document.getElementById('modalTitle').textContent = game.title || 'Unknown';
    document.getElementById('modalDeveloper').textContent = game.developer || 'Not Available';
    document.getElementById('modalPublisher').textContent = game.publisher || 'Not Available';
    document.getElementById('modalReleaseDate').textContent = game.release_date || 'Not Available';
    document.getElementById('modalGenre').textContent = game.genre || 'Not Available';
    document.getElementById('modalFeatures').textContent = game.features || 'Not Available';
    
    // Populate platforms
    const platformsContainer = document.getElementById('modalPlatforms');
    if (platformsContainer) {
        platformsContainer.innerHTML = '';
        const platforms = (game.platform_availability || '')
            .split(',')
            .map(p => p.trim())
            .filter(p => p && p !== 'Not Available');
        
        if (platforms.length > 0) {
            platforms.forEach(platform => {
                const badge = document.createElement('span');
                badge.className = 'modal-platform-badge';
                badge.textContent = platform;
                platformsContainer.appendChild(badge);
            });
        } else {
            platformsContainer.innerHTML = '<span style="color: var(--color-text-secondary);">Not Available</span>';
        }
    }
    
    // Show modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('gameModal');
    if (!modal) return;
    
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

/**
 * Create a single game card DOM element
 * @param {Object} game - Game data object
 * @param {Number} index - Index of the game in the array
 * @returns {HTMLElement} The card element
 */
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('role', 'article');
    card.setAttribute('data-game-title', game.title);
    card.style.cursor = 'pointer';
    
    // Format the card HTML
    const cardHTML = `
        <div class="game-card-image">
            ${game.thumbnail_image && game.thumbnail_image !== 'Not Available' 
                ? `<img src="${escapeHtml(game.thumbnail_image)}" alt="${escapeHtml(game.title)}" class="game-card-img" onerror="this.style.display='none'; this.parentElement.innerHTML='🎮';">` 
                : '🎮'}
        </div>
        <div class="game-card-content">
            <h3 class="game-card-title">${escapeHtml(game.title || 'Unknown Title')}</h3>
            
            ${createCardField('Genre', game.genre)}
            ${createCardField('Release Date', game.release_date)}
            ${createCardField('Developer', game.developer)}
            
            ${createPlatformBadges(game.platform_availability)}
            
            <div style="margin-top: auto; padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                <button class="read-more-btn" style="
                    width: 100%;
                    padding: var(--spacing-md);
                    background-color: var(--color-accent);
                    color: var(--color-text-primary);
                    border: none;
                    border-radius: var(--radius-md);
                    font-weight: var(--font-weight-semibold);
                    cursor: pointer;
                    transition: all var(--transition-normal);
                    font-size: var(--font-size-sm);
                ">
                    Read More →
                </button>
            </div>
        </div>
    `;
    
    card.innerHTML = cardHTML;
    
    // Add click handler for the "Read More" button
    card.querySelector('.read-more-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        openModal(game);
    });
    
    // Also allow clicking the entire card to open modal
    card.addEventListener('click', function(e) {
        if (e.target.className !== 'read-more-btn') {
            openModal(game);
        }
    });
    
    return card;
}

/**
 * Create a field section within a card
 * @param {String} label - Field label
 * @param {String} value - Field value
 * @param {Boolean} isLongForm - Whether this is a longer text field
 * @returns {String} HTML string for the field
 */
function createCardField(label, value, isLongForm = false) {
    const isUnavailable = value === 'Not Available' || value === undefined || value === null || value === '';
    const displayValue = isUnavailable ? 'Not Available' : value;
    const className = isUnavailable ? 'game-card-value unavailable' : 'game-card-value';
    
    // Truncate long values
    let truncated = String(displayValue);
    if (!isLongForm && truncated.length > 80) {
        truncated = truncated.substring(0, 80) + '...';
    }
    
    return `
        <div class="game-card-field">
            <label class="game-card-label">${escapeHtml(label)}</label>
            <div class="${className}" title="${escapeHtml(displayValue)}">
                ${escapeHtml(truncated)}
            </div>
        </div>
    `;
}

/**
 * Create platform badges from comma-separated platform string
 * @param {String} platformString - Comma-separated platform list
 * @returns {String} HTML string for platform badges
 */
function createPlatformBadges(platformString) {
    if (!platformString || platformString === 'Not Available') {
        return `
            <div class="game-card-field">
                <label class="game-card-label">Platforms</label>
                <div class="game-card-value unavailable">Not Available</div>
            </div>
        `;
    }
    
    const platforms = platformString
        .split(',')
        .map(p => p.trim())
        .filter(p => p && p !== 'Not Available');
    
    if (platforms.length === 0) {
        return `
            <div class="game-card-field">
                <label class="game-card-label">Platforms</label>
                <div class="game-card-value unavailable">Not Available</div>
            </div>
        `;
    }
    
    const badges = platforms
        .map(platform => `<span class="platform-badge">${escapeHtml(platform)}</span>`)
        .join('');
    
    return `
        <div class="game-card-field">
            <label class="game-card-label">Platforms</label>
            <div class="game-card-platforms">
                ${badges}
            </div>
        </div>
    `;
}

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {String} text - Raw text to escape
 * @returns {String} Escaped HTML text
 */
function escapeHtml(text) {
    if (!text) return '';
    
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

/**
 * Scroll to top of page (smooth)
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Handle API errors gracefully
 * @param {String} endpointName - Name of the API endpoint
 * @param {Object} error - Error object
 */
function handleApiError(endpointName, error) {
    console.error(`API Error [${endpointName}]:`, error);
    
    // Show user-friendly message
    const container = document.getElementById('gamesContainer');
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--color-error);">
                <p>⚠️ Error loading games data. Please refresh the page or check the console for details.</p>
            </div>
        `;
    }
}

/**
 * Fetch games from the API endpoint (for reference, currently unused as we use template data)
 * This function can be used to implement backend filtering if needed
 */
async function fetchGamesFromAPI() {
    try {
        const response = await fetch('/api/games');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
            return data.data.games;
        } else {
            throw new Error(data.error || 'Unknown API error');
        }
    } catch (error) {
        handleApiError('GET /api/games', error);
        return [];
    }
}

/**
 * Fetch game statistics from the API
 */
async function fetchGameStats() {
    try {
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
            console.log('Game Statistics:', data.data);
            return data.data;
        } else {
            throw new Error(data.error || 'Unknown API error');
        }
    } catch (error) {
        handleApiError('GET /api/stats', error);
        return null;
    }
}

/**
 * Export games data to CSV format
 * (Future enhancement: implement actual CSV download)
 */
function exportToCSV() {
    console.log('Export to CSV feature coming soon...');
}

/**
 * Export games data to JSON format
 */
function exportToJSON() {
    const data = JSON.stringify(allGames, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kotaku-games-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    console.log(`✅ Exported ${allGames.length} games to JSON`);
}

/**
 * Log application state for debugging
 */
function logAppState() {
    console.group('🎮 Kotaku Gaming Scraper - App State');
    console.log('Total games loaded:', allGames.length);
    console.log('Search input:', document.getElementById('searchInput')?.value || 'none');
    console.log('Current URL:', window.location.href);
    console.table(allGames);
    console.groupEnd();
}

// Window exposure for debugging (optional)
window.appDebug = {
    allGames,
    filterGames,
    scrollToTop,
    exportToJSON,
    logAppState,
    fetchGamesFromAPI,
    fetchGameStats
};

console.log('🎮 Kotaku Gaming Scraper frontend loaded successfully');
console.log('Use window.appDebug for debugging tools (beta)');
