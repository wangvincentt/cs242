'use strict'

class Stone {
    constructor({board, row, col, color}) {
      this.board = board
      this.row = row
      this.col = col
      this.checked = false
      this.color = color
      this.image = this.getImage()
    }

    getImage() {
      if (this.color === 'black') {
        return './images/b.png'
      } else {
        return `./images/w${Math.floor(Math.random() * 15 + 1)}.png`
      }
    }

    toString() {
      return `Stone(${this.row}, ${this.col})`
    }

    sameColor(color) {
      return this.color === color
    }

    // check self and nearby stones qi
    hasNoQi() {
      this.checked = true

      let noQi = true
      if (this.getQi() > 0) {
        noQi = false
      }

      let top = this.getTopStone(),
          left = this.getLeftStone(),
          right = this.getRightStone(),
          bottom = this.getBottomStone()

      if (top && top.sameColor(this.color) && !top.checked && !top.hasNoQi()) {
        noQi = false
      }

      if (left && left.sameColor(this.color) && !left.checked && !left.hasNoQi()) {
        noQi = false
      }

      if (right && right.sameColor(this.color) && !right.checked && !right.hasNoQi()) {
        noQi = false
      }

      if (bottom && bottom.sameColor(this.color) && !bottom.checked && !bottom.hasNoQi()) {
        noQi = false
      }

      return noQi
    }

    getTopStone() {
      if (this.row > 0) {
        return this.board.board[this.row - 1][this.col]
      } else {
        return null
      }
    }

    getBottomStone() {
      if (this.row < this.board.size - 1) {
        return this.board.board[this.row + 1][this.col]
      } else {
        return null
      }
    }

    getLeftStone() {
      if (this.col > 0) {
        return this.board.board[this.row][this.col - 1]
      } else {
        return null
      }
    }

    getRightStone() {
      if (this.col < this.board.size - 1) {
        return this.board.board[this.row][this.col + 1]
      } else {
        return null
      }
    }

    getQi() {
      let qi = 0

      // check top
      if (this.row > 0) {
        if (!this.board.board[this.row-1][this.col]) {
          qi += 1
        }
      }

      // check left
      if (this.col > 0) {
        if (!this.board.board[this.row][this.col - 1]) {
          qi += 1
        }
      }

      // check right
      if (this.col < this.board.size - 1) {
        if (!this.board.board[this.row][this.col + 1]) {
          qi += 1
        }
      }

      // check bottom
      if (this.row < this.board.size - 1) {
        if (!this.board.board[this.row + 1][this.col]) {
          qi += 1
        }
      }

      return qi
    }

    // return how many stones are removed
    removeStones() {
      let count = 1
      this.board.removeStone(this.row, this.col)

      let top = this.getTopStone(),
          left = this.getLeftStone(),
          right = this.getRightStone(),
          bottom = this.getBottomStone()

      if (top && top.sameColor(this.color)) {
        count += top.removeStones()
      }

      if (left && left.sameColor(this.color)) {
        count += left.removeStones()
      }

      if (right && right.sameColor(this.color)) {
        count += right.removeStones()
      }

      if (bottom && bottom.sameColor(this.color)) {
        count += bottom.removeStones()
      }

      return count
    }
}

export default Stone
