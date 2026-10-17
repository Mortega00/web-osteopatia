const header = document.querySelector('[data-header]');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const menuLinks = document.querySelectorAll('.main-nav a');
const toggleLabel = toggle.querySelector('.visually-hidden');
const inertContent = [
  document.querySelector('.brand'),
  document.querySelector('main'),
  document.querySelector('.site-footer'),
].filter(Boolean);

const setHeaderState = () => header.classList.toggle('is-stuck', window.scrollY > 4);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const setMenuState = (isOpen, restoreFocus = false) => {
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggleLabel.textContent = isOpen ? 'Cerrar menú' : 'Abrir menú';
  navigation.classList.toggle('is-open', isOpen);
  document.body.classList?.toggle('menu-is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  inertContent.forEach((element) => { element.inert = isOpen; });

  if (isOpen) {
    const focusFirstLink = () => {
      if (toggle.getAttribute('aria-expanded') === 'true') menuLinks[0]?.focus();
    };
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

const whatsappFloat = document.querySelector('.whatsapp-float');
const whatsappAssist = document.querySelector('[data-whatsapp-assist]');
const whatsappAssistClose = document.querySelector('[data-whatsapp-assist-close]');
let scheduleWhatsAppVisibility = () => {};

if (whatsappFloat) {
  const whatsappProtectedActions = [
    ...document.querySelectorAll('main a, main button, main input, main textarea, main summary'),
  ];
  const whatsappAssistProtectedContent = [
    ...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main a, main button, main input, main textarea, main summary'),
  ];
  let whatsappFrame;

  const overlapsProtectedContent = (bounds, protectedContent = whatsappProtectedActions) => protectedContent.some((element) => {
    const actionBounds = element.getBoundingClientRect();
    return actionBounds.width > 0
      && actionBounds.height > 0
      && actionBounds.right > bounds.left
      && actionBounds.left < bounds.right
      && actionBounds.bottom > bounds.top
      && actionBounds.top < bounds.bottom;
  });

  const updateWhatsAppVisibility = () => {
    whatsappFrame = undefined;
    const floatBounds = whatsappFloat.getBoundingClientRect();
    whatsappFloat.classList.toggle('is-contextually-hidden', overlapsProtectedContent(floatBounds));

    if (whatsappAssist && !whatsappAssist.classList.contains('is-dismissed')) {
      whatsappAssist.classList.toggle('is-contextually-hidden', overlapsProtectedContent(whatsappAssist.getBoundingClientRect(), whatsappAssistProtectedContent));
    }
  };

  scheduleWhatsAppVisibility = () => {
    if (whatsappFrame) return;
    whatsappFrame = window.requestAnimationFrame?.(updateWhatsAppVisibility);
    if (!whatsappFrame) updateWhatsAppVisibility();
  };

  window.addEventListener('scroll', scheduleWhatsAppVisibility, { passive: true });
  window.addEventListener('resize', updateWhatsAppVisibility);
  window.addEventListener('load', updateWhatsAppVisibility);
  updateWhatsAppVisibility();
}

if (whatsappAssist) {
  const dismissWhatsAppAssist = () => {
    whatsappAssist.classList.add('is-dismissed');
    whatsappAssist.setAttribute('aria-hidden', 'true');
  };
  const dismissAssistAfterScroll = () => {
    if (window.scrollY > 180) dismissWhatsAppAssist();
  };

  whatsappAssistClose?.addEventListener('click', dismissWhatsAppAssist);
  window.addEventListener('scroll', dismissAssistAfterScroll, { passive: true });
  const introduction = document.querySelector('#inicio, main > article > section, main > section');
  if (introduction && 'IntersectionObserver' in window) {
    const introductionObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) return;
      dismissWhatsAppAssist();
      observer.disconnect();
    }, { threshold: .08 });
    introductionObserver.observe(introduction);
  }
  dismissAssistAfterScroll();
}

const trajectory = document.querySelector('.about-trajectory');
const reduceTrajectoryMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

if (trajectory && !reduceTrajectoryMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('has-trajectory-motion');
  const trajectoryObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: .2 });

  trajectoryObserver.observe(trajectory);
}

const bookingForm = document.querySelector('[data-booking-form]');
const serviceButtons = document.querySelectorAll('[data-service]');

