/**
 * Analyzer packet report data — demo figures transcribed from the reference
 * screen. Replace with the analyzer endpoints later.
 */
(function (DA) {
  'use strict';

  DA.data = DA.data || {};

  /** The scenario comparison band above the report tabs. */
  DA.data.packetSummary = [
    {
      scenario: 'Current',
      adv: '5.6',
      baseDisc: '3.8%',
      totalDisc: '10.1%',
      rpp: '$86.49',
      annualRevenue: '$58,470',
      or: '0.35',
      annualProfit: '$37,766'
    },
    { scenario: '-' },
    { scenario: 'Difference' }
  ];

  /** Rows behind Analyzer > Services. */
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

  DA.data.packetViews = {
    revenueBasis: ['All'],
    costBasis: ['Fully Allocated Cost'],
    comparison: ['Comparison View']
  };
})(window.DA);
