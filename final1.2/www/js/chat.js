let socketAPI = require('./api/socket_api.js')
import Simple from 'Simple'

let chatEmitter = Simple.Emitter({
  messages: [],
  playerID: null,
  opponentID: null
})

chatEmitter.registerId('chat')

chatEmitter.on('register-self', function({playerID, opponentID}, component) {
  this.state.playerID = playerID
  this.state.opponentID = opponentID
  this.state.component = component
})

chatEmitter.on('send-message', function({playerID, opponentID, message}, component) {
  socketAPI.sendMessage({playerID, opponentID, message, chatEmitter: this})

  this.state.messages.push({id: playerID, message: message, me: true})
  this.state.playerID = playerID
  this.state.opponentID = opponentID

  component.setProps(this.state)
})

chatEmitter.on('receive-message', function({opponentID, message}) {
  console.log('receive message', {opponentID, message})
  this.state.messages.push({id: opponentID, message: message, me: false})

  if (this.state.component) {
    this.state.component.setProps(this.state)
  }
})

let Message = Simple.Component(function(props) {
  let id = props.id,
      message = props.message,
      me = props.me
  return this.div({class: 'message-box ' + (me?'me':'')},
            this.p({class: 'id'}, `${id}:`),
            this.p({class: 'message'}, message))
})

let Chat = Simple.Component({
  emitter: chatEmitter,
  getDefaultProps: function() {
    return {
      playerID: null,
      opponentID: null,
      messages: []
    }
  },
  init: function() {
    this.emit('register-self', {playerID: this.props.playerID, opponentID: this.props.opponentID})
  },
  onInput: function(e) {
    if (e.which === 13) {
      let message = e.target.value.trim()
      if (!message) return
      this.emit('send-message', { playerID: this.props.playerID,
                                  opponentID: this.props.opponentID,
                                  message: message})
      e.target.value = ''
    }
  },

  render: function() {
    let messagesDom = []
    for (let i = this.props.messages.length - 1; i >= 0; i--) {
      messagesDom.push(Message(this.props.messages[i]))
    }
    return this.div({class: 'chat-div'},
              this.div({class: 'chat-content'},
                messagesDom),
              this.div({class: 'input-box'},
                this.input({placeholder: 'enter your chat message here',
                            keypress: this.onInput.bind(this)})))
  }
})

export {Chat, chatEmitter}
