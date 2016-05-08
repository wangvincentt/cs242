import Simple from '../Simple/Simple.js'

import signupLogin from './signup_login.js'
import chat from './chat.js'
import menu from './menu.js'
import match from './match.js'

let emitter = Simple.createEmitter({
  playerID: null,
  MMR: 0,
  opponentID: null,
  board: null,
  chat: {
    messages: [], // {id, message, me}
    component: null
  },

  boardComponent: null,
  matchComponent: null,
  menuComponent: null,
  gameComponent: null
})

emitter.registerId('emitter')

emitter.on(signupLogin)
emitter.on(chat)
emitter.on(menu)
emitter.on(match)



export default emitter
