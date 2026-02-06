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
  const closeBtn = document.querySelector('.close-lightbox');

  const paintingDetails = {
    '2022-1.jpg': {
      zh: { title: '作品一', year: '2024', size: '30x40cm', medium: '布面油画', concept: '对自然纹理的研究' },
      en: { title: 'Work 1', year: '2024', size: '30x40cm', medium: 'Oil on canvas', concept: 'A study of natural patterns.' }
    },
    '2022-2.jpg': {
      zh: { title: '作品二', year: '2022', size: '50x60cm', medium: '布面油画', concept: '作品二的创作理念' },
      en: { title: 'Work 2', year: '2022', size: '50x60cm', medium: 'Oil on canvas', concept: 'Concept for painting 2.' }
    },
    // Add details for other paintings here
  };

  // Use event delegation on the carousel track to handle clicks
  const tracks = document.querySelectorAll('.carousel-track');
  tracks.forEach(track => {
    track.addEventListener('click', function(e) {
      const work = e.target.closest('.work');
      if (!work) return;

      const img = work.querySelector('img');
      if (!img) return;

      const imgSrc = img.src;
      // Extract filename safely
      const filename = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
      
      const details = paintingDetails[filename] || { 
        zh: { title: '无题', year: '未知', size: '-', medium: '-', concept: '-' },
        en: { title: 'Untitled', year: 'Unknown', size: '-', medium: '-', concept: '-' }
      };

      lightboxImg.src = imgSrc;
      document.getElementById('lightbox-title-zh').textContent = details.zh.title;
      document.getElementById('lightbox-title-en').textContent = details.en.title;

      document.getElementById('lightbox-year-zh').textContent = details.zh.year;
      document.getElementById('lightbox-year-en').textContent = details.en.year;

      document.getElementById('lightbox-size-zh').textContent = details.zh.size;
      document.getElementById('lightbox-size-en').textContent = details.en.size;

      document.getElementById('lightbox-medium-zh').textContent = details.zh.medium;
      document.getElementById('lightbox-medium-en').textContent = details.en.medium;

      document.getElementById('lightbox-concept-zh').textContent = details.zh.concept;
      document.getElementById('lightbox-concept-en').textContent = details.en.concept;

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
