const header = document.querySelector('[data-header]');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const menuLinks = document.querySelectorAll('.main-nav a');
const toggleLabel = toggle.querySelector('.visually-hidden');
const inertContent = [
  document.querySelector('.contact-strip'),
  document.querySelector('.brand'),
  document.querySelector('main'),
  document.querySelector('.site-footer'),
].filter(Boolean);
const whatsappFloat = document.querySelector('.whatsapp-float');
const protectedFloatContent = document.querySelectorAll('main h1, main h2, main h3, main p, main .button, main .text-link, main summary, .site-footer a, .site-footer span');

const setHeaderState = () => header.classList.toggle('is-stuck', window.scrollY > 4);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const setMenuState = (isOpen, restoreFocus = false) => {
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggleLabel.textContent = isOpen ? 'Cerrar menú' : 'Abrir menú';
  navigation.classList.toggle('is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  inertContent.forEach((element) => { element.inert = isOpen; });

  if (isOpen) {
    const focusFirstLink = () => menuLinks[0]?.focus();
    if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(focusFirstLink);
    else focusFirstLink();
  } else if (restoreFocus) {
    toggle.focus();
  }
};

const closeMenu = (restoreFocus = false) => setMenuState(false, restoreFocus);

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  setMenuState(!isOpen, isOpen);
});

menuLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu(true);
  }

  if (event.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
    const focusableMenuItems = [toggle, ...menuLinks];
    const firstItem = focusableMenuItems[0];
    const lastItem = focusableMenuItems[focusableMenuItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  }
});

document.addEventListener('click', (event) => {
  const menuIsOpen = toggle.getAttribute('aria-expanded') === 'true';
  if (menuIsOpen && !navigation.contains(event.target) && !toggle.contains(event.target)) {
    closeMenu(true);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) closeMenu();
});

const updateWhatsappFloat = () => {
  if (!whatsappFloat) return;

  const floatBounds = whatsappFloat.getBoundingClientRect();
  const overlapsContent = [...protectedFloatContent].some((element) => {
    const bounds = element.getBoundingClientRect();
    return bounds.right > floatBounds.left
      && bounds.left < floatBounds.right
      && bounds.bottom > floatBounds.top
      && bounds.top < floatBounds.bottom;
  });

  whatsappFloat.classList.toggle('is-obscured', overlapsContent);
};

let floatUpdateFrame;
const scheduleWhatsappFloatUpdate = () => {
  if (floatUpdateFrame) return;
  const update = () => {
    floatUpdateFrame = undefined;
    updateWhatsappFloat();
  };
  if (typeof window.requestAnimationFrame === 'function') floatUpdateFrame = window.requestAnimationFrame(update);
  else update();
};

scheduleWhatsappFloatUpdate();
window.addEventListener('scroll', scheduleWhatsappFloatUpdate, { passive: true });
window.addEventListener('resize', scheduleWhatsappFloatUpdate);

const bookingForm = document.querySelector('[data-booking-form]');
const bookingName = document.querySelector('#booking-name');
const serviceInputs = document.querySelectorAll('input[name="service"]');
const serviceButtons = document.querySelectorAll('[data-service]');
const serviceNames = {
  osteopatia: 'osteopatía',
  kinesiologia: 'kinesiología',
};

const selectService = (service) => {
  const input = [...serviceInputs].find((candidate) => candidate.value === service);
  if (input) input.checked = true;
};

serviceButtons.forEach((button) => {
  button.addEventListener('click', () => selectService(button.dataset.service));
});

if (bookingForm) {
  const requestedService = typeof window.location?.search === 'string'
    ? new URLSearchParams(window.location.search).get('service')
    : null;
  if (requestedService) selectService(requestedService);

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedService = [...serviceInputs].find((input) => input.checked)?.value || 'osteopatia';
    const serviceName = serviceNames[selectedService] || serviceNames.osteopatia;
    const name = bookingName.value.trim().replace(/\s+/g, ' ');
    const message = name
      ? `Hola, me llamo ${name} y quisiera consultar disponibilidad para un turno de ${serviceName}. ¡Muchas gracias!`
      : `Hola, quisiera consultar disponibilidad para un turno de ${serviceName}. ¡Muchas gracias!`;
    const url = `https://wa.me/5492664921564?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
