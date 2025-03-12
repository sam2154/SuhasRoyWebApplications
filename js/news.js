document.addEventListener('DOMContentLoaded', function() {
    // Load news data
    loadNewsData();
    
    // Setup modal functionality
    setupModalFunctionality();
    
    // Setup filter functionality
    setupFilterFunctionality();
});

// Load news data from JSON
function loadNewsData() {
    fetch('data/media.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store news data globally
            window.newsData = data.news;
            
            // Populate news grid
            populateNews(data.news);
            
            // Populate filter options
            populateFilterOptions(data.news);
        })
        .catch(error => {
            console.error('Error loading news data:', error);
            
            // If there's an error loading the JSON, use fallback data
            const fallbackData = getFallbackNewsData();
            window.newsData = fallbackData;
            populateNews(fallbackData);
            populateFilterOptions(fallbackData);
        });
}

// Fallback news data in case the JSON file can't be loaded
function getFallbackNewsData() {
    return [
        {
            id: 1,
            title: "Suhas Roy Receives National Award for Outstanding Contribution to Indian Art",
            date: "2024-05-15",
            source: "The Times of India",
            excerpt: "Renowned artist Suhas Roy was honored with the prestigious National Award for his outstanding contribution to Indian art at a ceremony held in New Delhi yesterday. The award recognizes his five decades of artistic excellence and influence on contemporary Indian art.",
            image: "https://via.placeholder.com/600x400?text=National+Award",
            link: "#"
        },
        {
            id: 2,
            title: "Suhas Roy's Works to be Featured in Major International Exhibition in Paris",
            date: "2024-04-03",
            source: "Art News Magazine",
            excerpt: "The Musée d'Art Moderne de Paris has announced a major exhibition of contemporary Indian art, featuring a significant collection of works by Suhas Roy. The exhibition, titled 'Visions of India,' will open in September 2024 and run for three months.",
            image: "https://via.placeholder.com/600x400?text=Paris+Exhibition",
            link: "#"
        },
        {
            id: 3,
            title: "Suhas Roy Opens New Studio and Gallery Space in Kolkata",
            date: "2024-03-12",
            source: "The Hindu",
            excerpt: "Artist Suhas Roy has inaugurated a new studio and gallery space in Kolkata's art district, designed to serve as both a working studio and a public exhibition space. The 5,000 square foot facility will also host workshops and artist residencies.",
            image: "https://via.placeholder.com/600x400?text=New+Studio",
            link: "#"
        },
        {
            id: 4,
            title: "Record Price for Suhas Roy Painting at Sotheby's Auction",
            date: "2024-02-18",
            source: "Economic Times",
            excerpt: "A painting from Suhas Roy's 'Radha' series fetched a record price of $1.2 million at a Sotheby's auction in London, marking the highest price ever paid for the artist's work and signaling growing international recognition.",
            image: "https://via.placeholder.com/600x400?text=Auction+Record",
            link: "#"
        },
        {
            id: 5,
            title: "Suhas Roy to Lead Master Class Series at National Art School",
            date: "2024-01-25",
            source: "India Today",
            excerpt: "The National Art School has announced a series of master classes to be led by Suhas Roy, offering aspiring artists a rare opportunity to learn techniques and insights from one of India's most celebrated contemporary artists.",
            image: "https://via.placeholder.com/600x400?text=Master+Class",
            link: "#"
        }
    ];
}

// Populate news grid
function populateNews(news) {
    const newsGrid = document.getElementById('all-news');
    if (!newsGrid) return;
    
    // Clear existing content
    newsGrid.innerHTML = '';
    
    if (news.length === 0) {
        document.querySelector('.no-results').style.display = 'block';
        return;
    }
    
    document.querySelector('.no-results').style.display = 'none';
    
    // Display all news items
    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.dataset.id = item.id;
        
        // Format date
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Use placeholder image if the image path doesn't start with http
        const imageSrc = item.image.startsWith('http') 
            ? item.image 
            : `https://via.placeholder.com/600x400?text=${encodeURIComponent(item.title.replace(/\s+/g, '+').substring(0, 30))}`;
        
        newsItem.innerHTML = `
            <div class="news-image">
                <img src="${imageSrc}" alt="${item.title}">
            </div>
            <div class="news-details">
                <span class="news-date">${formattedDate}</span>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-source">${item.source}</p>
                <p class="news-excerpt">${item.excerpt}</p>
                <button class="btn text-btn read-more-btn" data-id="${item.id}">Read More <i class="fas fa-arrow-right"></i></button>
            </div>
        `;
        
        newsGrid.appendChild(newsItem);
    });
    
    // Add event listeners to read more buttons
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const newsId = parseInt(this.getAttribute('data-id'));
            const newsItem = news.find(n => n.id === newsId);
            
            if (newsItem) {
                openNewsModal(newsItem);
            }
        });
    });
}

