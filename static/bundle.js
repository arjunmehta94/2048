require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"2048":[function(require,module,exports){
/*
 * boards look like:
 * [
 *   [#, #, #, #],
 *   [#, #, #, #],
 *   [#, #, #, #],
 *   [#, #, #, #]
 * ]
 */

var ROTATIONS = {
  left: 0,
  down: 1,
  right: 2,
  up: 3
};

function rotate (board, times) {
  var step = [[], [], [], []],
      row, col;

  if (times === 0) {
    for (row = 0; row < 4; row++) {
      for (col = 0; col < 4; col++) {
        step[row][col] = board[row][col];
      }
    }

    return step;
  }

  // 0  => 0
  // -1 => 3
  // -2 => 2
  // -3 => 1
  // 4  => 0
  if (times < 0) {
    times = (times % 4) + 4;
  }

  for (row = 0; row < 4; row++) {
    for (col = 0; col < 4; col++) {
      // 0, 0 => 0, 3
      // 0, 1 => 1, 3
      // 0, 2 => 2, 3
      // 0, 3 => 3, 3
      // 1, 0 => 0, 2
      // 1, 1 => 1, 2
      // 1, 2 => 2, 2
      // 1, 3 => 3, 2
      // 2, 0 => 0, 1
      // ...
      step[col][3 - row] = board[row][col];
    }
  }

  return rotate(step, times - 1);
}

function combine (row) {
  var combined = [],
      di = 0,
      si = 0;

  while (di < 4 && si < 4) {
    var value = row[si];

    if (value === 0) {
      si++;
    } else {
      var ni = si + 1;

      while (ni < 3 && row[ni] === 0) {
        ni++;
      }

      if (row[ni] === value) {
        combined[di] = value * 2;
        di++;
        si = ni + 1;
      } else {
        combined[di] = value;
        di++;
        si = ni;
      }
    }
  }

  while (di < 4) {
    combined[di] = 0;
    di++;
  }

  return combined;
}

function slide (board, direction) {
  var rotations = ROTATIONS[direction],
      slider = rotate(board, rotations);

  // slide stuff...
  for (var row = 0; row < 4; row++) {
    slider[row] = combine(slider[row]);
  }

  return rotations === 0 ? slider : rotate(slider, -rotations);
}

// Gets available spots on the board as an array of row col values
function getAvailableSpots (board) {
  var cells = [];
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        cells.push({'row': row, 'col': col});
      }
    }
  }
  return cells;
}

// Uses the available spots to get a random spot
function getRandomAvailableSpot (board) {
  var cells = getAvailableSpots(board);
  if (cells == []) {
    return {};
  }
  return cells[Math.floor(Math.random() * cells.length)];
}

// fills the board with 0s
function clearBoard (board) {
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      board[r][c] = 0;
    }
  }
  return board;
}

// clears the UI
function emptyUI (board) {
  board = clearBoard(board);
  $('#table').html('');
}

// updates the UI with most recent board state
function updateUI (board) {
  var rows = '';
  for (var r = 0; r < 4; r++) {
    var row = '<tr>';
    for (var c = 0; c < 4; c++) {
      if (board[r][c] !== 0) {
        var boardValue = board[r][c];
        var color = colorMappings[boardValue];
        row += '<td>' + '<div style="background-color: ' + color + '; color: white">' + boardValue.toString() + '</div>' + '</td>';
      } else {
        row += '<td>' + '<div style="visibility: hidden">' + board[r][c].toString() + '</div>' + '</td>';
      }
    }
    rows += row + '</tr>';
  }
  $('#table').html(rows);
  console.table(board);
}

