const assert = require('node:assert/strict');
const fs = require('node:fs');

const createClassList = () => {
  const values = new Set();
  return {
    add: (value) => values.add(value),
    contains: (value) => values.has(value),
    toggle: (value, force) => {
      const enabled = force === undefined ? !values.has(value) : force;
      if (enabled) values.add(value);
      else values.delete(value);
      return enabled;
    },
  };
};

const toggleListeners = {};
const documentListeners = {};
const windowListeners = {};
const label = { textContent: 'Abrir menú' };
const header = { classList: createClassList() };
const navigation = { classList: createClassList(), contains: (target) => target === navigation };
const toggle = {
  attributes: new Map([['aria-expanded', 'false']]),
  addEventListener: (event, listener) => { toggleListeners[event] = listener; },
  contains: (target) => target === toggle,
  focus: () => { toggle.focused = true; document.activeElement = toggle; },
  getAttribute: (name) => toggle.attributes.get(name),
  querySelector: () => label,
  setAttribute: (name, value) => toggle.attributes.set(name, value),
};
const menuLinkListeners = [];
const menuLink = {
  addEventListener: (event, listener) => menuLinkListeners.push({ event, listener }),
  focus: () => { document.activeElement = menuLink; },
};
const year = { textContent: '' };

global.document = {
  activeElement: undefined,
  body: { style: {} },
  addEventListener: (event, listener) => { documentListeners[event] = listener; },
  querySelector: (selector) => ({ '[data-header]': header, '.menu-toggle': toggle, '.main-nav': navigation, '[data-year]': year }[selector]),
  querySelectorAll: () => [menuLink],
};
global.window = {
  innerWidth: 390,
  scrollY: 0,
  addEventListener: (event, listener) => { (windowListeners[event] ??= []).push(listener); },
};

new Function(fs.readFileSync('script.js', 'utf8'))();

toggleListeners.click();
assert.equal(toggle.getAttribute('aria-expanded'), 'true');
assert.equal(label.textContent, 'Cerrar menú');
assert.equal(navigation.classList.contains('is-open'), true);
assert.equal(document.body.style.overflow, 'hidden');
assert.equal(document.activeElement, menuLink);

toggle.focus();
const trappedShiftTab = { key: 'Tab', shiftKey: true, prevented: false, preventDefault() { this.prevented = true; } };
documentListeners.keydown(trappedShiftTab);
assert.equal(trappedShiftTab.prevented, true);
assert.equal(document.activeElement, menuLink);

documentListeners.keydown({ key: 'Escape' });
assert.equal(toggle.getAttribute('aria-expanded'), 'false');
assert.equal(label.textContent, 'Abrir menú');
assert.equal(navigation.classList.contains('is-open'), false);
assert.equal(document.body.style.overflow, '');
assert.equal(toggle.focused, true);

toggleListeners.click();
documentListeners.click({ target: {} });
assert.equal(navigation.classList.contains('is-open'), false);

window.scrollY = 12;
windowListeners.scroll.forEach((listener) => listener());
assert.equal(header.classList.contains('is-stuck'), true);

assert.match(String(year.textContent), /^\d{4}$/);
