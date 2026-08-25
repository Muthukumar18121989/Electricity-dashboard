/**
 * Create Scenarios and Analyzer Packet — step two of the workflow.
 *
 * Reached from "Source Data" on the Customer Details form, which arrives with
 * the sourcing-in-progress dialog open. Shows the packet that was created, its
 * scenarios, and the route onward to the analyzer packet.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  var C = DA.components;

  DA.pages = DA.pages || {};

  DA.pages.CreateScenariosPage = function CreateScenariosPage(options) {
    options = options || {};
    var packet = options.packet || {};
    var scenarios = packet.scenarios || [];
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

    /* ---- Scenarios -------------------------------------------------------- */

    var scenarioList = el('div', { className: 'scenario-list' });

    function renderScenarios() {
      DA.dom.clear(scenarioList);
      scenarios.forEach(function (scenario) {
        scenarioList.appendChild(C.ScenarioBlock(scenario, {
          packet: packet,
          onOpenAccounts: options.onOpenAccounts
        }));
      });
    }

    /** Drawer: copy an existing scenario into a new one. */
    function openCreateScenario(trigger) {
      var nextIndex = scenarios.length;

      var copyFrom = C.SelectField({
        label: 'Choose Scenario to Copy',
        value: scenarios[0].title,
        options: scenarios.map(function (scenario) {
          return { value: scenario.title, label: scenario.title };
        })
      });

      var nameField = C.Field({
        label: 'Scenario Name',
        value: 'Scenario ' + nextIndex
      });

      var descriptionField = C.Field({
        label: 'Scenario Description',
        multiline: true,
        hideLabel: true
      });

      var drawer = C.Modal({
        variant: 'drawer',
        title: 'Create New Scenario',
        returnFocusTo: trigger,
        body: el('div', { className: 'drawer-form' }, [
          C.Alert({
            plain: true,
            message: 'Choose an existing Scenario to copy to create a new scenario.'
          }),
          copyFrom,
          nameField,
          descriptionField,
          el('div', { className: 'drawer-form__actions' }, [
            C.Button({
              label: 'Save',
              variant: 'primary',
              shape: 'pill',
              onClick: function () {
                var source = scenarios.filter(function (scenario) {
                  return scenario.title === copyFrom.select.value;
                })[0] || scenarios[0];

                // The new scenario opens; the others fold away behind it.
                scenarios.forEach(function (scenario) { scenario.expanded = false; });
                scenarios.push(DA.data.copyScenario(
                  source,
                  nextIndex,
                  nameField.input.value || 'Scenario ' + nextIndex,
                  descriptionField.input.value
                ));

                drawer.close();
                renderScenarios();
              }
            })
          ])
        ])
      });

      drawer.open();
    }

    var createScenarioButton = C.Button({
      label: 'Create New Scenario',
      variant: 'outline',
      shape: 'pill',
      icon: DA.icons.chevronRight(14, ''),
      iconPosition: 'end',
      onClick: function () { openCreateScenario(createScenarioButton); }
    });

    renderScenarios();

    /* ---- Composition ------------------------------------------------------ */

    var panel = el('section', { className: 'panel panel--auto' }, [
      el('div', { className: 'panel__content' }, [
        summary,
        C.Alert({ message: 'Active Bids sourced for existing customers' }),
        scenarioList,
        el('div', {}, [createScenarioButton])
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
        onClick: function () { if (options.onProceed) options.onProceed(); }
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
          accent: true,
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
