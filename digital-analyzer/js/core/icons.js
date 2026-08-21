/**
 * Icon set — stroke icons on a 24px grid so weight stays consistent.
 * Every icon is decorative; accessible names live on the control that owns it.
 */
(function (DA) {
  'use strict';

  var svg = DA.dom.svg;
  var STROKE =
    'fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"';

  function bell(size) {
    return svg(
      '<path ' + STROKE + ' d="M18 8.5a6 6 0 1 0-12 0c0 5.2-1.5 6.8-2 7.5h16c-.5-.7-2-2.3-2-7.5Z"/>' +
      '<path ' + STROKE + ' d="M10 19a2.2 2.2 0 0 0 4 0"/>',
      { size: size || 22 }
    );
  }

  function search(size) {
    return svg(
      '<circle ' + STROKE + ' cx="11" cy="11" r="6.25"/>' +
      '<path ' + STROKE + ' d="m16 16 4 4"/>',
      { size: size || 18 }
    );
  }

  function chevronRight(size) {
    return svg('<path ' + STROKE + ' d="m9.5 5.5 6.5 6.5-6.5 6.5"/>', {
      size: size || 14,
      className: 'record-link__chevron'
    });
  }

  function plus(size) {
    return svg('<path ' + STROKE + ' d="M12 5.5v13M5.5 12h13"/>', { size: size || 16 });
  }

  function inbox(size) {
    return svg(
      '<path ' + STROKE + ' d="M3.5 13.5h4l1.5 2.5h6l1.5-2.5h4"/>' +
      '<path ' + STROKE + ' d="M5.6 4.5h12.8l2.1 9v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-5Z"/>',
      { size: size || 40 }
    );
  }

  /**
   * UPS shield mark — simplified in-code placeholder.
   * Swap for the official brand asset before any external release.
   */
  function upsShield() {
    var node = DA.dom.svg('', { viewBox: '0 0 52 60', size: 0 });
    node.setAttribute('width', '52');
    node.setAttribute('height', '60');
    node.innerHTML =
      '<path d="M8.5 3.5h35a6 6 0 0 1 6 6v23.9c0 12.2-9.4 19.9-23.5 24.2C11.9 53.3 2.5 45.6 2.5 33.4V9.5a6 6 0 0 1 6-6Z" ' +
      'fill="var(--color-brand-shield)"/>' +
      '<path d="M13.5 15.5c3.6-4.4 8-6.6 12.5-6.6s8.9 2.2 12.5 6.6" fill="none" ' +
      'stroke="var(--color-brand-brown)" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M26 8.9c-1.9 0-3.1 1.3-3.1 2.7 0 1.5 1.3 2.5 3.1 2.5s3.1-1 3.1-2.5c0-1.4-1.2-2.7-3.1-2.7Z" ' +
      'fill="var(--color-brand-brown)"/>' +
      '<text x="26" y="42.5" text-anchor="middle" fill="var(--color-brand-brown)" ' +
      'font-family="var(--font-family-base)" font-size="20" font-weight="700" ' +
      'letter-spacing="-0.5">ups</text>';
    return node;
  }

  DA.icons = {
    bell: bell,
    search: search,
    chevronRight: chevronRight,
    plus: plus,
    inbox: inbox,
    upsShield: upsShield
  };
})(window.DA);
