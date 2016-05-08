import Simple from '../Simple/Simple.js'
import emitter from '../emitters/emitter.js'
import Signup_Login from './signup_login.js'
import Menu from './menu.js'
import Match from './match.js'

let Game = Simple.Component({
  emitter: emitter,
  getDefaultProps: function() {
    return {
      page: 'SHOW_LOGIN_SIGNUP',
      playerID: null,
      opponentID: null,
      MMR: 0,
      size: null,
      color: null,
      board: null
    }
  },
  init: function() {
    document.body.addEventListener('touchmove', function(e){ e.preventDefault()})
  },
  componentDidMount: function() {
    this.emit('check-auth')
  },
  render: function() {
    if (this.props.page === 'SHOW_LOGIN_SIGNUP') {
      return Signup_Login()
    } else if (this.props.page === 'SHOW_MENU') {
      return Menu({playerID: this.props.playerID, MMR: this.props.MMR})
    } else if (this.props.page === 'SHOW_MATCH') {
      return Match({board: this.props.board})
    }
  }
})

export default Game
