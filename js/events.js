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
            window.eventsData = data.events;
            
            // Populate the events grid
            populateEvents(window.eventsData);
        })
        .catch(error => {
            console.error('Error loading events data:', error);
            // Use fallback data if fetch fails
            window.eventsData = getFallbackEventsData();
            populateEvents(window.eventsData);
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
    const eventsGrid = document.getElementById('events-grid');
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
    
    // Sort events by date (newest first for upcoming/current, oldest first for past)
    events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (a.status === 'past' && b.status === 'past') {
            return dateB - dateA; // Most recent past events first
        } else if (a.status !== 'past' && b.status !== 'past') {
            return dateA - dateB; // Soonest upcoming/current events first
        } else {
            return a.status === 'past' ? 1 : -1; // Upcoming/current before past
        }
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
                ${event.status !== 'past' ? 
                    `<a href="${event.registrationLink}" class="btn primary-btn" target="_blank">Register <i class="fas fa-arrow-right"></i></a>` : 
                    `<button class="btn primary-btn gallery-btn">Gallery <i class="fas fa-images"></i></button>`
                }
                <button class="btn secondary-btn details-btn">Details <i class="fas fa-info-circle"></i></button>
            </div>
        </div>
    `;
    
    // Add event listener to open modal when clicking on the card
    eventCard.addEventListener('click', function(e) {
        // Don't open modal if clicking on register link
        if (e.target.classList.contains('primary-btn') || 
            e.target.parentElement.classList.contains('primary-btn')) {
            if (!e.target.classList.contains('gallery-btn') && 
                !e.target.parentElement.classList.contains('gallery-btn')) {
                return;
            }
        }
        
        openEventModal(event);
    });
    
    return eventCard;
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
    modalDescription.innerHTML = `<p>${event.description}</p>`;
    
    // Show/hide register button based on event status
    if (event.status !== 'past') {
        modalRegister.style.display = 'inline-flex';
        modalRegister.href = event.registrationLink;
    } else {
        modalRegister.style.display = 'none';
    }
    
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
function filterEvents(filter) {
    let filteredEvents = window.eventsData;
    
    if (filter !== 'all') {
        filteredEvents = window.eventsData.filter(event => event.status === filter);
    }
    
    populateEvents(filteredEvents);
}

// Function to set up event listeners
function setupEventListeners() {
    // Category tab filters
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter events based on tab
            const filter = this.dataset.filter;
            filterEvents(filter);
        });
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