if (bookingForm) {
  const bookingName = bookingForm.querySelector('#booking-name');
  const bookingComment = bookingForm.querySelector('#booking-comment');
  const serviceInputs = [...bookingForm.querySelectorAll('input[name="service"]')];
  const nameError = bookingForm.querySelector('#booking-name-error');
  const serviceError = bookingForm.querySelector('#booking-service-error');
  const nextButton = bookingForm.querySelector('[data-booking-next]');
  const backButton = bookingForm.querySelector('[data-booking-back]');
  const submitButton = bookingForm.querySelector('[data-booking-submit]');
  const progress = bookingForm.querySelector('[data-booking-progress]');
  const steps = [...bookingForm.querySelectorAll('[data-booking-step]')];
  const mobileQuery = window.matchMedia('(max-width: 680px)');
  let currentStep = 1;

  const normalizeText = (value) => value.trim().replace(/\s+/g, ' ');
  const clearNameError = () => {
    bookingName.setCustomValidity('');
    bookingName.removeAttribute('aria-invalid');
    nameError.hidden = true;
    nameError.textContent = '';
  };
  const clearServiceError = () => {
    serviceInputs.forEach((input) => input.removeAttribute('aria-invalid'));
    serviceError.hidden = true;
    serviceError.textContent = '';
  };
  const selectService = (service) => {
    const input = serviceInputs.find((candidate) => candidate.value === service);
    if (!input) return false;
    input.checked = true;
    clearServiceError();
    return true;
  };
  const selectedService = () => serviceInputs.find((input) => input.checked)?.value || null;
  const validateName = () => {
    const name = normalizeText(bookingName.value);
    bookingName.value = name;
    if (name) {
      clearNameError();
      return true;
    }
    bookingName.setCustomValidity('Ingresá tu nombre completo para continuar.');
    bookingName.setAttribute('aria-invalid', 'true');
    nameError.textContent = 'Ingresá tu nombre para continuar.';
    nameError.hidden = false;
    return false;
  };
  const validateService = () => {
    if (selectedService()) {
      clearServiceError();
      return true;
    }
    serviceInputs.forEach((input) => input.setAttribute('aria-invalid', 'true'));
    serviceError.textContent = 'Elegí una opción para continuar.';
    serviceError.hidden = false;
    return false;
  };
  const updateSteps = (focusTarget) => {
    const isMobile = mobileQuery.matches;
    bookingForm.dataset.currentStep = String(currentStep);
    steps.forEach((step) => {
      const isCurrent = Number(step.dataset.bookingStep) === currentStep;
      step.hidden = isMobile && !isCurrent;
      step.setAttribute('aria-hidden', String(isMobile && !isCurrent));
    });
    progress.hidden = !isMobile;
    progress.textContent = `Paso ${currentStep} de 2`;
    scheduleWhatsAppVisibility();
    if (!focusTarget || !isMobile) return;
    window.requestAnimationFrame(() => {
      if (focusTarget === 'name') bookingName.focus();
      if (focusTarget === 'service') (serviceInputs.find((input) => input.checked) || serviceInputs[0]).focus();
    });
  };
  const goToStep = (step, focusTarget) => {
    currentStep = step;
    updateSteps(focusTarget);
  };
  const buildMessage = (name, service, comment) => {
    const normalizedComment = normalizeText(comment).replace(/[.?!…]+$/u, '');
    const closing = '¿Podemos coordinar un turno?';
    if (service === 'orientacion') {
      const context = normalizedComment ? ` ${normalizedComment} y no sé qué tipo de atención necesito.` : ' No sé qué tipo de atención necesito.';
      return `Hola Gloria, mi nombre es ${name}. Quisiera solicitar una consulta con vos.${context} ${closing}`;
    }
    const serviceLabel = service === 'osteopatia' ? 'Osteopatía' : 'Kinesiología';
    const context = normalizedComment ? ` Te cuento brevemente: ${normalizedComment}.` : '';
    return `Hola Gloria, mi nombre es ${name}. Quisiera solicitar una consulta con vos por ${serviceLabel}.${context} ${closing}`;
  };

  bookingForm.dataset.bookingEnhanced = 'true';
  nextButton.hidden = false;
  backButton.hidden = false;
  submitButton.hidden = false;

  const requestedService = typeof window.location?.search === 'string'
    ? new URLSearchParams(window.location.search).get('service')
    : null;
  if (requestedService) selectService(requestedService);
  updateSteps();

  serviceButtons.forEach((button) => {
    button.addEventListener('click', () => selectService(button.dataset.service));
  });

  bookingName.addEventListener('input', () => {
    if (normalizeText(bookingName.value)) clearNameError();
  });
  bookingName.addEventListener('blur', validateName);
  serviceInputs.forEach((input) => input.addEventListener('change', clearServiceError));
  nextButton.addEventListener('click', () => {
    if (!validateName()) {
      bookingName.focus();
      return;
    }
    goToStep(2, 'service');
  });
  backButton.addEventListener('click', () => goToStep(1, 'name'));
  mobileQuery.addEventListener('change', () => updateSteps());

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const isNameValid = validateName();
    const service = selectedService();
    const isServiceValid = validateService();
    if (!isNameValid) {
      goToStep(1, 'name');
      return;
    }
    if (!isServiceValid) {
      goToStep(2, 'service');
      return;
    }
    const message = buildMessage(bookingName.value, service, bookingComment.value);
    const url = `https://wa.me/5492664921564?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
