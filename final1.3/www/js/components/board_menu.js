import Simple from '../Simple/Simple.js'
import Chat from './chat.js'
import emitter from '../emitters/emitter.js'

let Card = Simple.Component(function({board, color}) {
  return this.div({class: `card ${color} ${board.getColorForCurrentTurn() === color ? 'this-turn' : ''}`},
            this.div({class: 'profile-image'}),
            this.p({class: 'name'}, board.playerColor === color ? board.playerID : board.opponentID),
            (board.playerColor === color ?
            (board.isMyTurn() ?
            this.div({class: 'button-group'},
              this.div({class: 'pass'},
                this.div({class: 'btn pass-btn', click: ()=> {emitter.emit('pass')}}, 'Pass')),
              this.div({class: 'resign'},
                this.div({class: 'btn resign-btn', click: ()=> {emitter.emit('resign')} }, 'Resign'))) :
            this.div({class: 'button-group'}, color === 'black' ? 'White to move' : 'Black to move' )) : null))
})

/**
 * Require props:
 * 		playerID
 * 		opponentID
 * 		board
 */
let BoardMenu = Simple.Component({
  getDefaultProps: function() {
    return {messages: []}
  },
  render: function() {
    return this.div({class: 'board-menu'},
              this.div({class: 'players'},
                this.div({class: 'player'},
                  Card({board: this.props.board, color: 'black'})),
                this.div({class: 'player'},
                  Card({board: this.props.board, color: 'white'}))),
              Chat({playerID: this.props.board.playerID,
                    opponentID: this.props.board.opponentID,
                    messages: this.props.messages }))
  }
})

export default BoardMenu
