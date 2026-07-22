/* ============================================================
   SNEAKS THERAPY — script.js
   Features:
   - Navbar scroll effect
   - FAQ accordion
   - Scroll reveal + staggered animation
   - Waitlist form: validasi + popup terima kasih
   - Modal terima kasih
   - Modal kebijakan privasi
   - Smooth anchor scroll
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR SCROLL
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ============================================================
   2. FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // tutup semua
      questions.forEach(function (q) {
        q.setAttribute('aria-expanded', 'false');
        const a = q.nextElementSibling;
        if (a) a.classList.remove('open');
      });

      // buka yang diklik jika sebelumnya tertutup
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        const answer = btn.nextElementSibling;
        if (answer) answer.classList.add('open');
      }
    });
  });
})();


/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const selectors = [
    '.hero-badge', '.hero-title', '.hero-subtitle', '.hero-cta', '.hero-note',
    '.trust-item',
    '.pain-card',
    '.step-card',
    '.feature-card',
    '.aroma-card',
    '.package-card',
    '.waitlist-box',
    '.faq-item',
    '.footer-brand', '.footer-links', '.footer-social'
  ];

  const elements = document.querySelectorAll(selectors.join(', '));
  elements.forEach(function (el) { el.classList.add('reveal'); });

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
})();


/* ============================================================
   4. STAGGERED REVEAL DELAY
   ============================================================ */
(function initStagger() {
  var groups = [
    '.trustbar-inner .trust-item',
    '.pain-grid .pain-card',
    '.steps-grid .step-card',
    '.features-grid .feature-card',
    '.aroma-grid .aroma-card',
    '.packages-grid .package-card',
  ];

  groups.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.style.transitionDelay = (i * 80) + 'ms';
    });
  });
})();


/* ============================================================
   5. MODAL HELPERS
   ============================================================ */
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  // fokus ke modal untuk aksesibilitas
  var focusable = modalEl.querySelector('button, [href], input, select');
  if (focusable) focusable.focus();
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

// tutup modal jika klik overlay (luar box)
function bindOverlayClose(modalEl) {
  if (!modalEl) return;
  modalEl.addEventListener('click', function (e) {
    if (e.target === modalEl) closeModal(modalEl);
  });
}

// tutup modal dengan tombol Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(function (m) {
      closeModal(m);
    });
  }
});


/* ============================================================
   6. MODAL TERIMA KASIH
   ============================================================ */
(function initThanksModal() {
  var modal      = document.getElementById('modal-thanks');
  var btnClose   = document.getElementById('close-thanks');
  var btnClose2  = document.getElementById('btn-close-thanks');

  if (!modal) return;

  bindOverlayClose(modal);

  if (btnClose)  btnClose.addEventListener('click',  function () { closeModal(modal); });
  if (btnClose2) btnClose2.addEventListener('click', function () { closeModal(modal); });
})();


/* ============================================================
   7. MODAL KEBIJAKAN PRIVASI
   ============================================================ */
(function initPrivacyModal() {
  var modal      = document.getElementById('modal-privacy');
  var openBtn    = document.getElementById('open-privacy');
  var btnClose   = document.getElementById('close-privacy');
  var btnClose2  = document.getElementById('btn-close-privacy');

  if (!modal) return;

  bindOverlayClose(modal);

  // privacy buttons are now bound per-form in initWaitlistFormById
  if (btnClose)  btnClose.addEventListener('click',  function () { closeModal(modal); });
  if (btnClose2) btnClose2.addEventListener('click', function () { closeModal(modal); });
})();


/* ============================================================
   8. WAITLIST FORM
   ============================================================ */

var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwKk1xJHu6_4u4lUBgloDBqnEH7_FsbqTpyCGnHTrwkZ3Kl0Wk8CxbaNXzcDR4BSfkZbQ/exec';

