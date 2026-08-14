/* =========================================================
   ICONS.JS — lightweight inline SVG icon set (no emojis, no
   external requests). Every icon uses stroke="currentColor"
   so it inherits color from CSS. Call icon("name") to get a
   ready-to-insert <svg> string, or icon("name","cls") to add
   an extra class.
   ========================================================= */

const ICONS = {
  cart: '<path d="M3 3h2l.4 2M7 13h10l3.6-8.4A1 1 0 0 0 19.7 3H5.4M7 13 5.4 5M7 13l-1.4 6.4A1 1 0 0 0 6.6 20H18"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>',
  truck: '<path d="M14 18V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1"/><path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1"/><circle cx="6.5" cy="18.5" r="1.8"/><circle cx="16.5" cy="18.5" r="1.8"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 6v.01M18 18v-.01"/>',
  phoneMoney: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 6h2M12 16v2"/><circle cx="12" cy="12" r="2.4"/>',
  handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  returnArrow: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  location: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M13.4 9.6a10 10 0 0 0 3.9 3.9l1.3-1.6a1.3 1.3 0 0 1 1.5-.4c1 .4 2.1.6 3.2.6a1.3 1.3 0 0 1 1.3 1.3v3a1.3 1.3 0 0 1-1.3 1.3A17.7 17.7 0 0 1 5.3 5.7 1.3 1.3 0 0 1 6.6 4.4h3a1.3 1.3 0 0 1 1.3 1.3c0 1.1.2 2.2.6 3.2a1.3 1.3 0 0 1-.4 1.5l-1.6 1.2Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 9.3 6.2a1.6 1.6 0 0 0 1.8 0L22 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  alertTriangle: '<path d="M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.2h17.8a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z"/><path d="M12 9v4M12 17h.01"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/><path d="M10 11v6M14 11v6"/>',
  whatsapp: '<path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.6-1.5-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3Z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Z"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1L12 2Z"/>',
  package: '<path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v9l9 5 9-5V8"/><path d="M12 13v9"/>',
  shield: '<path d="M12 2 4 5v6c0 5.5 3.4 9 8 11 4.6-2 8-5.5 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  facebook: '<path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2a1 1 0 0 1 1-1Z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.7"/><circle cx="17.2" cy="6.8" r="1"/>',
  building: '<path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18"/><path d="M3 22h18M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/>',
  heart: '<path d="M12 20.5s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 11.5c-2.5 4.4-9.5 9-9.5 9Z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
};

function iconSvg(name, cls=""){
  const body = ICONS[name] || "";
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/* Auto-hydrate any <i data-icon="name" class="..."></i> placeholders found
   in static HTML into real inline SVGs on page load. */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-icon]").forEach(el => {
    const name = el.getAttribute("data-icon");
    el.outerHTML = iconSvg(name, el.className);
  });
});
