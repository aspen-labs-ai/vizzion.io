// ============================================
// VIZZION MAIN JAVASCRIPT
// Interactions and enhancements
// ============================================

(function() {
  'use strict';

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenuButton.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when nav link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMobileMenu();
    });
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add active state to widget options (demo interaction)
  const widgetOptions = document.querySelectorAll('.widget-option');
  widgetOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active from all
      widgetOptions.forEach(opt => opt.style.borderColor = 'var(--color-border)');
      // Add active to clicked
      this.style.borderColor = 'var(--color-accent)';
      this.style.borderWidth = '3px';
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation (excluding step-card-v2 which has CSS animation)
  const animateElements = document.querySelectorAll('.industry-card, .pricing-card');
  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

  // Prevent layout shift on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resize-animation-stopper');
    }, 400);
  });

  // Track CTA clicks (placeholder for analytics)
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const btnText = this.textContent.trim();
      console.log('CTA clicked:', btnText);
      // Add your analytics tracking here
      // e.g., gtag('event', 'cta_click', { button_text: btnText });
    });
  });

  // Add hover effect to pricing cards
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!this.classList.contains('pricing-card-featured')) {
        this.style.borderColor = 'var(--color-accent)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('pricing-card-featured')) {
        this.style.borderColor = 'var(--color-border)';
      }
    });
  });

  console.log('✨ Vizzion loaded successfully');
})();

// ============================================
// HOW IT WORKS - CARD INTERACTIONS
// ============================================
(function() {
  'use strict';

  // Interactive swatches in step 2 card
  const swatchItems = document.querySelectorAll('.swatch-item');
  swatchItems.forEach(swatch => {
    swatch.addEventListener('click', function() {
      // Remove active from siblings
      this.parentElement.querySelectorAll('.swatch-item').forEach(s => {
        s.classList.remove('active-swatch');
      });
      // Add active to clicked
      this.classList.add('active-swatch');
      
      // Add checkmark SVG if not already present
      if (!this.querySelector('svg')) {
        const checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkmark.setAttribute('width', '16');
        checkmark.setAttribute('height', '16');
        checkmark.setAttribute('viewBox', '0 0 20 20');
        checkmark.setAttribute('fill', 'none');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M5 10l3 3 7-7');
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        
        checkmark.appendChild(path);
        this.appendChild(checkmark);
      }
    });
  });

  console.log('🎨 Step cards initialized');
})();

// ============================================
// WIDGET STEPPER AUTO-CYCLING
// ============================================
(function() {
  'use strict';

  const STEP_DURATION = 3500; // 3.5 seconds per step
  let currentStep = 1;
  let stepTimer = null;
  let isPaused = false;

  const steps = document.querySelectorAll('.widget-step');
  const dots = document.querySelectorAll('.stepper-dot');
  const lines = document.querySelectorAll('.stepper-line');

  // Check if widget exists on page
  if (steps.length === 0) {
    return;
  }

  function updateProgressIndicator(stepNumber) {
    // Update dots
    dots.forEach((dot, index) => {
      if (index + 1 <= stepNumber) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update lines (lines appear before their following dot)
    lines.forEach((line, index) => {
      if (index + 1 < stepNumber) {
        line.classList.add('completed');
      } else {
        line.classList.remove('completed');
      }
    });
  }

  function showStep(stepNumber) {
    // Hide all steps
    steps.forEach(step => {
      step.classList.remove('active');
    });

    // Show current step
    const targetStep = document.querySelector(`.widget-step[data-step="${stepNumber}"]`);
    if (targetStep) {
      targetStep.classList.add('active');
    }

    // Update progress indicator
    updateProgressIndicator(stepNumber);

    currentStep = stepNumber;
  }

  function nextStep() {
    if (isPaused) return;

    let next = currentStep + 1;
    
    // Loop back to step 1 after step 4
    if (next > 4) {
      next = 1;
    }

    showStep(next);
  }

  function startCycling() {
    // Clear any existing timer
    if (stepTimer) {
      clearInterval(stepTimer);
    }

    // Start auto-cycling
    stepTimer = setInterval(nextStep, STEP_DURATION);
  }

  function stopCycling() {
    if (stepTimer) {
      clearInterval(stepTimer);
      stepTimer = null;
    }
  }

  // Pause on hover (for accessibility and user control)
  const widgetMockup = document.querySelector('.widget-mockup');
  if (widgetMockup) {
    widgetMockup.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    widgetMockup.addEventListener('mouseleave', () => {
      isPaused = false;
    });
  }

  // Pause when tab is not visible (save resources)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCycling();
    } else {
      startCycling();
    }
  });

  // Initialize - show step 1 and start cycling
  showStep(1);
  startCycling();

  // Expose controls for debugging
  window.widgetStepper = {
    goToStep: showStep,
    pause: stopCycling,
    resume: startCycling,
    getCurrentStep: () => currentStep
  };

  console.log('🔄 Widget stepper initialized - auto-cycling every 3.5s');
})();