// returns a board with either initial random placement of tiles
// or the random tile placement after every move
function randomBoard (board) {
  if (board.length === 0) {
    for (var r = 0; r < 4; r++) {
      var row = [];
      for (var c = 0; c < 4; c++) {
        row.push(0);
      }
      board.push(row);
    }
    var randomStart1 = getRandomAvailableSpot(board);
    board[randomStart1['row']][randomStart1['col']] = 2;
    var randomStart2 = getRandomAvailableSpot(board);
    board[randomStart2['row']][randomStart2['col']] = 2;
    updateUI(board);
    return board;
  }
  if (!checkIfBoardFull(board)) {
    var randomPosition = getRandomAvailableSpot(board);
    console.log(randomPosition);
    if ($.isEmptyObject(randomPosition)) {
      return board;
    }
    // https://www.reddit.com/r/2048/comments/23tzxu/odds_of_a_4_spawning/
    var value = Math.random() < 0.9 ? 2 : 4;
    console.log(value);
    board[randomPosition['row']][randomPosition['col']] = value;
    updateUI(board);
  }
  return board;
}

//checks if the board is completely full, i.e. no 0s
function checkIfBoardFull (board) {
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        return false;
      }
    }
  }
  return true;
}

// check if a 2048 is present
function checkWin (board) {
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      if (board[r][c] === 2048) {
        return true;
      }
    }
  }
  return false;
}

function checkIfBoardsEqual (board1, board2) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board1[i][j] !== board2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

// checks for a loss condition
// attempts a movement in all directions, if all
// are same as the original board that means there
// are no more valid moves, hence a loss
function checkLoss (board) {
  var copyOfBoard = JSON.parse(JSON.stringify(board));
  var left = slide(copyOfBoard, 'left');
  var up = slide(copyOfBoard, 'up');
  var right = slide(copyOfBoard, 'right');
  var down = slide(copyOfBoard, 'down');
  return checkIfBoardsEqual(copyOfBoard, left) && checkIfBoardsEqual(copyOfBoard, up) && checkIfBoardsEqual(copyOfBoard, right) && checkIfBoardsEqual(copyOfBoard, down);
}

function create () {

  // TODO random-ize this
  return randomBoard([]);
}

// conducts the actual game by taking in user inputs
// does not respond to non-specified inputs
function playGame (elem, board, started, btn) {
  var run = function (event) {
  if (event.keyCode == 37) {
    board = slide(board, 'left');
    board = randomBoard(board);
    $('#action').text('left');
  } else if (event.keyCode == 38) {
    board = slide(board, 'up');
    board = randomBoard(board);
    $('#action').text('up');
  } else if (event.keyCode == 39) {
    board = slide(board, 'right');
    board = randomBoard(board);
    $('#action').text('right');
  } else if (event.keyCode == 40) {
    board = slide(board, 'down');
    board = randomBoard(board);
    $('#action').text('down');
  }
  if (checkIfBoardFull(board)) {
    console.log('in here');
    if (checkLoss(board)) {
        $('#action').text('Game over!');
        started = false;
        emptyUI(board);
        btn.text('Start');
        elem.removeEventListener('keydown', run, true);
    }
  }
  if (checkWin(board)) {
    $('#action').text("You win!");
    started = false;
    emptyUI(board);
    btn.text('Start');
    elem.removeEventListener('keydown', run, true);
  }
};
  elem.addEventListener('keydown', run, true);
}

// click handler for the button
function startClick (elem, started, board) {
  elem.on('click', function(event){
    if (!started) {
      $('#action').text("Started! Use arrow keys to navigate");
      started = true;
      elem.text('Restart');
      board = create();
      playGame(document, board, started, elem);
    } else {
      $('#action').text("Started! Use arrow keys to navigate");
      started = false;
      board = create();
      playGame(document, board, started, elem);
    }
  });
}

var colorMappings = {
  2: "#072f37",
  4: "#334f3b",
  8: "#65816d",
  16: "#c8cbbf",
  32: "#bd7423",
  64: "#072f37",
  128: "#334f3b",
  256: "#65816d",
  512: "#c8cbbf",
  1024: "#bd7423",
  2048: "#072f37"
};

module.exports = {
  combine: combine,
  rotate: rotate,
  slide: slide,
  create: create,
  startClick: startClick
};

},{}]},{},[]);
