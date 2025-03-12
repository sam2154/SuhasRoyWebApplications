document.addEventListener('DOMContentLoaded', function() {
    // Check for artwork query parameter
    checkArtworkQuery();
    
    // Setup contact form validation
    setupContactForm();
});

// Check for artwork query parameter and pre-fill form
function checkArtworkQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const artworkId = urlParams.get('artwork');
    
    if (!artworkId) return;
    
    // Get the artwork select element
    const artworkSelect = document.getElementById('artwork');
    if (!artworkSelect) return;
    
    // Fetch artworks data
    fetchData('data/artworks.json')
        .then(artworks => {
            if (!artworks) return;
            
            // Find the artwork by ID
            const artwork = artworks.find(item => item.id.toString() === artworkId);
            if (!artwork) return;
            
            // Pre-select the artwork in the dropdown
            const option = document.createElement('option');
            option.value = artwork.id;
            option.textContent = artwork.title;
            option.selected = true;
            artworkSelect.appendChild(option);
            
            // Set the subject to include the artwork title
            const subjectField = document.getElementById('subject');
            if (subjectField) {
                subjectField.value = `Inquiry about "${artwork.title}"`;
            }
            
            // Add artwork details to the message
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `I am interested in the artwork "${artwork.title}" (${formatCurrency(artwork.price)}).\n\nPlease provide more information about this piece.\n\n`;
            }
            
            // Scroll to the form
            const contactForm = document.querySelector('.contact-form');
            if (contactForm) {
                contactForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
}

// Setup contact form validation and submission
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Populate artwork dropdown
    populateArtworkDropdown();
    
    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');
        
        // Validate form fields
        let isValid = true;
        
        if (!nameField.value.trim()) {
            showError(nameField, 'Please enter your name');
            isValid = false;
        } else {
            removeError(nameField);
        }
        
        if (!emailField.value.trim()) {
            showError(emailField, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(emailField.value)) {
            showError(emailField, 'Please enter a valid email address');
            isValid = false;
        } else {
            removeError(emailField);
        }
        
        if (phoneField.value.trim() && !isValidPhone(phoneField.value)) {
            showError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        } else {
            removeError(phoneField);
        }
        
        if (!subjectField.value.trim()) {
            showError(subjectField, 'Please enter a subject');
            isValid = false;
        } else {
            removeError(subjectField);
        }
        
        if (!messageField.value.trim()) {
            showError(messageField, 'Please enter your message');
            isValid = false;
        } else {
            removeError(messageField);
        }
        
        // If form is valid, submit it
        if (isValid) {
            // In a real application, you would send the form data to a server
            // For this demo, we'll just show a success message
            
            // Hide the form
            contactForm.style.display = 'none';
            
            // Show success message
            const successMessage = createElement('div', 'success-message');
            const heading = createElement('h3', null, 'Thank You!');
            const message = createElement('p', null, 'Your message has been sent successfully. We will get back to you soon.');
            const backButton = createElement('button', 'btn primary-btn', 'Back to Contact Form');
            
            successMessage.appendChild(heading);
            successMessage.appendChild(message);
            successMessage.appendChild(backButton);
            
            contactForm.parentNode.appendChild(successMessage);
            
            // Reset form when clicking back button
            backButton.addEventListener('click', function() {
                contactForm.reset();
                contactForm.style.display = 'block';
                successMessage.remove();
            });
        }
    });
}

// Populate artwork dropdown with options from JSON
async function populateArtworkDropdown() {
    const artworkSelect = document.getElementById('artwork');
    if (!artworkSelect) return;
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select an artwork (optional)';
    artworkSelect.appendChild(defaultOption);
    
    // Fetch artworks data
    const artworks = await fetchData('data/artworks.json');
    if (!artworks) return;
    
    // Add options for each artwork
    artworks.forEach(artwork => {
        const option = document.createElement('option');
        option.value = artwork.id;
        option.textContent = artwork.title;
        artworkSelect.appendChild(option);
    });
}

// Show error message for a form field
function showError(field, message) {
    // Remove any existing error
    removeError(field);
    
    // Add error class to the field
    field.classList.add('error');
    
    // Create and append error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    field.parentNode.appendChild(errorMessage);
}

// Remove error message from a form field
function removeError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number format
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
} 