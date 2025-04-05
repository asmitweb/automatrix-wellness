document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuButton = document.querySelector('.md\\:hidden');
    const mobileMenu = document.createElement('div');
    
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', function() {
        // Create mobile menu if it doesn't exist
        if (!document.querySelector('.mobile-menu-container')) {
          mobileMenu.className = 'mobile-menu-container fixed inset-0 bg-white z-50 p-6 transform translate-y-full transition-transform duration-300';
          mobileMenu.innerHTML = `
            <div class="flex justify-between items-center mb-8">
              <a href="/" class="text-2xl font-bold text-indigo-600 flex items-center">
                <i class="fas fa-brain mr-2"></i> AutoMatrix
              </a>
              <button class="close-mobile-menu text-gray-600">
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>
            <nav class="flex flex-col space-y-6">
              <a href="/" class="text-xl font-medium text-gray-700 hover:text-indigo-600">Home</a>
              <a href="/ai-assistant" class="text-xl font-medium text-gray-700 hover:text-indigo-600">AI Wellbeing Assistant</a>
              <a href="/journal" class="text-xl font-medium text-gray-700 hover:text-indigo-600">Daily Journal</a>
              <a href="/team" class="text-xl font-medium text-gray-700 hover:text-indigo-600">Team</a>
            </nav>
          `;
          document.body.appendChild(mobileMenu);
          
          // Add event listener to close button
          const closeButton = mobileMenu.querySelector('.close-mobile-menu');
          closeButton.addEventListener('click', function() {
            mobileMenu.classList.add('translate-y-full');
            setTimeout(() => {
              document.body.removeChild(mobileMenu);
            }, 300);
          });
          
          // Show menu
          setTimeout(() => {
            mobileMenu.classList.remove('translate-y-full');
          }, 10);
        }
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Animation on scroll initialization
    function initAnimations() {
      const animateElements = document.querySelectorAll('.animate-float, .fade-in-element');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('animate-float')) {
              entry.target.style.animation = 'float 6s ease-in-out infinite';
              const delay = entry.target.getAttribute('animation-delay') || '0';
              entry.target.style.animationDelay = `${delay}ms`;
            } else if (entry.target.classList.contains('fade-in-element')) {
              entry.target.style.animation = 'fadeIn 1s ease-in-out forwards';
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
  
      animateElements.forEach(element => {
        observer.observe(element);
      });
    }
  
    // Initialize animations
    initAnimations();
  
    // Form submission handling (for any general forms)
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(e) {
        // Add general form submission handling if needed
        // This can be overridden by specific form handlers in other JS files
      });
    });
  
    // Footer year update
    const yearElements = document.querySelectorAll('.current-year');
    if (yearElements.length > 0) {
      const currentYear = new Date().getFullYear();
      yearElements.forEach(element => {
        element.textContent = currentYear;
      });
    }
  
    // Add active class to current page link in navigation
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  });
  
  // Utility functions that might be used across the site
  function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }
  
  function throttle(func, limit = 100) {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }