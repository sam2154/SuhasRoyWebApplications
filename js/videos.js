document.addEventListener('DOMContentLoaded', function() {
    // Load videos data
    loadVideosData();
    
    // Setup modal functionality
    setupModalFunctionality();
    
    // Setup filter functionality
    setupFilterFunctionality();
});

// Load videos data from JSON
function loadVideosData() {
    fetch('data/media.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store videos data globally
            window.videosData = data.videos;
            
            // Populate videos grid
            populateVideos(data.videos);
            
            // Populate filter options
            populateFilterOptions(data.videos);
        })
        .catch(error => {
            console.error('Error loading videos data:', error);
            
            // If there's an error loading the JSON, use fallback data
            const fallbackData = getFallbackVideosData();
            window.videosData = fallbackData;
            populateVideos(fallbackData);
            populateFilterOptions(fallbackData);
        });
}

// Fallback videos data in case the JSON file can't be loaded
function getFallbackVideosData() {
    return [
        {
            id: 1,
            title: "Studio Visit: The Creative Process of Suhas Roy",
            duration: "18:35",
            year: 2024,
            category: "Studio Visit",
            description: "An intimate look into Suhas Roy's studio and creative process, featuring an interview about his inspirations, techniques, and artistic philosophy.",
            thumbnail: "https://via.placeholder.com/600x400?text=Studio+Visit",
            videoUrl: "#"
        },
        {
            id: 2,
            title: "Exhibition Opening: \"Transcending Boundaries\" at National Gallery",
            duration: "12:47",
            year: 2024,
            category: "Exhibition",
            description: "Coverage of the opening night of Suhas Roy's major solo exhibition \"Transcending Boundaries\" at the National Gallery of Modern Art in New Delhi.",
            thumbnail: "https://via.placeholder.com/600x400?text=Exhibition+Opening",
            videoUrl: "#"
        },
        {
            id: 3,
            title: "Artist Talk: The Evolution of Indian Contemporary Art",
            duration: "45:22",
            year: 2023,
            category: "Lecture",
            description: "A lecture by Suhas Roy at the India International Centre discussing the evolution of contemporary Indian art and his place within this tradition.",
            thumbnail: "https://via.placeholder.com/600x400?text=Artist+Talk",
            videoUrl: "#"
        },
        {
            id: 4,
            title: "Interview with Suhas Roy: Inspirations and Influences",
            duration: "28:15",
            year: 2023,
            category: "Interview",
            description: "An in-depth interview with Suhas Roy discussing his artistic inspirations, influences, and the evolution of his distinctive style over the decades.",
            thumbnail: "https://via.placeholder.com/600x400?text=Interview",
            videoUrl: "#"
        },
        {
            id: 5,
            title: "Technique Demonstration: Watercolor Mastery",
            duration: "32:40",
            year: 2022,
            category: "Demonstration",
            description: "Suhas Roy demonstrates his masterful watercolor techniques, sharing insights into his approach to composition, color, and brushwork.",
            thumbnail: "https://via.placeholder.com/600x400?text=Technique+Demo",
            videoUrl: "#"
        },
        {
            id: 6,
            title: "Documentary: The Life and Art of Suhas Roy",
            duration: "52:18",
            year: 2021,
            category: "Documentary",
            description: "A comprehensive documentary exploring Suhas Roy's life journey, artistic development, and significant contributions to contemporary Indian art.",
            thumbnail: "https://via.placeholder.com/600x400?text=Documentary",
            videoUrl: "#"
        }
    ];
}

