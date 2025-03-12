document.addEventListener('DOMContentLoaded', function() {
    // Load events data
    loadEventsData();

    // Set up event listeners
    setupEventListeners();
});

// Function to load events data
function loadEventsData() {
    fetch('data/events.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store the events data (only past events)
            window.eventsData = data.events.filter(event => event.status === 'past');
            
            // Populate the events grid
            populateEvents(window.eventsData);
            
            // Populate filter options
            populateFilterOptions(window.eventsData);
        })
        .catch(error => {
            console.error('Error loading events data:', error);
            // Use fallback data if fetch fails
            window.eventsData = getFallbackEventsData();
            populateEvents(window.eventsData);
            populateFilterOptions(window.eventsData);
        });
}

// Function to get fallback events data if JSON fetch fails
function getFallbackEventsData() {
    return [
        {
            "id": 1,
            "title": "Artist Talk: The Journey of Suhas Roy",
            "date": "2023-12-15",
            "time": "6:00 PM - 8:00 PM",
            "location": "National Gallery of Modern Art",
            "address": "Jaipur House, India Gate, New Delhi",
            "description": "Join us for an intimate evening with Suhas Roy as he discusses his artistic journey spanning over five decades. From his early influences to his evolution as one of India's most distinguished artists, this talk will provide insights into his creative process and philosophy.",
            "image": "https://via.placeholder.com/800x500?text=Artist+Talk:+The+Journey+of+Suhas+Roy",
            "category": "Talk",
            "status": "past",
            "ticketInfo": "Free entry with registration",
            "registrationLink": "#"
        },
        {
            "id": 7,
            "title": "Art History Lecture: Bengal School and Its Legacy",
            "date": "2023-11-08",
            "time": "4:00 PM - 6:00 PM",
            "location": "Lalit Kala Akademi",
            "address": "Rabindra Bhavan, 35 Ferozeshah Road, New Delhi",
            "description": "Suhas Roy presents a lecture on the Bengal School of Art and its enduring legacy in contemporary Indian art. The talk will explore the historical context, key figures, and stylistic elements of this influential movement, with a focus on how it continues to shape artistic practices today.",
            "image": "https://via.placeholder.com/800x500?text=Art+History+Lecture:+Bengal+School+and+Its+Legacy",
            "category": "Lecture",
            "status": "past",
            "ticketInfo": "Free entry with registration",
            "registrationLink": "#"
        },
        {
            "id": 8,
            "title": "Open Studio Day",
            "date": "2023-09-25",
            "time": "11:00 AM - 4:00 PM",
            "location": "Suhas Roy Studio",
            "address": "Santiniketan, West Bengal",
            "description": "A rare opportunity to visit Suhas Roy's personal studio in Santiniketan. Visitors will get a glimpse into the artist's working environment, view works in progress, and engage in informal conversations about his artistic process. Limited spots available.",
            "image": "https://via.placeholder.com/800x500?text=Open+Studio+Day",
            "category": "Open Studio",
            "status": "past",
            "ticketInfo": "₹200 per person",
            "registrationLink": "#"
        }
    ];
}