function initWaitlistFormById(formId, nameId, igId, privacyId, submitId, privacyBtnId) {
  var form        = document.getElementById(formId);
  var submitBtn   = document.getElementById(submitId);
  var thanksModal = document.getElementById('modal-thanks');
  var privacyModal = document.getElementById('modal-privacy');

  if (!form) return;

  /* --- helpers --- */
  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function setFieldError(inputEl, msg) {
    var target = inputEl.closest('.input-prefix-wrap') || inputEl;
    target.style.borderColor = '#e05555';
    inputEl.style.borderColor = '#e05555';

    var parent = inputEl.closest('.form-group');
    var old = parent && parent.querySelector('.field-error');
    if (old) old.remove();

    if (parent) {
      var errEl = document.createElement('span');
      errEl.className = 'field-error';
      errEl.setAttribute('role', 'alert');
      errEl.style.cssText = 'font-size:12px;color:#e05555;margin-top:4px;display:block;';
      errEl.textContent = msg;
      parent.appendChild(errEl);
    }
  }

  function clearAllErrors() {
    form.querySelectorAll('input, select').forEach(function (el) {
      el.style.borderColor = '';
    });
    form.querySelectorAll('.input-prefix-wrap').forEach(function (el) {
      el.style.borderColor = '';
    });
    form.querySelectorAll('.field-error').forEach(function (el) {
      el.remove();
    });
  }

  function validate() {
    var valid   = true;
    var name    = getVal(nameId);
    var ig      = getVal(igId).replace(/^@/, '');
    var privacy = document.getElementById(privacyId);

    if (!name || name.length < 2) {
      setFieldError(document.getElementById(nameId), 'Nama tidak boleh kosong (minimal 2 karakter).');
      valid = false;
    }

    if (!ig) {
      setFieldError(document.getElementById(igId), 'Username Instagram tidak boleh kosong.');
      valid = false;
    } else if (!/^[a-zA-Z0-9._]{1,30}$/.test(ig)) {
      setFieldError(document.getElementById(igId), 'Username tidak valid. Gunakan huruf, angka, titik, atau underscore.');
      valid = false;
    }

    if (privacy && !privacy.checked) {
      setFieldError(privacy, 'Kamu perlu menyetujui Kebijakan Privasi untuk melanjutkan.');
      valid = false;
    }

    return valid;
  }

  /* --- clear error saat user mulai mengetik --- */
  [nameId, igId].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      el.style.borderColor = '';
      var wrap = el.closest('.input-prefix-wrap');
      if (wrap) wrap.style.borderColor = '';
      var errEl = el.closest('.form-group') && el.closest('.form-group').querySelector('.field-error');
      if (errEl) errEl.remove();
    });
  });

  var privacyEl = document.getElementById(privacyId);
  if (privacyEl) {
    privacyEl.addEventListener('change', function () {
      privacyEl.style.borderColor = '';
      var errEl = privacyEl.closest('.form-group') && privacyEl.closest('.form-group').querySelector('.field-error');
      if (errEl) errEl.remove();
    });
  }

  /* --- privacy button inside this form --- */
  var privacyBtn = document.getElementById(privacyBtnId);
  if (privacyBtn && privacyModal) {
    privacyBtn.addEventListener('click', function () { openModal(privacyModal); });
  }

  /* --- submit --- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors();

    if (!validate()) return;

    var name = getVal(nameId);
    var ig   = getVal(igId).replace(/^@/, '');
    var pkg  = getVal(formId + '-package') || '';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Mendaftarkan...';

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, instagram: ig, package: pkg })
    })
    .then(function () {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Daftar Waitlist Sekarang';
      openModal(thanksModal);
    })
    .catch(function () {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Daftar Waitlist Sekarang';
      openModal(thanksModal);
    });
  });
}

/* inisialisasi kedua form */
(function () {
  initWaitlistFormById('waitlist-form',      'wl-name',      'wl-ig',      'wl-privacy',      'wl-submit',      'open-privacy');
  initWaitlistFormById('waitlist-form-hero', 'wl-name-hero', 'wl-ig-hero', 'wl-privacy-hero', 'wl-submit-hero', 'open-privacy-hero');
})();


/* ============================================================
   9. SMOOTH SCROLL ANCHOR
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      var navH = (document.getElementById('navbar') || {}).offsetHeight || 72;
      var top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
