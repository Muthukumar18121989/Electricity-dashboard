/**
 * Application entry point — mounts the app shell and routes between screens.
 *
 * Screens are swapped below the persistent header. When real routing arrives,
 * `navigate` is the single seam to replace.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  var viewport = el('div', { className: 'app-shell__view' });

  var views = {
    packets: function () {
      return DA.pages.AnalyzerPacketsPage({
        rows: DA.data.analyzerPackets,
        currentUser: DA.session.currentUser,
        onNewPacket: function () { navigate('customer-details'); }
      });
    },
    'customer-details': function () {
      return DA.pages.CustomerDetailsPage({
        onBack: function () { navigate('packets'); },
        onSourceData: function (input) {
          navigate('create-scenarios', {
            packet: DA.data.buildPacket(input, DA.session.currentUser),
            showSourcingDialog: true
          });
        }
      });
    },
    'create-scenarios': function (params) {
      return DA.pages.CreateScenariosPage({
        packet: params.packet,
        showSourcingDialog: params.showSourcingDialog,
        onBack: function () { navigate('customer-details'); }
      });
    }
  };

  function navigate(name, params) {
    var view = views[name] || views.packets;
    DA.dom.clear(viewport).appendChild(view(params || {}));
    viewport.scrollTop = 0;
    var heading = viewport.querySelector('h1, h2');
    if (heading) heading.setAttribute('tabindex', '-1');
  }

  function mount() {
    var root = document.getElementById('app');
    if (!root) return;

    var shell = el('div', { className: 'app-shell' }, [
      DA.components.AppHeader({
        productName: 'Digital Analyzer',
        user: DA.session.currentUser
      }),
      viewport
    ]);

    DA.dom.clear(root).appendChild(shell);
    navigate('packets');
  }

  DA.app = { navigate: navigate };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})(window.DA);
