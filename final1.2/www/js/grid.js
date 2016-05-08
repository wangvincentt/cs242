'use strict'

let Stone = require('./stone.js')

class Grid {
  constructor($gridTouch, $grid, board) {
    this.$gridTouch = $gridTouch
    this.$grid = $grid
    this.board = board
    this.stoneSize = Number(this.$grid.css('width').replace('px', ''))

    this.$hoverElement = null

    this.row = this.$gridTouch.data('row')
    this.col = this.$gridTouch.data('col')

    this.addDot()

    $gridTouch.click(()=> {
      if (!this.board.isMyTurn()) return
      this.board.addStone(this.row, this.col)
    })

    let isTouchDevice = ('ontouchstart' in window || 'onmsgesturechange' in window)
    if (!isTouchDevice) {
      $gridTouch.hover(
        () => {
          if (this.$hoverElement || this.board.board[this.row][this.col] || !this.board.isMyTurn()) return
          else {
            this.$hoverElement = $(`<div class="stone ${this.board.turn % 2 === 0 ? 'black' : 'white'}" style='width: ${this.stoneSize}px; height: ${this.stoneSize}px; border-radius: ${this.stoneSize}px; background-image: url("${this.board.getStoneImage()}"); opacity: 0.5;' data-row=${this.row} data-col=${this.col}> </div>`)

            this.$gridTouch.append(this.$hoverElement)
          }
        },
        () => {
          if (this.$hoverElement) {
            this.$hoverElement.remove()
            this.$hoverElement = null
          }
        })
    }
  }

  addDot() {
    if (this.board.size === 9) {
      if ((this.row === 2 || this.row === 6) && (this.col === 2 || this.col === 6) || (this.row === 4 && this.col === 4)) {
        this.$gridTouch.append($('<div class="dot"></div>'))
      }
    }

    if (this.board.size === 13) {
      if ((this.row === 3 || this.row === 9) && (this.col === 3 || this.col === 9) || (this.row === 6 && this.col === 6)) {
        this.$gridTouch.append($('<div class="dot"></div>'))
      }
    }

    if (this.board.size === 19) {
      if ((this.row === 3 || this.row === 9 || this.row === 15) && (this.col === 3 || this.col === 9 || this.col === 15) || (this.row === 9 && this.col === 9)) {
        this.$gridTouch.append($('<div class="dot dot-19"></div>'))
      }
    }
  }

}

module.exports = Grid
