document.addEventListener('DOMContentLoaded', function() {
    // Load featured artworks
    loadFeaturedArtworks();
    
    // Load upcoming exhibitions
    loadUpcomingExhibitions();
    
    // Load testimonials
    loadTestimonials();
    
    // Load other artists
    loadOtherArtists();
    
    // Setup testimonial navigation
    setupTestimonialNavigation();
});

// Load featured artworks from JSON
async function loadFeaturedArtworks() {
    const artworksContainer = document.getElementById('featured-artworks-container');
    if (!artworksContainer) return;
    
    const artworks = await fetchData('data/featured-artworks.json');
    if (!artworks) return;
    
    // Display only the first 3 artworks
    artworks.slice(0, 3).forEach(artwork => {
        const artworkItem = createElement('div', 'artwork-item');
        
        const artworkImage = createElement('div', 'artwork-image');
        const img = document.createElement('img');
        img.setAttribute('data-src', artwork.image);
        img.setAttribute('src', 'images/placeholder.jpg');
        img.setAttribute('alt', artwork.title);
        
        // Add click event to open artwork modal
        artworkImage.addEventListener('click', () => {
            openArtworkModal(artwork);
        });
        
        artworkImage.appendChild(img);
        
        const artworkDetails = createElement('div', 'artwork-details');
        
        const title = createElement('h3', 'artwork-title', artwork.title);
        const description = createElement('p', 'artwork-description', artwork.description);
        
        const artworkMeta = createElement('div', 'artwork-meta');
        const price = createElement('span', 'artwork-price', formatCurrency(artwork.price));
        
        const statusClass = artwork.available ? 'artwork-status available' : 'artwork-status sold';
        const statusText = artwork.available ? 'Available' : 'Sold';
        const status = createElement('span', statusClass, statusText);
        
        artworkMeta.appendChild(price);
        artworkMeta.appendChild(status);
        
        const inquiryBtn = createElement('button', 'btn secondary-btn', 'Inquire');
        inquiryBtn.addEventListener('click', () => {
            const modal = document.getElementById('inquiry-modal');
            const artworkCodeSpan = document.getElementById('inquiry-artwork-code');
            artworkCodeSpan.textContent = artwork.id;
            modal.classList.add('active');
        });
        
        artworkDetails.appendChild(title);
        artworkDetails.appendChild(description);
        artworkDetails.appendChild(artworkMeta);
        artworkDetails.appendChild(inquiryBtn);
        
        artworkItem.appendChild(artworkImage);
        artworkItem.appendChild(artworkDetails);
        
        artworksContainer.appendChild(artworkItem);
    });

    // Setup inquiry modal functionality
    setupInquiryModal();
    
    // Setup artwork modal functionality
    setupArtworkModal();
}

// Setup inquiry modal
function setupInquiryModal() {
    const modal = document.getElementById('inquiry-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const inquiryForm = document.getElementById('inquiry-form');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(inquiryForm);
        const artworkCode = document.getElementById('inquiry-artwork-code').textContent;
        
        formData.append('artworkCode', artworkCode);
        
        // Reset form and close modal
        inquiryForm.reset();
        modal.classList.remove('active');
        
        // Show success message
        alert('Thank you for your inquiry. We will get back to you soon.');
    });
}

// Setup artwork modal
function setupArtworkModal() {
    const modal = document.getElementById('artwork-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const inquiryBtn = document.getElementById('inquiry-btn');
    const shareBtn = document.getElementById('share-artwork-btn');
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

    // Image controls functionality
    let scale = 1;
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const modalImage = document.querySelector('.modal-image');
    const image = document.getElementById('modal-artwork-image');

    zoomInBtn.addEventListener('click', () => {
        scale = Math.min(scale + 0.2, 3);
        image.style.transform = `scale(${scale})`;
    });

    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(scale - 0.2, 1);
        image.style.transform = `scale(${scale})`;
    });

    fullscreenBtn.addEventListener('click', () => {
        modalImage.classList.toggle('fullscreen');
        const icon = fullscreenBtn.querySelector('i');
        icon.classList.toggle('fa-expand');
        icon.classList.toggle('fa-compress');
    });

    // Connect inquiry button to inquiry modal
    inquiryBtn.addEventListener('click', () => {
        const artworkCode = document.getElementById('modal-artwork-code').textContent;
        const inquiryModal = document.getElementById('inquiry-modal');
        const inquiryArtworkCode = document.getElementById('inquiry-artwork-code');
        
        inquiryArtworkCode.textContent = artworkCode;
        modal.classList.remove('active');
        inquiryModal.classList.add('active');
    });
}

