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
            // Store the events data
            window.eventsData = data.events.filter(event => event.status !== 'past');
            
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
            "id": 2,
            "title": "Workshop: Traditional Indian Painting Techniques",
            "date": "2024-03-20",
            "endDate": "2024-03-22",
            "time": "10:00 AM - 4:00 PM",
            "location": "Santiniketan Art School",
            "address": "Bolpur, West Bengal",
            "description": "A three-day intensive workshop led by Suhas Roy, focusing on traditional Indian painting techniques. Participants will learn about materials, pigments, brushwork, and composition while creating their own artwork under the guidance of the master artist.",
            "image": "https://via.placeholder.com/800x500?text=Workshop:+Traditional+Indian+Painting+Techniques",
            "category": "Workshop",
            "status": "current",
            "ticketInfo": "₹5,000 for all three days (materials included)",
            "registrationLink": "#"
        },
        {
            "id": 3,
            "title": "Live Painting Demonstration",
            "date": "2024-04-10",
            "time": "3:00 PM - 5:00 PM",
            "location": "Jehangir Art Gallery",
            "address": "M.G. Road, Kala Ghoda, Mumbai",
            "description": "Witness Suhas Roy's creative process in real-time as he demonstrates his unique painting techniques. This rare opportunity allows art enthusiasts to observe the master at work, with a Q&A session following the demonstration.",
            "image": "https://via.placeholder.com/800x500?text=Live+Painting+Demonstration",
            "category": "Demonstration",
            "status": "upcoming",
            "ticketInfo": "₹1,000 per person",
            "registrationLink": "#"
        },
        {
            "id": 4,
            "title": "Art and Spirituality: A Conversation",
            "date": "2024-05-18",
            "time": "5:30 PM - 7:30 PM",
            "location": "India International Centre",
            "address": "40 Max Mueller Marg, New Delhi",
            "description": "Suhas Roy joins philosopher Dr. Raman Sharma for a thought-provoking conversation on the intersection of art and spirituality. The discussion will explore how spiritual practices influence artistic expression and how art can serve as a medium for spiritual exploration.",
            "image": "https://via.placeholder.com/800x500?text=Art+and+Spirituality:+A+Conversation",
            "category": "Talk",
            "status": "upcoming",
            "ticketInfo": "Free entry with registration",
            "registrationLink": "#"
        },
        {
            "id": 5,
            "title": "Children's Art Workshop: Exploring Colors and Emotions",
            "date": "2024-06-05",
            "time": "11:00 AM - 1:00 PM",
            "location": "Kala Bhavan",
            "address": "Santiniketan, West Bengal",
            "description": "A special workshop designed for children aged 8-14, where Suhas Roy will guide young artists in exploring the relationship between colors and emotions. Children will create their own expressive artworks while learning fundamental artistic concepts.",
            "image": "https://via.placeholder.com/800x500?text=Children's+Art+Workshop",
            "category": "Workshop",
            "status": "upcoming",
            "ticketInfo": "₹500 per child (materials included)",
            "registrationLink": "#"
        }
    ];
}

// Function to populate events grid
function populateEvents(events) {
    const eventsGrid = document.getElementById('current-events-grid');
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
    
    // Sort events by date (soonest first)
    events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
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
    
    // Extract month for filtering
    const eventDate = new Date(event.date);
    const month = eventDate.toLocaleString('default', { month: 'long' });
    eventCard.dataset.month = month.toLowerCase();
    
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
                <a href="${event.registrationLink}" class="btn primary-btn" target="_blank">Register <i class="fas fa-arrow-right"></i></a>
                <button class="btn secondary-btn details-btn">Details <i class="fas fa-info-circle"></i></button>
            </div>
        </div>
    `;
    
    // Add event listener to open modal when clicking on the card
    eventCard.addEventListener('click', function(e) {
        // Don't open modal if clicking on register link
        if (e.target.classList.contains('primary-btn') || 
            e.target.parentElement.classList.contains('primary-btn')) {
            return;
        }
        
        openEventModal(event);
    });
    
    return eventCard;
}

// Function to populate filter options
function populateFilterOptions(events) {
    const categoryFilter = document.getElementById('category-filter');
    const monthFilter = document.getElementById('month-filter');
    
    // Get unique categories
    const categories = [...new Set(events.map(event => event.category))];
    
    // Get unique months
    const months = [...new Set(events.map(event => {
        const date = new Date(event.date);
        return date.toLocaleString('default', { month: 'long' });
    }))];
    
    // Sort months chronologically
    const monthOrder = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Add month options
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month.toLowerCase();
        option.textContent = month;
        monthFilter.appendChild(option);
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
    const modalRegister = document.getElementById('modal-event-register');
    
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
    modalDescription.innerHTML = `
        <p>${event.description}</p>
        ${event.status === 'current' ? 
            `<div class="event-highlight">
                <p><strong>Don't miss out!</strong> This event is currently running. Secure your spot today.</p>
            </div>` : 
            `<div class="event-highlight">
                <p><strong>Coming soon!</strong> Mark your calendar and register early to ensure your participation.</p>
            </div>`
        }
    `;
    
    // Set register button link
    modalRegister.href = event.registrationLink;
    
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
    const monthFilter = document.getElementById('month-filter').value;
    const searchInput = document.getElementById('search-events').value.toLowerCase();
    
    const eventCards = document.querySelectorAll('.event-card');
    let visibleCount = 0;
    
    eventCards.forEach(card => {
        const category = card.dataset.category;
        const month = card.dataset.month;
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.event-description').textContent.toLowerCase();
        
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        const matchesMonth = monthFilter === 'all' || month === monthFilter;
        const matchesSearch = searchInput === '' || 
                             title.includes(searchInput) || 
                             description.includes(searchInput);
        
        if (matchesCategory && matchesMonth && matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const eventsGrid = document.getElementById('current-events-grid');
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
    const monthFilter = document.getElementById('month-filter');
    const searchInput = document.getElementById('search-events');
    const searchBtn = document.getElementById('search-btn');
    
    categoryFilter.addEventListener('change', filterEvents);
    monthFilter.addEventListener('change', filterEvents);
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
            const shareText = `Check out this event: ${eventTitle} at Suhas Roy's website`;
            
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
} 