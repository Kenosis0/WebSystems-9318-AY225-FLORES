// admin.js - Admin Dashboard Functionality

// ========== SHOW/HIDE PASSWORD TOGGLE ==========
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        btn.title = 'Hide password';
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        btn.title = 'Show password';
    }
}

// ========== ADMIN LOGIN ==========
document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;

            if (BRCStorage.verifyAdminPassword(password)) {
                loginScreen.classList.add('hidden');
                adminDashboard.classList.remove('hidden');
                loadAllData();
            } else {
                loginError.textContent = 'Incorrect password. Please try again.';
                loginError.style.display = 'block';
            }
        });
    }

    // ========== TAB SWITCHING ==========
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            const target = document.getElementById(tab + '-tab');
            if (target) target.classList.add('active');
        });
    });

    // ========== SEARCH INPUTS ==========
    const searchMap = {
        volunteerSearch: 'volunteersTableBody',
        eventSearch: 'eventsTableBody',
        contactSearch: 'contactsTableBody',
        donationSearch: 'donationsTableBody'
    };

    Object.keys(searchMap).forEach(inputId => {
        const el = document.getElementById(inputId);
        if (el) {
            el.addEventListener('input', () => {
                filterTable(searchMap[inputId], el.value);
            });
        }
    });

    // ========== CHANGE PASSWORD FORM ==========
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const currentPwd = document.getElementById('currentPassword').value;
            const newPwd = document.getElementById('newPassword').value;
            const confirmPwd = document.getElementById('confirmPassword').value;
            const errorDiv = document.getElementById('passwordChangeError');

            if (!BRCStorage.verifyAdminPassword(currentPwd)) {
                errorDiv.textContent = 'Current password is incorrect.';
                errorDiv.style.display = 'block';
                return;
            }

            if (newPwd.length < 6) {
                errorDiv.textContent = 'New password must be at least 6 characters long.';
                errorDiv.style.display = 'block';
                return;
            }

            if (newPwd !== confirmPwd) {
                errorDiv.textContent = 'New passwords do not match.';
                errorDiv.style.display = 'block';
                return;
            }

            BRCStorage.updateAdminPassword(newPwd);
            alert('Password changed successfully!');
            closePasswordModal();
        });
    }
});

// ========== LOAD ALL DATA ==========
function loadAllData() {
    loadVolunteersData();
    loadEventsData();
    loadContactsData();
    loadDonationsData();
}

