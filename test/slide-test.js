var assert = require('chai').assert;

var source = [
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1]
];

var slides = {
  left: [
    [2, 2, 0, 0],
    [2, 2, 0, 0],
    [2, 2, 0, 0],
    [2, 2, 0, 0]
  ],
  down: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [2, 2, 2, 2]
  ],
  right: [
    [0, 0, 2, 2],
    [0, 0, 2, 2],
    [0, 0, 2, 2],
    [0, 0, 2, 2]
  ],
  up: [
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
};

var slide = require('../lib/utils').slide;

describe('sliding boards', function () {
  Object.keys(slides).forEach(function (direction) {
    var result = slides[direction];

    it ('slides ' + direction + ': ' + JSON.stringify(result), function () {
      assert.deepEqual(result, slide(source, direction));
    });
  });
});