// Open artwork modal with artwork data
function openArtworkModal(artwork) {
    const modal = document.getElementById('artwork-modal');
    
    // Set modal content
    document.getElementById('modal-artwork-image').src = artwork.image;
    document.getElementById('modal-artwork-title').textContent = artwork.title;
    document.getElementById('modal-artwork-code').textContent = artwork.id;
    document.getElementById('modal-artwork-year').textContent = artwork.year;
    document.getElementById('modal-artwork-medium').textContent = artwork.medium;
    document.getElementById('modal-artwork-dimensions').textContent = artwork.dimensions;
    document.getElementById('modal-artwork-category').textContent = artwork.category;
    document.getElementById('modal-artwork-price').textContent = formatCurrency(artwork.price);
    
    const availabilityElement = document.getElementById('modal-artwork-availability');
    availabilityElement.textContent = artwork.available ? 'Available' : 'Sold';
    availabilityElement.className = artwork.available ? 'artwork-availability available' : 'artwork-availability sold';
    
    document.getElementById('modal-artwork-description').textContent = artwork.description;
    
    // Setup share links
    const url = window.location.href;
    document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?url=${url}&text=${artwork.title}`;
    document.getElementById('share-pinterest').href = `https://pinterest.com/pin/create/button/?url=${url}&media=${artwork.image}&description=${artwork.title}`;
    
    // Show modal
    modal.classList.add('active');
}

// Load upcoming exhibitions from JSON
async function loadUpcomingExhibitions() {
    const exhibitionsContainer = document.getElementById('exhibitions-container');
    if (!exhibitionsContainer) return;
    
    const exhibitions = await fetchData('data/exhibitions.json');
    if (!exhibitions) return;
    
    // Filter only upcoming exhibitions
    const upcomingExhibitions = exhibitions.filter(exhibition => {
        const exhibitionDate = new Date(exhibition.date);
        return exhibitionDate > new Date();
    });
    
    // Display only the first 3 upcoming exhibitions
    upcomingExhibitions.slice(0, 3).forEach(exhibition => {
        const exhibitionItem = createElement('div', 'exhibition-item');
        
        const exhibitionImage = createElement('div', 'exhibition-image');
        const img = document.createElement('img');
        img.setAttribute('data-src', exhibition.image);
        img.setAttribute('src', 'images/placeholder.jpg');
        img.setAttribute('alt', exhibition.title);
        exhibitionImage.appendChild(img);
        
        const exhibitionDetails = createElement('div', 'exhibition-details');
        
        const date = createElement('p', 'exhibition-date', formatDate(exhibition.date));
        const title = createElement('h3', 'exhibition-title', exhibition.title);
        
        const location = createElement('div', 'exhibition-location');
        const locationIcon = document.createElement('i');
        locationIcon.className = 'fas fa-map-marker-alt';
        const locationText = document.createElement('span');
        locationText.textContent = exhibition.location;
        location.appendChild(locationIcon);
        location.appendChild(locationText);
        
        const description = createElement('p', 'exhibition-description', exhibition.description);
        
        const detailsBtn = createElement('a', 'btn text-btn', 'View Details');
        detailsBtn.setAttribute('href', 'exhibitions.html#' + exhibition.id);
        const btnIcon = document.createElement('i');
        btnIcon.className = 'fas fa-arrow-right';
        detailsBtn.appendChild(btnIcon);
        
        exhibitionDetails.appendChild(date);
        exhibitionDetails.appendChild(title);
        exhibitionDetails.appendChild(location);
        exhibitionDetails.appendChild(description);
        exhibitionDetails.appendChild(detailsBtn);
        
        exhibitionItem.appendChild(exhibitionImage);
        exhibitionItem.appendChild(exhibitionDetails);
        
        exhibitionsContainer.appendChild(exhibitionItem);
    });
}

