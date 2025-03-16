/**
 * Admin Portal JavaScript
 * Main functionality for the admin dashboard
 */

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const themeToggleBtn = document.querySelector('.theme-toggle');
const menuLinks = document.querySelectorAll('.menu-link');
const toastContainer = document.querySelector('.toast-container');

// Initialize Admin Portal
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initSidebar();
    loadDashboardStats();
    setupEventListeners();
});

/**
 * Initialize theme based on saved preference
 */
function initTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('admin-theme') || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
}

/**
 * Initialize sidebar state based on saved preference
 */
function initSidebar() {
    // Check for saved sidebar state
    const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    
    // Don't auto-collapse on mobile
    if (window.innerWidth < 992) {
        sidebar.classList.remove('collapsed');
    } else {
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
    }
    
    // Update toggle icon based on sidebar state - always use fa-bars
    const toggleIcon = document.querySelector('.toggle-sidebar i');
    toggleIcon.classList.remove('fa-times');
    toggleIcon.classList.add('fa-bars');
    
    // Set active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    menuLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop().split('.')[0];
        if (currentPage === linkPage || 
            (currentPage === 'index' && linkPage === 'dashboard')) {
            link.classList.add('active');
        }
    });
}

/**
 * Load dashboard statistics from JSON
 */
function loadDashboardStats() {
    // Only load stats on dashboard page
    if (!document.querySelector('.dashboard')) return;
    
    fetch('../admin/data/dashboard-stats.json')
        .then(response => response.json())
        .then(data => {
            updateStatCards(data);
            updateRecentInquiries();
            updateUpcomingEvents();
        })
        .catch(error => {
            console.error('Error loading dashboard stats:', error);
            showToast('Error', 'Failed to load dashboard statistics', 'error');
        });
}

/**
 * Update stat cards with data from JSON
 */
function updateStatCards(data) {
    // Update artwork stats
    document.getElementById('total-artworks').textContent = data.artworks.total;
    document.getElementById('available-artworks').textContent = data.artworks.available;
    
    // Update event stats
    document.getElementById('total-events').textContent = data.events.total;
    document.getElementById('upcoming-events').textContent = data.events.upcoming;
    
    // Update inquiry stats
    document.getElementById('total-inquiries').textContent = data.inquiries.total;
    document.getElementById('unresolved-inquiries').textContent = data.inquiries.unresolved;
    
    // Update media stats
    document.getElementById('total-media').textContent = data.media.total;
    document.getElementById('recent-media').textContent = data.media.recentlyAdded;
}

/**
 * Load and display recent inquiries
 */
