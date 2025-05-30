document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('projects-carousel');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
   
  let position = 0;
  let itemWidth = getItemWidth();
  let itemsPerView = getItemsPerView();
  const totalItems = document.querySelectorAll('.carousel-item').length;
 
  // Calcolo massimo scrollabile - CORRETTO
  function getMaxPosition() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 768) {
      // Su mobile, l'ultimo elemento visualizzabile è totalItems - 1
      // Ma dobbiamo considerare che partiamo da position 0
      return Math.max(0, totalItems - 1);
    } else {
      // Su desktop, calcolo normale
      return Math.max(0, totalItems - itemsPerView);
    }
  }
 
  // Touch swipe vars
  let startX = 0;
  let endX = 0;
  const swipeThreshold = 50;
 
  updateCarouselVisibility();
 
  prevBtn.addEventListener('click', () => {
    if (position > 0) {
      position = position - 1;
      updateCarouselPosition();
      updateCarouselVisibility();
    }
  });
 
  nextBtn.addEventListener('click', () => {
    if (position < getMaxPosition()) {
      position = position + 1;
      updateCarouselPosition();
      updateCarouselVisibility();
    }
  });
 
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
 
  carousel.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });
 
  function handleSwipe() {
    const diff = startX - endX;
    const maxPos = getMaxPosition();
     
    if (diff > swipeThreshold && position < maxPos) {
      position = position + 1;
    } else if (diff < -swipeThreshold && position > 0) {
      position = position - 1;
    }
     
    updateCarouselPosition();
    updateCarouselVisibility();
  }
 
  window.addEventListener('resize', () => {
    // Ricalcola tutto al resize
    itemWidth = getItemWidth();
    itemsPerView = getItemsPerView();
    
    const maxPos = getMaxPosition();
    if (position > maxPos) {
      position = Math.max(0, maxPos);
    }
    
    updateCarouselPosition();
    updateCarouselVisibility();
  });
 
  function updateCarouselPosition() {
    const isMobile = window.innerWidth <= 768;
    let translateAmount;
    
    if (isMobile) {
      // Su mobile, usa una logica di scorrimento più semplice
      // Calcola la larghezza effettiva dell'elemento + gap
      const item = document.querySelector('.carousel-item');
      const itemRect = item.getBoundingClientRect();
      const gap = 20; // Gap dal CSS
      translateAmount = position * (itemRect.width + gap);
    } else {
      // Su desktop, usa il calcolo originale
      translateAmount = position * itemWidth;
    }
    
    carousel.style.transform = `translateX(-${translateAmount}px)`;
    
    // Debug (rimuovi in produzione)
    console.log(`Position: ${position}/${getMaxPosition()}, ItemWidth: ${itemWidth}px, TotalItems: ${totalItems}, ItemsPerView: ${itemsPerView}, Mobile: ${window.innerWidth <= 768}, TranslateAmount: ${translateAmount}px`);
  }
 
  function updateCarouselVisibility() {
    const isMobile = window.innerWidth <= 768;
    
    // Su mobile nascondi i bottoni ma mantieni la funzionalità swipe
    prevBtn.style.display = isMobile ? 'none' : 'block';
    nextBtn.style.display = isMobile ? 'none' : 'block';
     
    if (!isMobile) {
      prevBtn.style.opacity = position === 0 ? '0.5' : '1';
      nextBtn.style.opacity = position >= getMaxPosition() ? '0.5' : '1';
      
      prevBtn.style.pointerEvents = position === 0 ? 'none' : 'auto';
      nextBtn.style.pointerEvents = position >= getMaxPosition() ? 'none' : 'auto';
    }
  }
 
  function getItemsPerView() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 768) {
      // Su mobile, mostra 1 elemento alla volta
      return 1;
    } else if (screenWidth <= 1440) {
      // Su desktop piccolo
      const containerWidth = carousel.parentElement.offsetWidth;
      const itemWidth = getItemWidth();
      return Math.min(Math.floor(containerWidth / itemWidth), 2);
    } else {
      // Su desktop grande
      const containerWidth = carousel.parentElement.offsetWidth;
      const itemWidth = getItemWidth();
      return Math.min(Math.floor(containerWidth / itemWidth), 3);
    }
  }
 
  function getItemWidth() {
    const item = document.querySelector('.carousel-item');
    if (!item) return 280; // fallback
    
    const rect = item.getBoundingClientRect();
    const gap = 20; // Gap dal CSS
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 768) {
      // Su mobile, usa la larghezza reale dell'elemento
      // Non limitare artificialmente la larghezza
      return rect.width + gap;
    } else {
      // Su desktop, usa il calcolo originale
      return rect.width + gap;
    }
  }
  
  // Aggiungi una funzione di debug per controllare i valori
  function debugCarousel() {
    console.log('=== CAROUSEL DEBUG ===');
    console.log('Total Items:', totalItems);
    console.log('Current Position:', position);
    console.log('Max Position:', getMaxPosition());
    console.log('Item Width:', itemWidth);
    console.log('Items Per View:', itemsPerView);
    console.log('Screen Width:', window.innerWidth);
    console.log('Is Mobile:', window.innerWidth <= 768);
    console.log('===================');
  }
  
  // Rimuovi questo in produzione - serve solo per debug
  window.debugCarousel = debugCarousel;
});