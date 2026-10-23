// Progressive enhancement: native details work before this script or without JS.
const conversation = document.querySelector('[data-advice-conversation]');

if (conversation) {
  const details = [...conversation.querySelectorAll('[data-advice-question]')];
  const choices = document.createElement('div');
  choices.className = 'advice-choice-list';
  choices.setAttribute('role', 'group');
  choices.setAttribute('aria-label', 'Situaciones cotidianas');
  const status = document.createElement('p');
  status.className = 'visually-hidden';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const entries = details.map((detail) => {
    const summary = detail.querySelector('summary');
    const response = detail.querySelector('.advice-answer');
    const button = document.createElement('button');
    const item = document.createElement('div');
    item.className = 'advice-choice-item';
    button.type = 'button';
    button.id = summary.id;
    button.className = 'advice-choice';
    button.textContent = summary.textContent.trim();
    button.setAttribute('aria-label', button.textContent);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', response.id);
    response.hidden = true;
    item.append(button, response);
    choices.append(item);
    return { button, response };
  });

  conversation.replaceChildren(choices, status);
  entries.forEach(({ button, response }) => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      entries.forEach((entry) => {
        const selected = open && entry.button === button;
        entry.button.setAttribute('aria-expanded', String(selected));
        entry.response.hidden = !selected;
      });
      status.textContent = open
        ? `Respuesta abierta: ${response.querySelector('h3').textContent}`
        : 'Respuesta cerrada. Podes elegir otra situación.';
    });
  });
}
