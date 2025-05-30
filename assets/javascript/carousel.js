document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('projects-carousel');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
   
  let position = 0;
  let itemWidth = getItemWidth();
  let itemsPerView = getItemsPerView();
  const totalItems = document.querySelectorAll('.carousel-item').length;
 
  // Calcolo massimo scrollabile
  function getMaxPosition() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 768) {
      // Su mobile, puoi scorrere fino all'ultimo elemento (totalItems - 1)
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
     
    if (diff > swipeThreshold && position < getMaxPosition()) {
      position = position + 1;
    } else if (diff < -swipeThreshold && position > 0) {
      position = position - 1;
    }
     
    updateCarouselPosition();
    updateCarouselVisibility();
  }
 
  window.addEventListener('resize', () => {
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
    const translateAmount = position * itemWidth;
    carousel.style.transform = `translateX(-${translateAmount}px)`;
    
    // Debug (rimuovi in produzione)
    console.log(`Position: ${position}/${getMaxPosition()}, ItemWidth: ${itemWidth}px, TotalItems: ${totalItems}, ItemsPerView: ${itemsPerView}, Mobile: ${window.innerWidth <= 768}`);
  }
 
  function updateCarouselVisibility() {
    const isMobile = window.innerWidth < 768;
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
      // Su mobile, mostra 1 elemento ma questo è solo per il calcolo desktop
      // Il vero controllo è in getMaxPosition()
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
    
    // Usa la larghezza reale dell'elemento renderizzato
    const rect = item.getBoundingClientRect();
    const gap = 20; // Gap dal CSS
    
    // Su mobile molto piccolo, assicurati che non superi la larghezza dello schermo
    const screenWidth = window.innerWidth;
    const maxWidth = screenWidth * 0.95; // 95% della larghezza schermo
    
    const calculatedWidth = rect.width + gap;
    const finalWidth = screenWidth <= 480 ? Math.min(calculatedWidth, maxWidth) : calculatedWidth;
    
    console.log(`Screen: ${screenWidth}px, Item: ${rect.width}px, Final: ${finalWidth}px`);
    return finalWidth;
  }
});