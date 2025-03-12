document.addEventListener('DOMContentLoaded', function() {
    // Load publications data
    loadPublicationsData();
    
    // Setup modal functionality
    setupModalFunctionality();
    
    // Setup filter functionality
    setupFilterFunctionality();
});

// Load publications data from JSON
function loadPublicationsData() {
    fetch('data/media.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store publications data globally
            window.publicationsData = data.publications;
            
            // Populate publications grid
            populatePublications(data.publications);
            
            // Populate filter options
            populateFilterOptions(data.publications);
        })
        .catch(error => {
            console.error('Error loading publications data:', error);
            
            // If there's an error loading the JSON, use fallback data
            const fallbackData = getFallbackPublicationsData();
            window.publicationsData = fallbackData;
            populatePublications(fallbackData);
            populateFilterOptions(fallbackData);
        });
}

// Fallback publications data in case the JSON file can't be loaded
function getFallbackPublicationsData() {
    return [
        {
            id: 1,
            title: "The Art of Suhas Roy: A Retrospective",
            author: "Dr. Alka Pande",
            publisher: "Roli Books",
            year: 2023,
            description: "A comprehensive retrospective of Suhas Roy's artistic journey spanning over three decades, featuring critical essays and over 200 color plates of his most significant works.",
            image: "https://via.placeholder.com/400x500?text=Suhas+Roy+Retrospective",
            link: "#"
        },
        {
            id: 2,
            title: "Contemporary Indian Art: New Directions",
            author: "Edited by Gayatri Sinha",
            publisher: "Thames & Hudson",
            year: 2022,
            description: "A landmark publication featuring Suhas Roy among other prominent contemporary Indian artists, exploring new trends and directions in Indian art in the 21st century.",
            image: "https://via.placeholder.com/400x500?text=Contemporary+Indian+Art",
            link: "#"
        },
        {
            id: 3,
            title: "Spiritual Dimensions in Contemporary Art",
            author: "By Ranjit Hoskote",
            publisher: "Mapin Publishing",
            year: 2021,
            description: "An exploration of spirituality in contemporary Indian art, featuring a dedicated chapter on Suhas Roy's meditative works and their philosophical underpinnings.",
            image: "https://via.placeholder.com/400x500?text=Spiritual+Dimensions",
            link: "#"
        },
        {
            id: 4,
            title: "The Female Form in Indian Art",
            author: "By Geeta Kapur",
            publisher: "Oxford University Press",
            year: 2020,
            description: "A scholarly examination of the representation of the female form in Indian art, with a section dedicated to Suhas Roy's iconic 'Radha' series.",
            image: "https://via.placeholder.com/400x500?text=Female+Form+in+Art",
            link: "#"
        },
        {
            id: 5,
            title: "Masters of Indian Art: Volume III",
            author: "Edited by Yashodhara Dalmia",
            publisher: "Penguin India",
            year: 2019,
            description: "The third volume in a series documenting the works of master Indian artists, featuring Suhas Roy alongside other contemporary masters.",
            image: "https://via.placeholder.com/400x500?text=Masters+of+Indian+Art",
            link: "#"
        }
    ];
}

// Populate publications grid
function populatePublications(publications) {
    const publicationsGrid = document.getElementById('all-publications');
    if (!publicationsGrid) return;
    
    // Clear existing content
    publicationsGrid.innerHTML = '';
    
    if (publications.length === 0) {
        document.querySelector('.no-results').style.display = 'block';
        return;
    }
    
    document.querySelector('.no-results').style.display = 'none';
    
    // Display all publications
    publications.forEach(publication => {
        const publicationItem = document.createElement('div');
        publicationItem.className = 'publication-item';
        publicationItem.dataset.id = publication.id;
        
        // Use placeholder image if the image path doesn't start with http
        const imageSrc = publication.image.startsWith('http') 
            ? publication.image 
            : `https://via.placeholder.com/400x500?text=${encodeURIComponent(publication.title.replace(/\s+/g, '+'))}`;
        
        publicationItem.innerHTML = `
            <div class="publication-image">
                <img src="${imageSrc}" alt="${publication.title}">
            </div>
            <div class="publication-details">
                <h3 class="publication-title">${publication.title}</h3>
                <p class="publication-author">${publication.author}</p>
                <p class="publication-publisher">Published by ${publication.publisher}, ${publication.year}</p>
                <p class="publication-description">${publication.description}</p>
                <button class="btn secondary-btn view-details-btn" data-id="${publication.id}">View Details</button>
            </div>
        `;
        
        publicationsGrid.appendChild(publicationItem);
    });
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const publicationId = parseInt(this.getAttribute('data-id'));
            const publication = publications.find(p => p.id === publicationId);
            
            if (publication) {
                openPublicationModal(publication);
            }
        });
    });
}

