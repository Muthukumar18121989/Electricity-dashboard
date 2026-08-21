/**
 * Signed-in user for the demo shell.
 * The header avatar shows these initials; "My Analyzers" scopes the list to
 * packets this person owns. Replace with the real session payload later.
 */
(function (DA) {
  'use strict';

  DA.session = {
    currentUser: {
      name: 'Aarav Anand',
      initials: 'AA'
    }
  };
})(window.DA);
