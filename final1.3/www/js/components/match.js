import Simple from '../Simple/Simple.js'
import emitter from '../emitters/emitter.js'

import Board from './board.js'
import BoardMenu from './board_menu.js'

let Match = Simple.Component({
  emitter: emitter,
  getDefaultProps: function() {
    return {board: null, messages: []}
  },
  init: function() {
    this.emit('match-register-self')
  },
  // componentDidMount doesn't work
  render: function() {
    return this.div({class: 'match'},
            Board({board: this.props.board}),
            BoardMenu({board: this.props.board, messages: this.props.messages}))
  }
})

export default Match
