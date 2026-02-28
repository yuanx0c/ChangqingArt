// scripts.js — language switcher and persistence
(function(){
  const body = document.body;
  const btnZh = document.getElementById('btn-zh');
  const btnEn = document.getElementById('btn-en');

  function setLang(lang){
    body.setAttribute('data-lang', lang);
    localStorage.setItem('site-lang', lang);
    btnZh.classList.toggle('active', lang === 'zh');
    btnEn.classList.toggle('active', lang === 'en');
    btnZh.setAttribute('aria-pressed', String(lang === 'zh'));
    btnEn.setAttribute('aria-pressed', String(lang === 'en'));
  }

  // attach
  btnZh.addEventListener('click', ()=> setLang('zh'));
  btnEn.addEventListener('click', ()=> setLang('en'));

  // initialize from storage or browser preference
  const saved = localStorage.getItem('site-lang');
  if(saved === 'zh' || saved === 'en'){
    setLang(saved);
  } else {
    const prefersEn = navigator.language && navigator.language.startsWith('en');
    setLang(prefersEn ? 'en' : 'zh');
  }
  // Smooth-scroll anchors inside the main scroll container so header stays visible
  const main = document.querySelector('main');

  function scrollToSection(id){
    const target = document.getElementById(id.replace('#',''));
    if(!target || !main) return;
    // compute target offset relative to main scrollTop
    const mainRect = main.getBoundingClientRect();
    const tgtRect = target.getBoundingClientRect();
    const offset = tgtRect.top - mainRect.top + main.scrollTop;
    main.scrollTo({ top: offset, behavior: 'smooth' });
  }

  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href || href.charAt(0) !== '#') return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if(target && main && main.contains(target)){
      if (e.preventDefault) e.preventDefault();
      scrollToSection('#' + id);
      // update hash without jumping
      history.replaceState(null, '', '#' + id);
    }
  });

})();

// Carousel button scrolling
(function(){
  const carousels = document.querySelectorAll('[data-carousel]');
  if(!carousels) return;
  carousels.forEach(car => {
    const track = car.querySelector('.carousel-track');
    const btnLeft = car.querySelector('.carousel-button.left');
    const btnRight = car.querySelector('.carousel-button.right');
    if(!track) return;
    const amount = () => Math.round(track.clientWidth * 0.75);
    btnLeft && btnLeft.addEventListener('click', ()=> track.scrollBy({ left: -amount(), behavior: 'smooth' }));
    btnRight && btnRight.addEventListener('click', ()=> track.scrollBy({ left: amount(), behavior: 'smooth' }));
  });
})();

