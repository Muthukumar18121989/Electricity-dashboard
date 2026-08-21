/**
 * Customer Details — step one of the New Analyzer Packet workflow.
 *
 * Reached from "New Analyzer Packet" on the packet list. Captures the customer
 * the packet is built for, the shipping profile window, and an optional
 * customer PLD file.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  var C = DA.components;

  var HIERARCHY_OPTIONS = [
    { value: 'Parent', label: 'Parent' },
    { value: 'Child', label: 'Child' }
  ];

  /** MM/DD/YYYY -> Date, or null when the text is not a complete date. */
  function parseDate(text) {
    var match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(text).trim());
    if (!match) return null;
    var date = new Date(Number(match[3]), Number(match[1]) - 1, Number(match[2]));
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Whole weeks covered by the profile window, counting both end dates.
   * Matches the reference: 05/23/2026-08/15/2026 is 13 weeks, and
   * 05/17/2025-04/04/2026 is 47 weeks.
   */
  function weeksBetween(from, to) {
    var start = parseDate(from);
    var end = parseDate(to);
    if (!start || !end || end < start) return null;
    var days = Math.round((end - start) / 86400000) + 1;
    return Math.ceil(days / 7);
  }

  DA.pages = DA.pages || {};

  DA.pages.CustomerDetailsPage = function CustomerDetailsPage(options) {
    options = options || {};

    var state = {
      hierarchy: 'Parent',
      from: '05/23/2026',
      to: '08/15/2026',
      pldFile: null
    };

    /* ---- Customer ------------------------------------------------------- */

    var hierarchyField = C.SelectField({
      label: 'Customer Hierarchy*',
      value: state.hierarchy,
      options: HIERARCHY_OPTIONS,
      onChange: function (event) {
        state.hierarchy = event.target.value;
        renderCustomerLookup();
      }
    });

    var customerLookupSlot = el('div', { className: 'form-field' });

    function renderCustomerLookup() {
      DA.dom.clear(customerLookupSlot).appendChild(
        C.ChipInput({
          label: 'Enter ' + state.hierarchy + '*',
          multiple: false
        })
      );
    }

    /* ---- Shipping profile ----------------------------------------------- */

    var duration = el('p', { className: 'field__hint' });

    function renderDuration() {
      var weeks = weeksBetween(state.from, state.to);
      duration.textContent = weeks == null
        ? 'Duration : —'
        : 'Duration : ' + weeks + ' Week' + (weeks === 1 ? '' : 's');
    }

    var fromField = C.Field({
      label: 'Shipping Profile From*',
      value: state.from,
      onInput: function (event) { state.from = event.target.value; renderDuration(); }
    });

    var toField = C.Field({
      label: 'Shipping Profile To*',
      value: state.to,
      onInput: function (event) { state.to = event.target.value; renderDuration(); }
    });

    renderDuration();

    /* ---- Optional customer PLD ------------------------------------------ */

    var attachmentSlot = el('div');

    function renderAttachment() {
      DA.dom.clear(attachmentSlot);
      if (!state.pldFile) return;

      attachmentSlot.appendChild(
        el('div', { className: 'attachment' }, [
          el('p', { className: 'attachment__title', text: 'Attached File' }),
          C.FileItem({
            name: state.pldFile,
            onRemove: function () { state.pldFile = null; renderAttachment(); }
          }),
          C.Field({ label: 'Add Duration* (In Weeks)', value: '13', type: 'text' }),
          C.Toggle({ label: 'Annualize :', valueLabel: 'Yes', checked: true })
        ])
      );
    }

    var pldSection = C.Accordion({
      title: 'Upload Optional Customer PLD',
      content: [
        C.FileDropzone({
          accept: '.csv,text/csv',
          fileType: 'CSV',
          onFile: function (selected) {
            state.pldFile = selected.name;
            renderAttachment();
          }
        }),
        attachmentSlot
      ]
    });

    /* ---- Composition ----------------------------------------------------- */

    renderCustomerLookup();

    var card = el('section', { className: 'form-card', attrs: { 'aria-labelledby': 'customer-details-title' } }, [
      el('h2', {
        className: 'form-card__title',
        text: 'Customer Details',
        attrs: { id: 'customer-details-title' }
      }),
      el('div', { className: 'form-grid' }, [
        hierarchyField,
        customerLookupSlot,
        C.Field({
          label: 'Enter PQR to link to packet (optional)',
          help: 'A PQR links an existing pricing quote request to this packet.'
        }),
        C.ChipInput({
          label: 'Enter OPP(s) to link to packet (optional)',
          multiline: true,
          help: 'Link one or more opportunity records to this packet.',
          hint: 'Use space bar or enter key to save each entry. Otherwise, paste multiple.',
          hintAlign: 'end'
        }),
        el('div', { className: 'form-grid__full' }, [
          C.Field({ label: 'Customer Reference Number*' })
        ]),
        el('div', { className: 'form-grid__full' }, [
          C.Field({
            label: 'Customer Name*',
            help: 'The customer name is taken from the selected account.'
          })
        ]),
        el('div', { className: 'form-grid__full' }, [
          C.Field({ label: 'Analyzer Packet Description*' })
        ]),
        fromField,
        toField,
        el('div', { className: 'form-grid__full' }, [duration])
      ]),
      el('hr', { className: 'form-divider' }),
      C.Toggle({ label: 'Annualize :', valueLabel: 'Yes', checked: true }),
      el('div', { style: { 'margin-top': 'var(--space-5)' } }, [pldSection])
    ]);

    var actions = el('div', { className: 'page-actions' }, [
      C.Button({
        label: 'Back',
        variant: 'link',
        icon: DA.icons.chevronLeft(14),
        onClick: function () { if (options.onBack) options.onBack(); }
      }),
      C.Button({
        label: 'Source Data',
        variant: 'primary',
        shape: 'pill',
        icon: DA.icons.chevronRight(14, ''),
        iconPosition: 'end'
      })
    ]);

    return el('main', { className: 'page', attrs: { id: 'main-content' } }, [card, actions]);
  };
})(window.DA);
