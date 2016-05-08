import History from './history.js'
import Stone from './stone.js'

import socketAPI from '../api/socket_api.js'
import userAPI from '../api/user_api.js'

// go board class
class Board {
  // 9x9 13x13 19x19
  constructor({size, playerColor, playerID, opponentID, komi, ranked}) {
    this.size = parseInt(size) || 19
    this.playerColor = playerColor || 'black'
    this.playerID = playerID || null
    this.opponentID = opponentID || null
    this.komi = komi || 0
    this.ranked = ranked || false

    this.board = []

    this.turn = 0
    this.history = new History()

    this.justPass = false

    this.lastMove = null // [row, col]

    // create board data
    for (let i = 0; i < this.size; i++) {
      this.board.push([])

      for (let j = 0; j < this.size; j++) {
        this.board[i].push(null)
      }
    }

    this.history.add(this.board)
  }

  // mark all stones as unchecked
  markAllStonsUncheckd() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j]) {
          this.board[i][j].checked = false
        }
      }
    }
  }

  getColorForCurrentTurn() {
    if (this.turn % 2 === 0) {
      return 'black'
    } else {
      return 'white'
    }
  }

  isMyTurn() {
    return this.getColorForCurrentTurn() === this.playerColor
  }

  getStoneImage() {
    if (this.turn % 2 === 0) {
      return './images/b.png'
    } else {
      return `./images/w${Math.floor(Math.random() * 15 + 1)}.png`
    }
  }

  nextTurn(justPass) {
    this.justPass = justPass
    this.turn += 1
    this.markAllStonsUncheckd()
  }

  addStone(row, col) {
    if (this.board[row][col]) return

    let color = this.getColorForCurrentTurn()
    let stone = new Stone({board: this, row, col, color})

    this.board[row][col] = stone // set to Go board

    this.turn += 1

    return this.checkCapture(row, col)
  }

  removeStone(row, col) {
    if (this.board[row][col]) {
      this.board[row][col] = null
    }
  }

  score() {
    let boardData = []
    // initialize flood fill data structure
    for (let i = 0; i < this.size; i++) {
      boardData.push([])
      for (let j = 0; j < this.size; j++) {
        boardData[i][j] = {white : false, black : false, visited : false}
        if (this.board[i][j]) {
          if (this.board[i][j].color === 'white') {
            boardData[i][j].white = true
          }
          else {
            boardData[i][j].black = true
          }
        }
      }
    }

    // flood fill algorithm
    let scoreFloodFill = (i, j, color)=> {
      if (i >= 0 && i < this.size && j >= 0 && j < this.size) {
        if (this.board[i][j]) return
        if (boardData[i][j][color]) return
        boardData[i][j][color] = true
        boardData[i][j].visited = true
        scoreFloodFill(i, j+1, color)
        scoreFloodFill(i, j-1, color)
        scoreFloodFill(i+1, j, color)
        scoreFloodFill(i-1, j, color)
      }
    }

      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (!boardData[i][j].visited && this.board[i][j]) {
            boardData[i][j].visited = true
            scoreFloodFill(i, j+1, this.board[i][j].color)
            scoreFloodFill(i, j-1, this.board[i][j].color)
            scoreFloodFill(i+1, j, this.board[i][j].color)
            scoreFloodFill(i-1, j, this.board[i][j].color)
          }
        }
      }


    let whiteScore = 0,
        blackScore = 0

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (boardData[i][j].white && boardData[i][j].black) continue
        else if (boardData[i][j].white) whiteScore++
        else if (boardData[i][j].black) blackScore++
        else continue
      }
    }

    // console.log(boardData)
    console.log(whiteScore)
    console.log(blackScore)

    /**toastr.success**/alert(`white score: ${whiteScore}+${this.komi}=${whiteScore+this.komi}, black score: ${blackScore}`)

    if (this.ranked) {
      let w = whiteScore + this.komi,
          b = blackScore
      if (this.playerColor === 'white') {
        if (w < b) { // lose
          userAPI.lose({playerID: this.playerID, opponentID: this.opponentID})
        } else if (w > b) { // win
          userAPI.win({playerID: this.playerID, opponentID: this.opponentID})
        }
      } else {
        if (b < w) { // lose
          userAPI.lose({playerID: this.playerID, opponentID: this.opponentID})
        } else if (b > w) { // win
          userAPI.win({playerID: this.playerID, opponentID: this.opponentID})
        }
      }
    }

    location.reload()
  }

  pass() {
    console.log('pass')
    if (this.justPass) {
      this.score()
      socketAPI.score(this.playerID, this.opponentID)
      return
    }

    if (this.opponentID) {
      socketAPI.sendMove(this.opponentID, -1, -1)
    }

    this.nextTurn()
  }

  resign() {
    console.log('resign')
    socketAPI.resign(this.playerID, this.opponentID)
    /**toastr.info**/alert('You resigned')

    if (this.ranked) {
      userAPI.lose({playerID: this.playerID, opponentID: this.opponentID})
    }

    location.reload()
  }

  opponentResign() {
    /**toastr.info**/alert('Opponent ' + this.opponentID + ' resigned')

    if (this.ranked) {
      userAPI.win({playerID: this.playerID, opponentID: this.opponentID})
    }

    location.reload()
  }

  // check if two boards have the same.
  twoBoardsEqual(board) {
    let board1 = this.board
    let board2 = board

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let stone1 = board1[i][j]
        let stone2 = board2[i][j]

        if (!stone1 && !stone2) {
          continue
        } else if (stone1 && stone2 && stone1.color === stone2.color) {
          continue
        } else {
          return false
        }
      }
    }
    return true
  }

  // return true if it's a legal move
  // otherwise return 'jie' or 'suicide'
  checkCapture(row, col) {
    let color = this.getColorForCurrentTurn()
    let last = this.history.get(-1)

    // check opponent
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let stone = this.board[i][j]
        if (stone && !stone.checked && stone.sameColor(color)) {
          if (stone.hasNoQi()) {
            this.board[i][j] = null  // not remove dom yet
            if (this.twoBoardsEqual(last)) {
              console.log('打劫！')
              this.board[i][j] = stone // restore
              this.removeStone(row, col)
              this.turn -= 1
              this.markAllStonsUncheckd()
              return 'jie'
            } else {
              this.board[i][j] = stone // restore. Have to restore first.
              stone.removeStones()
            }
          }
        }
      }
    }

    // check self
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let stone = this.board[i][j]
        if (stone && !stone.checked) {
          // console.log('@@ check ' + i + ' ' + j)
          if (stone.hasNoQi()) {
            // suicide
            // TODO: hint user not to put stone this way
            // console.log('@@ no qi ' + i + ' ' + j)
            console.log('suicide')
            this.removeStone(row, col) // restore
            this.turn -= 1
            this.markAllStonsUncheckd()
            return 'suicide'
          }
        }
      }
    }

    this.markAllStonsUncheckd()
    this.history.add(this.board) // save to history

    this.justPass = false

    this.lastMove = [row, col]
    return true
  }
}

module.exports = Board