// Populate filter options
function populateFilterOptions(publications) {
    // Get unique years
    const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
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
    
    // Get unique publishers
    const publishers = [...new Set(publications.map(p => p.publisher))].sort();
    const publisherFilter = document.getElementById('publisher-filter');
    
    // Clear existing options except the first one
    while (publisherFilter.options.length > 1) {
        publisherFilter.remove(1);
    }
    
    publishers.forEach(publisher => {
        const option = document.createElement('option');
        option.value = publisher;
        option.textContent = publisher;
        publisherFilter.appendChild(option);
    });
}

// Setup filter functionality
function setupFilterFunctionality() {
    const yearFilter = document.getElementById('year-filter');
    const publisherFilter = document.getElementById('publisher-filter');
    const searchInput = document.getElementById('publication-search');
    const searchBtn = document.getElementById('search-btn');
    
    // Function to apply filters
    function applyFilters() {
        const yearValue = yearFilter.value;
        const publisherValue = publisherFilter.value;
        const searchValue = searchInput.value.toLowerCase().trim();
        
        let filteredPublications = window.publicationsData;
        
        // Filter by year
        if (yearValue !== 'all') {
            filteredPublications = filteredPublications.filter(p => p.year === parseInt(yearValue));
        }
        
        // Filter by publisher
        if (publisherValue !== 'all') {
            filteredPublications = filteredPublications.filter(p => p.publisher === publisherValue);
        }
        
        // Filter by search term
        if (searchValue) {
            filteredPublications = filteredPublications.filter(p => 
                p.title.toLowerCase().includes(searchValue) || 
                p.author.toLowerCase().includes(searchValue) || 
                p.description.toLowerCase().includes(searchValue)
            );
        }
        
        // Update publications grid
        populatePublications(filteredPublications);
    }
    
    // Add event listeners to filters
    yearFilter.addEventListener('change', applyFilters);
    publisherFilter.addEventListener('change', applyFilters);
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}

// Setup modal functionality
function setupModalFunctionality() {
    const modal = document.querySelector('.publication-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const shareBtn = modal.querySelector('.share-btn');
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // Share functionality
    shareBtn.addEventListener('click', function() {
        const title = document.getElementById('modal-publication-title').textContent;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this publication: ${title}`,
                url: window.location.href
            })
            .catch(error => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            alert(`Share this publication: ${title}\n${window.location.href}`);
        }
    });
}

// Open publication modal
function openPublicationModal(publication) {
    const modal = document.querySelector('.publication-modal');
    
    // Use placeholder image if the image path doesn't start with http
    const imageSrc = publication.image.startsWith('http') 
        ? publication.image 
        : `https://via.placeholder.com/400x500?text=${encodeURIComponent(publication.title.replace(/\s+/g, '+'))}`;
    
    // Update modal content
    document.getElementById('modal-publication-image').src = imageSrc;
    document.getElementById('modal-publication-title').textContent = publication.title;
    document.getElementById('modal-publication-author').textContent = publication.author;
    document.getElementById('modal-publication-publisher').textContent = `Published by ${publication.publisher}, ${publication.year}`;
    document.getElementById('modal-publication-description').textContent = publication.description;
    
    const linkElement = document.getElementById('modal-publication-link');
    linkElement.href = publication.link;
    
    // Show modal
    modal.classList.add('active');
} 