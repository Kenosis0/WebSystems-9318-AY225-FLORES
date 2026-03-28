// forms.js - Form handling and validation for Bayanihan Relief Corps

// Volunteer Form Multi-Step
let currentStep = 1;
const totalSteps = 3;

function nextStep() {
    if (validateStep(currentStep)) {
        // Hide current step
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Show next step
        currentStep++;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
        
        // If on confirmation step, show summary
        if (currentStep === 3) {
            showFormSummary();
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevStep() {
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Show previous step
    currentStep--;
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');

        // Clear previous errors
        formGroup.classList.remove('error');
        if (errorMessage) errorMessage.textContent = '';

        // Validate input
        if (!input.value.trim()) {
            isValid = false;
            formGroup.classList.add('error');
            if (errorMessage) errorMessage.textContent = 'This field is required';
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            formGroup.classList.add('error');
            if (errorMessage) errorMessage.textContent = 'Please enter a valid email';
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
            isValid = false;
            formGroup.classList.add('error');
            if (errorMessage) errorMessage.textContent = 'Please enter a valid phone number';
        } else if (input.type === 'date' && !isValidAge(input.value)) {
            isValid = false;
            formGroup.classList.add('error');
            if (errorMessage) errorMessage.textContent = 'You must be at least 15 years old';
        }
    });

    // Check for checkboxes if on step 2
    if (step === 2) {
        const interestsChecked = currentStepElement.querySelectorAll('input[name="interests"]:checked').length;
        if (interestsChecked === 0) {
            isValid = false;
            alert('Please select at least one area of interest');
        }
    }

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[0-9+\-\s()]{10,}$/.test(phone);
}

function isValidAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    return age >= 15;
}

function showFormSummary() {
    const form = document.getElementById('volunteerForm');
    const summaryDiv = document.getElementById('formSummary');
    
    const formData = {
        'Full Name': `${form.firstName.value} ${form.middleName.value} ${form.lastName.value}`.trim(),
        'Date of Birth': form.birthdate.value,
        'Gender': form.gender.value,
        'Address': `${form.address.value}, ${form.city.value}, ${form.province.value}`,
        'Email': form.email.value,
        'Phone': form.phone.value,
        'Occupation': form.occupation.value,
        'Education': form.education.value,
        'Interests': Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.nextElementSibling.textContent).join(', '),
        'Skills': Array.from(form.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.nextElementSibling.textContent).join(', ') || 'None specified',
        'Availability': form.availability.value,
        'Hours per Week': form.hours.value
    };

    let summaryHTML = '<h4>Please review your information:</h4><div style="background:#f8f9fa; padding:20px; border-radius:8px;">';
    for (const [label, value] of Object.entries(formData)) {
        summaryHTML += `<p><strong>${label}:</strong> ${value}</p>`;
    }
    summaryHTML += '</div>';

    summaryDiv.innerHTML = summaryHTML;
}

// Volunteer Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Check agreement
            if (!document.getElementById('agreement').checked) {
                alert('Please agree to the terms and conditions');
                return;
            }

            // Collect form data
            const formData = {
                firstName: volunteerForm.firstName.value,
                middleName: volunteerForm.middleName.value,
                lastName: volunteerForm.lastName.value,
                fullName: `${volunteerForm.firstName.value} ${volunteerForm.middleName.value ? volunteerForm.middleName.value + ' ' : ''}${volunteerForm.lastName.value}`.replace(/\s+/g, ' ').trim(),
                birthdate: volunteerForm.birthdate.value,
                gender: volunteerForm.gender.value,
                address: volunteerForm.address.value,
                city: volunteerForm.city.value,
                province: volunteerForm.province.value,
                email: volunteerForm.email.value,
                phone: volunteerForm.phone.value,
                occupation: volunteerForm.occupation.value,
                education: volunteerForm.education.value,
                interests: Array.from(volunteerForm.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
                skills: Array.from(volunteerForm.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value),
                availability: volunteerForm.availability.value,
                hours: volunteerForm.hours.value,
                motivation: volunteerForm.motivation.value,
                emergencyContact: volunteerForm.reference.value
            };

            // Save to localStorage
            const volunteer = BRCStorage.addVolunteer(formData);

            if (volunteer) {
                // Generate volunteer ID card
                generateVolunteerCard(volunteer);
                
                // Show success modal
                openSuccessModal();
                
                // Reset form
                volunteerForm.reset();
                currentStep = 1;
                document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
                document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
                document.querySelector('.form-step[data-step="1"]').classList.add('active');
                document.querySelector('.step[data-step="1"]').classList.add('active');
            } else {
                alert('Error saving registration. Please try again.');
            }
        });
    }
});

