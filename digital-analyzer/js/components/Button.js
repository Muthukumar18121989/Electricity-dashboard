/**
 * Button — variants: primary (brand gold), secondary, ghost.
 * Usage: DA.components.Button({ label: 'New Analyzer Packet', variant: 'primary' })
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;

  DA.components = DA.components || {};

  DA.components.Button = function Button(options) {
    options = options || {};
    var variant = options.variant || 'secondary';

    return el(
      'button',
      {
        className: 'button button--' + variant + (options.className ? ' ' + options.className : ''),
        attrs: {
          type: options.type || 'button',
          disabled: options.disabled || false,
          'aria-label': options.ariaLabel || false
        },
        on: options.onClick ? { click: options.onClick } : {}
      },
      [options.icon || null, el('span', { text: options.label })]
    );
  };

  /** Icon-only button. `ariaLabel` is required — the icon carries no text. */
  DA.components.IconButton = function IconButton(options) {
    return el(
      'button',
      {
        className: 'icon-button' + (options.className ? ' ' + options.className : ''),
        attrs: { type: 'button', 'aria-label': options.ariaLabel, title: options.ariaLabel },
        on: options.onClick ? { click: options.onClick } : {}
      },
      [options.icon]
    );
  };
})(window.DA);
