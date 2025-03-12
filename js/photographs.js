document.addEventListener('DOMContentLoaded', function() {
    // Load photographs data
    loadPhotographsData();
    
    // Setup modal functionality
    setupModalFunctionality();
    
    // Setup filter functionality
    setupFilterFunctionality();
});

// Load photographs data from JSON
function loadPhotographsData() {
    fetch('data/media.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store photographs data globally
            window.photographsData = data.photographs;
            
            // Populate photographs grid
            populatePhotographs(data.photographs);
            
            // Populate filter options
            populateFilterOptions(data.photographs);
        })
        .catch(error => {
            console.error('Error loading photographs data:', error);
            
            // If there's an error loading the JSON, use fallback data
            const fallbackData = getFallbackPhotographsData();
            window.photographsData = fallbackData;
            populatePhotographs(fallbackData);
            populateFilterOptions(fallbackData);
        });
}

// Fallback photographs data in case the JSON file can't be loaded
function getFallbackPhotographsData() {
    return [
        {
            id: 1,
            title: "Suhas Roy in His Studio, 2023",
            photographer: "Raghu Rai",
            year: 2023,
            description: "The artist at work in his Kolkata studio, captured by renowned photographer Raghu Rai.",
            image: "https://via.placeholder.com/600x400?text=Studio+Portrait"
        },
        {
            id: 2,
            title: "Installation View, Jehangir Art Gallery, 2022",
            photographer: "Dayanita Singh",
            year: 2022,
            description: "A view of Suhas Roy's solo exhibition at the prestigious Jehangir Art Gallery in Mumbai.",
            image: "https://via.placeholder.com/600x400?text=Gallery+Installation"
        },
        {
            id: 3,
            title: "Portrait of the Artist, 2021",
            photographer: "Pablo Bartholomew",
            year: 2021,
            description: "An intimate portrait of Suhas Roy by Padma Shri awardee Pablo Bartholomew.",
            image: "https://via.placeholder.com/600x400?text=Artist+Portrait"
        },
        {
            id: 4,
            title: "Working on 'Spiritual Resonance' Series, 2023",
            photographer: "Ketaki Sheth",
            year: 2023,
            description: "The artist working on his acclaimed 'Spiritual Resonance' series in his studio.",
            image: "https://via.placeholder.com/600x400?text=Working+Artist"
        },
        {
            id: 5,
            title: "With Collectors at India Art Fair, 2024",
            photographer: "Sooni Taraporevala",
            year: 2024,
            description: "Suhas Roy discussing his work with collectors at the India Art Fair in New Delhi.",
            image: "https://via.placeholder.com/600x400?text=Art+Fair"
        },
        {
            id: 6,
            title: "Early Career, Santiniketan, 1995",
            photographer: "Personal Archive",
            year: 1995,
            description: "A rare photograph from the artist's early career at Santiniketan, where he studied under master artists.",
            image: "https://via.placeholder.com/600x400?text=Early+Career"
        },
        {
            id: 7,
            title: "Teaching Workshop, National Art School, 2022",
            photographer: "Prashant Panjiar",
            year: 2022,
            description: "Suhas Roy conducting a workshop for advanced students at the National Art School.",
            image: "https://via.placeholder.com/600x400?text=Teaching+Workshop"
        },
        {
            id: 8,
            title: "With Fellow Artists, Kochi-Muziris Biennale, 2023",
            photographer: "Ram Rahman",
            year: 2023,
            description: "Suhas Roy with fellow contemporary artists at the Kochi-Muziris Biennale.",
            image: "https://via.placeholder.com/600x400?text=Biennale"
        }
    ];
}

// Populate photographs grid
function populatePhotographs(photographs) {
    const photographsGrid = document.getElementById('all-photographs');
    if (!photographsGrid) return;
    
    // Clear existing content
    photographsGrid.innerHTML = '';
    
    if (photographs.length === 0) {
        document.querySelector('.no-results').style.display = 'block';
        return;
    }
    
    document.querySelector('.no-results').style.display = 'none';
    
    // Display all photographs
    photographs.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photograph-item';
        photoItem.dataset.id = photo.id;
        
        // Extract year from title if not explicitly provided
        const year = photo.year || extractYearFromTitle(photo.title);
        
        // Use placeholder image if the image path doesn't start with http
        const imageSrc = photo.image.startsWith('http') 
            ? photo.image 
            : `https://via.placeholder.com/600x400?text=${encodeURIComponent(photo.title.replace(/\s+/g, '+').substring(0, 30))}`;
        
        photoItem.innerHTML = `
            <img src="${imageSrc}" alt="${photo.title}">
            <div class="photograph-overlay">
                <div class="photograph-details">
                    <h3>${photo.title}</h3>
                    <p>Photograph by ${photo.photographer}</p>
                </div>
            </div>
        `;
        
        photographsGrid.appendChild(photoItem);
        
        // Add click event to open modal
        photoItem.addEventListener('click', function() {
            openPhotographModal(photo);
        });
    });
}

