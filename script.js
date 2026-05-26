
// ACTIVE NAV LINK

var page = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('nav a[data-page]').forEach(function(a) {
    if (a.getAttribute('data-page') === page) {
        a.classList.add('active');
    }
});


// MOBILE MENU

var menuBtn = document.getElementById('menuBtn');
var siteNav = document.getElementById('siteNav');

if (menuBtn && siteNav) {

    menuBtn.addEventListener('click', function() {
        var isOpen = siteNav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', function(e) {
        if (!menuBtn.contains(e.target) && !siteNav.contains(e.target)) {
            siteNav.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}


// HERO SLIDER

var heroImg  = document.getElementById('heroSlide');
var prevBtn  = document.getElementById('prevSlide');
var nextBtn  = document.getElementById('nextSlide');
var dotsList = document.querySelectorAll('.dot');

var heroSlides = [
    { src: 'images/hero1.jpg', alt: 'Exotic sports car on the road' },
    { src: 'images/hero2.png', alt: 'Luxury car front view' },
    { src: 'images/hero3.png', alt: 'Convertible on the highway' }
];

var heroIdx = 0;
var heroTimer;

function showSlide() {
    heroImg.classList.add('fade-out');
    setTimeout(function() {
        heroImg.src = heroSlides[heroIdx].src;
        heroImg.alt = heroSlides[heroIdx].alt;
        dotsList.forEach(function(d, i) {
            d.classList.toggle('on', i === heroIdx);
        });
        heroImg.classList.remove('fade-out');
    }, 280);
}

function nextSlide() {
    heroIdx = (heroIdx + 1) % heroSlides.length;
    showSlide();
    resetTimer();
}

function prevSlide() {
    heroIdx = (heroIdx - 1 + heroSlides.length) % heroSlides.length;
    showSlide();
    resetTimer();
}

function startTimer() {
    heroTimer = setInterval(nextSlide, 5000);
}

function resetTimer() {
    clearInterval(heroTimer);
    startTimer();
}

function goToSlide(i) {
    heroIdx = i;
    showSlide();
    resetTimer();
}

if (heroImg && prevBtn && nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    dotsList.forEach(function(d, i) {
        d.addEventListener('click', function() { goToSlide(i); });
    });
    showSlide();
    startTimer();
}


// GALLERY LIGHTBOX

var thumbs  = document.querySelectorAll('.g-thumb');
var overlay = document.getElementById('lightbox');
var lbImg   = document.getElementById('lbImg');
var lbCap   = document.getElementById('lbCaption');
var lbClose = document.getElementById('lbClose');
var lbPrev  = document.getElementById('lbPrev');
var lbNext  = document.getElementById('lbNext');

var curPhoto = 0;

function openLightbox(i) {
    curPhoto = i;
    lbImg.src = thumbs[curPhoto].getAttribute('data-full') || thumbs[curPhoto].src;
    lbImg.alt = thumbs[curPhoto].alt;
    if (lbCap) lbCap.textContent = thumbs[curPhoto].alt;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function lbShowPrev() {
    curPhoto = (curPhoto - 1 + thumbs.length) % thumbs.length;
    openLightbox(curPhoto);
}

function lbShowNext() {
    curPhoto = (curPhoto + 1) % thumbs.length;
    openLightbox(curPhoto);
}

if (thumbs.length && overlay) {

    thumbs.forEach(function(t, i) {
        t.addEventListener('click', function() { openLightbox(i); });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', lbShowPrev);
    if (lbNext)  lbNext.addEventListener('click', lbShowNext);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeLightbox();
    });

    // press Escape to close
    document.addEventListener('keydown', function(e) {
        if (!overlay.classList.contains('hidden') && e.key === 'Escape') {
            closeLightbox();
        }
    });
}


// FLEET FILTER

var filterBtns = document.querySelectorAll('.f-btn');
var vCards     = document.querySelectorAll('.v-card');
var noResults  = document.getElementById('noResults');

function filterCars(val) {
    var count = 0;
    vCards.forEach(function(c) {
        var match = val === 'all' || c.getAttribute('data-category') === val;
        if (match) {
            c.classList.remove('hidden');
            count++;
        } else {
            c.classList.add('hidden');
        }
    });
    if (noResults) noResults.style.display = count === 0 ? 'block' : 'none';
}

filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterCars(btn.getAttribute('data-filter'));
    });
});

if (vCards.length) filterCars('all');


// CONTACT FORM VALIDATION

var submitBtn = document.getElementById('submitBtn');
var formMsg   = document.getElementById('formMsg');

if (submitBtn && formMsg) {

    submitBtn.addEventListener('click', function() {

        var name  = document.getElementById('fullName').value.trim();
        var email = document.getElementById('email').value.trim();
        var msg   = document.getElementById('message').value.trim();
        var agree = document.getElementById('agreeBox');

        var errors = [];

        if (name.length < 2)  errors.push('Please enter your full name.');
        if (!email.includes('@') || !email.includes('.')) errors.push('Please enter a valid email address.');
        if (msg.length < 10)  errors.push('Please write a message (at least 10 characters).');
        if (agree && !agree.checked) errors.push('You need to agree to the terms.');

        formMsg.style.display = 'block';

        if (errors.length > 0) {
            formMsg.className = 'form-msg err';
            formMsg.textContent = errors.join(' ');
            return;
        }

        formMsg.className = 'form-msg';
        formMsg.textContent = 'Message sent! We will get back to you within 2 hours.';

        document.getElementById('contactForm').reset();
    });
}


// FAQ ACCORDION

var faqBtns = document.querySelectorAll('.faq-q');

faqBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {

        var panelId = btn.getAttribute('data-panel');
        var panel   = document.getElementById(panelId);
        var isOpen  = !panel.classList.contains('hidden');

        // close all
        faqBtns.forEach(function(b) {
            var p = document.getElementById(b.getAttribute('data-panel'));
            if (p) p.classList.add('hidden');
        });

        // open clicked one if it was closed
        if (!isOpen && panel) {
            panel.classList.remove('hidden');
        }
    });
});


// PROMO BANNER DISMISS

var dismissBtn = document.getElementById('dismissPromo');
var promoBanner = document.getElementById('promoBanner');

if (dismissBtn && promoBanner) {
    dismissBtn.addEventListener('click', function() {
        promoBanner.classList.add('hidden');
    });
}


// SCROLL TO TOP BUTTON

var toTopBtn = document.getElementById('toTop');

if (toTopBtn) {

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            toTopBtn.style.display = 'block';
        } else {
            toTopBtn.style.display = 'none';
        }
    });

    toTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
