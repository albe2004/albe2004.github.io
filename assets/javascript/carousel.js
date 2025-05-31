document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('projects-carousel');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
   
  let position = 0;
  const totalItems = document.querySelectorAll('.carousel-item').length;
 
  // Funzione per ottenere la larghezza effettiva di scorrimento
  function getScrollWidth() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 360) {
      return 240 + 20; // 240px (flex-basis) + 20px (gap)
    } else if (screenWidth <= 480) {
      return 260 + 20; // 260px + gap
    } else if (screenWidth <= 768) {
      return 280 + 20; // 280px + gap
    } else if (screenWidth <= 1440) {
      return 300 + 20; // 300px + gap
    } else {
      // Desktop: calcola dinamicamente
      const item = document.querySelector('.carousel-item');
      if (item) {
        const rect = item.getBoundingClientRect();
        return rect.width + 20;
      }
      return 320; // fallback
    }
  }
 
  // Calcolo massimo scrollabile - CORRETTO
  function getMaxPosition() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 768) {
      // Su mobile, può scorrere fino all'ultima carta
      // Ma dobbiamo considerare quante carte sono visibili
      const containerWidth = carousel.parentElement.offsetWidth;
      const scrollWidth = getScrollWidth();
      const itemsVisible = Math.floor(containerWidth / scrollWidth);
      return Math.max(0, totalItems - itemsVisible);
    } else {
      // Su desktop, calcola quante carte sono visibili
      const containerWidth = carousel.parentElement.offsetWidth;
      const scrollWidth = getScrollWidth();
      const itemsPerView = Math.floor(containerWidth / scrollWidth);
      return Math.max(0, totalItems - itemsPerView);
    }
  }
 
  // Touch swipe vars
  let startX = 0;
  let endX = 0;
  let startY = 0;
  let endY = 0;
  const swipeThreshold = 50;
  let isSwiping = false;
  let isHorizontalSwipe = false;
 
  updateCarouselVisibility();
 
  prevBtn.addEventListener('click', () => {
    if (position > 0) {
      position = position - 1;
      updateCarouselPosition();
      updateCarouselVisibility();
    }
  });
 
  nextBtn.addEventListener('click', () => {
    const maxPos = getMaxPosition();
    if (position < maxPos) {
      position = position + 1;
      updateCarouselPosition();
      updateCarouselVisibility();
    }
  });
 
  // TOUCH EVENTS MIGLIORATI
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isSwiping = true;
    isHorizontalSwipe = false;
  }, { passive: true });
 
  carousel.addEventListener('touchmove', (e) => {
    if (isSwiping) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);
      
      // Determina se è uno swipe orizzontale
      if (diffX > diffY && diffX > 10) {
        isHorizontalSwipe = true;
        e.preventDefault(); // Previeni lo scroll solo se è swipe orizzontale
      }
    }
  }, { passive: false });
 
  carousel.addEventListener('touchend', (e) => {
    if (isSwiping && isHorizontalSwipe) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      handleSwipe();
    }
    isSwiping = false;
    isHorizontalSwipe = false;
  }, { passive: true });
 
  function handleSwipe() {
    const diffX = startX - endX;
    const diffY = Math.abs(startY - endY);
    const maxPos = getMaxPosition();
    
    // Assicurati che sia uno swipe orizzontale
    if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
      if (diffX > 0 && position < maxPos) {
        // Swipe verso sinistra (prossima carta)
        position = position + 1;
        console.log(`Swiped left, new position: ${position}/${maxPos}`);
      } else if (diffX < 0 && position > 0) {
        // Swipe verso destra (carta precedente)
        position = position - 1;
        console.log(`Swiped right, new position: ${position}/${maxPos}`);
      }
      
      updateCarouselPosition();
      updateCarouselVisibility();
    }
  }
 
  window.addEventListener('resize', () => {
    // Ricalcola la posizione massima dopo il resize
    const maxPos = getMaxPosition();
    if (position > maxPos) {
      position = Math.max(0, maxPos);
    }
    
    updateCarouselPosition();
    updateCarouselVisibility();
  });
 
  function updateCarouselPosition() {
    const scrollWidth = getScrollWidth();
    const translateAmount = position * scrollWidth;
    
    carousel.style.transform = `translateX(-${translateAmount}px)`;
    
    // Debug dettagliato
    console.log(`=== POSITION UPDATE ===`);
    console.log(`Screen: ${window.innerWidth}px`);
    console.log(`Position: ${position}/${getMaxPosition()}`);
    console.log(`Scroll Width: ${scrollWidth}px`);
    console.log(`Translate: -${translateAmount}px`);
    console.log(`Total Items: ${totalItems}`);
    console.log(`========================`);
  }
 
  function updateCarouselVisibility() {
    const isMobile = window.innerWidth <= 768;
    const maxPos = getMaxPosition();
    
    // Su mobile nascondi i bottoni
    prevBtn.style.display = isMobile ? 'none' : 'block';
    nextBtn.style.display = isMobile ? 'none' : 'block';
     
    if (!isMobile) {
      prevBtn.style.opacity = position === 0 ? '0.5' : '1';
      nextBtn.style.opacity = position >= maxPos ? '0.5' : '1';
      
      prevBtn.style.pointerEvents = position === 0 ? 'none' : 'auto';
      nextBtn.style.pointerEvents = position >= maxPos ? 'none' : 'auto';
    }
  }
  
  // Funzione di debug globale
  function debugCarousel() {
    const scrollWidth = getScrollWidth();
    const maxPos = getMaxPosition();
    const containerWidth = carousel.parentElement.offsetWidth;
    const itemsVisible = Math.floor(containerWidth / scrollWidth);
    
    console.log('=== CAROUSEL DEBUG ===');
    console.log('Screen Width:', window.innerWidth);
    console.log('Container Width:', containerWidth);
    console.log('Total Items:', totalItems);
    console.log('Items Visible:', itemsVisible);
    console.log('Current Position:', position);
    console.log('Max Position:', maxPos);
    console.log('Scroll Width:', scrollWidth);
    console.log('Current Transform:', carousel.style.transform);
    console.log('Is Mobile:', window.innerWidth <= 768);
    
    // Test calcolo larghezza effettiva
    const item = document.querySelector('.carousel-item');
    if (item) {
      const rect = item.getBoundingClientRect();
      console.log('Item Actual Width:', rect.width);
      console.log('Item Computed Style:', window.getComputedStyle(item).width);
    }
    console.log('===================');
  }
  
  // Rimuovi in produzione
  window.debugCarousel = debugCarousel;
  
  // Auto debug al caricamento
  setTimeout(() => {
    debugCarousel();
  }, 1000);
});