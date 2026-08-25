/**
 * SummaryPanel — collapsible record header.
 *
 * Collapsed it shows the identifying fields inline; expanded it adds the full
 * detail grid. Both use the same label/value pair so the record reads
 * consistently either way.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  DA.components = DA.components || {};

  var uid = 0;

  DA.components.Detail = function Detail(options) {
    return el('p', { className: 'detail' }, [
      el('span', { className: 'detail__label', text: options.label + ':' }),
      ' ',
      el('span', {
        className: 'detail__value',
        text: options.value == null || options.value === '' ? '-' : String(options.value)
      })
    ]);
  };

  DA.components.SummaryPanel = function SummaryPanel(options) {
    options = options || {};
    uid += 1;
    var bodyId = 'summary-panel-' + uid;
    var expanded = options.expanded !== false;

    var body = el('div', {
      className: 'summary-panel__body',
      attrs: { id: bodyId, hidden: !expanded }
    }, (options.columns || []).map(function (column) {
      return el('div', { className: 'summary-panel__column' }, column.map(function (item) {
        return DA.components.Detail(item);
      }));
    }));

    var header = el('button', {
      className: 'summary-panel__header',
      attrs: {
        type: 'button',
        'aria-expanded': expanded ? 'true' : 'false',
        'aria-controls': bodyId
      },
      on: {
        click: function () {
          expanded = !expanded;
          header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          body.hidden = !expanded;
        }
      }
    }, [
      DA.icons.chevronRight(16, 'summary-panel__icon'),
      el('span', { className: 'summary-panel__header-items' },
        (options.headline || []).map(function (item) {
          return DA.components.Detail(item);
        })
      )
    ]);

    return el('section', {
      className: 'summary-panel',
      attrs: { 'aria-label': options.ariaLabel || 'Record summary' }
    }, [header, body]);
  };
})(window.DA);
