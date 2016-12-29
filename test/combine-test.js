var assert = require('chai').assert;

var combinations = [{
  source: [0, 8, 4, 2],
  combined: [8, 4, 2, 0]
}, {
  source: [2, 2, 0, 0],
  combined: [4, 0, 0, 0]
}, {
  source: [0, 0, 2, 2],
  combined: [4, 0, 0, 0]
}, {
  source: [0, 2, 0, 2],
  combined: [4, 0, 0, 0]
}, {
  source: [2, 2, 2, 2],
  combined: [4, 4, 0, 0]
}, {
  source: [0, 0, 0, 0],
  combined: [0, 0, 0, 0]
}, {
  source: [1, 1, 2, 2],
  combined: [2, 4, 0, 0]
}, {
  source: [1, 1, 0, 2],
  combined: [2, 2, 0, 0]
}, {
  source: [1, 1, 1, 1],
  combined: [2, 2, 0, 0]
}];

var combine = require('../lib/utils').combine;

describe('combining rows', function () {
  combinations.forEach(function (combo) {
    it(JSON.stringify(combo.source) + ' => ' + JSON.stringify(combo.combined), function () {
      assert.deepEqual(combo.combined, combine(combo.source));
    });
  });
});
