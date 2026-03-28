// storage.js - LocalStorage Management for Bayanihan Relief Corps
// Handles all data persistence operations

const BRCStorage = {
    // Storage Keys
    keys: {
        volunteers: 'brc_volunteers',
        eventRegistrations: 'brc_event_registrations',
        contactMessages: 'brc_contact_messages',
        donations: 'brc_donations',
        adminPassword: 'brc_admin_password'
    },

    // Initialize default admin password if not set
    init() {
        if (!this.getAdminPassword()) {
            this.setAdminPassword('admin123');
        }
    },

    // Generic storage operations
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return [];
        }
    },

    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            return false;
        }
    },

    add(key, item) {
        const items = this.get(key);
        item.id = this.generateId();
        item.timestamp = new Date().toISOString();
        items.push(item);
        return this.set(key, items) ? item : null;
    },

    delete(key, id) {
        const items = this.get(key);
        const filtered = items.filter(item => item.id !== id);
        return this.set(key, filtered);
    },

    clear(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error clearing ${key}:`, error);
            return false;
        }
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Volunteer operations
    addVolunteer(volunteerData) {
        return this.add(this.keys.volunteers, volunteerData);
    },

    getVolunteers() {
        return this.get(this.keys.volunteers);
    },

    deleteVolunteer(id) {
        return this.delete(this.keys.volunteers, id);
    },

    clearVolunteers() {
        return this.clear(this.keys.volunteers);
    },

    // Event registration operations
    addEventRegistration(registrationData) {
        return this.add(this.keys.eventRegistrations, registrationData);
    },

    getEventRegistrations() {
        return this.get(this.keys.eventRegistrations);
    },

    deleteEventRegistration(id) {
        return this.delete(this.keys.eventRegistrations, id);
    },

    clearEventRegistrations() {
        return this.clear(this.keys.eventRegistrations);
    },

    // Contact message operations
    addContactMessage(messageData) {
        return this.add(this.keys.contactMessages, messageData);
    },

    getContactMessages() {
        return this.get(this.keys.contactMessages);
    },

    deleteContactMessage(id) {
        return this.delete(this.keys.contactMessages, id);
    },

    clearContactMessages() {
        return this.clear(this.keys.contactMessages);
    },

    // Donation operations
    addDonation(donationData) {
        return this.add(this.keys.donations, donationData);
    },

    getDonations() {
        return this.get(this.keys.donations);
    },

    deleteDonation(id) {
        return this.delete(this.keys.donations, id);
    },

    clearDonations() {
        return this.clear(this.keys.donations);
    },

    // Admin password operations
    getAdminPassword() {
        return localStorage.getItem(this.keys.adminPassword);
    },

    setAdminPassword(password) {
        localStorage.setItem(this.keys.adminPassword, password);
    },

    verifyAdminPassword(password) {
        return this.getAdminPassword() === password;
    },

    updateAdminPassword(newPassword) {
        this.setAdminPassword(newPassword);
    },

    // Export data as CSV (accepts data array directly)
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        // Get all unique keys from data
        const allKeys = [...new Set(data.flatMap(Object.keys))];
        
        // Create CSV header
        let csv = allKeys.join(',') + '\n';
        
        // Add data rows
        data.forEach(item => {
            const row = allKeys.map(k => {
                const value = item[k];
                if (value === null || value === undefined) return '';
                const escaped = String(value).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csv += row.join(',') + '\n';
        });

        this.downloadFile(csv, filename, 'text/csv');
    },

    // Export data as JSON (accepts data array directly)
    exportToJSON(data, filename) {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, filename, 'application/json');
    },

    // Helper to download file
    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

// Initialize storage on load
BRCStorage.init();