// ============================================
// INDUSTRIES ACCORDION
// ============================================
(function() {
  'use strict';

  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  
  if (accordionTriggers.length === 0) {
    return;
  }
  
  function closeAccordion(trigger) {
    trigger.setAttribute('aria-expanded', 'false');
  }
  
  function openAccordion(trigger) {
    trigger.setAttribute('aria-expanded', 'true');
  }
  
  function toggleAccordion(trigger) {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      closeAccordion(trigger);
    } else {
      openAccordion(trigger);
    }
    
    // Track analytics (placeholder)
    const industryId = trigger.closest('.accordion-item').dataset.industry;
    console.log('Industry accordion toggled:', industryId, isExpanded ? 'closed' : 'opened');
  }
  
  // Add click handlers to accordion triggers
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      toggleAccordion(trigger);
    });
    
    // Keyboard support
    trigger.addEventListener('keydown', (e) => {
      // Enter or Space to toggle
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(trigger);
      }
    });
  });
  
  // Observe for scroll animations
  const accordionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        accordionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  const industriesAccordion = document.querySelector('.industries-accordion');
  if (industriesAccordion) {
    industriesAccordion.style.opacity = '0';
    industriesAccordion.style.transform = 'translateY(20px)';
    industriesAccordion.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    accordionObserver.observe(industriesAccordion);
  }
  
  console.log('✨ Industries accordion initialized - Shadcn style');
})();

// ============================================
// CODE TYPING ANIMATION
// ============================================
(function() {
  'use strict';

  const typingOutput = document.getElementById('typing-output');
  const typingCursor = document.querySelector('.typing-cursor');
  const codeWindow = document.querySelector('#integration .code-window');
  
  if (!typingOutput || !typingCursor) {
    return;
  }

  // Code to type out with syntax highlighting tokens
  const codeLines = [
    {
      text: '<script src="https://cdn.vizzion.app/widget.js"></script>',
      tokens: [
        { type: 'keyword', text: '<script' },
        { type: 'function', text: ' src' },
        { type: 'plain', text: '=' },
        { type: 'string', text: '"https://cdn.vizzion.app/widget.js"' },
        { type: 'keyword', text: '></script>' }
      ]
    },
    {
      text: '<div id="vizzion-widget" data-products="roofing"></div>',
      tokens: [
        { type: 'keyword', text: '<div' },
        { type: 'function', text: ' id' },
        { type: 'plain', text: '=' },
        { type: 'string', text: '"vizzion-widget"' },
        { type: 'function', text: ' data-products' },
        { type: 'plain', text: '=' },
        { type: 'string', text: '"roofing"' },
        { type: 'keyword', text: '></div>' }
      ]
    }
  ];

  let isTyping = false;
  let hasTyped = false;
  let currentLineIndex = 0;
  let currentTokenIndex = 0;
  let currentCharIndex = 0;
  let typingTimer = null;

  // Create span with syntax highlighting class
  function createHighlightedSpan(type, text) {
    const span = document.createElement('span');
    span.className = `code-${type}`;
    span.textContent = text;
    return span;
  }

  // Type one character
  function typeCharacter() {
    if (currentLineIndex >= codeLines.length) {
      // Finished typing all lines
      finishTyping();
      return;
    }

    const currentLine = codeLines[currentLineIndex];
    const currentToken = currentLine.tokens[currentTokenIndex];

    if (!currentToken) {
      // Move to next line
      typingOutput.appendChild(document.createTextNode('\n'));
      currentLineIndex++;
      currentTokenIndex = 0;
      currentCharIndex = 0;
      
      // Pause between lines
      typingTimer = setTimeout(typeCharacter, 500);
      return;
    }

    if (currentCharIndex === 0) {
      // Start new token - create the span
      const span = createHighlightedSpan(currentToken.type, '');
      typingOutput.appendChild(span);
    }

    // Get the last span (current token being typed)
    const spans = typingOutput.querySelectorAll('span');
    const currentSpan = spans[spans.length - 1];

    // Add next character
    currentSpan.textContent += currentToken.text[currentCharIndex];
    currentCharIndex++;

    // Check if token is complete
    if (currentCharIndex >= currentToken.text.length) {
      // Move to next token
      currentTokenIndex++;
      currentCharIndex = 0;
    }

    // Continue typing with random variation in speed (50-80ms)
    const delay = 50 + Math.random() * 30;
    typingTimer = setTimeout(typeCharacter, delay);
  }

  function finishTyping() {
    isTyping = false;
    hasTyped = true;
    typingCursor.classList.remove('typing');
    
    // Wait 2 seconds, then loop (restart from beginning)
    setTimeout(() => {
      if (!document.hidden) {
        resetAndStartTyping();
      }
    }, 2000);
  }

  function resetAndStartTyping() {
    // Clear output
    typingOutput.innerHTML = '';
    
    // Reset state
    currentLineIndex = 0;
    currentTokenIndex = 0;
    currentCharIndex = 0;
    isTyping = true;
    hasTyped = false;
    
    // Start typing
    typingCursor.classList.add('typing');
    typeCharacter();
  }

  function startTypingAnimation() {
    if (isTyping || hasTyped) {
      return;
    }

    resetAndStartTyping();
  }

  function stopTypingAnimation() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
    isTyping = false;
  }

  // Intersection Observer - start typing when scrolled into view
  const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTypingAnimation();
      } else {
        stopTypingAnimation();
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px'
  });

  if (codeWindow) {
    typingObserver.observe(codeWindow);
  }

  // Pause/resume on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTypingAnimation();
    } else if (codeWindow) {
      // Check if code window is in view
      const rect = codeWindow.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView && !isTyping) {
        resetAndStartTyping();
      }
    }
  });

  // Expose controls for debugging
  window.typingAnimation = {
    start: resetAndStartTyping,
    stop: stopTypingAnimation,
    reset: () => {
      stopTypingAnimation();
      typingOutput.innerHTML = '';
      currentLineIndex = 0;
      currentTokenIndex = 0;
      currentCharIndex = 0;
      hasTyped = false;
    }
  };

  console.log('⌨️  Code typing animation initialized');
})();
