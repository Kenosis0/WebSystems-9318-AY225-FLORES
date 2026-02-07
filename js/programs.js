// programs.js - Programs page functionality

document.addEventListener('DOMContentLoaded', () => {
    // Program Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const programCards = document.querySelectorAll('.program-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter programs
            programCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
});

// Toggle Program Details
function toggleProgramDetails(button) {
    const programCard = button.closest('.program-card');
    const details = programCard.querySelector('.program-details');
    const icon = button.querySelector('i');

    if (details.classList.contains('active')) {
        details.classList.remove('active');
        button.classList.remove('active');
        button.innerHTML = 'Learn More <i class="fas fa-chevron-down"></i>';
    } else {
        // Close other open details
        document.querySelectorAll('.program-details.active').forEach(d => {
            d.classList.remove('active');
        });
        document.querySelectorAll('.expand-btn.active').forEach(b => {
            b.classList.remove('active');
            b.innerHTML = 'Learn More <i class="fas fa-chevron-down"></i>';
        });

        details.classList.add('active');
        button.classList.add('active');
        button.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';

        // Scroll to the card
        setTimeout(() => {
            programCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Donation Allocation
function allocateDonation(program, amount) {
    const programNames = {
        disaster: 'Typhoon Response Unit',
        health: 'Mobile Health Caravan',
        blood: 'Blood Heroes Program',
        livelihood: 'Kabuhayan Plus Program',
        youth: 'Youth Brigade Initiative',
        wellness: 'Wellness & Psychosocial Support'
    };

    const purposes = {
        500: 'Emergency Kit / Training Materials / Workshop Materials',
        1000: 'Family Food Pack / Starter Kit',
        1500: 'Mobile Clinic Fuel',
        2000: 'Blood Drive Equipment / Counseling Session / Chapter Support',
        3000: 'Starter Kit',
        5000: 'Shelter Materials / Mobile Unit Operations / Training Program',
        10000: 'Medical Equipment / Business Capital'
    };

    const donationData = {
        program: programNames[program] || program,
        amount: amount,
        purpose: purposes[amount] || 'General Program Support'
    };

    // Save to localStorage
    const saved = BRCStorage.addDonation(donationData);

    if (saved) {
        showDonationConfirmation(donationData);
        updateDonationTracker();
    }
}

function showDonationConfirmation(donation) {
    const message = `Thank you for your support!\\n\\nYou've allocated ₱${donation.amount.toLocaleString()} to:\\n${donation.program}\\n\\nPurpose: ${donation.purpose}\\n\\nThis is a simulation for educational purposes. In a real system, you would be redirected to a payment gateway.`;
    alert(message);
}

function updateDonationTracker() {
    const trackerDiv = document.getElementById('donationTracker');
    if (!trackerDiv) return;

    const donations = BRCStorage.getDonations();
    
    if (donations.length === 0) {
        trackerDiv.innerHTML = '<p class="tracker-empty">Select a donation option from any program above to see how your contribution helps.</p>';
        return;
    }

    // Group by program
    const grouped = {};
    let total = 0;

    donations.forEach(d => {
        if (!grouped[d.program]) {
            grouped[d.program] = 0;
        }
        grouped[d.program] += d.amount;
        total += d.amount;
    });

    let html = '<h3 style="color:var(--navy); margin-bottom:20px;">Total Donations Allocated: ₱' + total.toLocaleString() + '</h3>';
    html += '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:15px;">';

    for (const [program, amount] of Object.entries(grouped)) {
        html += `
            <div style="background:#f8f9fa; padding:20px; border-radius:8px; border-left:4px solid var(--primary-coral);">
                <h4 style="color:var(--navy); margin-bottom:10px;">${program}</h4>
                <p style="font-size:1.5rem; font-weight:bold; color:var(--primary-coral); margin:0;">₱${amount.toLocaleString()}</p>
            </div>
        `;
    }

    html += '</div>';
    html += '<p style="margin-top:20px; text-align:center; color:var(--dark-gray); font-size:0.9rem;">*This is a simulation for educational purposes</p>';

    trackerDiv.innerHTML = html;
}

// Initialize donation tracker on page load
document.addEventListener('DOMContentLoaded', updateDonationTracker);
