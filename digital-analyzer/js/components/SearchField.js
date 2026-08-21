/**
 * SearchField — labelled search input with a leading icon.
 * Input is debounced so filtering does not run on every keystroke.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  DA.components = DA.components || {};

  DA.components.SearchField = function SearchField(options) {
    options = options || {};
    var id = options.id || 'search-' + Math.random().toString(36).slice(2, 8);
    var timer = null;

    var input = el('input', {
      className: 'search-field__input',
      attrs: {
        id: id,
        type: 'search',
        placeholder: options.placeholder || 'Search',
        autocomplete: 'off',
        'aria-describedby': options.describedBy || false
      },
      on: {
        input: function (event) {
          if (!options.onSearch) return;
          var value = event.target.value;
          window.clearTimeout(timer);
          timer = window.setTimeout(function () { options.onSearch(value); }, 180);
        }
      }
    });

    var icon = DA.icons.search();
    icon.setAttribute('class', 'search-field__icon');

    return el('div', { className: 'search-field' }, [
      el('label', { className: 'u-visually-hidden', text: options.label, attrs: { for: id } }),
      icon,
      input
    ]);
  };
})(window.DA);
