document.addEventListener('DOMContentLoaded', () => {
  const contactModal = document.getElementById('contactModal');
  const openModalBtn = document.querySelector('.open-modal-btn');
  const closeBtns = contactModal ? contactModal.querySelectorAll('.close-btn') : [];
  const submitBtn = contactModal ? contactModal.querySelector('.submit-btn') : null;

  if (!contactModal || !openModalBtn || closeBtns.length === 0) {
    console.error('Modal elements not found.');
    return;
  }

  // Trap keyboard focus inside the modal for accessibility
  function trapFocus(e) {
    if (!contactModal.classList.contains('is-visible')) return;

    const focusableEls = contactModal.querySelectorAll('input, textarea, button');
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  // Opens the modal with focus management
  const openModal = () => {
    contactModal.classList.add('is-visible');
    contactModal.setAttribute('aria-hidden', 'false');
    const firstFocusableElement = contactModal.querySelector('input, textarea, button:not(.close-btn)');
    if (firstFocusableElement) firstFocusableElement.focus();
    contactModal.addEventListener('click', closeModalOutside);
    document.addEventListener('keydown', trapFocus);
  };

  // Closes the modal and restores focus
  const closeModal = () => {
    contactModal.classList.remove('is-visible');
    contactModal.setAttribute('aria-hidden', 'true');
    contactModal.removeEventListener('click', closeModalOutside);
    document.removeEventListener('keydown', trapFocus);
    openModalBtn.focus();
  };

  // Close modal if clicking outside content
  const closeModalOutside = (event) => {
    if (event.target === contactModal) closeModal();
  };

  // Event listeners
  openModalBtn.addEventListener('click', openModal);
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && contactModal.classList.contains('is-visible')) {
      closeModal();
    }
  });

  // Form submission with Fetch API and error handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const formUrl = contactForm.getAttribute('action');

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const response = await fetch(formUrl, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          alert('Thank you for your message! I will get back to you soon.');
          contactForm.reset();
          closeModal();
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
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    });
  }

  // Intersection Observer to fade in page sections on scroll
  const sections = document.querySelectorAll('section:not(.hero-section)');
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  sections.forEach(section => sectionObserver.observe(section));
});
