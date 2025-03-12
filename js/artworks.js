document.addEventListener('DOMContentLoaded', function() {
    // Load all artworks
    loadAllArtworks();
    
    // Setup search functionality
    setupSearch();
    
    // Setup filter functionality
    setupFilters();
    
    // Setup modal functionality
    setupModals();
});

// Global variable to store all artworks
let allArtworks = [];
let currentArtwork = null;

// Load all artworks from JSON
async function loadAllArtworks() {
    const artworksContainer = document.getElementById('artworks-container');
    if (!artworksContainer) return;
    
    // Show loading state
    artworksContainer.innerHTML = '<div class="loading">Loading artworks...</div>';
    
    // Fetch artworks data
    allArtworks = await fetchData('data/artworks.json');
    if (!allArtworks) {
        artworksContainer.innerHTML = '<div class="error">Failed to load artworks. Please try again later.</div>';
        return;
    }
    
    // Display all artworks
    displayArtworks(allArtworks);
    
    // Populate filter options
    populateFilterOptions();
    
    // Check for artwork ID in URL after artworks are loaded
    checkUrlForArtwork();
}

// Display artworks in the container
function displayArtworks(artworks) {
    const artworksContainer = document.getElementById('artworks-container');
    if (!artworksContainer) return;
    
    // Clear container
    artworksContainer.innerHTML = '';
    
    if (artworks.length === 0) {
        artworksContainer.innerHTML = '<div class="no-results">No artworks found matching your criteria.</div>';
        return;
    }
    
    // Create and append artwork items
    artworks.forEach(artwork => {
        const artworkItem = createElement('div', 'artwork-item');
        artworkItem.setAttribute('data-id', artwork.id);
        
        const artworkImage = createElement('div', 'artwork-image');
        const img = document.createElement('img');
        img.setAttribute('data-src', artwork.image);
        img.setAttribute('src', 'images/placeholder.jpg');
        img.setAttribute('alt', artwork.title);
        artworkImage.appendChild(img);
        
        // Add click event to open modal
        artworkImage.addEventListener('click', () => openArtworkModal(artwork));
        
        const artworkDetails = createElement('div', 'artwork-details');
        
        const title = createElement('h3', 'artwork-title', artwork.title);
        const description = createElement('p', 'artwork-description', artwork.description);
        
        const artworkMeta = createElement('div', 'artwork-meta');
        
        // Category and medium info
        const categoryInfo = createElement('p', 'artwork-info');
        const categoryLabel = createElement('span', 'info-label', 'Category: ');
        const categoryValue = createElement('span', 'info-value', artwork.category);
        categoryInfo.appendChild(categoryLabel);
        categoryInfo.appendChild(categoryValue);
        
        const mediumInfo = createElement('p', 'artwork-info');
        const mediumLabel = createElement('span', 'info-label', 'Medium: ');
        const mediumValue = createElement('span', 'info-value', artwork.medium);
        mediumInfo.appendChild(mediumLabel);
        mediumInfo.appendChild(mediumValue);
        
        const dimensionsInfo = createElement('p', 'artwork-info');
        const dimensionsLabel = createElement('span', 'info-label', 'Dimensions: ');
        const dimensionsValue = createElement('span', 'info-value', artwork.dimensions);
        dimensionsInfo.appendChild(dimensionsLabel);
        dimensionsInfo.appendChild(dimensionsValue);
        
        const yearInfo = createElement('p', 'artwork-info');
        const yearLabel = createElement('span', 'info-label', 'Year: ');
        const yearValue = createElement('span', 'info-value', artwork.year);
        yearInfo.appendChild(yearLabel);
        yearInfo.appendChild(yearValue);
        
        // Price and availability
        const priceAvailability = createElement('div', 'price-availability');
        const price = createElement('span', 'artwork-price', formatCurrency(artwork.price));
        
        const statusClass = artwork.available ? 'artwork-status available' : 'artwork-status sold';
        const statusText = artwork.available ? 'Available' : 'Sold';
        const status = createElement('span', statusClass, statusText);
        
        priceAvailability.appendChild(price);
        priceAvailability.appendChild(status);
        
        // Inquiry button
        const inquiryBtn = createElement('button', 'btn secondary-btn', 'Inquire');
        inquiryBtn.addEventListener('click', () => openInquiryModal(artwork));
        
        // Assemble the artwork details
        artworkDetails.appendChild(title);
        artworkDetails.appendChild(description);
        artworkDetails.appendChild(categoryInfo);
        artworkDetails.appendChild(mediumInfo);
        artworkDetails.appendChild(dimensionsInfo);
        artworkDetails.appendChild(yearInfo);
        artworkDetails.appendChild(priceAvailability);
        artworkDetails.appendChild(inquiryBtn);
        
        // Assemble the artwork item
        artworkItem.appendChild(artworkImage);
        artworkItem.appendChild(artworkDetails);
        
        // Add to container
        artworksContainer.appendChild(artworkItem);
    });
    
    // Initialize lazy loading for the new images
    initLazyLoading();
}

