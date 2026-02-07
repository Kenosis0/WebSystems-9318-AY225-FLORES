// main.js - Main functionality for Bayanihan Relief Corps website
// Navigation, modals, and general interactions

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Alert Banner Close
    const closeAlert = document.getElementById('closeAlert');
    const alertBanner = document.getElementById('alertBanner');
    
    if (closeAlert && alertBanner) {
        closeAlert.addEventListener('click', () => {
            alertBanner.style.display = 'none';
        });
    }

    // Scroll Animation for Timeline
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Campaign Modal Functions
const campaignData = {
    typhoon: {
        title: 'Typhoon Sakura Relief Operations',
        image: 'assets/images/Campaign Highlights-1-Typhoon relief operation.jpg',
        description: 'Typhoon Sakura devastated Northern Luzon in December 2025, affecting over 15,000 families across 12 municipalities. Our rapid response teams were deployed within hours, providing emergency shelter, food, clean water, and medical assistance.',
        details: [
            '<strong>Emergency Phase (Days 1-7):</strong> Deployed 680 volunteers for search and rescue, evacuation assistance, and emergency relief distribution',
            '<strong>Recovery Phase (Weeks 2-8):</strong> Established temporary shelters, medical stations, and distribution centers',
            '<strong>Rehabilitation Phase (Ongoing):</strong> Supporting families with housing repairs, livelihood assistance, and trauma counseling'
        ],
        impact: {
            'Families Evacuated': '15,847',
            'Relief Packs Distributed': '124,500',
            'Medical Consultations': '8,234',
            'Temporary Shelters': '45'
        },
        needs: 'We urgently need continued support for housing reconstruction materials, livelihood programs, and psychosocial services. Your donation will directly help families rebuild their homes and lives.'
    },
    medical: {
        title: 'Mobile Health Caravan 2026',
        image: 'assets/images/Campaign Highlights-2-Medical mission.jpg',
        description: 'Our Mobile Health Caravan brings quality healthcare to 50 remote barangays across Visayas where residents have limited access to medical services. Teams of volunteer doctors, nurses, and dentists conduct free consultations and health education.',
        details: [
            '<strong>Service Coverage:</strong> General medicine, pediatrics, dental care, optometry, and pharmacy services',
            '<strong>Health Education:</strong> Disease prevention, nutrition, maternal health, and first aid training',
            '<strong>Follow-up Care:</strong> Referral system for serious conditions and medicine distribution'
        ],
        impact: {
            'Patients Treated': '12,456',
            'Barangays Visited': '38 of 50',
            'Medical Missions': '156',
            'Medicines Distributed': '₱2.3M worth'
        },
        needs: 'Help us reach our goal of 50 barangays by supporting mobile clinic operations, medical supplies, and volunteer doctor honoraria.'
    },
    livelihood: {
        title: 'Kabuhayan Plus Success Stories',
        image: 'assets/images/Campaign Highlights-3-Completed livelihood project.jpg',
        description: 'We are proud to announce that our Kabuhayan Plus Program has successfully trained and supported 500 families in launching sustainable microenterprises! From food processing to handicrafts, beneficiaries are now earning stable income.',
        details: [
            '<strong>Training Completed:</strong> 6-week comprehensive skills training in various trades',
            '<strong>Starter Kits Provided:</strong> Equipment and initial capital ranging from ₱5,000-₱15,000',
            '<strong>Business Mentoring:</strong> Ongoing support in bookkeeping, marketing, and business management'
        ],
        impact: {
            'Beneficiaries Trained': '500',
            'Businesses Launched': '387',
            'Still Operating': '87%',
            'Average Monthly Income': '₱8,500'
        },
        needs: 'Program complete! 100% funded. Thank you to all our donors and partners who made this transformation possible.'
    }
};

function openCampaignModal(campaignId) {
    const modal = document.getElementById('campaignModal');
    const modalBody = document.getElementById('modalBody');
    const campaign = campaignData[campaignId];

    if (!campaign || !modal || !modalBody) return;

    let impactHTML = '';
    for (const [label, value] of Object.entries(campaign.impact)) {
        impactHTML += `
            <div class="metric-box">
                <strong>${value}</strong>
                <span>${label}</span>
            </div>
        `;
    }

    let detailsHTML = '';
    campaign.details.forEach(detail => {
        detailsHTML += `<li>${detail}</li>`;
    });

    modalBody.innerHTML = `
        <img src="${campaign.image}" alt="${campaign.title}" style="width:100%; border-radius:8px; margin-bottom:20px;">
        <h2>${campaign.title}</h2>
        <p style="font-size:1.1rem; margin:20px 0;">${campaign.description}</p>
        
        <h3 style="color:var(--navy); margin-top:30px;">Campaign Details</h3>
        <ul style="list-style:none; padding:0;">
            ${detailsHTML}
        </ul>

        <h3 style="color:var(--navy); margin-top:30px;">Impact Achieved</h3>
        <div class="impact-metrics" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(120px, 1fr)); gap:15px; margin:20px 0;">
            ${impactHTML}
        </div>

        <div style="background-color:#f8f9fa; padding:20px; border-radius:8px; margin-top:20px;">
            <h4 style="color:var(--navy);">How You Can Help</h4>
            <p>${campaign.needs}</p>
        </div>
    `;

    modal.classList.add('active');
    modal.style.display = 'flex';
}

function closeCampaignModal() {
    const modal = document.getElementById('campaignModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('campaignModal');
    if (modal && e.target === modal) {
        closeCampaignModal();
    }
});

// Terms Modal
function openTerms() {
    alert('Terms & Conditions:\\n\\nBy registering as a volunteer with Bayanihan Relief Corps, you agree to:\\n\\n1. Provide accurate personal information\\n2. Participate in required training programs\\n3. Follow organizational policies and code of conduct\\n4. Respect beneficiaries and maintain confidentiality\\n5. Allow use of your data for volunteer management\\n\\nFor full terms, visit our website or contact us.');
}
