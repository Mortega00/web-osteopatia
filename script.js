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
const whatsappContact = document.querySelector('[data-whatsapp-contact]');

if (whatsappAssist && whatsappFloat && whatsappContact) {
  const pageId = whatsappContact.getAttribute('data-whatsapp-page');
  // Explicit page IDs also work under the GitHub Pages repository path.
  const dismissalKey = ['home', 'osteopatia', 'kinesiologia'].includes(pageId)
    ? `gloria-whatsapp-dismissed-${pageId}` : null;
  const dismissWhatsAppAssist = () => {
    whatsappAssist.classList.add('is-dismissed');
    whatsappAssist.setAttribute('aria-hidden', 'true');
    whatsappAssist.inert = true;
  };

  try {
    if (dismissalKey && window.sessionStorage.getItem(dismissalKey) === 'true') dismissWhatsAppAssist();
  } catch { /* Closing still works when browser storage is unavailable. */ }

  whatsappAssistClose?.addEventListener('click', () => {
    dismissWhatsAppAssist();
    whatsappFloat?.focus({ preventScroll: true });
    try {
      if (dismissalKey) window.sessionStorage.setItem(dismissalKey, 'true');
    } catch { /* No personal data is stored; storage is optional. */ }
  });

  const controls = [...document.querySelectorAll('a[href], button, input:not([type="hidden"]), textarea, select, summary, label, [tabindex]')]
    .filter((element) => !whatsappContact.contains(element));
  let circleLift = 0;
  let assistLift = 0;
  let placement = 'above';
  let placementFrame = null;

  const temporarilyUnavailable = (element, unavailable) => {
    element.classList.toggle('is-obstructed', unavailable);
    const hidden = unavailable || element.classList.contains('is-dismissed');
    element.inert = hidden;
    if (hidden) element.setAttribute('aria-hidden', 'true');
    else element.removeAttribute('aria-hidden');
  };

  // Keep the current placement whenever it is safe; do not chase the default
  // position on every scroll. Candidates are bounded to the same right corner.
  const findSafeLift = (base, current, limit, obstacles, viewport) => {
    const maximum = Math.min(limit, base.top - viewport.top);
    const blockers = obstacles.filter((rect) => rect.right > base.left && rect.left < base.right);
    const safe = (lift) => lift >= 0 && lift <= maximum
      && base.left >= viewport.left && base.right <= viewport.right
      && base.bottom - lift <= viewport.bottom
      && !blockers.some((rect) => rect.bottom > base.top - lift && rect.top < base.bottom - lift);
    if (safe(current)) return current;
    const candidates = [0, Math.max(0, base.bottom - viewport.bottom), maximum];
    blockers.forEach((rect) => candidates.push(base.bottom - rect.top, base.top - rect.bottom));
    return candidates.filter(safe).sort((a, b) => Math.abs(a - current) - Math.abs(b - current) || a - b)[0];
  };

  const updateWhatsAppPlacement = () => {
    placementFrame = null;
    if (document.body.classList.contains('menu-is-open')) return;

    // Read layout in one batch before updating this component only.
    const anchor = whatsappContact.getBoundingClientRect();
    const visual = window.visualViewport;
    const viewport = {
      left: (visual?.offsetLeft || 0) + 12,
      right: (visual?.offsetLeft || 0) + (visual?.width || window.innerWidth) - 12,
      top: Math.max((visual?.offsetTop || 0) + 12, header.getBoundingClientRect().bottom + 8),
      bottom: (visual?.offsetTop || 0) + (visual?.height || window.innerHeight) - 16,
    };
    const obstacles = controls.flatMap((element) => {
      const style = window.getComputedStyle(element);
      if (style.visibility === 'hidden' || style.display === 'none' || element.closest('[inert]')) return [];
      return [...element.getClientRects()].filter((rect) => rect.width && rect.height
        && rect.bottom > viewport.top && rect.top < viewport.bottom)
        .map((rect) => ({ left: rect.left - 8, right: rect.right + 8, top: rect.top - 8, bottom: rect.bottom + 8 }));
    });
    const nextCircleLift = findSafeLift(anchor, circleLift, 112, obstacles, viewport);
    const circleAvailable = nextCircleLift !== undefined;
    let nextAssist;
    const assistWidth = whatsappAssist.offsetWidth;
    const assistHeight = whatsappAssist.offsetHeight;
    const gap = window.innerWidth <= 680 ? 8 : 10;

    if (circleAvailable && !whatsappAssist.classList.contains('is-dismissed')) {
      const circleTop = anchor.top - nextCircleLift;
      const circleBottom = anchor.bottom - nextCircleLift;
      for (const mode of [placement, placement === 'above' ? 'beside' : 'above']) {
        const right = mode === 'above' ? anchor.right : anchor.left - gap;
        const bottom = mode === 'above' ? circleTop - gap : circleBottom;
        const base = { left: right - assistWidth, right, top: bottom - assistHeight, bottom };
        const lift = findSafeLift(base, mode === placement ? assistLift : 0, 180, obstacles, viewport);
        if (lift !== undefined) {
          nextAssist = { mode, lift, right: anchor.right - right, bottom: anchor.bottom - bottom + lift };
          break;
        }
      }
    }

    if (circleAvailable) {
      circleLift = nextCircleLift;
      whatsappFloat.style.setProperty('--whatsapp-circle-lift', `${circleLift}px`);
    }
    if (nextAssist) {
      placement = nextAssist.mode;
      assistLift = nextAssist.lift;
      whatsappAssist.dataset.placement = placement;
      whatsappAssist.style.setProperty('--whatsapp-assist-right', `${nextAssist.right}px`);
      whatsappAssist.style.setProperty('--whatsapp-assist-bottom', `${nextAssist.bottom}px`);
    }
    const focusedInAssist = whatsappAssist.contains(document.activeElement);
    const focusedOnCircle = document.activeElement === whatsappFloat;
    // A lack of safe space is temporary, never a stored/manual dismissal.
    temporarilyUnavailable(whatsappFloat, !circleAvailable);
    temporarilyUnavailable(whatsappAssist, !nextAssist && !whatsappAssist.classList.contains('is-dismissed'));
    if ((!nextAssist && focusedInAssist) || (!circleAvailable && focusedOnCircle)) {
      const focusTarget = circleAvailable ? whatsappFloat
        : (toggle.getClientRects().length ? toggle : document.querySelector('.brand'));
      focusTarget?.focus({ preventScroll: true });
    }
  };

  const scheduleWhatsAppPlacement = () => {
    if (placementFrame === null) placementFrame = window.requestAnimationFrame(updateWhatsAppPlacement);
  };
  window.addEventListener('scroll', scheduleWhatsAppPlacement, { passive: true });
  window.addEventListener('resize', scheduleWhatsAppPlacement);
  window.addEventListener('pageshow', scheduleWhatsAppPlacement);
  window.addEventListener('load', scheduleWhatsAppPlacement);
  window.visualViewport?.addEventListener('resize', scheduleWhatsAppPlacement);
  window.visualViewport?.addEventListener('scroll', scheduleWhatsAppPlacement, { passive: true });
  ['click', 'focusin', 'input', 'change', 'toggle'].forEach((event) => document.addEventListener(event, scheduleWhatsAppPlacement, true));
  if ('ResizeObserver' in window) {
    const contentObserver = new ResizeObserver(scheduleWhatsAppPlacement);
    contentObserver.observe(document.querySelector('main'));
  }
  scheduleWhatsAppPlacement();
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
