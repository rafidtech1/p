/* script.js
   Minimal JS for interactions:
   - Navbar scroll blur
   - Mobile nav toggle
   - IntersectionObserver for entrance animations & skills
   - Project modal open/close & populate
   - Contact form simple client-side validation & feedback
*/

/* ============
   Utilities
   ============ */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* ============
   Navbar: sticky blur on scroll
   ============ */
const navWrap = document.querySelector('.nav-wrap');
window.addEventListener('scroll', () => {
  if (window.scrollY > 24) navWrap.classList.add('scrolled');
  else navWrap.classList.remove('scrolled');
});

/* ============
   Mobile nav toggle
   ============ */
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('show');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* Close mobile nav on link click */
$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      navToggle.setAttribute('aria-expanded','false');
    }
  });
});

/* ============
   Entrance animations & skill fills using IntersectionObserver
   ============ */
const observerOpts = { threshold: 0.12 };
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);

      // If it's a skill-fill inside, animate width
      $$('.skill-fill', entry.target).forEach(el => {
        const pct = el.dataset.fill || 70;
        setTimeout(() => el.style.width = pct + '%', 120);
      });
    }
  });
}, observerOpts);

/* Observe elements with .fade-up */
$$('.fade-up').forEach(el => io.observe(el));

/* Also observe each project-card to add subtle animation */
$$('.project-card').forEach(el => io.observe(el));

/* ============
   Active nav link on scroll
   ============ */
const sections = ['about','portfolio','contact'].map(id => $(`#${id}`));
const navLinksArr = $$('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    const id = en.target.id;
    const link = navLinksArr.find(a => a.getAttribute('href') === '#' + id);
    if (en.isIntersecting) {
      navLinksArr.forEach(a => a.classList.remove('active'));
      link?.classList.add('active');
    }
  });
}, {threshold:0.5});

sections.forEach(s => s && sectionObserver.observe(s));

/* ============
   Projects modal
   ============ */
const modal = $('#projectModal');
const modalTitle = $('#modalTitle');
const modalDesc = $('#modalDesc');
const modalImpact = $('#modalImpact');
const modalTags = $('#modalTags');
const modalCloseBtns = $$('.modal-close');

$$('.project-card').forEach(card => {
  const btn = card.querySelector('.project-open');
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dataStr = card.dataset.project;
    try {
      const data = JSON.parse(dataStr);
      openModalWith(data);
    } catch (err) {
      openModalWith({title:'Project', desc:'Details coming soon', impact:'—', tags:[]});
    }
  });
  // clicking the whole card opens too
  card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('project-open')) {
      const dataStr = card.dataset.project;
      const data = JSON.parse(dataStr);
      openModalWith(data);
    }
  });
});

function openModalWith(data){
  modalTitle.textContent = data.title || 'Project';
  modalDesc.textContent = data.desc || '—';
  modalImpact.textContent = data.impact || '—';
  modalTags.textContent = (data.tags || []).join(', ');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

function closeModal(){
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

/* ============
   Contact form: floating label placeholders & validation
   ============ */
const contactForm = $('#contactForm');
const formNote = $('#formNote');

if (contactForm){
  // enable placeholder behavior required for :placeholder-shown CSS trick
  contactForm.querySelectorAll('input, textarea').forEach(el => {
    if (!el.placeholder) el.setAttribute('placeholder', ' ');
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // simple validation
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    if (!name || !email || !message) {
      formNote.textContent = 'Please fill the required fields (name, email, message).';
      formNote.style.color = '#FFBDBD';
      return;
    }

    // Simulate send
    formNote.style.color = '#BFECDD';
    formNote.textContent = 'Sending…';
    setTimeout(() => {
      formNote.textContent = 'Thanks — your message is sent. I’ll reply within 48 hours.';
      contactForm.reset();
      // reset floating label visuals by triggering input events
      contactForm.querySelectorAll('input,textarea').forEach(i => i.dispatchEvent(new Event('blur')));
    }, 900);
  });
}

/* ============
   Small helpers
   ============ */
document.getElementById('year').textContent = new Date().getFullYear();

/* Accessibility: close modal with ESC */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

/* Smooth slightly enhanced focus for keyboard users */
document.addEventListener('keyup', (e) => {
  if (e.key === 'Tab') {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
});

/* End of script.js */