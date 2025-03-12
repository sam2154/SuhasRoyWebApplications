document.addEventListener('DOMContentLoaded', function() {
    // Load media data
    loadMediaData();
    
    // Setup category tabs
    setupCategoryTabs();
    
    // Setup smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Setup photograph modal functionality
    setupPhotographModal();
    
    // Setup video play functionality
    setupVideoPlay();
});

// Load media data from JSON
function loadMediaData() {
    fetch('data/media.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate publications section
            populatePublications(data.publications);
            
            // Populate news section
            populateNews(data.news);
            
            // Populate videos section
            populateVideos(data.videos);
            
            // Populate photographs section
            populatePhotographs(data.photographs);
        })
        .catch(error => {
            console.error('Error loading media data:', error);
            
            // Use fallback data if JSON fails to load
            const fallbackData = {
                publications: getFallbackPublications(),
                news: getFallbackNews(),
                videos: getFallbackVideos(),
                photographs: getFallbackPhotographs()
            };
            
            populatePublications(fallbackData.publications);
            populateNews(fallbackData.news);
            populateVideos(fallbackData.videos);
            populatePhotographs(fallbackData.photographs);
        });
}

// Fallback data functions
function getFallbackPublications() {
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
        }
    ];
}

function getFallbackNews() {
    return [
        {
            id: 1,
            title: "Suhas Roy Receives National Award for Outstanding Contribution to Indian Art",
            date: "2024-05-15",
            source: "The Times of India",
            excerpt: "Renowned artist Suhas Roy was honored with the prestigious National Award for his outstanding contribution to Indian art at a ceremony held in New Delhi yesterday.",
            image: "https://via.placeholder.com/600x400?text=National+Award",
            link: "#"
        },
        {
            id: 2,
            title: "Suhas Roy's Works to be Featured in Major International Exhibition in Paris",
            date: "2024-04-03",
            source: "Art News Magazine",
            excerpt: "The Musée d'Art Moderne de Paris has announced a major exhibition of contemporary Indian art, featuring a significant collection of works by Suhas Roy.",
            image: "https://via.placeholder.com/600x400?text=Paris+Exhibition",
            link: "#"
        },
        {
            id: 3,
            title: "Suhas Roy Opens New Studio and Gallery Space in Kolkata",
            date: "2024-03-12",
            source: "The Hindu",
            excerpt: "Artist Suhas Roy has inaugurated a new studio and gallery space in Kolkata's art district, designed to serve as both a working studio and a public exhibition space.",
            image: "https://via.placeholder.com/600x400?text=New+Studio",
            link: "#"
        }
    ];
}

function getFallbackVideos() {
    return [
        {
            id: 1,
            title: "Studio Visit: The Creative Process of Suhas Roy",
            duration: "18:35",
            description: "An intimate look into Suhas Roy's studio and creative process, featuring an interview about his inspirations, techniques, and artistic philosophy.",
            thumbnail: "https://via.placeholder.com/600x400?text=Studio+Visit",
            videoUrl: "#"
        },
        {
            id: 2,
            title: "Exhibition Opening: \"Transcending Boundaries\" at National Gallery",
            duration: "12:47",
            description: "Coverage of the opening night of Suhas Roy's major solo exhibition \"Transcending Boundaries\" at the National Gallery of Modern Art in New Delhi.",
            thumbnail: "https://via.placeholder.com/600x400?text=Exhibition+Opening",
            videoUrl: "#"
        },
        {
            id: 3,
            title: "Artist Talk: The Evolution of Indian Contemporary Art",
            duration: "45:22",
            description: "A lecture by Suhas Roy at the India International Centre discussing the evolution of contemporary Indian art and his place within this tradition.",
            thumbnail: "https://via.placeholder.com/600x400?text=Artist+Talk",
            videoUrl: "#"
        }
    ];
}

function getFallbackPhotographs() {
    return [
        {
            id: 1,
            title: "Suhas Roy in His Studio, 2023",
            photographer: "Raghu Rai",
            description: "The artist at work in his Kolkata studio, captured by renowned photographer Raghu Rai.",
            image: "https://via.placeholder.com/600x400?text=Studio+Portrait"
        },
        {
            id: 2,
            title: "Installation View, Jehangir Art Gallery, 2022",
            photographer: "Dayanita Singh",
            description: "A view of Suhas Roy's solo exhibition at the prestigious Jehangir Art Gallery in Mumbai.",
            image: "https://via.placeholder.com/600x400?text=Gallery+Installation"
        },
        {
            id: 3,
            title: "Portrait of the Artist, 2021",
            photographer: "Pablo Bartholomew",
            description: "An intimate portrait of Suhas Roy by Padma Shri awardee Pablo Bartholomew.",
            image: "https://via.placeholder.com/600x400?text=Artist+Portrait"
        },
        {
            id: 4,
            title: "Working on 'Spiritual Resonance' Series, 2023",
            photographer: "Ketaki Sheth",
            description: "The artist working on his acclaimed 'Spiritual Resonance' series in his studio.",
            image: "https://via.placeholder.com/600x400?text=Working+Artist"
        },
        {
            id: 5,
            title: "With Collectors at India Art Fair, 2024",
            photographer: "Sooni Taraporevala",
            description: "Suhas Roy discussing his work with collectors at the India Art Fair in New Delhi.",
            image: "https://via.placeholder.com/600x400?text=Art+Fair"
        },
        {
            id: 6,
            title: "Early Career, Santiniketan, 1995",
            photographer: "Personal Archive",
            description: "A rare photograph from the artist's early career at Santiniketan, where he studied under master artists.",
            image: "https://via.placeholder.com/600x400?text=Early+Career"
        }
    ];
}

