// modalHandler.js

document.addEventListener('DOMContentLoaded', () => {
    const contactModal = document.getElementById('contactModal');
    const openModalBtn = document.querySelector('.open-modal-btn');
    // Using querySelectorAll to get all close buttons (e.g., inside modal-actions and potentially a standalone X)
    const closeBtns = contactModal.querySelectorAll('.close-btn');
    const submitBtn = contactModal.querySelector('.submit-btn'); // Get the submit button

    // It's good practice to log if essential elements are missing
    if (!contactModal || !openModalBtn || closeBtns.length === 0) {
        console.error('Modal elements not found. Ensure #contactModal, .open-modal-btn, and .close-btn exist.');
        return; // Exit if essential elements are missing
    }

    // Function to open the modal
    const openModal = () => {
        contactModal.classList.add('is-visible');
        contactModal.setAttribute('aria-hidden', 'false');
        // Set focus to the first interactive element inside the modal for accessibility
        const firstFocusableElement = contactModal.querySelector('input, textarea, button:not(.close-btn)'); // Exclude the close button
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
        // Add event listener to close modal if clicking outside
        contactModal.addEventListener('click', closeModalOutside);
    };

    // Function to close the modal
    const closeModal = () => {
        contactModal.classList.remove('is-visible');
        contactModal.setAttribute('aria-hidden', 'true');
        // Remove event listener to prevent memory leaks
        contactModal.removeEventListener('click', closeModalOutside);
        // Return focus to the element that opened the modal (optional, but good for accessibility)
        openModalBtn.focus();
    };

    // Function to close modal if click is outside the modal-content
    const closeModalOutside = (event) => {
        // Check if the click occurred directly on the modal overlay, not inside modal-content
        if (event.target === contactModal) {
            closeModal();
        }
    };

    // Event Listeners
    openModalBtn.addEventListener('click', openModal);

    // Add event listener to all close buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });


    // Close modal with ESC key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && contactModal.classList.contains('is-visible')) {
            closeModal();
        }
    });

    // Handle form submission (optional: add AJAX/fetch for a smoother experience)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(contactForm);
            const formUrl = contactForm.getAttribute('action'); // Get the Formspree URL from the form's action attribute

            try {
                // Display a loading indicator if desired (e.g., disable submit button)
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                const response = await fetch(formUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree to return JSON
                    }
                });

                if (response.ok) {
                    alert('Thank you for your message! I will get back to you soon.');
                    contactForm.reset(); // Clear the form
                    closeModal(); // Close the modal
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        alert(`Error: ${data.errors.map(error => error.message).join(', ')}`);
                    } else {
                        alert('Oops! There was a problem sending your message. Please try again.');
                    }
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('Network error. Please check your connection and try again.');
            } finally {
                // Re-enable submit button and reset text
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
        });
    }

    // Optional: Section fade-in on scroll (Intersection Observer)
    const sections = document.querySelectorAll('section:not(.hero-section)'); // Exclude hero if it's always visible
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible'); // Add a class to trigger animation
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});