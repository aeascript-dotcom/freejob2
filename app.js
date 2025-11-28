// API Endpoint
const API_URL = 'https://script.google.com/macros/s/AKfycbx9GzgecT2qgwDLMA1hjIS9BNrqTBaA26UkM2cKNvehTHAF32c3d90TuzkSdvZ6Dy0lQQ/exec';

// Global variables
let allActivities = [];
let selectedDate = null;

// DOM Elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const activitiesEl = document.getElementById('activities');
const dateSelectorEl = document.getElementById('dateSelector');
const modalEl = document.getElementById('imageModal');
const modalImageEl = document.getElementById('modalImage');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    createDateButtons();
    fetchActivities();
});

// Create date buttons (26 Dec - 08 Jan)
function createDateButtons() {
    const dates = [
        { day: 26, month: 12 },
        { day: 27, month: 12 },
        { day: 28, month: 12 },
        { day: 29, month: 12 },
        { day: 30, month: 12 },
        { day: 31, month: 12 },
        { day: 1, month: 1 },
        { day: 2, month: 1 },
        { day: 3, month: 1 },
        { day: 4, month: 1 },
        { day: 5, month: 1 },
        { day: 6, month: 1 },
        { day: 7, month: 1 },
        { day: 8, month: 1 }
    ];

    dates.forEach(date => {
        const btn = document.createElement('button');
        btn.className = 'date-btn';
        btn.textContent = String(date.day).padStart(2, '0');
        btn.dataset.day = date.day;
        btn.dataset.month = date.month;
        
        btn.addEventListener('click', () => {
            filterByDate(date.day, date.month);
            
            // Update active state
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        
        dateSelectorEl.appendChild(btn);
    });
}

// Fetch activities from API
async function fetchActivities() {
    try {
        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        loadingEl.classList.add('hidden');
        
        if (!data || data.length === 0) {
            activitiesEl.innerHTML = '<div class="no-data">ไม่มีข้อมูลกิจกรรม</div>';
            return;
        }
        
        allActivities = data;
        displayActivities(data);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
    }
}

// Filter activities by date
function filterByDate(day, month) {
    selectedDate = { day, month };
    
    const filtered = allActivities.filter(activity => {
        const dateStr = activity['วันที่'] || activity.date || ''; 
        
        // Try to parse date and match
        if (dateStr) {
            const activityDate = parseDateString(dateStr);
            if (activityDate && activityDate.day === day && activityDate.month === month) {
                return true;
            }
        }
        
        return false;
    });
    
    if (filtered.length > 0) {
        displayActivities(filtered);
    } else {
        activitiesEl.innerHTML = '<div class="no-data">ไม่มีกิจกรรมในวันนี้</div>';
    }
}

// Parse date string
function parseDateString(dateStr) {
    try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return {
                day: date.getDate(),
                month: date.getMonth() + 1
            };
        }
    } catch (e) {
        // If parsing fails, return null
    }
    return null;
}

// Display activities
function displayActivities(activities) {
    activitiesEl.innerHTML = '';
    
    activities.forEach((activity, index) => {
        const card = createActivityCard(activity, index);
        activitiesEl.appendChild(card);
    });
}

// Create activity card
function createActivityCard(activity, index) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    
    // Extract data
    const number = activity['/'] || activity.number || index + 1;
    const date = activity['วันที่'] || activity.date || '';
    const activityName = activity['activity'] || '';
    const location = activity['location'] || '';
    const picture = activity['picture'] || '';
    const mapUrl = activity['map google'] || activity.map || '';
    const etc = activity['ETC'] || '';
    const detail = activity['detail'] || '';
    
    let cardHTML = '';
    
    // Image container with overlay
    if (picture) {
        cardHTML += `
            <div class="activity-image-container">
                <img src="${picture}" 
                     alt="${activityName}" 
                     class="activity-image"
                     onclick="openModal('${picture}')"
                     onerror="this.parentElement.style.display='none'">
                
                <div class="activity-overlay">
                    ${activityName ? `<h2 class="activity-title">${activityName}</h2>` : ''}
                    ${location ? `<div class="activity-location">📍 ${location}</div>` : ''}
                    ${detail ? `<p class="activity-detail">${detail}</p>` : ''}
                </div>
            </div>
        `;
    } else {
        // No image fallback
        cardHTML += `
            <div class="activity-image-container" style="background: linear-gradient(135deg, #c0c0c0 0%, #e0e0e0 100%); display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; color: #666;">
                    <div style="font-size: 4rem;">📷</div>
                    <p>ไม่มีรูปภาพ</p>
                </div>
            </div>
        `;
        
        if (activityName || location || detail) {
            cardHTML += `
                <div class="activity-overlay">
                    ${activityName ? `<h2 class="activity-title">${activityName}</h2>` : ''}
                    ${location ? `<div class="activity-location">📍 ${location}</div>` : ''}
                    ${detail ? `<p class="activity-detail">${detail}</p>` : ''}
                </div>
            `;
        }
    }
    
    // Bottom info section
    cardHTML += '<div class="activity-info">';
    
    if (date) {
        cardHTML += `<div class="activity-date">📅 ${formatDate(date)}</div>`;
    }
    
    if (etc) {
        cardHTML += `<div class="activity-etc">💰 ${etc}</div>`;
    }
    
    if (mapUrl) {
        cardHTML += `
            <div class="activity-map">
                <a href="${mapUrl}" target="_blank" class="map-link">
                    🗺️ ดูแผนที่
                </a>
            </div>
        `;
    }
    
    cardHTML += '</div>'; // Close activity-info
    
    card.innerHTML = cardHTML;
    return card;
}

// Format date to Thai
function formatDate(dateString) {
    if (!dateString) return '';  
    
    try {
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            return dateString;
        }
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return date.toLocaleDateString('th-TH', options);
    } catch (error) {
        return dateString;
    }
}

// Open image modal
function openModal(imageSrc) {
    modalImageEl.src = imageSrc;
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close image modal
function closeModal() {
    modalEl.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
