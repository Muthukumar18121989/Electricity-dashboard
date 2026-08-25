/**
 * StepIndicator — persistent "where am I" strip for a multi-screen journey.
 *
 * A completed step is a clickable shortcut back to it (`onSelect`); the
 * current step is marked current for assistive tech; a step not yet reached
 * is inert — the journey's order is a business rule, not a shortcut.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  DA.components = DA.components || {};

  DA.components.StepIndicator = function StepIndicator(options) {
    options = options || {};
    var steps = options.steps || [];
    var current = options.current || 0;

    return el('ol', { className: 'step-indicator', attrs: { 'aria-label': options.ariaLabel || 'Progress' } },
      steps.map(function (step, index) {
        var state = index < current ? 'done' : index === current ? 'current' : 'upcoming';
        var canSelect = state === 'done' && options.onSelect;

        var marker = state === 'done'
          ? el('span', { className: 'step-indicator__marker' }, [DA.icons.check(12)])
          : el('span', { className: 'step-indicator__marker' }, [el('span', { text: String(index + 1) })]);

        var content = [marker, el('span', { className: 'step-indicator__label', text: step.label })];

        return el('li', {
          className: 'step-indicator__item step-indicator__item--' + state,
          attrs: { 'aria-current': state === 'current' ? 'step' : false }
        }, [
          canSelect
            ? el('button', {
                className: 'step-indicator__button',
                attrs: { type: 'button', 'aria-label': 'Back to ' + step.label },
                on: { click: function () { options.onSelect(index); } }
              }, content)
            : el('span', { className: 'step-indicator__button' }, content)
        ]);
      })
    );
  };
})(window.DA);
