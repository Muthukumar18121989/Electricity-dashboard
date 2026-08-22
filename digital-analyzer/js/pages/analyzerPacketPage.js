/**
 * Analyzer Packet — the report built from the packet's scenarios.
 *
 * Reached from "Proceed to Analyzer Packet". Two levels of tabs: the report
 * section (Analyzer, Pricing Terms, …) and, within Analyzer, the view
 * (Comparisons, Services, …). Only Analyzer > Services is documented by a
 * reference screen; the rest render the product's empty table state.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  var C = DA.components;

  DA.pages = DA.pages || {};

  /** Right-aligned numeric column; `link` makes the figure a drill-down. */
  function numeric(key, label, options) {
    options = options || {};
    return {
      key: key,
      label: label,
      width: options.width || '110px',
      className: 'is-numeric is-end',
      headerClassName: 'is-end',
      render: options.link
        ? function (row) {
            return el('a', {
              text: row[key] == null ? '-' : row[key],
              attrs: { href: '#detail', 'aria-label': label + ' ' + row[key] }
            });
          }
        : function (row) { return row[key] == null ? '-' : row[key]; }
    };
  }

  function emptyView(label) {
    return function () {
      return el('div', { className: 'card' }, [
        C.DataTable({
          caption: label,
          embedded: true,
          headerTone: 'warm',
          columns: [{ key: 'name', label: label }],
          rows: [],
          emptyState: el('p', { className: 'table-empty', text: 'No data available.' })
        })
      ]);
    };
  }

  DA.pages.AnalyzerPacketPage = function AnalyzerPacketPage(options) {
    options = options || {};
    var packet = options.packet || {};

    /* ---- Scenario comparison band ---------------------------------------- */

    var summary = el('section', { className: 'panel panel--auto' }, [
      C.DataTable({
        caption: 'Scenario comparison',
        embedded: true,
        headerTone: 'plain',
        dividers: true,
        columns: [
          { key: 'scenario', label: 'Scenario', width: '160px' },
          numeric('adv', 'ADV'),
          numeric('baseDisc', 'Base Disc'),
          numeric('totalDisc', 'Total Disc'),
          numeric('rpp', 'RPP'),
          numeric('annualRevenue', 'Annual Revenue', { width: '150px' }),
          numeric('or', 'OR'),
          numeric('annualProfit', 'Annual Profit', { width: '150px' })
        ],
        rows: DA.data.packetSummary
      })
    ]);

    /* ---- Analyzer > Services --------------------------------------------- */

    function servicesView() {
      return el('div', {}, [
        el('div', { className: 'view-filters' }, [
          el('div', { className: 'view-filters__field' }, [
            C.SelectField({
              label: 'Choose Scenario',
              value: 'Current',
              options: (packet.scenarios || []).map(function (scenario) {
                return { value: scenario.name, label: scenario.name };
              })
            })
          ]),
          el('span', { className: 'view-filters__divider' }),
          el('div', { className: 'view-filters__field' }, [
            C.SelectField({ label: 'Choose Bid', value: 'All', options: [{ value: 'All', label: 'All' }] })
          ]),
          C.Button({ label: 'Filters', variant: 'ghost', icon: DA.icons.filter(16) })
        ]),
        el('div', { className: 'card' }, [
          C.DataTable({
            caption: 'Services',
            embedded: true,
            headerTone: 'warm',
            tinted: true,
            columns: [
              {
                key: 'service',
                label: 'Core Service',
                width: '240px',
                render: function (row) {
                  return el('button', {
                    className: 'row-expander',
                    attrs: { type: 'button', 'aria-label': 'Open ' + row.service }
                  }, [
                    el('span', { className: 'row-expander__label', text: row.service }),
                    DA.icons.chevronRight(14, 'row-expander__icon')
                  ]);
                }
              },
              numeric('volume', 'Volume', { link: true, width: '95px' }),
              numeric('adv', 'ADV', { link: true, width: '80px' }),
              numeric('avgZone', 'Avg Zone', { link: true, width: '100px' }),
              numeric('billableWt', 'Billable Wt', { link: true, width: '105px' }),
              numeric('pps', 'PPS', { link: true, width: '80px' }),
              numeric('baseGrossRev', 'Base Gross Rev', { link: true, width: '135px' }),
              numeric('baseNetRev', 'Base Net Rev', { link: true, width: '125px' }),
              numeric('disc', 'Disc', { width: '85px' }),
              numeric('baseRpp', 'Base RPP', { link: true, width: '105px' }),
              numeric('baseProfit', 'Base Profit', { link: true, width: '110px' }),
              numeric('baseOr', 'Base OR', { width: '95px' })
            ],
            rows: DA.data.packetServices
          })
        ])
      ]);
    }

    var analyzerView = el('div', { className: 'panel panel--auto' }, [
      C.Tabs({
        ariaLabel: 'Analyzer views',
        value: 'services',
        items: [
          { id: 'comparisons', label: 'Comparisons', render: emptyView('Comparison') },
          { id: 'services', label: 'Services', render: servicesView },
          { id: 'charges', label: 'Charges', render: emptyView('Charge') },
          { id: 'accounts', label: 'Accounts', render: emptyView('Account') },
          { id: 'cost-details', label: 'Cost Details', render: emptyView('Cost Detail') },
          { id: 'zones', label: 'Zones', render: emptyView('Zone') },
          { id: 'weight-cube', label: 'Weight & Cube', render: emptyView('Weight & Cube') }
        ]
      })
    ]);

    /* ---- Composition ------------------------------------------------------ */

    var page = el('main', { className: 'page', attrs: { id: 'main-content' } }, [
      C.Breadcrumb({
        separator: '/',
        items: [
          { label: 'My Analyzers', onClick: options.onExit },
          { label: 'Packet' }
        ]
      }),
      el('div', { className: 'record-header' }, [
        el('h2', {
          className: 'record-header__title title-rule title-rule--full',
          text: packet.customerName || '-'
        }),
        el('div', { className: 'record-header__meta' }, [
          el('span', { className: 'badge badge--success', text: packet.industry || '-' }),
          el('span', { text: 'Sub Industry : ' + (packet.subIndustry || '-') }),
          el('span', { className: 'meta-divider' }),
          el('span', { text: packet.referenceNumber || '-' }),
          el('span', { className: 'meta-divider' }),
          el('span', { text: 'Analyzer Packet: ' + (packet.packetId || '-') })
        ])
      ]),
      el('div', { className: 'page-back' }, [
        C.Button({
          label: 'Back to Scenarios',
          variant: 'link',
          icon: DA.icons.chevronLeft(14),
          onClick: function () { if (options.onBack) options.onBack(); }
        })
      ]),
      el('div', { className: 'report-filters' }, [
        el('div', { className: 'report-filters__field' }, [
          C.SelectField({
            label: 'View',
            hideLabel: true,
            value: 'Comparison View',
            options: [{ value: 'Comparison View', label: 'Comparison View' }]
          })
        ]),
        el('div', { className: 'report-filters__field' }, [
          C.SelectField({ label: 'Revenue Basis', value: 'All', options: [{ value: 'All', label: 'All' }] })
        ]),
        el('div', { className: 'report-filters__field' }, [
          C.SelectField({
            label: 'Cost Basis',
            value: 'Fully Allocated Cost',
            options: [{ value: 'Fully Allocated Cost', label: 'Fully Allocated Cost' }]
          })
        ]),
        el('div', { className: 'report-filters__actions' }, [
          C.Button({
            label: 'Reset',
            variant: 'outline',
            shape: 'pill',
            icon: DA.icons.refresh(15),
            iconPosition: 'end'
          })
        ])
      ]),
      summary,
      el('div', { className: 'tabs--page' }, [
        C.Tabs({
          ariaLabel: 'Report sections',
          value: 'analyzer',
          items: [
            { id: 'analyzer', label: 'Analyzer', render: function () { return analyzerView; } },
            { id: 'pricing-terms', label: 'Pricing Terms', render: emptyView('Pricing Term') },
            { id: 'other-terms', label: 'Other Terms', render: emptyView('Other Term') },
            { id: 'adjustments', label: 'Adjustments', render: emptyView('Adjustment') },
            { id: 'rate-charts', label: 'Rate Charts', render: emptyView('Rate Chart') }
          ]
        })
      ])
    ]);

    return page;
  };
})(window.DA);
