document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Menu');
    hamburger.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    header.appendChild(hamburger);
      
      hamburger.addEventListener('click', function() {
        header.classList.toggle('menu-open');
        
        const isExpanded = header.classList.contains('menu-open');
        hamburger.setAttribute('aria-expanded', isExpanded);
      });
      
      const navLinks = document.querySelectorAll('.nav a');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          header.classList.remove('menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
      
      document.addEventListener('click', function(event) {
        if (!header.contains(event.target) && header.classList.contains('menu-open')) {
          header.classList.remove('menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
      
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          if (window.innerWidth > 768 && header.classList.contains('menu-open')) {
            header.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
          }
        }, 250);
      });
    });
  