// Populate videos grid
function populateVideos(videos) {
    const videosGrid = document.getElementById('all-videos');
    if (!videosGrid) return;
    
    // Clear existing content
    videosGrid.innerHTML = '';
    
    if (videos.length === 0) {
        document.querySelector('.no-results').style.display = 'block';
        return;
    }
    
    document.querySelector('.no-results').style.display = 'none';
    
    // Display all videos
    videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.dataset.id = video.id;
        
        // Use placeholder image if the thumbnail path doesn't start with http
        const thumbnailSrc = video.thumbnail.startsWith('http') 
            ? video.thumbnail 
            : `https://via.placeholder.com/600x400?text=${encodeURIComponent(video.title.replace(/\s+/g, '+').substring(0, 30))}`;
        
        videoItem.innerHTML = `
            <div class="video-thumbnail" data-video-url="${video.videoUrl}">
                <img src="${thumbnailSrc}" alt="${video.title}">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-details">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-duration"><i class="far fa-clock"></i> ${video.duration}</p>
                <p class="video-category">${video.category} | ${video.year}</p>
                <p class="video-description">${video.description}</p>
                <button class="btn secondary-btn view-details-btn" data-id="${video.id}">View Details</button>
            </div>
        `;
        
        videosGrid.appendChild(videoItem);
    });
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = parseInt(this.getAttribute('data-id'));
            const video = videos.find(v => v.id === videoId);
            
            if (video) {
                openVideoModal(video);
            }
        });
    });
    
    // Add event listeners to play buttons
    document.querySelectorAll('.video-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = parseInt(this.closest('.video-item').dataset.id);
            const video = videos.find(v => v.id === videoId);
            
            if (video) {
                openVideoModal(video);
            }
        });
    });
}

// Populate filter options
function populateFilterOptions(videos) {
    // Get unique years
    const years = [...new Set(videos.map(v => v.year))].sort((a, b) => b - a);
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
    
    // Get unique categories
    const categories = [...new Set(videos.map(v => v.category))].sort();
    const categoryFilter = document.getElementById('category-filter');
    
    // Clear existing options except the first one
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Setup filter functionality
function setupFilterFunctionality() {
    const yearFilter = document.getElementById('year-filter');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('video-search');
    const searchBtn = document.getElementById('search-btn');
    
    // Function to apply filters
    function applyFilters() {
        const yearValue = yearFilter.value;
        const categoryValue = categoryFilter.value;
        const searchValue = searchInput.value.toLowerCase().trim();
        
        // Get all videos
        const allVideos = window.videosData || [];
        
        // Filter videos based on selected criteria
        const filteredVideos = allVideos.filter(video => {
            // Year filter
            if (yearValue !== 'all' && video.year.toString() !== yearValue) {
                return false;
            }
            
            // Category filter
            if (categoryValue !== 'all' && video.category !== categoryValue) {
                return false;
            }
            
            // Search filter
            if (searchValue && !video.title.toLowerCase().includes(searchValue) && 
                !video.description.toLowerCase().includes(searchValue)) {
                return false;
            }
            
            return true;
        });
        
        // Update videos grid with filtered results
        populateVideos(filteredVideos);
    }
    
    // Add event listeners to filters
    yearFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            applyFilters();
        }
    });
}

// Setup modal functionality
function setupModalFunctionality() {
    const modal = document.querySelector('.video-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const playBtn = document.getElementById('play-video-btn');
    
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
    
    // Play video when clicking the play button
    playBtn.addEventListener('click', function() {
        const videoUrl = this.getAttribute('data-video-url');
        
        // In a real implementation, this would play the video
        alert(`Video player would open here with URL: ${videoUrl}. In a real implementation, this would play the video.`);
    });
}

// Open video modal
function openVideoModal(video) {
    const modal = document.querySelector('.video-modal');
    
    // Use placeholder image if the thumbnail path doesn't start with http
    const thumbnailSrc = video.thumbnail.startsWith('http') 
        ? video.thumbnail 
        : `https://via.placeholder.com/600x400?text=${encodeURIComponent(video.title.replace(/\s+/g, '+').substring(0, 30))}`;
    
    // Update modal content
    document.getElementById('modal-video-thumbnail').src = thumbnailSrc;
    document.getElementById('modal-video-title').textContent = video.title;
    document.getElementById('modal-video-duration').querySelector('span').textContent = video.duration;
    document.getElementById('modal-video-description').textContent = video.description;
    
    const playBtn = document.getElementById('play-video-btn');
    playBtn.setAttribute('data-video-url', video.videoUrl);
    
    // Show modal
    modal.classList.add('active');
} 