// Load testimonials from JSON
async function loadTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer) return;
    
    const testimonials = await fetchData('data/testimonials.json');
    if (!testimonials) return;
    
    testimonials.forEach(testimonial => {
        const testimonialItem = createElement('div', 'testimonial-item');
        
        const testimonialContent = createElement('div', 'testimonial-content');
        const quote = createElement('p', null, testimonial.quote);
        testimonialContent.appendChild(quote);
        
        const testimonialAuthor = createElement('div', 'testimonial-author');
        
        const authorImage = createElement('div', 'testimonial-author-image');
        const img = document.createElement('img');
        img.setAttribute('data-src', testimonial.image);
        img.setAttribute('src', 'images/placeholder.jpg');
        img.setAttribute('alt', testimonial.name);
        authorImage.appendChild(img);
        
        const authorInfo = createElement('div', 'testimonial-author-info');
        const name = createElement('h4', 'testimonial-author-name', testimonial.name);
        const title = createElement('p', 'testimonial-author-title', testimonial.title);
        authorInfo.appendChild(name);
        authorInfo.appendChild(title);
        
        testimonialAuthor.appendChild(authorImage);
        testimonialAuthor.appendChild(authorInfo);
        
        testimonialItem.appendChild(testimonialContent);
        testimonialItem.appendChild(testimonialAuthor);
        
        testimonialsContainer.appendChild(testimonialItem);
    });
}

// Load other artists from JSON
async function loadOtherArtists() {
    const artistsContainer = document.getElementById('other-artists-container');
    if (!artistsContainer) return;
    
    const artists = await fetchData('data/other-artists.json');
    if (!artists) return;
    
    artists.forEach(artist => {
        const artistItem = createElement('div', 'artist-item');
        
        const artistImage = createElement('div', 'artist-image');
        const img = document.createElement('img');
        img.setAttribute('data-src', artist.image);
        img.setAttribute('src', 'images/placeholder.jpg');
        img.setAttribute('alt', artist.name);
        artistImage.appendChild(img);
        
        const name = createElement('h3', 'artist-name', artist.name);
        
        const website = createElement('a', 'artist-website', 'Visit Website');
        website.setAttribute('href', artist.website);
        website.setAttribute('target', '_blank');
        website.setAttribute('rel', 'noopener noreferrer');
        
        artistItem.appendChild(artistImage);
        artistItem.appendChild(name);
        artistItem.appendChild(website);
        
        artistsContainer.appendChild(artistItem);
    });
}

// Format date function
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Setup testimonial navigation
function setupTestimonialNavigation() {
    const slider = document.getElementById('testimonials-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    // Calculate the width of a single testimonial item plus gap
    let itemWidth = 0;
    
    // Function to update item width after testimonials are loaded
    function updateItemWidth() {
        if (slider.children.length > 0) {
            const firstItem = slider.children[0];
            // Get the width of the item plus the gap (2rem = 32px)
            itemWidth = firstItem.offsetWidth + 32;
        }
    }
    
    // Initial update after a short delay to ensure items are loaded
    setTimeout(updateItemWidth, 500);
    
    // Navigate to previous testimonial
    prevBtn.addEventListener('click', function() {
        updateItemWidth(); // Update width in case of window resize
        slider.scrollLeft -= itemWidth;
    });
    
    // Navigate to next testimonial
    nextBtn.addEventListener('click', function() {
        updateItemWidth(); // Update width in case of window resize
        slider.scrollLeft += itemWidth;
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isElementInViewport(slider)) {
            if (e.key === 'ArrowLeft') {
                slider.scrollLeft -= itemWidth;
            } else if (e.key === 'ArrowRight') {
                slider.scrollLeft += itemWidth;
            }
        }
    });
}

// Helper function to check if an element is in the viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
} 