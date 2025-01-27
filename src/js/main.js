// Navigation Menu
document.addEventListener('DOMContentLoaded', () => {
  const menuTrigger = document.querySelector('.menu-trigger');
  const menuOverlay = document.querySelector('.menu-overlay');
  const nav = document.querySelector('.nav');

  // Menu toggle
  if (menuTrigger && menuOverlay) {
    menuTrigger.addEventListener('click', () => {
      menuOverlay.classList.toggle('is-active');
      menuTrigger.classList.toggle('is-active');
      
      // Update button text based on state
      menuTrigger.textContent = menuTrigger.classList.contains('is-active') ? 'Close' : 'Menu';
    });
  }

  // Scroll behavior for navbar
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when page is scrolled
    if (currentScroll > 50) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
    
    lastScroll = currentScroll;
  });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
      
      // Close menu if open
      const menuOverlay = document.querySelector('.menu-overlay');
      const menuTrigger = document.querySelector('.menu-trigger');
      if (menuOverlay.classList.contains('is-active')) {
        menuOverlay.classList.remove('is-active');
        menuTrigger.classList.remove('is-active');
        menuTrigger.textContent = 'Menu';
      }
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  root: null,
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((element) => {
  observer.observe(element);
});

// Popup Management
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const popupClose = popup?.querySelector('.popup__close');
  const hasInteractedWithPopup = localStorage.getItem('hasInteractedWithPopup');
  
  if (popup && !hasInteractedWithPopup) {
    setTimeout(() => {
      popup.classList.add('is-active');
    }, 5000); // 5 seconds delay
  }

  if (popupClose) {
    popupClose.addEventListener('click', () => {
      popup.classList.remove('is-active');
      localStorage.setItem('hasInteractedWithPopup', 'true');
    });
  }

  // Handle form submission
  const popupForm = popup?.querySelector('form');
  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      // Let the form submit normally, but set the localStorage item
      localStorage.setItem('hasInteractedWithPopup', 'true');
    });
  }
});

// Cookie Consent Management
document.addEventListener('DOMContentLoaded', () => {
  const cookieConsent = document.getElementById('cookieConsent');
  const acceptButton = document.getElementById('acceptCookies');
  const declineButton = document.getElementById('declineCookies');
  const closeButton = cookieConsent?.querySelector('.cookie-consent__close');
  const hasConsented = localStorage.getItem('cookieConsent');

  if (cookieConsent && !hasConsented) {
    setTimeout(() => {
      cookieConsent.classList.add('is-active');
    }, 1000);
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieConsent.classList.remove('is-active');
    });
  }

  if (declineButton) {
    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieConsent.classList.remove('is-active');
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      cookieConsent.classList.remove('is-active');
      localStorage.setItem('cookieConsent', 'closed');
    });
  }
});