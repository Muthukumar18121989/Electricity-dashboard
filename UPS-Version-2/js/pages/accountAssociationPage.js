/**
 * Account Association — the accounts attached to one bid in a scenario.
 *
 * Reached from the Accounts link in an editable scenario's bid table. The
 * counts above the tree are derived from the accounts in it.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  var C = DA.components;

  DA.pages = DA.pages || {};

  DA.pages.AccountAssociationPage = function AccountAssociationPage(options) {
    options = options || {};
    var bid = options.bid || {};
    var scenario = options.scenario || {};
    var tree = DA.data.accountTree;
    var accounts = DA.data.accountsIn(tree);

    function countWhere(predicate) {
      return accounts.filter(predicate).length;
    }

    /* ---- Counts ----------------------------------------------------------- */

    var stats = C.StatRow({
      ariaLabel: 'Account counts',
      items: [
        {
          icon: DA.icons.box(26),
          value: accounts.length,
          label: 'Total Accounts',
          help: 'Every account under this bid.'
        },
        {
          icon: DA.icons.box(26),
          value: countWhere(function (a) { return a.type === 'ups'; }),
          label: 'UPS Accounts',
          help: 'Accounts held in the UPS account system.'
        },
        {
          icon: DA.icons.box(26),
          value: countWhere(function (a) { return a.type === 'temporary'; }),
          label: 'Temporary Accounts',
          help: 'Accounts created for this analysis only.'
        },
        {
          icon: DA.icons.boxOff(26),
          value: countWhere(function (a) { return !a.associated; }),
          label: 'Unassociated Accounts',
          help: 'Accounts not yet attached to a bid.'
        }
      ]
    });

    /* ---- Account tree ------------------------------------------------------ */

    var ACCOUNT_COLUMNS = [
      {
        key: 'select',
        label: 'Select',
        width: '48px',
        className: 'is-select',
        headerClassName: 'is-select',
        renderHeader: function () { return el('span'); },
        render: function (account) {
          return C.Checkbox({
            checked: Boolean(account.selected),
            ariaLabel: 'Select ' + account.account,
            onChange: function (checked) { account.selected = checked; updateBulkBar(); }
          });
        }
      },
      {
        key: 'account',
        label: 'Account',
        render: function (account) {
          return el('a', { text: account.account, attrs: { href: '#account' } });
        }
      },
      {
        key: 'adv',
        label: 'ADV',
        width: '16%',
        render: function (account) { return account.adv || '-'; }
      },
      { key: 'commodityTier', label: 'Commodity Tier', width: '20%' },
      {
        key: 'associatedBids',
        label: '# of Associated Bids',
        width: '22%',
        render: function (account) {
          return el('a', {
            text: String(account.associatedBids),
            attrs: {
              href: '#bids',
              'aria-label': account.associatedBids + ' bids associated with ' + account.account
            }
          });
        }
      }
    ];

    /** One collapsible level of the tree, with its own select-all checkbox. */
    function treeNode(config) {
      var open = true;
      var body = el('div', { className: 'tree__body' }, config.children);
      var toggle = el('button', {
        className: 'tree__toggle u-tap-target',
        attrs: { type: 'button', 'aria-expanded': 'true', 'aria-label': 'Collapse ' + config.label },
        on: {
          click: function () {
            open = !open;
            body.hidden = !open;
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', (open ? 'Collapse ' : 'Expand ') + config.label);
            DA.dom.clear(toggle).appendChild(
              open ? DA.icons.chevronUp(16) : DA.icons.chevronDown(16)
            );
          }
        }
      }, [DA.icons.chevronUp(16)]);

      return el('div', { className: 'tree__node' + (config.nested ? ' tree__node--nested' : '') }, [
        el('div', { className: 'tree__row' }, [
          toggle,
          C.Checkbox({
            ariaLabel: 'Select all accounts under ' + config.label,
            onChange: function (checked) {
              config.accounts.forEach(function (account) { account.selected = checked; });
              render();
              updateBulkBar();
            }
          }),
          el('span', { className: 'tree__label tree__label--' + config.level, text: config.label })
        ]),
        body
      ]);
    }

    var treeRoot = el('div', { className: 'tree' });
    var state = { query: '' };

    function matchesQuery(account) {
      if (!state.query) return true;
      return account.account.toLowerCase().indexOf(state.query) !== -1;
    }

    function render() {
      DA.dom.clear(treeRoot);
      var matched = 0;

      tree.forEach(function (parent) {
        var groups = (parent.groups || [])
          .map(function (group) {
            var accounts = group.accounts.filter(matchesQuery);
            matched += accounts.length;
            return { group: group, accounts: accounts };
          })
          .filter(function (entry) { return entry.accounts.length > 0; });

        if (state.query && groups.length === 0) return;

        var parentAccounts = DA.data.accountsIn([parent]).filter(matchesQuery);

        treeRoot.appendChild(treeNode({
          label: parent.label,
          level: 'parent',
          accounts: parentAccounts,
          children: groups.map(function (entry) {
            return treeNode({
              label: entry.group.label,
              level: 'group',
              nested: true,
              accounts: entry.accounts,
              children: [
                el('div', { className: 'tree__table' }, [
                  C.DataTable({
                    caption: 'Accounts under ' + entry.group.label,
                    embedded: true,
                    headerTone: 'warm',
                    columns: ACCOUNT_COLUMNS,
                    rows: entry.accounts
                  })
                ])
              ]
            });
          })
        }));
      });

      if (state.query && matched === 0) {
        treeRoot.appendChild(C.EmptyState({
          title: 'No accounts match your search',
          description: 'No account name or number matches "' + state.query + '". Check the spelling or clear the search to see every account.'
        }));
      }
    }

    render();

    /* ---- Bulk selection ----------------------------------------------------- */

    var reviewButton = C.Button({
      label: 'Review Changes',
      variant: 'primary',
      shape: 'pill',
      icon: DA.icons.chevronRight(14, ''),
      iconPosition: 'end',
      onClick: function () {
        var count = accounts.filter(function (a) { return a.selected; }).length;
        accounts.forEach(function (a) { a.selected = false; });
        render();
        updateBulkBar();
        DA.toast.show(
          count === 1 ? '1 account association saved.' : count + ' account associations saved.',
          { tone: 'success' }
        );
      }
    });

    var bulkCount = el('span', { className: 'bulk-bar__count' });
    var bulkBar = el('div', { className: 'bulk-bar', attrs: { role: 'status', hidden: true } }, [
      bulkCount,
      el('div', { className: 'bulk-bar__actions' }, [
        C.Button({
          label: 'Clear selection',
          variant: 'ghost',
          className: 'button--on-dark',
          onClick: function () {
            accounts.forEach(function (a) { a.selected = false; });
            render();
            updateBulkBar();
          }
        }),
        reviewButton
      ])
    ]);

    function updateBulkBar() {
      var count = accounts.filter(function (a) { return a.selected; }).length;
      bulkCount.textContent = count === 1 ? '1 account selected' : count + ' accounts selected';

      if (count > 0) {
        bulkBar.hidden = false;
        window.requestAnimationFrame(function () { bulkBar.classList.add('bulk-bar--visible'); });
      } else {
        bulkBar.classList.remove('bulk-bar--visible');
        bulkBar.hidden = true;
      }
    }

    updateBulkBar();

    /* ---- Composition ------------------------------------------------------- */

    var search = C.SearchField({
      id: 'account-search',
      label: 'Search accounts',
      placeholder: 'Search Accounts',
      clearable: true,
      onSearch: function (value) {
        state.query = value.trim().toLowerCase();
        render();
      }
    });

    var page = el('main', { className: 'page', attrs: { id: 'main-content' } }, [
      el('div', { className: 'page-back' }, [
        C.Button({
          label: 'Back',
          variant: 'link',
          icon: DA.icons.chevronLeft(14),
          onClick: function () { if (options.onBack) options.onBack(); }
        })
      ]),
      C.Breadcrumb({
        items: [
          { label: scenario.title, onClick: options.onBack },
          { label: bid.bidName, onClick: options.onBack },
          { label: 'Account' }
        ]
      }),
      el('div', { className: 'page-heading' }, [
        el('h2', {
          className: 'page-heading__title title-rule title-rule--center',
          text: 'Account Association'
        }),
        el('p', {
          className: 'page-heading__subtitle',
          text: 'Manage accounts associated with each bid'
        }),
        el('p', {}, [el('span', { className: 'page-heading__chip', text: scenario.title })])
      ]),
      stats,
      el('h3', {
        className: 'section-title',
        text: bid.bidNumber + ' - ' + bid.bidName + ' - Account Association'
      }),
      el('div', { className: 'search-bar' }, [
        search,
        C.Button({
          label: 'Search',
          variant: 'primary',
          icon: DA.icons.chevronRight(14, ''),
          iconPosition: 'end',
          onClick: function () {
            var input = search.querySelector('.search-field__input');
            state.query = (input ? input.value : '').trim().toLowerCase();
            render();
          }
        }),
        el('div', { className: 'search-bar__actions' }, [
          el('a', {
            className: 'link-with-icon',
            attrs: { href: '#attach-account' }
          }, [DA.icons.plusCircle(18), el('span', { text: 'Attach Account' })])
        ])
      ]),
      treeRoot,
      bulkBar
    ]);

    return page;
  };
})(window.DA);