function updateRecentInquiries() {
    fetch('../admin/data/inquiries.json')
        .then(response => response.json())
        .then(data => {
            const inquiriesTable = document.getElementById('recent-inquiries-table');
            if (!inquiriesTable) return;
            
            // Sort by date (newest first) and take first 5
            const recentInquiries = data
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            
            const tableBody = inquiriesTable.querySelector('tbody');
            tableBody.innerHTML = '';
            
            recentInquiries.forEach(inquiry => {
                const row = document.createElement('tr');
                
                const dateCell = document.createElement('td');
                const date = new Date(inquiry.date);
                dateCell.textContent = date.toLocaleDateString();
                
                const nameCell = document.createElement('td');
                nameCell.textContent = inquiry.name;
                
                const subjectCell = document.createElement('td');
                subjectCell.textContent = inquiry.subject;
                
                const statusCell = document.createElement('td');
                const statusBadge = document.createElement('span');
                statusBadge.classList.add('status-badge');
                statusBadge.classList.add(inquiry.resolved ? 'status-resolved' : 'status-pending');
                statusBadge.textContent = inquiry.resolved ? 'Resolved' : 'Pending';
                statusCell.appendChild(statusBadge);
                
                const actionsCell = document.createElement('td');
                actionsCell.classList.add('table-actions');
                
                const viewBtn = document.createElement('button');
                viewBtn.classList.add('text-btn');
                viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
                viewBtn.addEventListener('click', () => viewInquiry(inquiry.id));
                
                const resolveBtn = document.createElement('button');
                resolveBtn.classList.add('text-btn');
                resolveBtn.innerHTML = inquiry.resolved ? 
                    '<i class="fas fa-times"></i>' : 
                    '<i class="fas fa-check"></i>';
                resolveBtn.addEventListener('click', () => toggleInquiryStatus(inquiry.id));
                
                actionsCell.appendChild(viewBtn);
                actionsCell.appendChild(resolveBtn);
                
                row.appendChild(dateCell);
                row.appendChild(nameCell);
                row.appendChild(subjectCell);
                row.appendChild(statusCell);
                row.appendChild(actionsCell);
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading inquiries:', error);
            showToast('Error', 'Failed to load recent inquiries', 'error');
        });
}

/**
 * Load and display upcoming events
 */
function updateUpcomingEvents() {
    fetch('../data/events.json')
        .then(response => response.json())
        .then(data => {
            const eventsTable = document.getElementById('upcoming-events-table');
            if (!eventsTable) return;
            
            // Filter upcoming events and sort by date
            const upcomingEvents = data.events
                .filter(event => event.status === 'upcoming' || event.status === 'current')
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5);
            
            const tableBody = eventsTable.querySelector('tbody');
            tableBody.innerHTML = '';
            
            upcomingEvents.forEach(event => {
                const row = document.createElement('tr');
                
                const dateCell = document.createElement('td');
                const date = new Date(event.date);
                dateCell.textContent = date.toLocaleDateString();
                
                const titleCell = document.createElement('td');
                titleCell.textContent = event.title;
                
                const locationCell = document.createElement('td');
                locationCell.textContent = event.location;
                
                const statusCell = document.createElement('td');
                const statusBadge = document.createElement('span');
                statusBadge.classList.add('status-badge');
                statusBadge.classList.add(`status-${event.status}`);
                statusBadge.textContent = event.status.charAt(0).toUpperCase() + event.status.slice(1);
                statusCell.appendChild(statusBadge);
                
                const actionsCell = document.createElement('td');
                actionsCell.classList.add('table-actions');
                
                const viewBtn = document.createElement('button');
                viewBtn.classList.add('text-btn');
                viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
                viewBtn.addEventListener('click', () => viewEvent(event.id));
                
                const editBtn = document.createElement('button');
                editBtn.classList.add('text-btn');
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.addEventListener('click', () => editEvent(event.id));
                
                actionsCell.appendChild(viewBtn);
                actionsCell.appendChild(editBtn);
                
                row.appendChild(dateCell);
                row.appendChild(titleCell);
                row.appendChild(locationCell);
                row.appendChild(statusCell);
                row.appendChild(actionsCell);
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading events:', error);
            showToast('Error', 'Failed to load upcoming events', 'error');
        });
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Toggle sidebar
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar on overlay click (mobile)
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Toggle theme
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', function(event) {
            if (event.target === this) {
                closeModal(event);
            }
        });
    });
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Update sidebar state on window resize
        if (window.innerWidth < 992) {
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.remove('collapsed');
            }
        }
        
        // Update toggle icon - always use fa-bars
        const toggleIcon = document.querySelector('.toggle-sidebar i');
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
    });
}

/**
 * Toggle sidebar expanded/collapsed state
 */
function toggleSidebar() {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    const toggleIcon = document.querySelector('.toggle-sidebar i');
    
    // Always use fa-bars icon regardless of sidebar state
    toggleIcon.classList.remove('fa-times');
    toggleIcon.classList.add('fa-bars');
    
    // On mobile, handle expanded state differently
    if (window.innerWidth < 992) {
        if (!isCollapsed) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('expanded');
            sidebarOverlay.classList.add('active');
        } else {
            sidebar.classList.remove('expanded');
            sidebarOverlay.classList.remove('active');
        }
    }
    
    // Save preference
    localStorage.setItem('sidebar-collapsed', isCollapsed);
}

/**
 * Close sidebar (mobile only)
 */
function closeSidebar() {
    sidebar.classList.remove('expanded');
    sidebarOverlay.classList.remove('active');
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('admin-theme', isDarkMode ? 'dark' : 'light');
    
    // Update admin settings in JSON
    updateAdminSettings({ theme: isDarkMode ? 'dark' : 'light' });
}

/**
 * Update admin settings in JSON file
 */
function updateAdminSettings(settings) {
    // In a real application, this would be an API call
    // For this demo, we'll just log the settings
    console.log('Settings updated:', settings);
}

