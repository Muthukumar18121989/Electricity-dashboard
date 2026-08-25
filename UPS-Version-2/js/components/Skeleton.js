/**
 * Skeleton — loading placeholders shaped like the content they precede, so
 * the layout doesn't jump when real data arrives.
 *
 * SkeletonBlock: one shimmering bar.
 * SkeletonTableRows: a set of rows shaped like DataTable rows, for a table
 * that is still loading its first page of data.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  DA.components = DA.components || {};

  DA.components.SkeletonBlock = function SkeletonBlock(options) {
    options = options || {};
    return el('span', {
      className: 'skeleton',
      attrs: { 'aria-hidden': 'true' },
      style: {
        width: options.width || '100%',
        height: options.height || '14px',
        'border-radius': options.radius || 'var(--radius-sm)'
      }
    });
  };

  /** Mimics the packet-list table: a header bar plus `rows` shimmering rows. */
  DA.components.SkeletonTableRows = function SkeletonTableRows(options) {
    options = options || {};
    var count = options.rows || 6;
    var widths = options.columnWidths || ['70%', '85%', '60%', '75%', '55%', '65%', '50%'];

    var body = [];
    for (var i = 0; i < count; i += 1) {
      body.push(el('div', { className: 'skeleton-row', attrs: { 'aria-hidden': 'true' } },
        widths.map(function (w) {
          return el('span', { className: 'skeleton-row__cell' }, [
            DA.components.SkeletonBlock({ width: w, height: '11px' })
          ]);
        })
      ));
    }

    return el('div', { className: 'skeleton-table' }, [
      el('p', { className: 'u-visually-hidden', text: options.label || 'Loading…', attrs: { role: 'status' } }),
      el('div', { className: 'skeleton-row skeleton-row--head' },
        widths.map(function () { return el('span', { className: 'skeleton-row__cell' }); })
      )
    ].concat(body));
  };
})(window.DA);
