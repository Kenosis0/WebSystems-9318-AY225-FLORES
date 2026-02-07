// events.js - Events page functionality

document.addEventListener('DOMContentLoaded', () => {
    // Event Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const upcomingEvents = document.getElementById('upcomingEvents');
    const pastEvents = document.getElementById('pastEvents');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');

            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide event grids
            if (tab === 'upcoming') {
                upcomingEvents.classList.remove('hidden');
                pastEvents.classList.add('hidden');
            } else {
                upcomingEvents.classList.add('hidden');
                pastEvents.classList.remove('hidden');
            }
        });
    });

    // Event Search
    const searchInput = document.getElementById('eventSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }

    // Category Filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterEvents);
    }
});

function filterEvents() {
    const searchTerm = document.getElementById('eventSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const eventCards = document.querySelectorAll('.event-card');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;

    eventCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardStatus = card.getAttribute('data-status');
        const cardText = card.textContent.toLowerCase();
        
        // Check current tab
        const currentTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        const matchesTab = (currentTab === 'upcoming' && cardStatus === 'upcoming') || 
                          (currentTab === 'past' && cardStatus === 'past');
        
        const matchesSearch = cardText.includes(searchTerm);
        const matchesCategory = category === 'all' || cardCategory === category;

        if (matchesTab && matchesSearch && matchesCategory) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results message
    if (noResults) {
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
}

function openEventGallery(eventId) {
    const modal = document.getElementById('galleryModal');
    const content = document.getElementById('galleryContent');

    const galleryData = {
        orientation2026: {
            title: 'Grand Volunteer Orientation 2026',
            description: 'A successful onboarding of 450 new volunteers from Metro Manila. The event included comprehensive orientation sessions, team-building activities, and networking opportunities.',
            images: [
                'assets/images/Events-Campaigns Gallery-1-Community event.jpeg'
            ]
        },
        typhoonSakura: {
            title: 'Typhoon Sakura Relief Operations',
            description: 'Comprehensive emergency response and recovery operations for communities affected by Typhoon Sakura in Northern Luzon.',
            images: [
                'assets/images/Campaign Highlights-1-Typhoon relief operation.jpg',
                'assets/images/Events-Campaigns Gallery-6-Relief distribution.jpg'
            ]
        },
        awards2025: {
            title: 'Volunteer Excellence Awards 2025',
            description: 'Recognition ceremony honoring 156 outstanding volunteers who demonstrated exceptional commitment to humanitarian service.',
            images: [
                'assets/images/Events-Campaigns Gallery-7-Community celebration.jpg',
                'assets/images/Campaign Highlights-4-Volunteer milestone.jpg'
            ]
        }
    };

    const event = galleryData[eventId];
    if (!event) return;

    let imagesHTML = '';
    event.images.forEach(img => {
        imagesHTML += `<img src="${img}" alt="${event.title}" style="width:100%; border-radius:8px; margin-bottom:20px;">`;
    });

    content.innerHTML = `
        <h2>${event.title}</h2>
        <p style="font-size:1.1rem; margin:20px 0; color:var(--dark-gray);">${event.description}</p>
        ${imagesHTML}
    `;

    modal.classList.add('active');
    modal.style.display = 'flex';
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal && e.target === galleryModal) {
        closeGalleryModal();
    }
    
    const regModal = document.getElementById('registrationModal');
    if (regModal && e.target === regModal) {
        closeRegistrationModal();
    }
});
