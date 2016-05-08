'use strict'

class History {
  constructor() {
    this.history = []
  }

  add(board) {
    let b = []
    for (let i = 0; i < board.length; i++) {
      b.push([])
      for (let j = 0; j < board[i].length; j++) {
        b[i].push(board[i][j])
      }
    }
    this.history.push(b)
  }

  pop() {
    this.history.pop()
  }

  get(num) {
    if (num >= 0) {
      return this.history[num]
    } else {
      return this.history[this.history.length - 1 + num]
    }
  }
}

module.exports = {
  History
}