// Initialize lazy loading for images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                lazyLoadObserver.unobserve(img);
            }
        });
    }, {
        threshold: 0.1
    });
    
    lazyImages.forEach(image => {
        lazyLoadObserver.observe(image);
    });
}

// Setup search functionality
function setupSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (!searchForm || !searchInput) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            displayArtworks(allArtworks);
            return;
        }
        
        // Filter artworks based on search term
        const filteredArtworks = allArtworks.filter(artwork => {
            return artwork.title.toLowerCase().includes(searchTerm) ||
                   artwork.description.toLowerCase().includes(searchTerm) ||
                   artwork.category.toLowerCase().includes(searchTerm) ||
                   artwork.medium.toLowerCase().includes(searchTerm);
        });
        
        displayArtworks(filteredArtworks);
    });
}

// Populate filter options from artwork data
function populateFilterOptions() {
    if (!allArtworks || allArtworks.length === 0) return;
    
    // Get unique categories
    const categories = [...new Set(allArtworks.map(artwork => artwork.category))];
    populateSelect('category-filter', categories);
    
    // Get unique mediums
    const mediums = [...new Set(allArtworks.map(artwork => artwork.medium))];
    populateSelect('medium-filter', mediums);
    
    // Get unique years
    const years = [...new Set(allArtworks.map(artwork => artwork.year))];
    years.sort((a, b) => b - a); // Sort years in descending order
    populateSelect('year-filter', years);
    
    // Price ranges are predefined
    const priceRanges = [
        'All Prices',
        'Under ₹10,000',
        '₹10,000 - ₹50,000',
        '₹50,000 - ₹100,000',
        '₹100,000 - ₹500,000',
        'Above ₹500,000'
    ];
    populateSelect('price-filter', priceRanges);
    
    // Availability options are predefined
    const availabilityOptions = ['All', 'Available', 'Sold'];
    populateSelect('availability-filter', availabilityOptions);
}

// Populate select element with options
function populateSelect(selectId, options) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    
    // Add default "All" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = `All ${selectElement.getAttribute('data-filter-name')}`;
    selectElement.appendChild(defaultOption);
    
    // Add options from data
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// Setup filter functionality
function setupFilters() {
    const filterForm = document.getElementById('filter-form');
    if (!filterForm) return;
    
    // Get all filter selects
    const filterSelects = filterForm.querySelectorAll('select');
    
    // Add change event listener to each filter
    filterSelects.forEach(select => {
        select.addEventListener('change', applyFilters);
    });
    
    // Reset button functionality
    const resetButton = document.getElementById('reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            filterSelects.forEach(select => {
                select.selectedIndex = 0;
            });
            document.getElementById('search-input').value = '';
            displayArtworks(allArtworks);
        });
    }
}

// Apply all filters to artworks
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const mediumFilter = document.getElementById('medium-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const availabilityFilter = document.getElementById('availability-filter').value;
    
    // Filter artworks based on selected criteria
    let filteredArtworks = allArtworks.filter(artwork => {
        // Category filter
        if (categoryFilter && artwork.category !== categoryFilter) {
            return false;
        }
        
        // Medium filter
        if (mediumFilter && artwork.medium !== mediumFilter) {
            return false;
        }
        
        // Year filter
        if (yearFilter && artwork.year.toString() !== yearFilter) {
            return false;
        }
        
        // Price filter
        if (priceFilter) {
            const price = artwork.price;
            
            if (priceFilter === 'Under ₹10,000' && price >= 10000) {
                return false;
            } else if (priceFilter === '₹10,000 - ₹50,000' && (price < 10000 || price > 50000)) {
                return false;
            } else if (priceFilter === '₹50,000 - ₹100,000' && (price < 50000 || price > 100000)) {
                return false;
            } else if (priceFilter === '₹100,000 - ₹500,000' && (price < 100000 || price > 500000)) {
                return false;
            } else if (priceFilter === 'Above ₹500,000' && price <= 500000) {
                return false;
            }
        }
        
        // Availability filter
        if (availabilityFilter === 'Available' && !artwork.available) {
            return false;
        } else if (availabilityFilter === 'Sold' && artwork.available) {
            return false;
        }
        
        return true;
    });
    
    // Display filtered artworks
    displayArtworks(filteredArtworks);
}