// ---- Volunteers ----
function loadVolunteersData() {
    const volunteers = BRCStorage.getVolunteers();
    const tbody = document.getElementById('volunteersTableBody');
    const total = document.getElementById('totalVolunteers');
    if (!tbody || !total) return;

    total.textContent = volunteers.length;

    if (volunteers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:#95a5a6;">No volunteer registrations yet.</td></tr>';
        return;
    }

    tbody.innerHTML = volunteers.map((v, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${v.fullName || v.name || 'N/A'}</td>
            <td>${v.email || 'N/A'}</td>
            <td>${v.phone || 'N/A'}</td>
            <td>${v.location || v.city || 'N/A'}</td>
            <td>${v.interests ? (Array.isArray(v.interests) ? v.interests.join(', ') : v.interests) : 'N/A'}</td>
            <td>${v.timestamp ? new Date(v.timestamp).toLocaleDateString() : 'N/A'}</td>
            <td><button onclick="deleteVolunteer('${v.id}')" class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('');
}

// ---- Event Registrations ----
function loadEventsData() {
    const registrations = BRCStorage.getEventRegistrations();
    const tbody = document.getElementById('eventsTableBody');
    const total = document.getElementById('totalEventRegs');
    if (!tbody || !total) return;

    total.textContent = registrations.length;

    if (registrations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:30px; color:#95a5a6;">No event registrations yet.</td></tr>';
        return;
    }

    tbody.innerHTML = registrations.map((r, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${r.eventName || 'N/A'}</td>
            <td>${r.eventDate || 'N/A'}</td>
            <td>${r.fullName || r.name || 'N/A'}</td>
            <td>${r.email || 'N/A'}</td>
            <td>${r.phone || 'N/A'}</td>
            <td>${r.participationType || r.type || 'N/A'}</td>
            <td>${r.timestamp ? new Date(r.timestamp).toLocaleDateString() : 'N/A'}</td>
            <td><button onclick="deleteEventRegistration('${r.id}')" class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('');
}

// ---- Contact Messages ----
function loadContactsData() {
    const contacts = BRCStorage.getContactMessages();
    const tbody = document.getElementById('contactsTableBody');
    const total = document.getElementById('totalContacts');
    if (!tbody || !total) return;

    total.textContent = contacts.length;

    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:30px; color:#95a5a6;">No contact messages yet.</td></tr>';
        return;
    }

    tbody.innerHTML = contacts.map((c, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${c.name || c.fullName || 'N/A'}</td>
            <td>${c.email || 'N/A'}</td>
            <td>${c.phone || 'N/A'}</td>
            <td>${c.department || 'N/A'}</td>
            <td>${c.subject || 'N/A'}</td>
            <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${c.message || ''}">${c.message || 'N/A'}</td>
            <td>${c.timestamp ? new Date(c.timestamp).toLocaleDateString() : 'N/A'}</td>
            <td><button onclick="deleteContactMessage('${c.id}')" class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('');
}

// ---- Donations ----
function loadDonationsData() {
    const donations = BRCStorage.getDonations();
    const tbody = document.getElementById('donationsTableBody');
    const total = document.getElementById('totalDonations');
    if (!tbody || !total) return;

    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    total.textContent = donations.length > 0 ? `₱${totalAmount.toLocaleString()}` : '0';

    if (donations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#95a5a6;">No donation allocations yet.</td></tr>';
        return;
    }

    tbody.innerHTML = donations.map((d, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${d.program || 'N/A'}</td>
            <td>₱${(d.amount || 0).toLocaleString()}</td>
            <td style="max-width:250px;">${d.purpose || 'N/A'}</td>
            <td>${d.timestamp ? new Date(d.timestamp).toLocaleDateString() : 'N/A'}</td>
            <td><button onclick="deleteDonation('${d.id}')" class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('');
}

// ========== FILTER TABLE ==========
function filterTable(tbodyId, searchTerm) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    }
}

// ========== EXPORT DATA ==========
function exportData(type, format) {
    const dataMap = {
        volunteers: { get: () => BRCStorage.getVolunteers(), name: 'volunteers' },
        eventRegistrations: { get: () => BRCStorage.getEventRegistrations(), name: 'event-registrations' },
        contactMessages: { get: () => BRCStorage.getContactMessages(), name: 'contact-messages' },
        donations: { get: () => BRCStorage.getDonations(), name: 'donations' }
    };

    const entry = dataMap[type];
    if (!entry) return;

    const data = entry.get();
    if (data.length === 0) {
        alert(`No ${entry.name} data to export.`);
        return;
    }

    if (format === 'csv') {
        BRCStorage.exportToCSV(data, `${entry.name}.csv`);
    } else if (format === 'json') {
        BRCStorage.exportToJSON(data, `${entry.name}.json`);
    }
}

// ========== CLEAR DATA ==========
function clearData(type) {
    const clearMap = {
        volunteers: { label: 'all volunteer registrations', clear: () => BRCStorage.clearVolunteers(), reload: loadVolunteersData },
        eventRegistrations: { label: 'all event registrations', clear: () => BRCStorage.clearEventRegistrations(), reload: loadEventsData },
        contactMessages: { label: 'all contact messages', clear: () => BRCStorage.clearContactMessages(), reload: loadContactsData },
        donations: { label: 'all donation records', clear: () => BRCStorage.clearDonations(), reload: loadDonationsData }
    };

    const entry = clearMap[type];
    if (!entry) return;

    if (!confirm(`Are you sure you want to clear ${entry.label}? This action cannot be undone.`)) return;

    entry.clear();
    entry.reload();
    alert(`Cleared ${entry.label} successfully.`);
}

// ========== DELETE INDIVIDUAL RECORDS ==========
function deleteVolunteer(id) {
    if (confirm('Delete this volunteer registration?')) {
        BRCStorage.deleteVolunteer(id);
        loadVolunteersData();
    }
}

function deleteEventRegistration(id) {
    if (confirm('Delete this event registration?')) {
        BRCStorage.deleteEventRegistration(id);
        loadEventsData();
    }
}

function deleteContactMessage(id) {
    if (confirm('Delete this contact message?')) {
        BRCStorage.deleteContactMessage(id);
        loadContactsData();
    }
}

function deleteDonation(id) {
    if (confirm('Delete this donation record?')) {
        BRCStorage.deleteDonation(id);
        loadDonationsData();
    }
}

// ========== LOGOUT ==========
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('adminPassword').value = '';
        document.getElementById('loginError').style.display = 'none';
    }
}

// ========== CHANGE PASSWORD MODAL ==========
function changePassword() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
    const form = document.getElementById('changePasswordForm');
    if (form) form.reset();
    const err = document.getElementById('passwordChangeError');
    if (err) err.style.display = 'none';
}

// Close modals on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        e.target.style.display = 'none';
    }
});
