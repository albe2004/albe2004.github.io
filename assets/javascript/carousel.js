document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('projects-carousel');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
   
  let position = 0;
  const totalItems = document.querySelectorAll('.carousel-item').length;
  const isMobile = () => window.innerWidth <= 768;

  // SCORRIMENTO COERENTE: Calcola quanti pixel scorrere basandosi sulla larghezza del container
  function getScrollAmount() {
    const container = carousel.parentElement;
    const containerWidth = container.offsetWidth;
    
    // Scorre sempre del 70% della larghezza del container visibile
    // Questo garantisce movimento significativo ma mantiene continuità visiva
    return Math.floor(containerWidth * 0.7);
  }

  // POSIZIONI MASSIME: Calcola fino a dove può scorrere
  function getMaxScrollPosition() {
    if (isMobile()) return 0;
    
    const container = carousel.parentElement;
    const containerWidth = container.offsetWidth;
    
    // Calcola la larghezza totale del contenuto
    let totalContentWidth = 0;
    const items = document.querySelectorAll('.carousel-item');
    
    items.forEach(item => {
      totalContentWidth += item.offsetWidth + 20; // larghezza item + gap
    });
    
    // Massimo scroll = contenuto totale - container visibile
    const maxScroll = Math.max(0, totalContentWidth - containerWidth);
    
    // Converti in numero di "posizioni" basate su quanto scorre per click
    const scrollAmount = getScrollAmount();
    return Math.ceil(maxScroll / scrollAmount);
  }

  function initCarousel() {
    position = 0; // Reset posizione
    
    if (isMobile()) {
      setupMobileScroll();
    } else {
      setupDesktopControls();
    }
    updateControls();
  }
  
  function setupMobileScroll() {
    // Reset transform
    carousel.style.transform = 'translateX(0px)';
    
    // Abilita scroll nativo
    const container = carousel.parentElement;
    container.style.overflowX = 'auto';
    container.style.overflowY = 'hidden';
    container.style.scrollBehavior = 'smooth';
    
    // Nascondi scrollbar
    container.style.scrollbarWidth = 'none';
    container.style.msOverflowStyle = 'none';
    
    // Assicura che il carousel sia largo abbastanza
    let totalWidth = 0;
    const items = document.querySelectorAll('.carousel-item');
    items.forEach(item => {
      totalWidth += item.offsetWidth + 20;
    });
    carousel.style.width = `${totalWidth}px`;
  }
  
  function setupDesktopControls() {
    // Reset scroll nativo
    const container = carousel.parentElement;
    container.style.overflowX = 'hidden';
    container.scrollLeft = 0;
    carousel.style.width = 'auto';
    
    // Aggiungi event listeners
    prevBtn.removeEventListener('click', handlePrevClick);
    nextBtn.removeEventListener('click', handleNextClick);
    prevBtn.addEventListener('click', handlePrevClick);
    nextBtn.addEventListener('click', handleNextClick);
  }
  
  function handlePrevClick() {
    if (position > 0) {
      position--;
      updateCarouselPosition();
      updateControls();
    }
  }
  
  function handleNextClick() {
    const maxPos = getMaxScrollPosition();
    if (position < maxPos) {
      position++;
      updateCarouselPosition();
      updateControls();
    }
  }

  function updateCarouselPosition() {
    if (isMobile()) return;
    
    const scrollAmount = getScrollAmount();
    const translateX = position * scrollAmount;
    
    carousel.style.transform = `translateX(-${translateX}px)`;
    
    console.log(`Scroll - Position: ${position}, Translate: -${translateX}px, Max: ${getMaxScrollPosition()}`);
  }

  function updateControls() {
    const mobile = isMobile();
    
    // Mostra/nascondi controlli
    prevBtn.style.display = mobile ? 'none' : 'block';
    nextBtn.style.display = mobile ? 'none' : 'block';
    
    if (!mobile) {
      const maxPos = getMaxScrollPosition();
      
      // Disabilita/abilita controlli
      prevBtn.style.opacity = position === 0 ? '0.5' : '1';
      nextBtn.style.opacity = position >= maxPos ? '0.5' : '1';
      prevBtn.style.pointerEvents = position === 0 ? 'none' : 'auto';
      nextBtn.style.pointerEvents = position >= maxPos ? 'none' : 'auto';
    }
  }

  // Gestione resize con debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initCarousel();
    }, 100);
  });

  // Debug function
  window.debugCarousel = () => {
    console.log('=== CAROUSEL DEBUG ===');
    console.log('Screen:', window.innerWidth + 'px');
    console.log('Mobile:', isMobile());
    console.log('Items:', totalItems);
    console.log('Position:', position);
    console.log('Max Position:', getMaxScrollPosition());
    console.log('Scroll Amount:', getScrollAmount() + 'px');
    console.log('Current Transform:', carousel.style.transform);
    console.log('=====================');
  };

  // Inizializza
  initCarousel();
  
  // Debug dopo 500ms
  setTimeout(() => {
    console.log('Carousel inizializzato - usa debugCarousel() per info');
  }, 500);
});