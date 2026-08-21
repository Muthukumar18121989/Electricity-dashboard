/**
 * DataTable — the product's one tabular pattern.
 *
 * Renders a real <table> with a sticky header inside a scrollable viewport:
 * wide data scrolls horizontally rather than collapsing into cards, so column
 * alignment and row comparison survive on every screen size.
 *
 * columns: [{ key, label, width, align, className, render(row) -> Node|string }]
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  DA.components = DA.components || {};

  DA.components.DataTable = function DataTable(options) {
    var columns = options.columns || [];
    var rows = options.rows || [];

    var colgroup = el(
      'colgroup',
      {},
      columns.map(function (column) {
        return el('col', { style: column.width ? { width: column.width } : {} });
      })
    );

    var head = el('thead', {}, [
      el(
        'tr',
        {},
        columns.map(function (column) {
          var custom = column.renderHeader ? column.renderHeader() : null;
          return el('th', {
            text: custom ? null : column.label,
            attrs: { scope: 'col', 'aria-label': column.ariaLabel || false },
            className: column.headerClassName || ''
          }, custom ? [custom] : null);
        })
      )
    ]);

    var body = el('tbody');

    if (rows.length === 0) {
      body.appendChild(
        el('tr', {}, [
          el('td', { attrs: { colspan: columns.length }, style: { 'white-space': 'normal' } }, [
            options.emptyState || DA.components.EmptyState({ title: 'No records found' })
          ])
        ])
      );
    } else {
      rows.forEach(function (row) {
        body.appendChild(
          el(
            'tr',
            {},
            columns.map(function (column) {
              var content = column.render ? column.render(row) : row[column.key];
              var isNode = content instanceof Node;
              return el(
                'td',
                {
                  className: column.className || '',
                  text: isNode ? null : content,
                  attrs: { title: isNode ? false : String(content == null ? '' : content) }
                },
                isNode ? [content] : null
              );
            })
          )
        );
      });
    }

    var table = el('table', {
      className: 'data-table' + (options.embedded ? ' data-table--auto' : '') +
        (options.headerTone === 'warm' ? ' data-table--warm' : '')
    }, [
      options.caption
        ? el('caption', { className: 'u-visually-hidden', text: options.caption })
        : null,
      colgroup,
      head,
      body
    ]);

    return el(
      'div',
      {
        className: 'data-table__viewport scroll-area' +
          (options.embedded ? ' data-table__viewport--auto' : ''),
        attrs: {
          tabindex: '0',
          role: 'region',
          'aria-label': options.caption || 'Data table'
        }
      },
      [table]
    );
  };

  /** Record link cell: identifier + chevron affordance, one hit target. */
  DA.components.RecordLink = function RecordLink(options) {
    return el(
      'a',
      {
        className: 'record-link',
        attrs: {
          href: options.href || '#',
          'aria-label': options.ariaLabel || false
        }
      },
      [el('span', { className: 'record-link__label', text: options.label }), DA.icons.chevronRight()]
    );
  };
})(window.DA);
