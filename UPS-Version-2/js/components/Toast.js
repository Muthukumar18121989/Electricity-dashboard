/**
 * Toast — transient system feedback ("Saved", "Scenario created") that
 * floats over the page rather than displacing layout.
 *
 * Usage: DA.toast.show('Changes saved.', { tone: 'success' })
 * tone: 'success' (default) | 'info' | 'error'
 *
 * A single host is created lazily on first use and lives outside the app
 * shell, so a toast survives the screen that triggered it being torn down
 * by navigation. Toasts announce once via a shared aria-live region rather
 * than each toast owning its own, so screen readers hear one clean
 * announcement instead of a flood when several fire in quick succession.
 */
(function (DA) {
  'use strict';

  var el = DA.dom.el;
  var ICONS = { success: 'checkCircle', info: 'info', error: 'closeCircle' };
  var DISMISS_AFTER = 4000;

  var host = null;
  var liveRegion = null;

  function ensureHost() {
    if (host) return host;
    liveRegion = el('div', {
      className: 'u-visually-hidden',
      attrs: { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' }
    });
    host = el('div', { className: 'toast-host', attrs: { 'aria-hidden': 'false' } });
    document.body.appendChild(liveRegion);
    document.body.appendChild(host);
    return host;
  }

  function show(message, options) {
    options = options || {};
    var tone = options.tone || 'success';
    ensureHost();
    liveRegion.textContent = message;

    var timer;
    var toast = el('div', {
      className: 'toast toast--' + tone,
      attrs: { role: 'presentation' }
    }, [
      el('span', { className: 'toast__icon' }, [DA.icons[ICONS[tone]](18)]),
      el('span', { className: 'toast__message', text: message }),
      el('button', {
        className: 'toast__close',
        attrs: { type: 'button', 'aria-label': 'Dismiss notification' },
        on: { click: function () { dismiss(); } }
      }, [DA.icons.close(13)])
    ]);

    function dismiss() {
      window.clearTimeout(timer);
      if (!toast.parentNode) return;
      toast.classList.add('toast--leaving');
      window.setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 160);
    }

    toast.addEventListener('mouseenter', function () { window.clearTimeout(timer); });
    toast.addEventListener('mouseleave', function () { timer = window.setTimeout(dismiss, DISMISS_AFTER); });

    host.appendChild(toast);
    // Next frame, so the enter transition actually runs.
    window.requestAnimationFrame(function () { toast.classList.add('toast--visible'); });
    timer = window.setTimeout(dismiss, options.duration || DISMISS_AFTER);

    return { dismiss: dismiss };
  }

  DA.toast = { show: show };
})(window.DA);
