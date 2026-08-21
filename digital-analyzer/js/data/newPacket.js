/**
 * Builds the packet record the Create Scenarios screen displays from what the
 * Customer Details form captured.
 *
 * Demo stand-in for the create-packet endpoint: the ID continues the existing
 * list, timestamps are taken from the clock, and any field left blank falls
 * back to the reference customer so the walkthrough still reads correctly.
 */
(function (DA) {
  'use strict';

  var FALLBACK = {
    customerName: 'APPLEGATE FARMS',
    referenceNumber: '0000067577'
  };

  function nextPacketId(rows) {
    var highest = (rows || []).reduce(function (max, row) {
      return Math.max(max, Number(row.packetId) || 0);
    }, 0);
    return String(highest + 1);
  }

  DA.data = DA.data || {};

  DA.data.buildPacket = function buildPacket(input, currentUser) {
    var format = DA.format;
    var now = new Date();
    var timestamp = format.formatTimestamp(now);
    var owner = (currentUser.id ? currentUser.id + ' - ' : '') + currentUser.name;
    var customerName = input.customerName || FALLBACK.customerName;
    var weeks = format.weeksBetween(input.from, input.to);

    return {
      packetId: nextPacketId(DA.data.analyzerPackets),
      customerName: customerName,
      referenceNumber: input.referenceNumber || FALLBACK.referenceNumber,
      description: input.description ||
        customerName + ' Analyzer - ' + format.formatDate(now).replace(/-/g, '/'),
      hierarchy: input.hierarchy,
      industry: '',
      pqr: input.pqr,
      opps: (input.opps || []).join(', '),
      owner: owner,
      lastModifiedBy: owner,
      createdAt: timestamp,
      lastModifiedAt: timestamp,
      from: format.toDashDate(input.from),
      to: format.toDashDate(input.to),
      scenario: {
        title: 'Scenario 0',
        name: (weeks == null ? '' : weeks + ' WEEKS ') + 'UPS SHIPPING PROFILE',
        createdDate: format.formatDate(now),
        lastModified: format.formatDate(now)
      }
    };
  };
})(window.DA);
