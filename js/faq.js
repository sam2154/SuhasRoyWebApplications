document.addEventListener('DOMContentLoaded', () => {
    loadFAQs();
});

async function loadFAQs() {
    try {
        const response = await fetch('data/faq.json');
        const data = await response.json();
        const faqContainer = document.getElementById('faq-container');
        
        data.faqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            
            faqItem.innerHTML = `
                <div class="faq-question">
                    ${faq.question}
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            `;
            
            const question = faqItem.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = faqItem.classList.contains('active');
                
                // Close all other FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Toggle current FAQ item
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
            
            faqContainer.appendChild(faqItem);
        });
    } catch (error) {
        console.error('Error loading FAQs:', error);
        document.getElementById('faq-container').innerHTML = '<p class="error-message">Failed to load FAQ content. Please try again later.</p>';
    }
} 