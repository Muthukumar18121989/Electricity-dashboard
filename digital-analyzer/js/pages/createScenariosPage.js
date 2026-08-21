/**
 * Create Scenarios and Analyzer Packet — step two of the workflow.
 *
 * Reached from "Source Data" on the Customer Details form, which arrives with
 * the sourcing-in-progress dialog open. Shows the packet that was created, the
 * scenarios on it, and the route onward to the analyzer packet.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  var C = DA.components;

  DA.pages = DA.pages || {};

  DA.pages.CreateScenariosPage = function CreateScenariosPage(options) {
    options = options || {};
    var packet = options.packet || {};
    var owner = packet.owner || '';

    /* ---- Packet summary -------------------------------------------------- */

    var summary = C.SummaryPanel({
      ariaLabel: 'Analyzer packet summary',
      headline: [
        { label: 'Analyzer Packet ID', value: packet.packetId },
        { label: 'Customer Name', value: packet.customerName },
        { label: 'Reference Number', value: packet.referenceNumber }
      ],
      columns: [
        [
          { label: 'Analyzer Packet Description', value: packet.description },
          { label: 'Shipping Profile From', value: packet.from },
          { label: 'Shipping Profile To', value: packet.to }
        ],
        [
          { label: 'Customer Hierarchy', value: packet.hierarchy },
          { label: 'Industry', value: packet.industry },
          { label: 'PQR', value: packet.pqr },
          { label: 'OPPs', value: packet.opps }
        ],
        [
          { label: 'Owner', value: owner },
          { label: 'Created Date', value: packet.createdAt },
          { label: 'Last Modified By', value: packet.lastModifiedBy || owner },
          { label: 'Last Modified Date', value: packet.lastModifiedAt }
        ]
      ]
    });

    /* ---- Scenario -------------------------------------------------------- */

    var scenario = packet.scenario || {};

    var expanded = false;
    var scenarioCard = el('div', { className: 'scenario__card' });
    var bidPanelId = 'scenario-bids';

    var toggle = el('button', {
      className: 'scenario__toggle',
      attrs: {
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': bidPanelId,
        'aria-label': 'Expand to find bid details'
      },
      on: {
        click: function () {
          expanded = !expanded;
          renderScenarioCard();
          toggle.focus();
        }
      }
    });

    /** Bid rows, with a header checkbox that selects every selectable bid. */
    function bidTable() {
      var bids = scenario.bids || [];
      var table;

      function selectAll(checked) {
        bids.forEach(function (bid) {
          if (bid.selectable) bid.selected = checked;
        });
        DA.dom.clear(table.parentNode).appendChild(build());
      }

      function build() {
        var allSelected = bids.every(function (bid) {
          return !bid.selectable || bid.selected;
        });

        table = C.DataTable({
          caption: 'Bids sourced for ' + scenario.title,
          embedded: true,
          headerTone: 'warm',
          columns: [
            {
              key: 'select',
              label: 'Select',
              width: '48px',
              className: 'is-select',
              headerClassName: 'is-select',
              renderHeader: function () {
                return C.Checkbox({
                  checked: allSelected,
                  ariaLabel: 'Select all bids',
                  onChange: selectAll
                });
              },
              render: function (bid) {
                if (!bid.selectable) return el('span');
                return C.Checkbox({
                  checked: bid.selected,
                  ariaLabel: 'Include bid ' + bid.bidNumber,
                  onChange: function (checked) { bid.selected = checked; }
                });
              }
            },
            { key: 'bidNumber', label: 'Bid Number', width: '125px' },
            // Bid Name is left unsized so it absorbs the remaining width.
            { key: 'bidName', label: 'Bid Name' },
            {
              key: 'shippingProfile',
              label: 'Shipping Profile',
              width: '190px',
              className: 'is-muted'
            },
            { key: 'construct', label: 'Construct', width: '130px' }
          ],
          rows: bids
        });
        return table;
      }

      return el('div', { className: 'scenario__panel', attrs: { id: bidPanelId } }, [build()]);
    }

    function renderScenarioCard() {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.setAttribute('aria-label', expanded ? 'Collapse bid details' : 'Expand to find bid details');
      DA.dom.clear(toggle).appendChild(
        expanded ? DA.icons.chevronUp(16) : DA.icons.chevronDown(16)
      );

      var cells = [
        el('div', { className: 'scenario__cell' }, [
          el('span', { className: 'scenario__cell-label', text: 'Current' })
        ]),
        el('div', { className: 'scenario__cell scenario__cell--name' }, [
          el('span', {
            className: 'scenario__cell-label',
            text: scenario.name,
            attrs: { title: scenario.name }
          })
        ]),
        el('div', { className: 'scenario__cell' }, [
          el('span', { className: 'scenario__cell-label', text: 'Created Date' }),
          el('span', { className: 'scenario__cell-value', text: scenario.createdDate })
        ]),
        el('div', { className: 'scenario__cell scenario__cell--last' }, [
          el('span', { className: 'scenario__cell-label', text: 'Last Modified' }),
          el('span', { className: 'scenario__cell-value', text: scenario.lastModified })
        ]),
        el('div', { className: 'scenario__status' }, [
          el('span', { className: 'badge badge--neutral badge--pill', text: 'Current' })
        ])
      ];

      // The chevron rides the summary row when open and the hint line when
      // closed, matching both reference states.
      var row = el(
        'div',
        { className: 'scenario__row' + (expanded ? '' : ' scenario__row--indented') },
        (expanded ? [toggle] : []).concat(cells).concat(
          expanded
            ? [el('div', { className: 'scenario__update' }, [
                C.Button({
                  label: 'Update Description',
                  variant: 'link',
                  icon: DA.icons.chevronRight(14, ''),
                  iconPosition: 'end'
                })
              ])]
            : []
        )
      );

      DA.dom.clear(scenarioCard);
      scenarioCard.appendChild(row);
      scenarioCard.appendChild(
        expanded
          ? bidTable()
          : el('div', { className: 'scenario__hint-row' }, [
              toggle,
              el('span', {
                className: 'scenario__hint',
                text: 'Expand To Find Bid Details',
                on: { click: function () { toggle.click(); } }
              })
            ])
      );
    }

    renderScenarioCard();

    var scenarioBlock = el('section', { className: 'scenario', attrs: { 'aria-label': 'Scenarios' } }, [
      el('div', { className: 'scenario__header' }, [
        C.Checkbox({ checked: true, ariaLabel: 'Include ' + (scenario.title || 'scenario') }),
        el('h3', { className: 'scenario__name', text: scenario.title }),
        el('div', { className: 'scenario__header-actions' }, [
          C.Button({
            label: 'Download Scenario Summary',
            variant: 'quiet-link',
            icon: DA.icons.download(18)
          }),
          C.HelpButton('Downloads a summary of every scenario on this packet.')
        ])
      ]),
      scenarioCard,
      el('div', {}, [
        C.Button({
          label: 'Create New Scenario',
          variant: 'outline',
          shape: 'pill',
          icon: DA.icons.chevronRight(14, ''),
          iconPosition: 'end'
        })
      ])
    ]);

    /* ---- Composition ----------------------------------------------------- */

    var panel = el('section', { className: 'panel panel--auto' }, [
      el('div', { className: 'panel__content' }, [
        summary,
        C.Alert({ message: 'Active Bids sourced for existing customers' }),
        scenarioBlock
      ])
    ]);

    var actions = el('div', { className: 'page-actions page-actions--wide' }, [
      C.Button({
        label: 'Back',
        variant: 'link',
        icon: DA.icons.chevronLeft(14),
        onClick: function () { if (options.onBack) options.onBack(); }
      }),
      C.Button({
        label: 'Proceed to Analyzer Packet',
        variant: 'primary',
        shape: 'pill',
        icon: DA.icons.chevronRight(14, ''),
        iconPosition: 'end',
        disabled: true
      })
    ]);

    var page = el('main', { className: 'page', attrs: { id: 'main-content' } }, [
      el('h2', { className: 'page-title', text: 'Create Scenarios and Analyzer Packet' }),
      panel,
      actions
    ]);

    if (options.showSourcingDialog) {
      window.setTimeout(function () {
        C.Modal({
          title: 'Sourcing Data is in progress',
          body:
            'Sourcing Data is in progress. The links will be enabled after the ' +
            'process is complete. Thank you for your patience.'
        }).open();
      }, 0);
    }

    return page;
  };
})(window.DA);