// Setup modal functionality
function setupModals() {
    // Get modal elements
    const artworkModal = document.getElementById('artwork-modal');
    const inquiryModal = document.getElementById('inquiry-modal');
    const modalImage = document.getElementById('modal-artwork-image');
    const modalImageContainer = modalImage.parentElement;
    
    // Get zoom and fullscreen controls
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // Initialize zoom level
    let currentZoom = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    
    // Zoom functionality
    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < 3) {
            currentZoom += 0.5;
            updateZoom();
        }
    });
    
    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > 1) {
            currentZoom -= 0.5;
            updateZoom();
        }
    });
    
    function updateZoom() {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
        modalImageContainer.classList.toggle('zoomed', currentZoom > 1);
    }
    
    // Pan functionality when zoomed
    modalImage.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImage.style.cursor = 'grabbing';
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateZoom();
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        modalImage.style.cursor = currentZoom > 1 ? 'grab' : 'default';
    });
    
    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', () => {
        modalImageContainer.classList.toggle('fullscreen');
        const icon = fullscreenBtn.querySelector('i');
        if (modalImageContainer.classList.contains('fullscreen')) {
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
        } else {
            icon.classList.add('fa-expand');
            icon.classList.remove('fa-compress');
        }
    });
    
    // Reset zoom and position when modal is closed
    function resetZoomAndPosition() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateZoom();
        modalImageContainer.classList.remove('fullscreen');
        const icon = fullscreenBtn.querySelector('i');
        icon.classList.add('fa-expand');
        icon.classList.remove('fa-compress');
    }
    
    // Get close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Add event listeners to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            artworkModal.classList.remove('active');
            inquiryModal.classList.remove('active');
            resetZoomAndPosition();
            
            // Also close share dropdown if open
            const shareDropdown = document.querySelector('.share-dropdown');
            if (shareDropdown) {
                shareDropdown.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside of modal content
    window.addEventListener('click', (e) => {
        if (e.target === artworkModal) {
            artworkModal.classList.remove('active');
            resetZoomAndPosition();
            
            // Also close share dropdown if open
            const shareDropdown = document.querySelector('.share-dropdown');
            if (shareDropdown) {
                shareDropdown.classList.remove('active');
            }
        }
        if (e.target === inquiryModal) {
            inquiryModal.classList.remove('active');
        }
    });
    
    // Setup inquiry button in artwork modal
    const inquiryBtn = document.getElementById('inquiry-btn');
    if (inquiryBtn) {
        inquiryBtn.addEventListener('click', () => {
            artworkModal.classList.remove('active');
            resetZoomAndPosition();
            openInquiryModal(currentArtwork);
        });
    }
    
    // Setup share button functionality
    setupShareFunctionality();
    
    // Setup inquiry form submission
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            alert('Thank you for your inquiry! We will get back to you soon.');
            
            // Close the modal and reset the form
            inquiryModal.classList.remove('active');
            inquiryForm.reset();
        });
    }
}

