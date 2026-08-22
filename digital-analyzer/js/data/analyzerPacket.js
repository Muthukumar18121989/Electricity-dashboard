/**
 * Analyzer packet report data — demo figures transcribed from the reference
 * screens. `{customer}` is replaced with the packet's customer at render, so
 * the report reads as one record end to end.
 */
(function (DA) {
  'use strict';

  DA.data = DA.data || {};

  /** The comparison band above the report tabs. */
  DA.data.packetSummary = [
    {
      scenario: 'Current',
      adv: '17313.0',
      baseFrtDisc: '51.3%',
      totalDisc: '55.9%',
      rpp: '$ 12.41',
      revenue: '$ 1,074,292',
      or: '0.98',
      profit: '$ 26,111'
    },
    { scenario: '-' },
    { scenario: '-' }
  ];

  /** Charge filters currently applied to the report. */
  DA.data.chargeFilters = [
    'Fuel Surcharge',
    'Transportation Charges',
    'Pickup And Delivery',
    'Returns',
    'Other Charges',
    'Custom Brokerage'
  ];

  /* ---- Summary tab -------------------------------------------------------- */

  var SERVICE_ROWS = [
    { label: '1DA', level: 1, adv: '130.4', baseFrt: '49.1%', totalDisc: '52.2%', rpp: '$ 99.76', annRev: '$ 65,024' },
    { label: '1DM', level: 1, adv: '3.0', baseFrt: '0.0%', totalDisc: '0.8%', rpp: '$ 326.80', annRev: '$ 4,902' },
    { label: '1DP', level: 1, adv: '13.6', baseFrt: '61.7%', totalDisc: '63.8%', rpp: '$ 72.58', annRev: '$ 4,933' },
    { label: '2DA', level: 1, adv: '43.6', baseFrt: '56.7%', totalDisc: '58.8%', rpp: '$ 28.21', annRev: '$ 6,148' },
    { label: '2DM', level: 1, adv: '1.8', baseFrt: '18.9%', totalDisc: '24.9%', rpp: '$ 68.63', annRev: '$ 617' },
    { label: '3DS', level: 1, adv: '71.4', baseFrt: '59.4%', totalDisc: '60.9%', rpp: '$ 31.36', annRev: '$ 11,193' },
    { label: 'GND', level: 1, adv: '4190.6', baseFrt: '58.0%', totalDisc: '61.9%', rpp: '$ 13.33', annRev: '$ 279,251' },
    { label: 'USG', level: 1, adv: '12559.2', baseFrt: '48.9%', totalDisc: '53.6%', rpp: '$ 10.92', annRev: '$ 685,610' },
    { label: 'USL', level: 1, adv: '299.4', baseFrt: '37.8%', totalDisc: '44.8%', rpp: '$ 11.06', annRev: '$ 16,614' }
  ];

  function accountBlock() {
    return [
      {
        label: '{customer} MAIN',
        level: 0,
        expandable: true,
        adv: '17313.0',
        baseFrt: '51.3%',
        totalDisc: '56.0%',
        rpp: '$ 12.41',
        annRev: '$ 1,074,292'
      },
      { label: 'Sub total', level: 1, adv: '-', baseFrt: '-', totalDisc: '-', rpp: '$ 12.41', annRev: '$ 1,074,292' }
    ].concat(SERVICE_ROWS);
  }

  DA.data.packetSummaryTrees = {
    Current: [
      { label: 'Total', level: 0, total: true, adv: '17313.0', baseFrt: '51.3%', totalDisc: '56.0%', rpp: '$ 12.41', annRev: '$ 1,074,292' }
    ].concat(accountBlock()),

    'Scenario 1': [
      { label: 'Total', level: 0, total: true, adv: '17340.2', baseFrt: '50.9%', totalDisc: '55.5%', rpp: '$ 12.57', annRev: '$ 1,094,443' },
      { label: 'Unincented PLD', level: 0, expandable: true, adv: '27.2', baseFrt: '0.0%', totalDisc: '0.0%', rpp: '$ 38.48', annRev: '$ 20,151' }
    ].concat(accountBlock())
  };

  /* ---- Shipping Profiles tab ---------------------------------------------- */

  DA.data.shippingProfileCost = [
    { movement: 'N', mode: 'AIR', service: '1DA', zone: '-', lane: '-', volume: '652.0', adv: '130.4', pps: '1.0', weightPiece: '11.91', avgCube: '1.24', avgCubeFactor: '1.08' },
    { movement: 'N', mode: 'AIR', service: '1DM', zone: '-', lane: '-', volume: '15.0', adv: '3.0', pps: '1.0', weightPiece: '14.87', avgCube: '1.51', avgCubeFactor: '1.07' },
    { movement: 'N', mode: 'AIR', service: '1DP', zone: '-', lane: '-', volume: '68.0', adv: '13.6', pps: '1.0', weightPiece: '11.09', avgCube: '1.17', avgCubeFactor: '0.97' },
    { movement: 'N', mode: 'AIR', service: '2DA', zone: '-', lane: '-', volume: '218.0', adv: '43.6', pps: '1.0', weightPiece: '5.45', avgCube: '0.55', avgCubeFactor: '1.02' },
    { movement: 'N', mode: 'AIR', service: '2DM', zone: '-', lane: '-', volume: '9.0', adv: '1.8', pps: '1.0', weightPiece: '13.89', avgCube: '0.99', avgCubeFactor: '0.91' },
    { movement: 'N', mode: 'AIR', service: '3DS', zone: '-', lane: '-', volume: '357.0', adv: '71.4', pps: '1.0', weightPiece: '12.38', avgCube: '1.15', avgCubeFactor: '1.05' },
    { movement: 'N', mode: 'GROUND', service: 'GND', zone: '-', lane: '-', volume: '20953.0', adv: '4190.6', pps: '1.0', weightPiece: '13.01', avgCube: '1.36', avgCubeFactor: '1.15' },
    { movement: 'N', mode: 'GROUND SAV', service: 'USG', zone: '-', lane: '-', volume: '62796.0', adv: '12559.2', pps: '1.0', weightPiece: '3.59', avgCube: '0.52', avgCubeFactor: '1.09' },
    { movement: 'N', mode: 'GROUND SAV', service: 'USL', zone: '-', lane: '-', volume: '1497.0', adv: '299.4', pps: '1.0', weightPiece: '12.12', avgCube: '0.29', avgCubeFactor: '1.11' }
  ];

  /** Rows behind Shipping Profiles > Service. */
  DA.data.packetServices = [
    { service: 'N-2nd Day Air', volume: '128', adv: '1.1', avgZone: '204.9', billableWt: '3.1', pps: '1.0', baseGrossRev: '$5,975', baseNetRev: '$5,975', disc: '0.0%', baseRpp: '$46.68', baseProfit: '$3,836', baseOr: '0.36' },
    { service: 'N-2nd Day Air A.M.', volume: '24', adv: '0.2', avgZone: '245.0', billableWt: '21.2', pps: '1.0', baseGrossRev: '$3,588', baseNetRev: '$3,588', disc: '0.0%', baseRpp: '$149.51', baseProfit: '$2,750', baseOr: '0.23' },
    { service: 'N-Ground', volume: '300', adv: '2.5', avgZone: '4.3', billableWt: '8.6', pps: '1.0', baseGrossRev: '$5,802', baseNetRev: '$4,678', disc: '19.4%', baseRpp: '$15.59', baseProfit: '$485', baseOr: '0.90' },
    { service: 'N-Next Day Air', volume: '168', adv: '1.4', avgZone: '105.2', billableWt: '11.2', pps: '1.0', baseGrossRev: '$26,597', baseNetRev: '$26,597', disc: '0.0%', baseRpp: '$158.31', baseProfit: '$19,592', baseOr: '0.26' },
    { service: 'N-Next Day Air Early', volume: '4', adv: '0.0', avgZone: '105.0', billableWt: '0.0', pps: '1.0', baseGrossRev: '$362', baseNetRev: '$362', disc: '0.0%', baseRpp: '$90.46', baseProfit: '$299', baseOr: '0.17' },
    { service: 'N-Next Day Air Saver', volume: '44', adv: '0.4', avgZone: '134.4', billableWt: '10.8', pps: '1.0', baseGrossRev: '$6,853', baseNetRev: '$6,853', disc: '0.0%', baseRpp: '$155.74', baseProfit: '$5,145', baseOr: '0.25' },
    { service: 'E-Worldwide Expedited', volume: '4', adv: '0.0', avgZone: '71.0', billableWt: '7.0', pps: '1.0', baseGrossRev: '$697', baseNetRev: '$334', disc: '52.1%', baseRpp: '$83.44', baseProfit: '$233', baseOr: '0.30' },
    { service: 'E-Worldwide Express Saver', volume: '4', adv: '0.0', avgZone: '481.0', billableWt: '10.0', pps: '1.0', baseGrossRev: '$787', baseNetRev: '$326', disc: '58.5%', baseRpp: '$81.61', baseProfit: '$213', baseOr: '0.35' }
  ];
})(window.DA);