// Populate filter options
function populateFilterOptions(news) {
    // Get unique sources
    const sources = [...new Set(news.map(n => n.source))].sort();
    const sourceFilter = document.getElementById('source-filter');
    
    // Clear existing options except the first one
    while (sourceFilter.options.length > 1) {
        sourceFilter.remove(1);
    }
    
    sources.forEach(source => {
        const option = document.createElement('option');
        option.value = source;
        option.textContent = source;
        sourceFilter.appendChild(option);
    });
}

// Setup filter functionality
function setupFilterFunctionality() {
    const dateFilter = document.getElementById('date-filter');
    const sourceFilter = document.getElementById('source-filter');
    const searchInput = document.getElementById('news-search');
    const searchBtn = document.getElementById('search-btn');
    
    // Function to apply filters
    function applyFilters() {
        const dateValue = dateFilter.value;
        const sourceValue = sourceFilter.value;
        const searchValue = searchInput.value.toLowerCase().trim();
        
        let filteredNews = window.newsData;
        
        // Filter by date
        if (dateValue !== 'all') {
            const now = new Date();
            const currentYear = now.getFullYear();
            
            if (dateValue === 'recent') {
                // Last 3 months
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(now.getMonth() - 3);
                
                filteredNews = filteredNews.filter(n => {
                    const newsDate = new Date(n.date);
                    return newsDate >= threeMonthsAgo;
                });
            } else if (dateValue === 'this-year') {
                // This year
                filteredNews = filteredNews.filter(n => {
                    const newsDate = new Date(n.date);
                    return newsDate.getFullYear() === currentYear;
                });
            } else if (dateValue === 'last-year') {
                // Last year
                filteredNews = filteredNews.filter(n => {
                    const newsDate = new Date(n.date);
                    return newsDate.getFullYear() === currentYear - 1;
                });
            }
        }
        
        // Filter by source
        if (sourceValue !== 'all') {
            filteredNews = filteredNews.filter(n => n.source === sourceValue);
        }
        
        // Filter by search term
        if (searchValue) {
            filteredNews = filteredNews.filter(n => 
                n.title.toLowerCase().includes(searchValue) || 
                n.excerpt.toLowerCase().includes(searchValue)
            );
        }
        
        // Update news grid
        populateNews(filteredNews);
    }
    
    // Add event listeners to filters
    dateFilter.addEventListener('change', applyFilters);
    sourceFilter.addEventListener('change', applyFilters);
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}

// Setup modal functionality
function setupModalFunctionality() {
    const modal = document.querySelector('.news-modal');
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
        const title = document.getElementById('modal-news-title').textContent;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this news: ${title}`,
                url: window.location.href
            })
            .catch(error => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            alert(`Share this news: ${title}\n${window.location.href}`);
        }
    });
}

// Open news modal
function openNewsModal(newsItem) {
    const modal = document.querySelector('.news-modal');
    
    // Format date
    const date = new Date(newsItem.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Use placeholder image if the image path doesn't start with http
    const imageSrc = newsItem.image.startsWith('http') 
        ? newsItem.image 
        : `https://via.placeholder.com/600x400?text=${encodeURIComponent(newsItem.title.replace(/\s+/g, '+').substring(0, 30))}`;
    
    // Update modal content
    document.getElementById('modal-news-image').src = imageSrc;
    document.getElementById('modal-news-date').textContent = formattedDate;
    document.getElementById('modal-news-title').textContent = newsItem.title;
    document.getElementById('modal-news-source').textContent = `Source: ${newsItem.source}`;
    document.getElementById('modal-news-content').textContent = newsItem.excerpt;
    
    const linkElement = document.getElementById('modal-news-link');
    linkElement.href = newsItem.link;
    
    // Show modal
    modal.classList.add('active');
} 