/**
 * View inquiry details
 */
function viewInquiry(id) {
    fetch('../admin/data/inquiries.json')
        .then(response => response.json())
        .then(data => {
            const inquiry = data.find(item => item.id === id);
            if (!inquiry) {
                showToast('Error', 'Inquiry not found', 'error');
                return;
            }
            
            // Populate modal with inquiry details
            document.getElementById('inquiry-name').textContent = inquiry.name;
            document.getElementById('inquiry-email').textContent = inquiry.email;
            document.getElementById('inquiry-phone').textContent = inquiry.phone;
            document.getElementById('inquiry-subject').textContent = inquiry.subject;
            document.getElementById('inquiry-message').textContent = inquiry.message;
            document.getElementById('inquiry-date').textContent = new Date(inquiry.date).toLocaleString();
            document.getElementById('inquiry-status').textContent = inquiry.resolved ? 'Resolved' : 'Pending';
            document.getElementById('inquiry-status').className = inquiry.resolved ? 'text-success' : 'text-warning';
            
            // Show the modal
            const modal = document.getElementById('inquiry-modal');
            modal.classList.add('active');
        })
        .catch(error => {
            console.error('Error loading inquiry:', error);
            showToast('Error', 'Failed to load inquiry details', 'error');
        });
}

/**
 * Toggle inquiry resolved status
 */
function toggleInquiryStatus(id) {
    // In a real application, this would be an API call
    // For this demo, we'll just show a success message
    showToast('Success', 'Inquiry status updated', 'success');
    
    // Refresh the inquiries table
    updateRecentInquiries();
}

/**
 * View event details
 */
function viewEvent(id) {
    fetch('../data/events.json')
        .then(response => response.json())
        .then(data => {
            const event = data.events.find(item => item.id === id);
            if (!event) {
                showToast('Error', 'Event not found', 'error');
                return;
            }
            
            // Populate modal with event details
            document.getElementById('event-title').textContent = event.title;
            document.getElementById('event-date').textContent = new Date(event.date).toLocaleDateString();
            document.getElementById('event-time').textContent = event.time;
            document.getElementById('event-location').textContent = event.location;
            document.getElementById('event-description').textContent = event.description;
            document.getElementById('event-category').textContent = event.category;
            document.getElementById('event-status').textContent = event.status.charAt(0).toUpperCase() + event.status.slice(1);
            
            // Show the modal
            const modal = document.getElementById('event-modal');
            modal.classList.add('active');
        })
        .catch(error => {
            console.error('Error loading event:', error);
            showToast('Error', 'Failed to load event details', 'error');
        });
}

/**
 * Edit event
 */
function editEvent(id) {
    // Redirect to event edit page
    window.location.href = `edit-event.html?id=${id}`;
}

/**
 * Close any open modal
 */
