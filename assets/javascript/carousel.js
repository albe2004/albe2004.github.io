document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('projects-carousel');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    
    let position = 0;
    let itemWidth = document.querySelector('.carousel-item').offsetWidth + 20; // larghezza + gap
    let itemsPerView = getItemsPerView();
    const totalItems = document.querySelectorAll('.carousel-item').length;
  
    // Variabili per il touch swipe
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50;
  
    updateCarouselVisibility();
  
    prevBtn.addEventListener('click', () => {
      if (position > 0) {
        position--;
        updateCarouselPosition();
      }
      updateCarouselVisibility();
    });
  
    nextBtn.addEventListener('click', () => {
      if (position < totalItems - itemsPerView) {
        position++;
        updateCarouselPosition();
      }
      updateCarouselVisibility();
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
  
      if (diff > swipeThreshold && position < totalItems - itemsPerView) {
        position++;
        updateCarouselPosition();
      } else if (diff < -swipeThreshold && position > 0) {
        position--;
        updateCarouselPosition();
      }
      updateCarouselVisibility();
    }
  
    window.addEventListener('resize', () => {
      itemWidth = document.querySelector('.carousel-item').offsetWidth + 20;
      itemsPerView = getItemsPerView();
      position = 0;
      updateCarouselPosition();
      updateCarouselVisibility();
    });
  
    function updateCarouselPosition() {
      carousel.style.transform = `translateX(-${position * itemWidth}px)`;
    }
  
    function updateCarouselVisibility() {
      const isMobile = window.innerWidth < 768;
      prevBtn.style.display = isMobile ? 'none' : 'block';
      nextBtn.style.display = isMobile ? 'none' : 'block';
  
      if (!isMobile) {
        prevBtn.style.opacity = position === 0 ? '0.5' : '1';
        nextBtn.style.opacity = position >= totalItems - itemsPerView ? '0.5' : '1';
      }
    }
  
    function getItemsPerView() {
      return window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
    }
  });
  