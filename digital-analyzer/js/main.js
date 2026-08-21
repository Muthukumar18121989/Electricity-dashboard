/**
 * Application entry point — mounts the app shell and the landing screen.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;

  function mount() {
    var root = document.getElementById('app');
    if (!root) return;

    var shell = el('div', { className: 'app-shell' }, [
      DA.components.AppHeader({
        productName: 'Digital Analyzer',
        user: DA.session.currentUser
      }),
      DA.pages.AnalyzerPacketsPage({
        rows: DA.data.analyzerPackets,
        currentUser: DA.session.currentUser
      })
    ]);

    DA.dom.clear(root).appendChild(shell);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})(window.DA);
