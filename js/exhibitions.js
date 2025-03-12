document.addEventListener('DOMContentLoaded', function() {
    // Load all exhibitions
    loadExhibitions();
    
    // Setup category tabs
    setupCategoryTabs();
    
    // Setup exhibition modal
    setupExhibitionModal();
});

// Load exhibitions from JSON
async function loadExhibitions(category = 'all') {
    const exhibitionsContainer = document.getElementById('exhibitions-container');
    if (!exhibitionsContainer) return;
    
    // Clear container
    exhibitionsContainer.innerHTML = '';
    
    const exhibitions = await fetchData('data/exhibitions.json');
    if (!exhibitions) return;
    
    // Get current date for comparison
    const currentDate = new Date();
    
    // Filter exhibitions based on category
    let filteredExhibitions = exhibitions;
    
    if (category !== 'all') {
        filteredExhibitions = exhibitions.filter(exhibition => {
            const startDate = new Date(exhibition.date);
            const endDate = new Date(exhibition.endDate);
            
            if (category === 'upcoming') {
                return startDate > currentDate;
            } else if (category === 'current') {
                return startDate <= currentDate && endDate >= currentDate;
            } else if (category === 'past') {
                return endDate < currentDate;
            }
            
            return true;
        });
    }
    
    // Display message if no exhibitions found
    if (filteredExhibitions.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = `No ${category} exhibitions found.`;
        exhibitionsContainer.appendChild(noResults);
        return;
    }
    
    // Display exhibitions
    filteredExhibitions.forEach(exhibition => {
        const exhibitionItem = createElement('div', 'exhibition-item');
        exhibitionItem.setAttribute('data-id', exhibition.id);
        
        // Determine exhibition status
        const startDate = new Date(exhibition.date);
        const endDate = new Date(exhibition.endDate);
        let status = '';
        let statusClass = '';
        
        if (startDate > currentDate) {
            status = 'Upcoming';
            statusClass = 'upcoming';
        } else if (startDate <= currentDate && endDate >= currentDate) {
            status = 'Current';
            statusClass = 'current';
        } else {
            status = 'Past';
            statusClass = 'past';
        }
        
        // Create status badge
        const statusBadge = createElement('div', `exhibition-status ${statusClass}`, status);
        
        // Create exhibition image
        const exhibitionImage = createElement('div', 'exhibition-image');
        const img = document.createElement('img');
        img.setAttribute('data-src', exhibition.image);
        img.setAttribute('src', 'images/placeholder.jpg');
        img.setAttribute('alt', exhibition.title);
        exhibitionImage.appendChild(img);
        
        // Create exhibition details
        const exhibitionDetails = createElement('div', 'exhibition-details');
        
        // Format dates
        const formattedStartDate = formatDate(exhibition.date);
        const formattedEndDate = formatDate(exhibition.endDate);
        
        const dateElement = createElement('div', 'exhibition-date');
        const dateIcon = document.createElement('i');
        dateIcon.className = 'fas fa-calendar-alt';
        const dateText = document.createElement('span');
        dateText.textContent = `${formattedStartDate} - ${formattedEndDate}`;
        dateElement.appendChild(dateIcon);
        dateElement.appendChild(dateText);
        
        const title = createElement('h3', 'exhibition-title', exhibition.title);
        
        const location = createElement('div', 'exhibition-location');
        const locationIcon = document.createElement('i');
        locationIcon.className = 'fas fa-map-marker-alt';
        const locationText = document.createElement('span');
        locationText.textContent = exhibition.location;
        location.appendChild(locationIcon);
        location.appendChild(locationText);
        
        const description = createElement('p', 'exhibition-description', truncateText(exhibition.description, 120));
        
        const actions = createElement('div', 'exhibition-actions');
        
        const detailsBtn = createElement('button', 'btn primary-btn', 'View Details');
        detailsBtn.addEventListener('click', () => {
            openExhibitionModal(exhibition);
        });
        
        actions.appendChild(detailsBtn);
        
        exhibitionDetails.appendChild(dateElement);
        exhibitionDetails.appendChild(title);
        exhibitionDetails.appendChild(location);
        exhibitionDetails.appendChild(description);
        exhibitionDetails.appendChild(actions);
        
        exhibitionItem.appendChild(statusBadge);
        exhibitionItem.appendChild(exhibitionImage);
        exhibitionItem.appendChild(exhibitionDetails);
        
        // Add click event to open modal
        exhibitionImage.addEventListener('click', () => {
            openExhibitionModal(exhibition);
        });
        
        title.addEventListener('click', () => {
            openExhibitionModal(exhibition);
        });
        
        exhibitionsContainer.appendChild(exhibitionItem);
    });
    
    // Initialize lazy loading for images
    initLazyLoading();
}

// Setup category tabs
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Load exhibitions for selected category
            const category = tab.getAttribute('data-category');
            loadExhibitions(category);
        });
    });
}

// Setup exhibition modal
function setupExhibitionModal() {
    const modal = document.getElementById('exhibition-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const shareBtn = document.getElementById('share-exhibition-btn');
    const shareOptions = document.getElementById('share-options');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const copySuccessMessage = document.getElementById('copy-success-message');
    
    // Close modal functionality
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Share dropdown functionality
    shareBtn.addEventListener('click', () => {
        shareOptions.classList.toggle('active');
    });
    
    // Close share dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.share-dropdown')) {
            shareOptions.classList.remove('active');
        }
    });
    
    // Copy link functionality
    copyLinkBtn.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            copySuccessMessage.classList.add('show');
            setTimeout(() => {
                copySuccessMessage.classList.remove('show');
            }, 2000);
        });
    });
    
    // RSVP button functionality
    const rsvpBtn = document.getElementById('modal-rsvp-btn');
    rsvpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const exhibitionTitle = document.getElementById('modal-exhibition-title').textContent;
        window.location.href = `contact.html?exhibition=${encodeURIComponent(exhibitionTitle)}`;
    });
}

// Open exhibition modal
function openExhibitionModal(exhibition) {
    const modal = document.getElementById('exhibition-modal');
    
    // Set modal content
    document.getElementById('modal-exhibition-image').src = exhibition.image;
    document.getElementById('modal-exhibition-title').textContent = exhibition.title;
    
    // Format dates
    const formattedStartDate = formatDate(exhibition.date);
    const formattedEndDate = formatDate(exhibition.endDate);
    document.getElementById('modal-exhibition-dates').textContent = `${formattedStartDate} - ${formattedEndDate}`;
    
    document.getElementById('modal-exhibition-location').textContent = exhibition.location;
    document.getElementById('modal-exhibition-description').textContent = exhibition.description;
    
    // Setup share links
    const url = window.location.href;
    document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?url=${url}&text=${exhibition.title}`;
    document.getElementById('share-pinterest').href = `https://pinterest.com/pin/create/button/?url=${url}&media=${exhibition.image}&description=${exhibition.title}`;
    
    // Show or hide RSVP button based on exhibition date
    const rsvpBtn = document.getElementById('modal-rsvp-btn');
    const currentDate = new Date();
    const endDate = new Date(exhibition.endDate);
    
    if (endDate < currentDate) {
        // Past exhibition
        rsvpBtn.style.display = 'none';
    } else {
        rsvpBtn.style.display = 'inline-block';
    }
    
    // Show modal
    modal.classList.add('active');
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Format date function
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
} 