// Populate publications section
function populatePublications(publications) {
    const publicationsGrid = document.querySelector('.publications-grid');
    if (!publicationsGrid) return;
    
    // Clear existing content
    publicationsGrid.innerHTML = '';
    
    // Display first 3 publications
    publications.slice(0, 3).forEach(publication => {
        const publicationItem = document.createElement('div');
        publicationItem.className = 'publication-item';
        
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
                <a href="${publication.link}" class="btn secondary-btn">View Details</a>
            </div>
        `;
        
        publicationsGrid.appendChild(publicationItem);
    });
}

// Populate news section
function populateNews(news) {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;
    
    // Clear existing content
    newsGrid.innerHTML = '';
    
    // Display first 3 news items
    news.slice(0, 3).forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
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
                <a href="${item.link}" class="btn text-btn">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        
        newsGrid.appendChild(newsItem);
    });
}

// Populate videos section
function populateVideos(videos) {
    const videosGrid = document.querySelector('.videos-grid');
    if (!videosGrid) return;
    
    // Clear existing content
    videosGrid.innerHTML = '';
    
    // Display first 3 videos
    videos.slice(0, 3).forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        
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
                <p class="video-description">${video.description}</p>
            </div>
        `;
        
        videosGrid.appendChild(videoItem);
    });
    
    // Reinitialize video play functionality
    setupVideoPlay();
}

// Populate photographs section
function populatePhotographs(photographs) {
    const photographsGrid = document.querySelector('.photographs-grid');
    if (!photographsGrid) return;
    
    // Clear existing content
    photographsGrid.innerHTML = '';
    
    // Display first 6 photographs
    photographs.slice(0, 6).forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photograph-item';
        
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
    });
    
    // Reinitialize photograph modal functionality
    setupPhotographModal();
}

// Setup category tabs
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    const sections = document.querySelectorAll('.media-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Scroll to the target section
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Check which section is in view on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const id = section.getAttribute('id');
                
                tabs.forEach(tab => {
                    if (tab.getAttribute('href') === `#${id}`) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
            }
        });
    });
}

// Setup smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Setup photograph modal functionality
function setupPhotographModal() {
    const photographItems = document.querySelectorAll('.photograph-item');
    
    photographItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create modal if it doesn't exist
            let modal = document.querySelector('.media-modal.photograph-modal');
            
            if (!modal) {
                modal = document.createElement('div');
                modal.className = 'media-modal photograph-modal';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'modal-content';
                
                const closeBtn = document.createElement('span');
                closeBtn.className = 'close-modal';
                closeBtn.innerHTML = '&times;';
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
                
                const modalImage = document.createElement('img');
                modalImage.id = 'modal-photograph';
                
                const modalCaption = document.createElement('div');
                modalCaption.className = 'modal-caption';
                
                modalContent.appendChild(closeBtn);
                modalContent.appendChild(modalImage);
                modalContent.appendChild(modalCaption);
                modal.appendChild(modalContent);
                
                document.body.appendChild(modal);
                
                // Close modal when clicking outside
                modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.classList.remove('active');
                    }
                });
            }
            
            // Update modal content
            const img = this.querySelector('img');
            const details = this.querySelector('.photograph-details');
            
            const modalImg = document.getElementById('modal-photograph');
            const modalCaption = document.querySelector('.modal-caption');
            
            modalImg.src = img.src;
            modalCaption.innerHTML = details.innerHTML;
            
            // Show modal
            modal.classList.add('active');
        });
    });
}

// Setup video play functionality
function setupVideoPlay() {
    const videoItems = document.querySelectorAll('.video-thumbnail');
    
    videoItems.forEach(item => {
        item.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video-url');
            
            // In a real implementation, this would open a video player or YouTube embed
            // For now, we'll just show an alert
            alert(`Video player would open here with URL: ${videoUrl}. In a real implementation, this would play the video.`);
        });
    });
} 