function generateVolunteerCard(volunteer) {
    const cardDiv = document.getElementById('volunteerIdCard');
    const fullName = `${volunteer.firstName} ${volunteer.lastName}`;
    const volunteerId = volunteer.id.toUpperCase();

    cardDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 30px; border-radius: 12px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%; transform: translate(50%, -50%);"></div>
            <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <i class="fas fa-hands-helping" style="font-size: 3rem; color: #ff6b5a;"></i>
                    <div>
                        <h3 style="margin: 0; font-size: 1.2rem;">Bayanihan Relief Corps</h3>
                        <p style="margin: 0; opacity: 0.8; font-size: 0.9rem;">Volunteer ID</p>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; backdrop-filter: blur(10px);">
                    <p style="margin: 0 0 10px 0; font-size: 1.5rem; font-weight: bold;">${fullName}</p>
                    <p style="margin: 0; opacity: 0.9;">ID: ${volunteerId}</p>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Registered: ${new Date().toLocaleDateString()}</p>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <p style="margin: 0; font-size: 0.85rem; opacity: 0.7;">This certifies that the individual named above is a registered volunteer of Bayanihan Relief Corps.</p>
                </div>
            </div>
        </div>
    `;
}

function openSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

function downloadVolunteerCard() {
    alert('Volunteer ID card download functionality would generate a PDF in a production environment. For this educational project, your registration has been saved successfully!');
}

// Contact Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: contactForm.contactName.value,
                email: contactForm.contactEmail.value,
                phone: contactForm.contactPhone.value || 'Not provided',
                department: contactForm.contactDepartment.value,
                subject: contactForm.contactSubject.value,
                message: contactForm.contactMessage.value,
                newsletter: contactForm.newsletter.checked
            };

            // Validate
            if (!isValidEmail(formData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Save to localStorage
            const saved = BRCStorage.addContactMessage(formData);

            if (saved) {
                openContactSuccessModal();
                contactForm.reset();
            } else {
                alert('Error sending message. Please try again.');
            }
        });
    }
});

function openContactSuccessModal() {
    const modal = document.getElementById('contactSuccessModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closeContactSuccess() {
    const modal = document.getElementById('contactSuccessModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Event Registration Modal
function openRegistrationModal(eventName, eventDate) {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        document.getElementById('eventName').value = eventName;
        document.getElementById('eventDate').value = eventDate;
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.getElementById('eventRegistrationForm').reset();
    }
}

// Event Registration Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const eventRegForm = document.getElementById('eventRegistrationForm');
    if (eventRegForm) {
        eventRegForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                eventName: document.getElementById('eventName').value,
                eventDate: document.getElementById('eventDate').value,
                firstName: document.getElementById('regFirstName').value,
                lastName: document.getElementById('regLastName').value,
                fullName: `${document.getElementById('regFirstName').value} ${document.getElementById('regLastName').value}`.trim(),
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regPhone').value,
                participationType: document.getElementById('regParticipationType').value,
                comments: document.getElementById('regComments').value || 'None'
            };

            // Validate
            if (!isValidEmail(formData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Save to localStorage
            const saved = BRCStorage.addEventRegistration(formData);

            if (saved) {
                closeRegistrationModal();
                alert(`Registration successful! You're registered for ${formData.eventName}. Check your email for confirmation details.`);
            } else {
                alert('Error saving registration. Please try again.');
            }
        });
    }
});