// Lightbox functionality
(function() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxYear = document.getElementById('lightbox-year');
  const lightboxSize = document.getElementById('lightbox-size');
  const lightboxMedium = document.getElementById('lightbox-medium');
  const lightboxConcept = document.getElementById('lightbox-concept');
  const closeBtn = document.querySelector('.close-lightbox');

  if (!lightboxImg || !lightboxTitle || !lightboxYear || !lightboxSize || !lightboxMedium || !lightboxConcept) {
    return;
  }


  const paintingDetails = {
    '2022-1.jpg': { title: 'work 1', year: '2022', size: '30x40cm', medium: 'Oil on canvas', concept: 'The first painting of the series.' },
    '2022-2.jpg': { title: 'work 2', year: '2022', size: '50x60cm', medium: 'Oil on canvas', concept: 'Exploring blue tones.' },
    '2022-3.jpg': { title: 'work 3', year: '2022', size: '40x50cm', medium: 'Oil on canvas', concept: 'A study of light.' },
    '2022-4.jpg': { title: 'work 4', year: '2022', size: '30x40cm', medium: 'Oil on canvas', concept: 'Abstract landscape.' },
    '2022-5.jpg': { title: 'work 5', year: '2022', size: '50x60cm', medium: 'Oil on canvas', concept: 'Ocean vibe.' },
    '2022-6.jpg': { title: 'work 6', year: '2022', size: '60x80cm', medium: 'Oil on canvas', concept: 'Sunset colors.' },
    '2022-7.jpg': { title: 'work 7', year: '2022', size: '40x50cm', medium: 'Oil on canvas', concept: 'Waves crashing.' },
    '2022-8.jpg': { title: 'work 8', year: '2022', size: '30x40cm', medium: 'Oil on canvas', concept: 'Quiet morning.' },
    '2022-9.jpg': { title: 'work 9', year: '2022', size: '50x60cm', medium: 'Oil on canvas', concept: 'Stormy sea.' },
    '2022-10.jpg': { title: 'work 10', year: '2022', size: '40x50cm', medium: 'Oil on canvas', concept: 'Deep blue.' },
    
    '2023-1.jpg': { title: 'work 2023-1', year: '2023', size: '50x60cm', medium: 'Oil on canvas', concept: 'New year, new style.' },
    '2023-2.jpg': { title: 'work 2023-2', year: '2023', size: '60x80cm', medium: 'Oil on canvas', concept: 'Spring colors.' },
    '2023-3.jpg': { title: 'work 2023-3', year: '2023', size: '40x50cm', medium: 'Oil on canvas', concept: 'Summer breeze.' },
    '2023-4.jpg': { title: 'work 2023-4', year: '2023', size: '30x40cm', medium: 'Oil on canvas', concept: 'Autumn leaves.' },
    '2023-5.jpg': { title: 'work 2023-5', year: '2023', size: '50x60cm', medium: 'Oil on canvas', concept: 'Winter chill.' },
    '2023-6.jpg': { title: 'work 2023-6', year: '2023', size: '60x80cm', medium: 'Oil on canvas', concept: 'Mountain view.' },
    '2023-7.jpg': { title: 'work 2023-7', year: '2023', size: '40x50cm', medium: 'Oil on canvas', concept: 'River flow.' },
    '2023-8.jpg': { title: 'work 2023-8', year: '2023', size: '30x40cm', medium: 'Oil on canvas', concept: 'Forest path.' },
    '2023-9.jpg': { title: 'work 2023-9', year: '2023', size: '50x60cm', medium: 'Oil on canvas', concept: 'City lights.' },
    '2023-10.jpg': { title: 'work 2023-10', year: '2023', size: '60x80cm', medium: 'Oil on canvas', concept: 'Night sky.' },
    '2023-11.jpg': { title: 'work 2023-11', year: '2023', size: '40x50cm', medium: 'Oil on canvas', concept: 'Daydreaming.' },
    '2023-12.jpg': { title: 'work 2023-12', year: '2023', size: '30x40cm', medium: 'Oil on canvas', concept: 'Reflections.' },
    '2023-13.jpg': { title: 'work 2023-13', year: '2023', size: '50x60cm', medium: 'Oil on canvas', concept: 'Shadows.' },
    '2023-14.jpg': { title: 'work 2023-14', year: '2023', size: '60x80cm', medium: 'Oil on canvas', concept: 'Textures.' },
    '2023-15.jpg': { title: 'work 2023-15', year: '2023', size: '40x50cm', medium: 'Oil on canvas', concept: 'Patterns.' },
    '2023-16.jpg': { title: 'work 2023-16', year: '2023', size: '30x40cm', medium: 'Oil on canvas', concept: 'Abstract forms.' },
    '2023-17.jpg': { title: 'work 2023-17', year: '2023', size: '50x60cm', medium: 'Oil on canvas', concept: 'Color study.' },
    '2023-18.jpg': { title: 'work 2023-18', year: '2023', size: '60x80cm', medium: 'Oil on canvas', concept: 'Composition.' },
    '2023-19.jpg': { title: 'work 2023-19', year: '2023', size: '40x50cm', medium: 'Oil on canvas', concept: 'Final touch.' },

    '2024-1.jpg': { title: 'work 2024-1', year: '2024', size: '50x60cm', medium: 'Oil on canvas', concept: 'Fresh start.' },
    '2024-2.jpg': { title: 'work 2024-2', year: '2024', size: '60x80cm', medium: 'Oil on canvas', concept: 'Bright future.' },
    '2024-3.jpg': { title: 'work 2024-3', year: '2024', size: '40x50cm', medium: 'Oil on canvas', concept: 'Bold moves.' },
    '2024-4.jpg': { title: 'work 2024-4', year: '2024', size: '30x40cm', medium: 'Oil on canvas', concept: 'Subtle changes.' },
    '2024-5.jpg': { title: 'work 2024-5', year: '2024', size: '50x60cm', medium: 'Oil on canvas', concept: 'Harmony.' },
    '2024-6.jpg': { title: 'work 2024-6', year: '2024', size: '60x80cm', medium: 'Oil on canvas', concept: 'Balance.' },
    '2024-7.jpg': { title: 'work 2024-7', year: '2024', size: '40x50cm', medium: 'Oil on canvas', concept: 'Contrast.' },
    '2024-9.jpg': { title: 'work 2024-9', year: '2024', size: '50x60cm', medium: 'Oil on canvas', concept: 'Evolution.' },
  };

  // Use event delegation on the works grid and carousel tracks to handle clicks
  const containers = document.querySelectorAll('.works-grid, .carousel-track');
  containers.forEach(container => {
    container.addEventListener('click', function(e) {
      const work = e.target.closest('.work');
      if (!work) return;

      const img = work.querySelector('img');
      if (!img) return;

      const imgSrc = img.src;
      // Extract filename safely, handling URL encoded characters
      const decodedSrc = decodeURIComponent(imgSrc);
      const filename = decodedSrc.substring(decodedSrc.lastIndexOf('/') + 1);
      
      const details = paintingDetails[filename] || { 
        title: 'Untitled', 
        year: 'Unknown', 
        size: 'N/A', 
        medium: 'Oil on canvas', 
        concept: '-' 
      };

      lightboxImg.src = imgSrc;
      lightboxTitle.textContent = details.title;
      lightboxYear.textContent = details.year;
      lightboxSize.textContent = details.size;
      lightboxMedium.textContent = details.medium;
      lightboxConcept.textContent = details.concept;

      // Fix potential size difference in lightbox
      lightboxImg.style.maxHeight = '80vh';
      lightboxImg.style.maxWidth = '100%';
      
      lightbox.style.display = 'flex';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
})();
