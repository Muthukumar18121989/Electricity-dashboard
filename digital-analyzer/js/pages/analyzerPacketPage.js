/**
 * Analyzer Packet — the report built from the packet's scenarios.
 *
 * Reached from "Proceed to Analyzer Packet". The comparison selector chooses
 * which scenarios the report covers; the tabs below split it into Summary,
 * Rate Charts, Shipping Profiles, Pricing terms and Other terms.
 *
 * Summary and Shipping Profiles > Cost/Service are documented by reference
 * screens; the remaining tabs render the product's empty table state.
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
    var customer = packet.customerName || '-';
    var scenarios = packet.scenarios || [];

    function withCustomer(text) {
      return String(text).replace('{customer}', customer);
    }

    /* ---- Comparison selector --------------------------------------------- */

    var comparisonSelector = C.Dropdown({
      label: 'Comparison View',
      content: [
        el('div', {}, scenarios.map(function (scenario, index) {
          return el('div', { className: 'dropdown__option' }, [
            C.Checkbox({
              // The baseline scenario is always part of a comparison.
              checked: index === 0,
              label: scenario.name
            })
          ]);
        })),
        el('div', { className: 'dropdown__footer' }, [
          C.Button({
            label: 'Apply',
            variant: 'outline',
            shape: 'pill',
            onClick: function () { comparisonSelector.close(); }
          })
        ])
      ]
    });

    /* ---- Summary tab ------------------------------------------------------ */

    function summaryColumns() {
      return [
        {
          key: 'label',
          label: 'Cost Basis: FA',
          width: '150px',
          className: 'is-rowhead',
          render: function (row) {
            return el('span', {
              className: 'tree-cell' + (row.level ? ' tree-cell--indent' : '')
            }, [
              row.expandable
                ? el('button', {
                    className: 'tree-cell__toggle',
                    attrs: { type: 'button', 'aria-label': 'Expand ' + withCustomer(row.label) }
                  }, [DA.icons.chevronDown(14)])
                : null,
              el('span', { className: 'tree-cell__label', text: withCustomer(row.label) })
            ]);
          }
        },
        numeric('adv', 'ADV', { width: '110px' }),
        numeric('baseFrt', 'Base Frt', { width: '105px' }),
        numeric('totalDisc', 'Total Disc', { width: '110px' }),
        numeric('rpp', 'RPP', { width: '110px' }),
        numeric('annRev', 'Ann Rev', { width: '140px' })
      ];
    }

    function summaryView() {
      var trees = DA.data.packetSummaryTrees;

      return el('div', { className: 'comparison-grid' },
        scenarios.map(function (scenario) {
          var rows = trees[scenario.name] || trees.Current;
          return C.Accordion({
            title: scenario.name,
            expanded: true,
            className: 'accordion--filled',
            content: [
              C.DataTable({
                caption: scenario.name + ' summary',
                embedded: true,
                headerTone: 'warm',
                columns: summaryColumns(),
                rows: rows
              })
            ]
          });
        })
      );
    }

    /* ---- Shipping Profiles tab -------------------------------------------- */

    function profileFilters() {
      return el('div', { className: 'card' }, [
        el('div', { className: 'view-filters' }, [
          el('div', { className: 'view-filters__field' }, [
            C.SelectField({
              label: 'Choose Scenario',
              value: scenarios[0] && scenarios[0].name,
              options: scenarios.map(function (scenario) {
                return { value: scenario.name, label: scenario.name };
              })
            })
          ]),
          el('span', { className: 'view-filters__divider' }),
          el('div', { className: 'view-filters__field' }, [
            C.SelectField({
              label: 'Account',
              hideLabel: true,
              value: customer + ' MAIN',
              options: [{ value: customer + ' MAIN', label: customer + ' MAIN' }]
            })
          ]),
          C.Button({ label: 'Filters', variant: 'ghost', icon: DA.icons.filter(16) })
        ])
      ]);
    }

    function costView() {
      return el('div', {}, [
        profileFilters(),
        el('div', { className: 'card' }, [
          C.DataTable({
            caption: 'Shipping profile cost',
            embedded: true,
            headerTone: 'warm',
            tinted: true,
            columns: [
              { key: 'movement', label: 'Movement', width: '110px', className: 'is-rowhead' },
              { key: 'mode', label: 'Mode', width: '110px', className: 'is-rowhead' },
              {
                key: 'service',
                label: 'Core Service',
                width: '150px',
                className: 'is-rowhead',
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
              numeric('zone', 'Zone', { width: '85px' }),
              numeric('lane', 'Lane', { width: '85px' }),
              numeric('volume', 'Volume', { link: true, width: '110px' }),
              numeric('adv', 'ADV', { link: true, width: '100px' }),
              numeric('pps', 'PPS', { link: true, width: '80px' }),
              numeric('weightPiece', 'Weight/ Piece', { link: true, width: '120px' }),
              numeric('avgCube', 'Avg Cube', { link: true, width: '105px' }),
              numeric('avgCubeFactor', 'Avg Cube Factor', { link: true, width: '140px' })
            ],
            rows: DA.data.shippingProfileCost
          })
        ])
      ]);
    }

    function serviceView() {
      return el('div', {}, [
        profileFilters(),
        el('div', { className: 'card' }, [
          C.DataTable({
            caption: 'Shipping profile services',
            embedded: true,
            headerTone: 'warm',
            tinted: true,
            columns: [
              {
                key: 'service',
                label: 'Core Service',
                width: '240px',
                className: 'is-rowhead',
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

    function shippingProfilesView() {
      return el('div', { className: 'tabs--boxed' }, [
        C.Tabs({
          ariaLabel: 'Shipping profile views',
          value: 'cost',
          items: [
            { id: 'cost', label: 'Cost', render: costView },
            { id: 'zone', label: 'Zone', render: emptyView('Zone') },
            { id: 'weight', label: 'Weight', render: emptyView('Weight') },
            { id: 'account', label: 'Account', render: emptyView('Account') },
            { id: 'accessorial', label: 'Accessorial', render: emptyView('Accessorial') },
            { id: 'service', label: 'Service', render: serviceView }
          ]
        })
      ]);
    }

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
          text: customer
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
        el('div', { className: 'report-filters__field' }, [comparisonSelector]),
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
      C.FilterChips({ ariaLabel: 'Applied charge filters', values: DA.data.chargeFilters }),
      el('section', { className: 'panel panel--auto' }, [
        C.DataTable({
          caption: 'Scenario comparison',
          embedded: true,
          headerTone: 'plain',
          dividers: true,
          columns: [
            { key: 'scenario', label: 'Scenario', width: '150px' },
            numeric('adv', 'ADV'),
            numeric('baseFrtDisc', 'Base Frt Disc'),
            numeric('totalDisc', 'Total Disc'),
            numeric('rpp', 'RPP'),
            numeric('revenue', 'Revenue', { width: '150px' }),
            numeric('or', 'OR'),
            numeric('profit', 'Profit', { width: '130px' })
          ],
          rows: DA.data.packetSummary
        })
      ]),
      el('div', { className: 'tabs--page' }, [
        C.Tabs({
          ariaLabel: 'Report sections',
          value: 'summary',
          items: [
            { id: 'summary', label: 'Summary', render: function () {
              return el('section', { className: 'panel panel--auto' }, [summaryView()]);
            } },
            { id: 'rate-charts', label: 'Rate Charts', render: emptyView('Rate Chart') },
            { id: 'shipping-profiles', label: 'Shipping Profiles', render: function () {
              return el('section', { className: 'panel panel--auto' }, [
                el('div', { className: 'panel__content' }, [shippingProfilesView()])
              ]);
            } },
            { id: 'pricing-terms', label: 'Pricing terms', render: emptyView('Pricing Term') },
            { id: 'other-terms', label: 'Other terms', render: emptyView('Other Term') }
          ]
        })
      ])
    ]);

    return page;
  };
})(window.DA);
