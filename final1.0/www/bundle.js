"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    'use strict';

    var Board = require('../board.js');

    if (!window.socket) {
      window.socket = io();
    }

    var socket = window.socket;

    var socketAPI = {
      inviteMatch: function inviteMatch(opponentID, size) {
        socket.emit('invite-match', opponentID, size);
      },

      sendMove: function sendMove(opponentID, row, col) {
        socket.emit('send-move', [opponentID, row, col]);
      },

      userLoggedIn: function userLoggedIn(userID) {
        socket.emit('user-logged-in', userID);
      },

      resign: function resign(userID, opponentID) {
        socket.emit('resign', userID, opponentID);
      },

      score: function score(userID, opponentID) {
        socket.emit('score', userID, opponentID);
      }
    };

    /*
    不再需要产生随机 ID
     */
    /*
    socket.on('generate-user-id', function(userID) {
      console.log('get userID: ', userID)
      $('.user-id').html('User ID: ' + userID)
    })
    */

    socket.on('opponent-not-found', function (opponentID) {
      alert('opponent ' + opponentID + ' not found');
    });

    socket.on('invitation-sent', function (opponentID) {
      alert('opponent ' + opponentID + ' not found');
    });

    socket.on('receive-match-invitation', function (opponentID) {
      alert('receive match invitation from ' + opponentID);
    });

    socket.on('start-match', function (data) {
      var size = data.size,
          color = data.color,
          opponentID = data.opponentID;

      $('.menu').remove();
      window.gameManager.startNewMatch(size, color, opponentID);
    });

    socket.on('receive-move', function (data) {
      var row = data[0],
          col = data[1];

      if (row === -1 || col === -1) {
        // pass
        window.gameManager.board.nextTurn(true);
      } else {
        window.gameManager.board.addStone(row, col);
      }
    });

    socket.on('opponent-resign', function () {
      window.gameManager.board.opponentResign();
    });

    socket.on('opponent-score', function () {
      window.gameManager.board.score();
    });

    socket.on('opponent-disconnect', function (opponentID) {
      alert('opponent disconnect: ' + opponentID);
    });

    module.exports = socketAPI;
  }, { "../board.js": 3 }], 2: [function (require, module, exports) {
    'use strict';

    var userAPI = {
      signup: function signup(email, userID, password, callback) {
        $.ajax('/signup', {
          type: 'POST',
          dataType: 'json',
          data: { email: email, password: password, userID: userID },
          success: function success(res) {
            if (res) {
              if (callback) callback(res);else callback(null);
            } else if (callback) {
              callback(null);
            }
          },
          error: function error(res) {
            if (callback) callback(null);
          }
        });
      },

      signin: function signin(email, password, callback) {
        $.ajax('/signin', {
          type: 'POST',
          dataType: 'json',
          data: { email: email, password: password },
          success: function success(res) {
            if (res) {
              if (callback) callback(res);else callback(null);
            } else if (callback) {
              callback(null);
            }
          },
          error: function error(res) {
            if (callback) callback(null);
          }
        });
      },

      checkAuth: function checkAuth(callback) {
        $.ajax('/auth', {
          type: 'GET',
          dataType: 'json',
          success: function success(res) {
            console.log('auth success', res);
            if (res) {
              if (callback) callback(res);else callback(null);
            } else if (callback) {
              callback(null);
            }
          },
          error: function error(res) {
            if (callback) callback(null);
          }
        });
      }
    };

    module.exports = userAPI;
  }, {}], 3: [function (require, module, exports) {
    var Grid = require('./grid.js');
    var Stone = require('./stone.js');
    var History = require('./history.js').History;
    var socketAPI = require('./api/socket_api');
    var Simple = require('./simple.js');

    // 假设只 9x9

    var Board = (function (_Simple) {
      _inherits(Board, _Simple);

      // 9x9 13x13 19x19

      function Board( /*size, playerColor, opponentID */props) {
        _classCallCheck(this, Board);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Board).call(this));

        _this.size = props.size || 19;
        _this.playerColor = props.playerColor || 'black';
        _this.playerID = props.playerID || null;
        _this.opponentID = props.opponentID || null;
        _this.gameManager = props.gameManager || null;

        _this.board = [];
        _this.boardDom = [];

        _this.turn = 0;
        _this.history = new History();

        _this.$mark = null;
        _this.justPass = false;

        // create board data
        for (var i = 0; i < _this.size; i++) {
          _this.board.push([]);
          _this.boardDom.push([]);

          for (var j = 0; j < _this.size; j++) {
            _this.board[i].push(null);
            _this.boardDom[i].push(null);
          }
        }

        _this.history.add(_this.board);
        return _this;
      }

      // mark all stones as unchecked

      _createClass(Board, [{
        key: "markAllStonsUncheckd",
        value: function markAllStonsUncheckd() {
          for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
              if (this.board[i][j]) {
                this.board[i][j].checked = false;
              }
            }
          }
        }
      }, {
        key: "getColorForCurrentTurn",
        value: function getColorForCurrentTurn() {
          if (this.turn % 2 === 0) {
            return 'black';
          } else {
            return 'white';
          }
        }
      }, {
        key: "isMyTurn",
        value: function isMyTurn() {
          return this.getColorForCurrentTurn() === this.playerColor;
        }
      }, {
        key: "getStoneImage",
        value: function getStoneImage() {
          if (this.turn % 2 === 0) {
            return './images/b.png';
          } else {
            return "./images/w" + Math.floor(Math.random() * 15 + 1) + ".png";
          }
        }
      }, {
        key: "nextTurn",
        value: function nextTurn(justPass) {
          this.justPass = justPass;
          this.turn += 1;
          this.markAllStonsUncheckd();

          this.gameManager.updateBoardMenu();
        }
      }, {
        key: "addStone",
        value: function addStone(row, col) {
          if (this.board[row][col]) return;

          var $stone = $("<div class=\"stone " + (this.turn % 2 === 0 ? 'black' : 'white') + "\" style='width: " + this.stoneSize + "px; height: " + this.stoneSize + "px; border-radius: " + this.stoneSize + "px; background-image: url(\"" + this.getStoneImage() + "\");' data-row=" + row + " data-col=" + col + " id=\"stone-" + row + "-" + col + "\"> </div>");

          $("#grid-touch-" + row + "-" + col).append($stone);

          var stone = new Stone($stone, this);

          this.board[row][col] = stone; // set to Go board

          this.turn += 1;

          // console.log('enter here')

          this.checkCapture(row, col);
        }
      }, {
        key: "removeStone",
        value: function removeStone(row, col) {
          if (this.board[row][col]) {
            this.board[row][col].$stone.remove();
            this.board[row][col] = null;
          }
        }
      }, {
        key: "score",
        value: function score() {
          var _this2 = this;

          console.log('score');
          var boardData = [];
          // initialize flood fill data structure
          for (var i = 0; i < this.size; i++) {
            boardData.push([]);
            for (var j = 0; j < this.size; j++) {
              boardData[i][j] = { white: false, black: false, visited: false };
              if (this.board[i][j]) {
                if (this.board[i][j].color === 'white') {
                  boardData[i][j].white = true;
                } else {
                  boardData[i][j].black = true;
                }
              }
            }
          }

          // flood fill algorithm
          var scoreFloodFill = function scoreFloodFill(i, j, color) {
            if (i >= 0 && i < _this2.size && j >= 0 && j < _this2.size) {
              if (_this2.board[i][j]) return;
              if (boardData[i][j][color]) return;
              boardData[i][j][color] = true;
              boardData[i][j].visited = true;
              scoreFloodFill(i, j + 1, color);
              scoreFloodFill(i, j - 1, color);
              scoreFloodFill(i + 1, j, color);
              scoreFloodFill(i - 1, j, color);
            }
          };

          for (var _i = 0; _i < this.size; _i++) {
            for (var _j = 0; _j < this.size; _j++) {
              if (!boardData[_i][_j].visited && this.board[_i][_j]) {
                boardData[_i][_j].visited = true;
                scoreFloodFill(_i, _j + 1, this.board[_i][_j].color);
                scoreFloodFill(_i, _j - 1, this.board[_i][_j].color);
                scoreFloodFill(_i + 1, _j, this.board[_i][_j].color);
                scoreFloodFill(_i - 1, _j, this.board[_i][_j].color);
              }
            }
          }

          var whiteScore = 0,
              blackScore = 0;

          for (var _i2 = 0; _i2 < this.size; _i2++) {
            for (var _j2 = 0; _j2 < this.size; _j2++) {
              if (boardData[_i2][_j2].white && boardData[_i2][_j2].black) continue;else if (boardData[_i2][_j2].white) whiteScore++;else if (boardData[_i2][_j2].black) blackScore++;else continue;
            }
          }

          console.log(boardData);
          console.log(whiteScore);
          console.log(blackScore);

          alert("white score: " + whiteScore + ", black score: " + blackScore);

          location.reload();
        }
      }, {
        key: "pass",
        value: function pass() {
          console.log('pass');
          if (this.justPass) {
            this.score();
            socketAPI.score(this.userID, this.opponentID);
            return;
          }

          if (this.opponentID) {
            socketAPI.sendMove(this.opponentID, -1, -1);
          }

          this.nextTurn();
        }
      }, {
        key: "resign",
        value: function resign() {
          console.log('resign');
          socketAPI.resign(this.userID, this.opponentID);
          alert('You resigned');

          location.reload();
        }
      }, {
        key: "opponentResign",
        value: function opponentResign() {
          alert('Opponent ' + this.opponentID + ' resigned');

          location.reload();
        }

        // check if two boards have the same.

      }, {
        key: "twoBoardsEqual",
        value: function twoBoardsEqual(board) {
          var board1 = this.board;
          var board2 = board;

          for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
              var stone1 = board1[i][j];
              var stone2 = board2[i][j];

              if (!stone1 && !stone2) {
                continue;
              } else if (stone1 && stone2 && stone1.color === stone2.color) {
                continue;
              } else {
                return false;
              }
            }
          }
          return true;
        }
      }, {
        key: "showIcon",
        value: function showIcon(row, col, iconName) {
          var $gridTouch = this.boardDom[row][col].$gridTouch;
          var $icon = $("<div class='" + iconName + "'> </div>");
          $icon.css('width', $gridTouch.css('width'));
          $icon.css('height', $gridTouch.css('height'));
          $icon.css('left', $gridTouch.css('left'));
          $icon.css('right', $gridTouch.css('right'));
          $icon.css('top', $gridTouch.css('top'));
          $icon.css('bottom', $gridTouch.css('bottom'));

          this.boardDom[row][col].$grid.append($icon);

          $icon.fadeOut(2000, function () {
            $icon.remove();
          });
        }
      }, {
        key: "setMark",
        value: function setMark(row, col) {
          if (this.$mark) {
            this.$mark.remove();
          }

          var $grid = this.boardDom[row][col].$grid;
          var $gridTouch = this.boardDom[row][col].$gridTouch;
          var $mark = $("<div class=\"" + (this.board[row][col].color === 'black' ? 'mark-w' : 'mark-b') + "\"></div>");
          $mark.css('width', $grid.css('width'));
          $mark.css('height', $grid.css('height'));
          $mark.css('left', $gridTouch.css('left'));
          $mark.css('right', $gridTouch.css('right'));
          $mark.css('top', $gridTouch.css('top'));
          $mark.css('bottom', $gridTouch.css('bottom'));

          this.$mark = $mark;
          this.boardDom[row][col].$grid.append(this.$mark);

          if (this.$mark) {
            this.$mark.remove();
          } else {
            var _$gridTouch = this.boardDom[row][col].$gridTouch;
            var _$mark = $("<div class='mark'> </div>");
            _$mark.css('width', _$gridTouch.css('width'));
            _$mark.css('height', _$gridTouch.css('height'));
            _$mark.css('left', _$gridTouch.css('left'));
            _$mark.css('right', _$gridTouch.css('right'));
            _$mark.css('top', _$gridTouch.css('top'));
            _$mark.css('bottom', _$gridTouch.css('bottom'));

            this.$mark = _$mark;
          }

          this.boardDom[row][col].$grid.append(this.$mark);
        }
      }, {
        key: "checkCapture",
        value: function checkCapture(row, col) {
          var color = this.turn % 2 === 0 ? 'black' : 'white';
          var last = this.history.get(-1);

          // check opponent
          for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
              var stone = this.board[i][j];
              if (stone && !stone.checked && stone.sameColor(color)) {
                // console.log('@ check ' + i + ' ' + j)
                if (stone.hasNoQi()) {
                  this.board[i][j] = null; // not remove dom yet
                  if (this.twoBoardsEqual(last)) {
                    console.log('打劫！');
                    this.showIcon(row, col, 'jie');
                    this.board[i][j] = stone; // restore
                    this.removeStone(row, col);
                    this.turn -= 1;
                    this.markAllStonsUncheckd();
                    return;
                  } else {
                    this.board[i][j] = stone; // restore. Have to restore first.
                    stone.removeStones();
                  }
                }
              }
            }
          }

          // check self
          for (var _i3 = 0; _i3 < this.size; _i3++) {
            for (var _j3 = 0; _j3 < this.size; _j3++) {
              var _stone = this.board[_i3][_j3];
              if (_stone && !_stone.checked) {
                // console.log('@@ check ' + i + ' ' + j)
                if (_stone.hasNoQi()) {
                  // suicide
                  // TODO: hint user not to put stone this way
                  // console.log('@@ no qi ' + i + ' ' + j)
                  console.log('suicide');
                  this.showIcon(row, col, 'suicide');
                  this.removeStone(row, col); // restore
                  this.turn -= 1;
                  this.markAllStonsUncheckd();
                  return;
                }
              }
            }
          }

          this.markAllStonsUncheckd();
          this.history.add(this.board); // save to history
          // this.setMark(row, col) // mark lastest stone
          this.setMark(row, col);

          this.justPass = false;

          if (this.opponentID) {
            socketAPI.sendMove(this.opponentID, row, col);
          }

          if (this.gameManager) {
            this.gameManager.updateBoardMenu();
          }
        }
      }, {
        key: "render",
        value: function render($el) {
          var dom = $("<div class=\"board\"></div>");

          if ($el) {
            $el.append(dom);
          }

          var boardSize = dom.width(),
              // excluding padding  // 576,
          gridSize = boardSize / (this.size - 1);

          dom.css('height', boardSize + parseInt(dom.css('padding'), 10) * 2 + 'px'); // set height

          var stoneSize = gridSize;
          this.stoneSize = gridSize;

          for (var i = 0; i < this.size - 1; i++) {
            var gridRow = $('<div class="grid-row"></div>');
            for (var j = 0; j < this.size - 1; j++) {
              var grid = $("<div style='width: " + gridSize + "px; height: " + gridSize + "px;' class=\"grid\"></div>");

              var gridTouch = $("<div class=\"grid-touch\"\n                                data-row=" + i + "\n                                data-col=" + j + "\n                                id=\"grid-touch-" + i + "-" + j + "\"\n                                style=\"width: " + stoneSize + "px; height: " + stoneSize + "px; left: " + -stoneSize / 2 + "px; top: " + -stoneSize / 2 + "px;\"> </div>");
              this.boardDom[i][j] = new Grid(gridTouch, grid, this);
              grid.append(gridTouch);

              if (j === this.size - 2) {
                var _gridTouch = $("<div class=\"grid-touch grid-touch-right-top\"\n                                  data-row=" + i + "\n                                  data-col=" + (j + 1) + "\n                                  id=\"grid-touch-" + i + "-" + (j + 1) + "\"\n                                  style=\"width: " + stoneSize + "px; height: " + stoneSize + "px; right: " + -stoneSize / 2 + "px; top: " + -stoneSize / 2 + "px;\"> </div>");
                this.boardDom[i][j + 1] = new Grid(_gridTouch, grid, this);
                grid.append(_gridTouch);
              }

              if (i === this.size - 2) {
                var _gridTouch2 = $("<div class=\"grid-touch grid-touch-left-bottom\"\n                                  data-row=" + (i + 1) + "\n                                  data-col=" + j + "\n                                  id=\"grid-touch-" + (i + 1) + "-" + j + "\"\n                                  style=\"width: " + stoneSize + "px; height: " + stoneSize + "px; left: " + -stoneSize / 2 + "px; bottom: " + -stoneSize / 2 + "px;\"> </div>");
                this.boardDom[i + 1][j] = new Grid(_gridTouch2, grid, this);
                grid.append(_gridTouch2);
              }

              if (i === this.size - 2 && j === this.size - 2) {
                var _gridTouch3 = $("<div class=\"grid-touch grid-touch-right-bottom\"\n                                  data-row=" + (i + 1) + "\n                                  data-col=" + (j + 1) + "\n                                  id=\"grid-touch-" + (i + 1) + "-" + (j + 1) + "\"\n                                  style=\"width: " + stoneSize + "px; height: " + stoneSize + "px; right: " + -stoneSize / 2 + "px; bottom: " + -stoneSize / 2 + "px;\"> </div>");
                this.boardDom[i + 1][j + 1] = new Grid(_gridTouch3, grid, this);
                grid.append(_gridTouch3);
              }

              gridRow.append(grid);
            }
            dom.append(gridRow);
          }

          return dom;
        }
      }]);

      return Board;
    })(Simple);

    module.exports = Board;
  }, { "./api/socket_api": 1, "./grid.js": 5, "./history.js": 6, "./simple.js": 10, "./stone.js": 11 }], 4: [function (require, module, exports) {
    var Simple = require('./simple.js');

    var BoardMenu = (function (_Simple2) {
      _inherits(BoardMenu, _Simple2);

      function BoardMenu(board) {
        _classCallCheck(this, BoardMenu);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(BoardMenu).call(this));

        _this3.board = board;
        return _this3;
      }

      _createClass(BoardMenu, [{
        key: "render",
        value: function render() {
          var _this4 = this;

          var $menu = $("\n<div class=\"board-menu\">\n  <div class=\"players\">\n    <div class=\"player\">\n      <div class=\"card black " + (this.board.getColorForCurrentTurn() === 'black' ? 'this-turn' : '') + "\">\n        <div class=\"profile-image\"> </div>\n        <p class=\"name\"> " + (this.board.playerColor === 'black' ? this.board.playerID : this.board.opponentID) + " </p>\n\n        " + (this.board.playerColor === 'black' ? this.board.isMyTurn() ? " <div class=\"button-group\">\n              <div class=\"pass\"> <div class=\"btn pass-btn\"> Pass </div> </div>\n              <div class=\"resign\"> <div class=\"btn resign-btn\"> Resign </div> </div>\n            </div>" : '<div class="button-group"> White to move</div>' : '') + "\n\n      </div>\n    </div>\n    <div class=\"player\">\n      <div class=\"card white " + (this.board.getColorForCurrentTurn() === 'white' ? 'this-turn' : '') + "\">\n        <div class=\"profile-image\"> </div>\n        <p class=\"name\"> " + (this.board.playerColor === 'white' ? this.board.playerID : this.board.opponentID) + " </p>\n\n        " + (this.board.playerColor === 'white' ? this.board.isMyTurn() ? " <div class=\"button-group\">\n              <div class=\"pass\"> <div class=\"btn pass-btn\"> Pass </div> </div>\n              <div class=\"resign\"> <div class=\"btn resign-btn\"> Resign </div> </div>\n            </div>" : '<div class="button-group"> Black to move </div>' : '') + "\n      </div>\n    </div>\n  </div>\n</div>\n");
          console.log('enter here');

          $('.pass-btn', $menu).click(function () {
            _this4.board.pass();
          });

          $('.resign-btn', $menu).click(function () {
            _this4.board.resign();
          });

          return $menu;
        }
      }]);

      return BoardMenu;
    })(Simple);

    module.exports = BoardMenu;
  }, { "./simple.js": 10 }], 5: [function (require, module, exports) {
    'use strict';

    var Stone = require('./stone.js');

    var Grid = (function () {
      function Grid($gridTouch, $grid, board) {
        var _this5 = this;

        _classCallCheck(this, Grid);

        this.$gridTouch = $gridTouch;
        this.$grid = $grid;
        this.board = board;
        this.stoneSize = Number(this.$grid.css('width').replace('px', ''));

        this.$hoverElement = null;

        this.row = this.$gridTouch.data('row');
        this.col = this.$gridTouch.data('col');

        this.addDot();

        $gridTouch.click(function () {
          if (!_this5.board.isMyTurn()) return;
          _this5.board.addStone(_this5.row, _this5.col);
        });

        var isTouchDevice = 'ontouchstart' in window || 'onmsgesturechange' in window;
        if (!isTouchDevice) {
          $gridTouch.hover(function () {
            if (_this5.$hoverElement || _this5.board.board[_this5.row][_this5.col] || !_this5.board.isMyTurn()) return;else {
              _this5.$hoverElement = $("<div class=\"stone " + (_this5.board.turn % 2 === 0 ? 'black' : 'white') + "\" style='width: " + _this5.stoneSize + "px; height: " + _this5.stoneSize + "px; border-radius: " + _this5.stoneSize + "px; background-image: url(\"" + _this5.board.getStoneImage() + "\"); opacity: 0.5;' data-row=" + _this5.row + " data-col=" + _this5.col + "> </div>");

              _this5.$gridTouch.append(_this5.$hoverElement);
            }
          }, function () {
            if (_this5.$hoverElement) {
              _this5.$hoverElement.remove();
              _this5.$hoverElement = null;
            }
          });
        }
      }

      _createClass(Grid, [{
        key: "addDot",
        value: function addDot() {
          if (this.board.size === 9) {
            if ((this.row === 2 || this.row === 6) && (this.col === 2 || this.col === 6) || this.row === 4 && this.col === 4) {
              this.$gridTouch.append($('<div class="dot"></div>'));
            }
          }

          if (this.board.size === 13) {
            if ((this.row === 3 || this.row === 9) && (this.col === 3 || this.col === 9) || this.row === 6 && this.col === 6) {
              this.$gridTouch.append($('<div class="dot"></div>'));
            }
          }

          if (this.board.size === 19) {
            if ((this.row === 3 || this.row === 9 || this.row === 15) && (this.col === 3 || this.col === 9 || this.col === 15) || this.row === 9 && this.col === 9) {
              this.$gridTouch.append($('<div class="dot dot-19"></div>'));
            }
          }
        }
      }]);

      return Grid;
    })();

    module.exports = Grid;
  }, { "./stone.js": 11 }], 6: [function (require, module, exports) {
    'use strict';

    var History = (function () {
      function History() {
        _classCallCheck(this, History);

        this.history = [];
      }

      _createClass(History, [{
        key: "add",
        value: function add(board) {
          var b = [];
          for (var i = 0; i < board.length; i++) {
            b.push([]);
            for (var j = 0; j < board[i].length; j++) {
              b[i].push(board[i][j]);
            }
          }
          this.history.push(b);
        }
      }, {
        key: "pop",
        value: function pop() {
          this.history.pop();
        }
      }, {
        key: "get",
        value: function get(num) {
          if (num >= 0) {
            return this.history[num];
          } else {
            return this.history[this.history.length - 1 + num];
          }
        }
      }]);

      return History;
    })();

    module.exports = {
      History: History
    };
  }, {}], 7: [function (require, module, exports) {
    'use strict';

    var Stone = require('./stone.js').Stone;
    var Board = require('./board.js');
    var socketAPI = require('./api/socket_api.js');
    var userAPI = require('./api/user_api.js');
    var Menu = require('./menu.js');
    var Signup_Login = require('./signup_login.js');
    var BoardMenu = require('./board_menu.js');

    var GameManager = (function () {
      function GameManager() {
        var _this6 = this;

        _classCallCheck(this, GameManager);

        this.$game = $('.game');
        userAPI.checkAuth(function (res) {
          if (res && res.success) {
            _this6.playerID = res.userID;
            // $('.user-id').html('User ID: ' + this.playerID)
            socketAPI.userLoggedIn(_this6.playerID);
            _this6.showMenu();
          } else {
            _this6.signup_login_page = new Signup_Login();
            _this6.signup_login_page.appendTo($('.game'));
          }
        });

        document.body.addEventListener('touchmove', function (e) {
          e.preventDefault();
        });

        // this.startNewMatch(19, 'white', 'opponentID')
      }

      _createClass(GameManager, [{
        key: "setPlayerID",
        value: function setPlayerID(id) {
          this.playerID = id;
        }
      }, {
        key: "startNewMatch",
        value: function startNewMatch(size, playerColor, opponentID) {
          this.board = new Board({ size: size,
            playerColor: playerColor,
            playerID: this.playerID,
            opponentID: opponentID,
            gameManager: this });
          this.board.render(this.$game);
          // this.board.appendTo(this.$game)

          this.boardMenu = new BoardMenu(this.board);
          this.boardMenu.appendTo(this.$game);
        }
      }, {
        key: "updateBoardMenu",
        value: function updateBoardMenu() {
          this.boardMenu.forceUpdate();
        }
      }, {
        key: "showMenu",
        value: function showMenu() {
          if (this.signup_login_page) {
            this.signup_login_page.remove();
            this.signup_login_page = null;
          }

          if (this.board) {
            this.board.remove();
            this.board = null;
          }

          if (this.boardMenu) {
            this.boardMenu.remove();
            this.boardMenu = null;
          }

          // TODO: remove
          /*
          if (this.board) {
          }
          */

          this.menu = new Menu(this);
          this.menu.appendTo($('.game'));
        }
      }]);

      return GameManager;
    })();

    // 没什么卵用的 loading screen

    $('.loading-screen .logo').fadeIn(1000, function () {
      setTimeout(function () {
        $('.loading-screen .logo').fadeOut(1000, function () {
          $('.loading-screen').remove();
        });
      }, 1600);
    });

    window.gameManager = new GameManager();

    // let board = new Board({size: 9})
    //board.board[1][1] = {color: 'black'}
    // board.score()
  }, { "./api/socket_api.js": 1, "./api/user_api.js": 2, "./board.js": 3, "./board_menu.js": 4, "./menu.js": 8, "./signup_login.js": 9, "./stone.js": 11 }], 8: [function (require, module, exports) {
    'use strict';

    var socketAPI = require('./api/socket_api.js');
    var Simple = require('./simple.js');

    var Menu = (function (_Simple3) {
      _inherits(Menu, _Simple3);

      function Menu(gameManager) {
        _classCallCheck(this, Menu);

        var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Menu).call(this));

        _this7.gameManager = gameManager;

        _this7.state = {
          showBoardSize: false
        };
        return _this7;
      }

      _createClass(Menu, [{
        key: "render",
        value: function render() {
          var _this8 = this;

          if (this.state.showBoardSize) {
            var $menu = $("<div class=\"menu\">\n                      <p class=\"menu-title\"> Board Size </p>\n                      <div class=\"button play\" size=\"19\"> <span size=\"19\"> 19x19 </span> </div>\n                      <div class=\"button play\" size=\"13\"> <span size=\"13\"> 13x13 </span> </div>\n                      <div class=\"button play\" size=\"9\"> <span size=\"9\"> 9x9 </span> </div>\n                      <div class=\"button back\"> <span> Back </span> </div>\n                    </div>");

            $('.play', $menu).click(function (event) {
              var size = parseInt(event.target.getAttribute('size'));

              var opponentID = prompt('enter opponent id');
              socketAPI.inviteMatch(opponentID, size);
            });

            $('.back', $menu).click(function (event) {
              _this8.setState({ showBoardSize: false });
            });

            return $menu;
          } else {
            var _$menu = $(" <div class=\"menu\">\n                        <p class=\"menu-title\"> Go! " + this.gameManager.playerID + " </p>\n                        <div class=\"button private-match\"> <span> Private Match </span> </div>\n                        <div class=\"button public-match\"> <span> Public Match </span> </div>\n                        <div class=\"button\"> <span> Bot Match </span> </div>\n                      </div>");

            $('.private-match', _$menu).click(function () {
              _this8.setState({ showBoardSize: true });
            });

            $('.public-match', _$menu).click(function () {
              console.log('public match');
            });

            return _$menu;
          }
        }
      }]);

      return Menu;
    })(Simple);

    module.exports = Menu;
  }, { "./api/socket_api.js": 1, "./simple.js": 10 }], 9: [function (require, module, exports) {
    'use strict';

    var Simple = require('./simple.js');
    var userAPI = require('./api/user_api.js');
    var socketAPI = require('./api/socket_api.js');

    var Signup_Login = (function (_Simple4) {
      _inherits(Signup_Login, _Simple4);

      function Signup_Login() {
        _classCallCheck(this, Signup_Login);

        var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(Signup_Login).call(this));

        _this9.state = {
          showLogin: true
        };
        return _this9;
      }

      _createClass(Signup_Login, [{
        key: "render",
        value: function render() {
          var _this10 = this;

          var $email = $("<div class=\"email field\"> <input placeholder=\"Email\" /> </div>");
          var $userID = $("<div class=\"userID field  " + (this.state.showLogin ? 'hide' : 'show') + "\"> <input placeholder=\"User ID\" /> </div>");
          var $password = $('<div class="password field"> <input placeholder="Password" type="password" /> </div>');

          var $switch = $("<a class=\"switch\"> " + (this.state.showLogin ? 'Don\'t have account yet? Click me ' : 'Already have an account? Click me') + " </a>");

          var $go = $('<div class="go"> Go </div>');

          var $container = $('<div class="container"></div>');

          $container.append($email);
          $container.append($userID);
          $container.append($password);
          $container.append($switch);
          $container.append($go);

          var $pageElement = $("\n      <div class=\"signup-login-page\">\n      </div>\n      ");

          $pageElement.append($container);

          $switch.click(function () {
            _this10.setState({ showLogin: !_this10.state.showLogin });
          });

          $go.click(function () {
            var email = $('input', $email).val().trim(),
                userID = $('input', $userID).val().trim(),
                password = $('input', $password).val();

            if (_this10.state.showLogin) {
              // login
              // missing information
              if (!email.length || !password.length) {
                return;
              }
              console.log('login');
              userAPI.signin(email, password, function (res) {
                console.log(res);
                if (!res) {
                  alert('Failed to signin');
                } else {
                  // $('.user-id').html('User ID: ' + res.userID)
                  window.gameManager.setPlayerID(res.userID);
                  window.gameManager.showMenu();
                  socketAPI.userLoggedIn(res.userID);
                }
              });
            } else {
              // missing information
              if (!email.length || !userID.length || !password.length) {
                return;
              }
              console.log('signup');
              userAPI.signup(email, userID, password, function (res) {
                console.log(res);
                if (!res) {
                  alert('Failed to signup');
                } else {
                  // $('.user-id').html('User ID: ' + res.userID)
                  window.gameManager.setPlayerID(res.userID);
                  window.gameManager.showMenu();
                  socketAPI.userLoggedIn(res.userID);
                }
              });
            }
          });

          return $pageElement;
        }
      }]);

      return Signup_Login;
    })(Simple);

    module.exports = Signup_Login;
  }, { "./api/socket_api.js": 1, "./api/user_api.js": 2, "./simple.js": 10 }], 10: [function (require, module, exports) {
    /*
      My Simple and silly front end library called "Simple"
     */

    var Simple = (function () {
      function Simple() {
        _classCallCheck(this, Simple);

        this.state = {};
        this.$el = null;
      }

      _createClass(Simple, [{
        key: "setState",
        value: function setState(newState) {
          // copy state and then rerender dom element
          for (var key in newState) {
            this.state[key] = newState[key];
          }

          this.forceUpdate();
        }
      }, {
        key: "forceUpdate",
        value: function forceUpdate() {
          var $new = this._render();

          if (this.$el) {
            this.$el.replaceWith($new);
            this.$el = $new;
          } else {
            this.$el = $new;
          }
        }
      }, {
        key: "_render",
        value: function _render() {
          var res = this.render();
          if (typeof res === 'string') {
            return $(res);
          } else {
            return res;
          }
        }
      }, {
        key: "appendTo",
        value: function appendTo($element) {
          if (!this.$el) {
            this.$el = this._render();
          }
          $element.append(this.$el);
        }
      }, {
        key: "remove",
        value: function remove() {
          if (this.$el) {
            this.$el.remove();
            this.$el = null;
          }
        }
      }, {
        key: "render",
        value: function render() {
          throw 'Simple Exception: render function not implemented';
          return null;
        }
      }]);

      return Simple;
    })();

    module.exports = Simple;
  }, {}], 11: [function (require, module, exports) {
    'use strict';

    var Stone = (function () {
      function Stone($stone, board) {
        _classCallCheck(this, Stone);

        this.$stone = $stone;
        this.board = board;
        this.row = $stone.data('row');
        this.col = $stone.data('col');
        this.checked = false;
        this.color = $stone.hasClass('black') ? 'black' : 'white';
      }

      _createClass(Stone, [{
        key: "toString",
        value: function toString() {
          return "Stone(" + this.row + ", " + this.col + ")";
        }
      }, {
        key: "sameColor",
        value: function sameColor(color) {
          return this.color === color;
        }

        // check self and nearby stones qi

      }, {
        key: "hasNoQi",
        value: function hasNoQi() {
          this.checked = true;

          var noQi = true;
          if (this.getQi() > 0) {
            noQi = false;
          }

          var top = this.getTopStone(),
              left = this.getLeftStone(),
              right = this.getRightStone(),
              bottom = this.getBottomStone();

          if (top && top.sameColor(this.color) && !top.checked && !top.hasNoQi()) {
            noQi = false;
          }

          if (left && left.sameColor(this.color) && !left.checked && !left.hasNoQi()) {
            noQi = false;
          }

          if (right && right.sameColor(this.color) && !right.checked && !right.hasNoQi()) {
            noQi = false;
          }

          if (bottom && bottom.sameColor(this.color) && !bottom.checked && !bottom.hasNoQi()) {
            noQi = false;
          }

          return noQi;
        }
      }, {
        key: "getTopStone",
        value: function getTopStone() {
          if (this.row > 0) {
            return this.board.board[this.row - 1][this.col];
          } else {
            return null;
          }
        }
      }, {
        key: "getBottomStone",
        value: function getBottomStone() {
          if (this.row < this.board.size - 1) {
            return this.board.board[this.row + 1][this.col];
          } else {
            return null;
          }
        }
      }, {
        key: "getLeftStone",
        value: function getLeftStone() {
          if (this.col > 0) {
            return this.board.board[this.row][this.col - 1];
          } else {
            return null;
          }
        }
      }, {
        key: "getRightStone",
        value: function getRightStone() {
          if (this.col < this.board.size - 1) {
            return this.board.board[this.row][this.col + 1];
          } else {
            return null;
          }
        }
      }, {
        key: "getQi",
        value: function getQi() {
          var qi = 0;

          // check top
          if (this.row > 0) {
            if (!this.board.board[this.row - 1][this.col]) {
              qi += 1;
            }
          }

          // check left
          if (this.col > 0) {
            if (!this.board.board[this.row][this.col - 1]) {
              qi += 1;
            }
          }

          // check right
          if (this.col < this.board.size - 1) {
            if (!this.board.board[this.row][this.col + 1]) {
              qi += 1;
            }
          }

          // check bottom
          if (this.row < this.board.size - 1) {
            if (!this.board.board[this.row + 1][this.col]) {
              qi += 1;
            }
          }

          // console.log(this.row + ' ' + this.col + ' qi: ' + qi)

          return qi;
        }

        // return how many stones are removed

      }, {
        key: "removeStones",
        value: function removeStones() {
          var count = 1;
          this.board.removeStone(this.row, this.col);

          var top = this.getTopStone(),
              left = this.getLeftStone(),
              right = this.getRightStone(),
              bottom = this.getBottomStone();

          if (top && top.sameColor(this.color)) {
            count += top.removeStones();
          }

          if (left && left.sameColor(this.color)) {
            count += left.removeStones();
          }

          if (right && right.sameColor(this.color)) {
            count += right.removeStones();
          }

          if (bottom && bottom.sameColor(this.color)) {
            count += bottom.removeStones();
          }

          return count;
        }
      }]);

      return Stone;
    })();

    module.exports = Stone;
  }, {}] }, {}, [7]);