// Extract year from title (e.g., "Title, 2023" -> 2023)
function extractYearFromTitle(title) {
    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : null;
}

// Populate filter options
function populateFilterOptions(photographs) {
    // Get unique years
    const years = [...new Set(photographs.map(p => p.year || extractYearFromTitle(p.title)))].filter(Boolean).sort((a, b) => b - a);
    const yearFilter = document.getElementById('year-filter');
    
    // Clear existing options except the first one
    while (yearFilter.options.length > 1) {
        yearFilter.remove(1);
    }
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
    
    // Get unique photographers
    const photographers = [...new Set(photographs.map(p => p.photographer))].sort();
    const photographerFilter = document.getElementById('photographer-filter');
    
    // Clear existing options except the first one
    while (photographerFilter.options.length > 1) {
        photographerFilter.remove(1);
    }
    
    photographers.forEach(photographer => {
        const option = document.createElement('option');
        option.value = photographer;
        option.textContent = photographer;
        photographerFilter.appendChild(option);
    });
}

// Setup filter functionality
function setupFilterFunctionality() {
    const yearFilter = document.getElementById('year-filter');
    const photographerFilter = document.getElementById('photographer-filter');
    const searchInput = document.getElementById('photograph-search');
    const searchBtn = document.getElementById('search-btn');
    
    // Function to apply filters
    function applyFilters() {
        const yearValue = yearFilter.value;
        const photographerValue = photographerFilter.value;
        const searchValue = searchInput.value.toLowerCase().trim();
        
        // Get all photographs
        const allPhotographs = window.photographsData || [];
        
        // Filter photographs based on selected criteria
        const filteredPhotographs = allPhotographs.filter(photo => {
            // Extract year from title if not explicitly provided
            const photoYear = photo.year || extractYearFromTitle(photo.title);
            
            // Year filter
            if (yearValue !== 'all' && photoYear && photoYear.toString() !== yearValue) {
                return false;
            }
            
            // Photographer filter
            if (photographerValue !== 'all' && photo.photographer !== photographerValue) {
                return false;
            }
            
            // Search filter
            if (searchValue && !photo.title.toLowerCase().includes(searchValue) && 
                !photo.description.toLowerCase().includes(searchValue) &&
                !photo.photographer.toLowerCase().includes(searchValue)) {
                return false;
            }
            
            return true;
        });
        
        // Update photographs grid with filtered results
        populatePhotographs(filteredPhotographs);
    }
    
    // Add event listeners to filters
    yearFilter.addEventListener('change', applyFilters);
    photographerFilter.addEventListener('change', applyFilters);
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            applyFilters();
        }
    });
}

// Setup modal functionality
function setupModalFunctionality() {
    const modal = document.querySelector('.photograph-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Toggle fullscreen when clicking the fullscreen button
    fullscreenBtn.addEventListener('click', function() {
        const imageContainer = document.querySelector('.photograph-modal-image');
        imageContainer.classList.toggle('fullscreen');
        
        if (imageContainer.classList.contains('fullscreen')) {
            this.textContent = 'Exit Fullscreen';
        } else {
            this.textContent = 'View Fullscreen';
        }
    });
}

// Open photograph modal
function openPhotographModal(photo) {
    const modal = document.querySelector('.photograph-modal');
    
    // Use placeholder image if the image path doesn't start with http
    const imageSrc = photo.image.startsWith('http') 
        ? photo.image 
        : `https://via.placeholder.com/600x400?text=${encodeURIComponent(photo.title.replace(/\s+/g, '+').substring(0, 30))}`;
    
    // Update modal content
    document.getElementById('modal-photograph-image').src = imageSrc;
    document.getElementById('modal-photograph-title').textContent = photo.title;
    document.getElementById('modal-photograph-photographer').textContent = `Photograph by ${photo.photographer}`;
    document.getElementById('modal-photograph-description').textContent = photo.description;
    
    // Reset fullscreen button text
    document.getElementById('fullscreen-btn').textContent = 'View Fullscreen';
    document.querySelector('.photograph-modal-image').classList.remove('fullscreen');
    
    // Show modal
    modal.classList.add('active');
} 