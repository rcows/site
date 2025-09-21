// Main JavaScript for performance and accessibility enhancements

(function() {
  'use strict';

  // Lazy loading for images
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading is supported
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      });
    } else {
      // Fallback for browsers without native lazy loading
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Keyboard navigation improvements
  function initKeyboardNavigation() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    }

    // Focus management for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.addEventListener('click', function() {
        // Announce to screen readers that link opens in new window
        const announcement = document.createElement('span');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = 'Opens in new window';
        document.body.appendChild(announcement);
        
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      });
    });
  }

  // Initialize everything when DOM is ready
  function init() {
    initLazyLoading();
    initSmoothScrolling();
    initKeyboardNavigation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
