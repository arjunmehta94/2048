var assert = require('chai').assert;

var source = [
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0]
];

var rotations = {
  0: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
  ],
  1: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  2: [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0]
  ],
  3: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0]
  ]
};

rotations[4] = rotations[0];
rotations[-1] = rotations[3];
rotations[-2] = rotations[2];
rotations[-3] = rotations[1];
rotations[-4] = rotations[0];

var rotate = require('../lib/utils').rotate;

describe('rotating boards', function () {
  Object.keys(rotations).forEach(function (times) {
    it(times + ' rotations: ' + JSON.stringify(rotations[times]), function () {
      assert.deepEqual(rotations[times], rotate(source, times));
    });
  });
});
