import socketAPI from '../api/socket_api.js'
import userAPI from '../api/user_api.js'

import Board from '../models/board.js'

let match = {
  'start-match': function({opponentID, size, color, komi, ranked}) {
    this.state.opponentID = opponentID
    this.state.board = new Board({playerID: this.state.playerID, opponentID, size, playerColor: color, komi, ranked})

    if (this.state.menuComponent) { // as componentDidUnmount is not implemented in Simple library...
      this.state.menuComponent.stopTimer()
    }

    let gameComponent = this.state.gameComponent
    gameComponent.setProps({page: 'SHOW_MATCH', board: this.state.board})
  },

  'match-register-self': function(data, component) {
    this.state.matchComponent = component
  },

  'board-register-self': function(data, component) {
    this.state.boardComponent = component
  },

  'board-put-stone': function({row, col}, component) {
    let board = this.state.board
    if (!board.isMyTurn()) return
    let res = board.addStone(row, col)

    if (res === true) {
      socketAPI.sendMove(this.state.opponentID, row, col)
      this.state.matchComponent.setProps({board: board, messages: this.state.chat.messages.slice(0)})
    } else {
      component.setState({'showIcon': res})

      setTimeout(()=> {
        component.setState({'showIcon': false})
      }, 2000)
    }
  },

  'board-receive-move': function({row, col}) {
    let board = this.state.board
    if (row === -1 || col === -1) { // pass
      board.nextTurn(true)
    } else {
      board.addStone(row, col)
    }
    this.state.matchComponent.setProps({board: board, messages: this.state.chat.messages.slice(0)})
  },

  'pass': function() {
    this.state.board.pass()
    this.state.matchComponent.setProps({board: this.state.board, messages: this.state.chat.messages.slice(0)})
  },

  'resign': function() {
    this.state.board.resign()
  },

  'opponent-score': function() {
    this.state.board.score()
  },

  'opponent-resign': function() {
    this.state.board.opponentResign()
  }

}

export default match
