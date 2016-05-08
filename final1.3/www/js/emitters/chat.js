import socketAPI from '../api/socket_api.js'
import userAPI from '../api/user_api.js'

let chat = {
  'chat-register-self': function(data, component) {
    this.state.chat.component = component
  },

  'send-message': function({message}, component) {
    let playerID = this.state.playerID,
        opponentID = this.state.opponentID

    socketAPI.sendMessage({ playerID, opponentID, message })
    let messages = this.state.chat.messages
    messages.push({id: playerID, message: message, me: true})
    component.setProps({playerID, opponentID, messages})
  },

  'receive-message': function({opponentID, message}) {
    let messages = this.state.chat.messages,
        playerID = this.state.playerID

    messages.push({id: opponentID, message: message, me: false})

    if (this.state.chat.component) {
      this.state.chat.component.setProps({playerID, opponentID, messages: messages.slice(0)})
    }
  }
}

export default chat
