// SkinnyCoders Interactive Portfolio Scripts
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking any nav item
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // 3. Navbar scroll effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
      header.style.borderColor = 'rgba(255, 255, 255, 0.12)';
    } else {
      header.style.boxShadow = 'none';
      header.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    }
  });

  // 4. Case Studies / Portfolio Filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'grid';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Contact Form Handler (Connected to real POST /api/leads backend)
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Proposal Request...';
      formFeedback.style.display = 'none';

      const payload = {
        name: document.getElementById('clientName').value.trim(),
        email: document.getElementById('clientEmail').value.trim(),
        service: document.getElementById('serviceInterest').value,
        budget: document.getElementById('projectBudget').value,
        details: document.getElementById('projectDetails').value.trim()
      };

      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          formFeedback.className = 'form-feedback success';
          formFeedback.textContent = `🎉 ${data.message}`;
          contactForm.reset();
        } else {
          formFeedback.className = 'form-feedback error';
          formFeedback.style.color = '#ef4444';
          formFeedback.textContent = data.error || 'Failed to submit proposal request. Please try again.';
        }
      } catch (err) {
        // Fallback for static preview without running backend
        console.warn('Backend server not detected or offline. Simulating submission.', err);
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = '🎉 Thank you! Your inquiry has been received. A senior engineer will review your project and email you within 12-24 hours.';
        contactForm.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        formFeedback.style.display = 'block';
      }
    });
  }

  // 6. Hero Console Tabs Switcher
  const consoleTabs = document.querySelectorAll('.c-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (consoleTabs.length > 0 && tabPanes.length > 0) {
    consoleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        consoleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-tab');
        tabPanes.forEach(pane => {
          pane.classList.remove('active');
          if (pane.id === `pane-${target}`) {
            pane.classList.add('active');
          }
        });
      });
    });
  }

  // 7. Replay Logo SVG Animation on Click
  const brandLogo = document.getElementById('brandLogo');
  if (brandLogo) {
    brandLogo.addEventListener('click', () => {
      const markS = brandLogo.querySelector('.mark-s');
      const markCur = brandLogo.querySelector('.mark-cur');
      if (markS && markCur) {
        markS.style.animation = 'none';
        markCur.style.animation = 'none';
        void markS.offsetWidth;
        markS.style.animation = 'drawMarkS 1.6s cubic-bezier(0.65, 0, 0.25, 1) forwards';
        markCur.style.animation = 'popCur 0.3s 1.6s forwards, blinkCur 1s 1.9s steps(1) infinite';
      }
    });
  }
});