// Setup share functionality
function setupShareFunctionality() {
    const shareBtn = document.getElementById('share-artwork-btn');
    const shareOptions = document.getElementById('share-options');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const shareFacebook = document.getElementById('share-facebook');
    const shareTwitter = document.getElementById('share-twitter');
    const sharePinterest = document.getElementById('share-pinterest');
    const copySuccessMessage = document.getElementById('copy-success-message');
    
    if (!shareBtn || !shareOptions) return;
    
    // Toggle share options dropdown
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        const shareDropdown = shareBtn.parentElement;
        shareDropdown.classList.toggle('active');
    });
    
    // Close share dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.share-dropdown')) {
            const shareDropdown = document.querySelector('.share-dropdown');
            if (shareDropdown) {
                shareDropdown.classList.remove('active');
            }
        }
    });
    
    // Copy link to clipboard
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            // Create the artwork URL
            const artworkUrl = `${window.location.origin}${window.location.pathname}?artwork=${currentArtwork.id}`;
            
            // Use the Clipboard API to copy the link
            navigator.clipboard.writeText(artworkUrl).then(() => {
                // Show success message
                copySuccessMessage.classList.add('show');
                
                // Hide message after 3 seconds
                setTimeout(() => {
                    copySuccessMessage.classList.remove('show');
                }, 3000);
                
                // Close the dropdown
                const shareDropdown = document.querySelector('.share-dropdown');
                if (shareDropdown) {
                    shareDropdown.classList.remove('active');
                }
            }).catch(err => {
                console.error('Could not copy text: ', err);
                alert('Failed to copy link. Please try again.');
            });
        });
    }
    
    // Setup social media share links
    if (shareFacebook && shareTwitter && sharePinterest) {
        // Update share links when modal opens
        document.addEventListener('modalOpened', () => {
            if (!currentArtwork) return;
            
            const artworkUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}?artwork=${currentArtwork.id}`);
            const artworkTitle = encodeURIComponent(currentArtwork.title);
            const artworkImage = encodeURIComponent(currentArtwork.image);
            
            // Facebook share
            shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${artworkUrl}`;
            
            // Twitter share
            shareTwitter.href = `https://twitter.com/intent/tweet?text=Check out this artwork: ${artworkTitle}&url=${artworkUrl}`;
            
            // Pinterest share (requires image)
            sharePinterest.href = `https://pinterest.com/pin/create/button/?url=${artworkUrl}&media=${artworkImage}&description=${artworkTitle}`;
        });
    }
}

// Open artwork modal with details
function openArtworkModal(artwork) {
    // Store current artwork for reference
    currentArtwork = artwork;
    
    // Get modal elements
    const modal = document.getElementById('artwork-modal');
    const modalImage = document.getElementById('modal-artwork-image');
    const modalTitle = document.getElementById('modal-artwork-title');
    const modalArtist = document.getElementById('modal-artwork-artist');
    const modalCode = document.getElementById('modal-artwork-code');
    const modalYear = document.getElementById('modal-artwork-year');
    const modalMedium = document.getElementById('modal-artwork-medium');
    const modalDimensions = document.getElementById('modal-artwork-dimensions');
    const modalCategory = document.getElementById('modal-artwork-category');
    const modalPrice = document.getElementById('modal-artwork-price');
    const modalAvailability = document.getElementById('modal-artwork-availability');
    const modalDescription = document.getElementById('modal-artwork-description');
    
    // Set modal content
    modalImage.src = artwork.image;
    modalImage.alt = artwork.title;
    modalTitle.textContent = artwork.title;
    
    // Artist is hardcoded as "Suhas Roy" in the HTML
    
    // Generate a unique artwork code (SR + year + id)
    modalCode.textContent = `SR${artwork.year}${artwork.id.toString().padStart(3, '0')}`;
    
    modalYear.textContent = artwork.year;
    modalMedium.textContent = artwork.medium;
    modalDimensions.textContent = artwork.dimensions;
    modalCategory.textContent = artwork.category;
    modalPrice.textContent = formatCurrency(artwork.price);
    
    // Set availability
    modalAvailability.textContent = artwork.available ? 'Available' : 'Sold';
    modalAvailability.className = 'artwork-availability';
    modalAvailability.classList.add(artwork.available ? 'available' : 'sold');
    
    // Set description
    modalDescription.textContent = artwork.description;
    
    // Show modal
    modal.classList.add('active');
    
    // Dispatch custom event for share links to update
    document.dispatchEvent(new CustomEvent('modalOpened'));
}

// Open inquiry modal for an artwork
function openInquiryModal(artwork) {
    // Get modal elements
    const modal = document.getElementById('inquiry-modal');
    const artworkCode = document.getElementById('inquiry-artwork-code');
    
    // Set artwork code in the form
    artworkCode.textContent = `SR${artwork.year}${artwork.id.toString().padStart(3, '0')}`;
    
    // Show modal
    modal.classList.add('active');
}

// Check URL for artwork ID parameter
function checkUrlForArtwork() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const artworkId = urlParams.get('artwork');
    
    // If artwork ID is present, open the modal for that artwork
    if (artworkId && allArtworks.length > 0) {
        // Find the artwork by ID
        const artwork = allArtworks.find(item => item.id.toString() === artworkId);
        
        // If artwork is found, open the modal
        if (artwork) {
            openArtworkModal(artwork);
        }
    }
} 