// Function to populate events grid
function populateEvents(events) {
    const eventsGrid = document.getElementById('past-events-grid');
    const noResults = document.getElementById('no-results');
    
    // Clear existing content
    eventsGrid.innerHTML = '';
    
    if (events.length === 0) {
        eventsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    eventsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    // Sort events by date (most recent first)
    events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    
    // Create event cards
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

// Function to create an event card
function createEventCard(event) {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.dataset.id = event.id;
    eventCard.dataset.category = event.category.toLowerCase();
    
    // Extract year for filtering
    const eventDate = new Date(event.date);
    const year = eventDate.getFullYear().toString();
    eventCard.dataset.year = year;
    
    // Format date for display
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create end date string if available
    let dateString = formattedDate;
    if (event.endDate) {
        const endDate = new Date(event.endDate);
        const formattedEndDate = endDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateString = `${formattedDate} - ${formattedEndDate}`;
    }
    
    // Get image URL (use placeholder if not available)
    const imageUrl = event.image && event.image.startsWith('http') 
        ? event.image 
        : `https://via.placeholder.com/800x500?text=${encodeURIComponent(event.title)}`;
    
    // Create HTML structure for the event card
    eventCard.innerHTML = `
        <div class="event-image">
            <img src="${imageUrl}" alt="${event.title}">
            <div class="event-status status-${event.status}">${event.status}</div>
        </div>
        <div class="event-details">
            <h3>${event.title}</h3>
            <div class="event-info">
                <div class="info-item">
                    <i class="far fa-calendar-alt"></i>
                    <span>${dateString}</span>
                </div>
                <div class="info-item">
                    <i class="far fa-clock"></i>
                    <span>${event.time}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
            </div>
            <div class="event-description">${event.description}</div>
            <div class="event-actions">
                <button class="btn primary-btn gallery-btn">Gallery <i class="fas fa-images"></i></button>
                <button class="btn secondary-btn details-btn">Details <i class="fas fa-info-circle"></i></button>
            </div>
        </div>
    `;
    
    // Add event listener to open modal when clicking on the card
    eventCard.addEventListener('click', function(e) {
        openEventModal(event);
    });
    
    return eventCard;
}

// Function to populate filter options
function populateFilterOptions(events) {
    const categoryFilter = document.getElementById('category-filter');
    const yearFilter = document.getElementById('year-filter');
    
    // Get unique categories
    const categories = [...new Set(events.map(event => event.category))];
    
    // Get unique years
    const years = [...new Set(events.map(event => {
        const date = new Date(event.date);
        return date.getFullYear();
    }))];
    
    // Sort years in descending order (most recent first)
    years.sort((a, b) => b - a);
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Add year options
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// Function to open event modal
function openEventModal(event) {
    const modal = document.querySelector('.event-modal');
    const modalImage = document.getElementById('modal-event-image');
    const modalTitle = document.getElementById('modal-event-title');
    const modalDate = document.getElementById('modal-event-date');
    const modalTime = document.getElementById('modal-event-time');
    const modalLocation = document.getElementById('modal-event-location');
    const modalTicket = document.getElementById('modal-event-ticket');
    const modalDescription = document.getElementById('modal-event-description');
    
    // Format date for display
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create end date string if available
    let dateString = formattedDate;
    if (event.endDate) {
        const endDate = new Date(event.endDate);
        const formattedEndDate = endDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateString = `${formattedDate} - ${formattedEndDate}`;
    }
    
    // Get image URL (use placeholder if not available)
    const imageUrl = event.image && event.image.startsWith('http') 
        ? event.image 
        : `https://via.placeholder.com/800x500?text=${encodeURIComponent(event.title)}`;
    
    // Set modal content
    modalImage.src = imageUrl;
    modalImage.alt = event.title;
    modalTitle.textContent = event.title;
    modalDate.textContent = dateString;
    modalTime.textContent = event.time;
    modalLocation.textContent = `${event.location}, ${event.address}`;
    modalTicket.textContent = event.ticketInfo;
    
    // Add event description with additional past event highlights
    modalDescription.innerHTML = `
        <p>${event.description}</p>
        <div class="past-event-highlights">
            <h4>Event Highlights</h4>
            <p>This event has concluded. It featured ${event.title.toLowerCase()} with Suhas Roy at ${event.location}. 
            The event was well-received by attendees and contributed to the appreciation of Suhas Roy's artistic legacy.</p>
            <p>Photos and reviews from this event are available in our archives. Contact us for more information.</p>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'block';
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

// Function to close event modal
function closeEventModal() {
    const modal = document.querySelector('.event-modal');
    modal.style.display = 'none';
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Function to filter events
function filterEvents() {
    const categoryFilter = document.getElementById('category-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const searchInput = document.getElementById('search-events').value.toLowerCase();
    
    const eventCards = document.querySelectorAll('.event-card');
    let visibleCount = 0;
    
    eventCards.forEach(card => {
        const category = card.dataset.category;
        const year = card.dataset.year;
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.event-description').textContent.toLowerCase();
        
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        const matchesYear = yearFilter === 'all' || year === yearFilter;
        const matchesSearch = searchInput === '' || 
                             title.includes(searchInput) || 
                             description.includes(searchInput);
        
        if (matchesCategory && matchesYear && matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const eventsGrid = document.getElementById('past-events-grid');
    const noResults = document.getElementById('no-results');
    
    if (visibleCount === 0) {
        eventsGrid.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        eventsGrid.style.display = 'grid';
        noResults.style.display = 'none';
    }
}

// Function to set up event listeners
function setupEventListeners() {
    // Filter change events
    const categoryFilter = document.getElementById('category-filter');
    const yearFilter = document.getElementById('year-filter');
    const searchInput = document.getElementById('search-events');
    const searchBtn = document.getElementById('search-btn');
    
    categoryFilter.addEventListener('change', filterEvents);
    yearFilter.addEventListener('change', filterEvents);
    searchBtn.addEventListener('click', filterEvents);
    
    // Search on enter key
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterEvents();
        }
    });
    
    // Close modal when clicking on close button or outside the modal content
    const modal = document.querySelector('.event-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', closeEventModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeEventModal();
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeEventModal();
        }
    });
    
    // Share button functionality
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const eventTitle = document.getElementById('modal-event-title').textContent;
            const shareText = `Check out this past event: ${eventTitle} at Suhas Roy's website`;
            
            if (navigator.share) {
                navigator.share({
                    title: eventTitle,
                    text: shareText,
                    url: window.location.href
                })
                .catch(error => console.error('Error sharing:', error));
            } else {
                // Fallback for browsers that don't support Web Share API
                alert('Copy this link to share: ' + window.location.href);
            }
        });
    }
    
    // Gallery button functionality
    const galleryBtn = document.querySelector('.gallery-btn');
    if (galleryBtn) {
        galleryBtn.addEventListener('click', function() {
            alert('Event gallery feature coming soon!');
        });
    }
} 