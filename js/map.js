// map.js - Leaflet.js Interactive Map for Contact Page

document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Initialize map centered on Philippines
    const map = L.map('map').setView([12.8797, 121.7740], 6);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Custom icons
    const regionalIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color:#e74c3c; width:30px; height:30px; border-radius:50%; border:3px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const operationsIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color:#3498db; width:25px; height:25px; border-radius:50%; border:3px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
    });

    const medicalIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color:#27ae60; width:25px; height:25px; border-radius:50%; border:3px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
    });

    // Regional Offices (Red markers)
    const regionalOffices = [
        {
            name: 'Main Office - Manila',
            location: [14.5995, 120.9842],
            description: '<strong>National Headquarters</strong><br>123 Mabini Street, Ermita, Manila<br>Tel: (02) 8123-4567<br>Email: info@bayanihanrelief.org'
        },
        {
            name: 'Luzon Regional Office',
            location: [14.6760, 121.0437],
            description: '<strong>Quezon City Office</strong><br>456 Commonwealth Avenue<br>Tel: (02) 8234-5678<br>Email: luzon@bayanihanrelief.org'
        },
        {
            name: 'Visayas Regional Office',
            location: [10.3157, 123.8854],
            description: '<strong>Cebu City Office</strong><br>789 Osmeña Boulevard<br>Tel: (032) 234-5678<br>Email: visayas@bayanihanrelief.org'
        },
        {
            name: 'Mindanao Regional Office',
            location: [7.1907, 125.4553],
            description: '<strong>Davao City Office</strong><br>321 J.P. Laurel Avenue<br>Tel: (082) 234-5678<br>Email: mindanao@bayanihanrelief.org'
        }
    ];

    regionalOffices.forEach(office => {
        L.marker(office.location, { icon: regionalIcon })
            .addTo(map)
            .bindPopup(`<div style="font-size:14px;"><h4 style="margin:0 0 10px 0; color:#2c3e50;">${office.name}</h4><p style="margin:0;">${office.description}</p></div>`);
    });

    // Active Relief Operations (Blue markers)
    const operations = [
        {
            name: 'Typhoon Sakura Relief',
            location: [17.6132, 121.7270],
            description: '<strong>Emergency Response</strong><br>Northern Luzon<br>Status: Active<br>15,847 families assisted'
        },
        {
            name: 'Mobile Health Caravan',
            location: [11.2588, 125.0111],
            description: '<strong>Health Services</strong><br>Eastern Visayas<br>Status: Ongoing<br>Medical missions in remote barangays'
        },
        {
            name: 'Livelihood Training Center',
            location: [14.5547, 121.0244],
            description: '<strong>Development Program</strong><br>Mandaluyong, Metro Manila<br>Status: Active<br>Skills training for 200 beneficiaries'
        },
        {
            name: 'Flood Relief Operations',
            location: [14.8515, 120.8165],
            description: '<strong>Emergency Response</strong><br>Bulacan Province<br>Status: Active<br>3,500 families evacuated'
        }
    ];

    operations.forEach(op => {
        L.marker(op.location, { icon: operationsIcon })
            .addTo(map)
            .bindPopup(`<div style="font-size:14px;"><h4 style="margin:0 0 10px 0; color:#2c3e50;">${op.name}</h4><p style="margin:0;">${op.description}</p></div>`);
    });

    // Medical Missions (Green markers)
    const medicalMissions = [
        {
            name: 'Medical Mission - Palawan',
            location: [9.8349, 118.7384],
            description: '<strong>Health Caravan</strong><br>Remote islands, Palawan<br>Schedule: Feb 20-28, 2026<br>Target: 2,000 patients'
        },
        {
            name: 'Dental Mission - Iloilo',
            location: [10.7202, 122.5621],
            description: '<strong>Dental Services</strong><br>Iloilo Province<br>Schedule: Mar 5-12, 2026<br>Free dental care for communities'
        },
        {
            name: 'Blood Drive - Baguio',
            location: [16.4023, 120.5960],
            description: '<strong>Blood Heroes Program</strong><br>Baguio City<br>Schedule: Feb 18, 2026<br>Target: 500 blood units'
        },
        {
            name: 'Medical Mission - Mindoro',
            location: [13.4108, 121.4417],
            description: '<strong>Health Services</strong><br>Mindoro Island<br>Schedule: Mar 15-20, 2026<br>Serving upland communities'
        }
    ];

    medicalMissions.forEach(mission => {
        L.marker(mission.location, { icon: medicalIcon })
            .addTo(map)
            .bindPopup(`<div style="font-size:14px;"><h4 style="margin:0 0 10px 0; color:#2c3e50;">${mission.name}</h4><p style="margin:0;">${mission.description}</p></div>`);
    });
});