function closeModal(event) {
    const modal = event.target.closest('.modal-backdrop');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Show toast notification
 */
function showToast(title, message, type = 'info') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    
    let icon = '';
    switch (type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'times-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        default:
            icon = 'info-circle';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
        <div class="toast-progress"></div>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Animate progress bar
    const progressBar = toast.querySelector('.toast-progress');
    progressBar.style.width = '100%';
    progressBar.style.animation = 'progress 5s linear forwards';
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Artwork Management Functions
function loadArtworks() {
    fetch('../data/artworks.json')
        .then(response => response.json())
        .then(data => {
            renderArtworkGrid(data);
        })
        .catch(error => {
            console.error('Error loading artworks:', error);
            showToast('Error', 'Failed to load artworks', 'error');
        });
}

function renderArtworkGrid(artworks) {
    const artworkGrid = document.querySelector('.artwork-grid');
    if (!artworkGrid) return;
    
    artworkGrid.innerHTML = '';
    
    artworks.forEach(artwork => {
        const artworkCard = document.createElement('div');
        artworkCard.classList.add('artwork-card');
        
        const statusClass = artwork.available ? 'status-available' : 'status-sold';
        const statusText = artwork.available ? 'Available' : 'Sold';
        
        artworkCard.innerHTML = `
            <div class="artwork-image">
                <img src="../${artwork.image}" alt="${artwork.title}">
                <span class="artwork-status ${statusClass}">${statusText}</span>
            </div>
            <div class="artwork-details">
                <h3 class="artwork-title">${artwork.title}</h3>
                <div class="artwork-meta">${artwork.medium}, ${artwork.year}</div>
                <div class="artwork-price">₹${artwork.price.toLocaleString()}</div>
                <div class="artwork-actions">
                    <button class="text-btn" onclick="viewArtwork(${artwork.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-btn" onclick="editArtwork(${artwork.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-btn text-danger" onclick="deleteArtwork(${artwork.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        artworkGrid.appendChild(artworkCard);
    });
}

function viewArtwork(id) {
    fetch('../data/artworks.json')
        .then(response => response.json())
        .then(data => {
            const artwork = data.find(item => item.id === id);
            if (!artwork) {
                showToast('Error', 'Artwork not found', 'error');
                return;
            }
            
            // Populate modal with artwork details
            document.getElementById('artwork-title').textContent = artwork.title;
            document.getElementById('artwork-image').src = `../${artwork.image}`;
            document.getElementById('artwork-description').textContent = artwork.description;
            document.getElementById('artwork-medium').textContent = artwork.medium;
            document.getElementById('artwork-dimensions').textContent = artwork.dimensions;
            document.getElementById('artwork-year').textContent = artwork.year;
            document.getElementById('artwork-price').textContent = `₹${artwork.price.toLocaleString()}`;
            document.getElementById('artwork-status').textContent = artwork.available ? 'Available' : 'Sold';
            document.getElementById('artwork-status').className = artwork.available ? 'text-success' : 'text-danger';
            
            // Show the modal
            const modal = document.getElementById('artwork-modal');
            modal.classList.add('active');
        })
        .catch(error => {
            console.error('Error loading artwork:', error);
            showToast('Error', 'Failed to load artwork details', 'error');
        });
}

function editArtwork(id) {
    // Redirect to artwork edit page
    window.location.href = `edit-artwork.html?id=${id}`;
}

function deleteArtwork(id) {
    if (confirm('Are you sure you want to delete this artwork?')) {
        // In a real application, this would be an API call
        // For this demo, we'll just show a success message
        showToast('Success', 'Artwork deleted successfully', 'success');
        
        // Refresh the artworks grid
        loadArtworks();
    }
}

// Media Management Functions
function loadMedia() {
    fetch('../data/media.json')
        .then(response => response.json())
        .then(data => {
            renderMediaTabs(data);
        })
        .catch(error => {
            console.error('Error loading media:', error);
            showToast('Error', 'Failed to load media', 'error');
        });
}

function renderMediaTabs(data) {
    // Implementation depends on the media page structure
    console.log('Media data loaded:', data);
}

// Event Management Functions
function loadEvents() {
    fetch('../data/events.json')
        .then(response => response.json())
        .then(data => {
            renderEventsTabs(data);
        })
        .catch(error => {
            console.error('Error loading events:', error);
            showToast('Error', 'Failed to load events', 'error');
        });
}

function renderEventsTabs(data) {
    // Implementation depends on the events page structure
    console.log('Events data loaded:', data);
}

// Inquiries Management Functions
function loadInquiries() {
    fetch('../admin/data/inquiries.json')
        .then(response => response.json())
        .then(data => {
            renderInquiriesTable(data);
        })
        .catch(error => {
            console.error('Error loading inquiries:', error);
            showToast('Error', 'Failed to load inquiries', 'error');
        });
}

function renderInquiriesTable(inquiries) {
    const inquiriesTable = document.getElementById('inquiries-table');
    if (!inquiriesTable) return;
    
    const tableBody = inquiriesTable.querySelector('tbody');
    tableBody.innerHTML = '';
    
    inquiries.forEach(inquiry => {
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        const date = new Date(inquiry.date);
        dateCell.textContent = date.toLocaleDateString();
        
        const nameCell = document.createElement('td');
        nameCell.textContent = inquiry.name;
        
        const emailCell = document.createElement('td');
        emailCell.textContent = inquiry.email;
        
        const subjectCell = document.createElement('td');
        subjectCell.textContent = inquiry.subject;
        
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.classList.add('status-badge');
        statusBadge.classList.add(inquiry.resolved ? 'status-resolved' : 'status-pending');
        statusBadge.textContent = inquiry.resolved ? 'Resolved' : 'Pending';
        statusCell.appendChild(statusBadge);
        
        const actionsCell = document.createElement('td');
        actionsCell.classList.add('table-actions');
        
        const viewBtn = document.createElement('button');
        viewBtn.classList.add('text-btn');
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.addEventListener('click', () => viewInquiry(inquiry.id));
        
        const resolveBtn = document.createElement('button');
        resolveBtn.classList.add('text-btn');
        resolveBtn.innerHTML = inquiry.resolved ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-check"></i>';
        resolveBtn.addEventListener('click', () => toggleInquiryStatus(inquiry.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('text-btn', 'text-danger');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteInquiry(inquiry.id));
        
        actionsCell.appendChild(viewBtn);
        actionsCell.appendChild(resolveBtn);
        actionsCell.appendChild(deleteBtn);
        
        row.appendChild(dateCell);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(subjectCell);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);
        
        tableBody.appendChild(row);
    });
}

function deleteInquiry(id) {
    if (confirm('Are you sure you want to delete this inquiry?')) {
        // In a real application, this would be an API call
        // For this demo, we'll just show a success message
        showToast('Success', 'Inquiry deleted successfully', 'success');
        
        // Refresh the inquiries table
        loadInquiries();
    }
}

// Settings Management
function loadSettings() {
    fetch('../admin/data/admin-settings.json')
        .then(response => response.json())
        .then(data => {
            populateSettingsForm(data);
        })
        .catch(error => {
            console.error('Error loading settings:', error);
            showToast('Error', 'Failed to load settings', 'error');
        });
}

function populateSettingsForm(settings) {
    // Theme settings
    document.getElementById('theme-preference').value = settings.theme;
    
    // Notification settings
    document.getElementById('notifications-enabled').checked = settings.notificationsEnabled;
    
    // Auto-save settings
    document.getElementById('auto-save').checked = settings.autoSave;
    
    // Dashboard widget settings
    document.getElementById('show-artwork-stats').checked = settings.dashboardWidgets.artworkStats;
    document.getElementById('show-recent-inquiries').checked = settings.dashboardWidgets.recentInquiries;
    document.getElementById('show-upcoming-events').checked = settings.dashboardWidgets.upcomingEvents;
    document.getElementById('show-media-stats').checked = settings.dashboardWidgets.mediaStats;
    
    // Customization settings
    document.getElementById('primary-color').value = settings.customization.primaryColor;
    document.getElementById('accent-color').value = settings.customization.accentColor;
    document.getElementById('font-family').value = settings.customization.fontFamily;
    document.getElementById('header-style').value = settings.customization.headerStyle;
    
    // Profile settings
    document.getElementById('admin-name').value = settings.profile.name;
    document.getElementById('admin-email').value = settings.profile.email;
}

function saveSettings(event) {
    event.preventDefault();
    
    const settings = {
        theme: document.getElementById('theme-preference').value,
        notificationsEnabled: document.getElementById('notifications-enabled').checked,
        autoSave: document.getElementById('auto-save').checked,
        dashboardWidgets: {
            artworkStats: document.getElementById('show-artwork-stats').checked,
            recentInquiries: document.getElementById('show-recent-inquiries').checked,
            upcomingEvents: document.getElementById('show-upcoming-events').checked,
            mediaStats: document.getElementById('show-media-stats').checked
        },
        customization: {
            primaryColor: document.getElementById('primary-color').value,
            accentColor: document.getElementById('accent-color').value,
            fontFamily: document.getElementById('font-family').value,
            headerStyle: document.getElementById('header-style').value
        },
        profile: {
            name: document.getElementById('admin-name').value,
            email: document.getElementById('admin-email').value,
            // Keep other profile fields unchanged
            avatar: 'images/admin-avatar.jpg',
            role: 'Administrator',
            lastLogin: new Date().toISOString()
        }
    };
    
    // In a real application, this would be an API call
    // For this demo, we'll just show a success message
    console.log('Settings to save:', settings);
    showToast('Success', 'Settings saved successfully', 'success');
    
    // Apply theme change immediately
    document.body.classList.toggle('dark-mode', settings.theme === 'dark');
    localStorage.setItem('admin-theme', settings.theme);
}

// Search functionality
function searchItems(query, type) {
    if (!query) return;
    
    // Redirect to appropriate search page
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}&type=${type}`;
} 