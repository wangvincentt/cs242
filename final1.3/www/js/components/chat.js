import Simple from '../Simple/Simple.js'
import emitter from '../emitters/emitter.js'

let Message = Simple.Component(function(props) {
  let id = props.id,
      message = props.message,
      me = props.me
  return this.div({class: 'message-box ' + (me?'me':'')},
            this.p({class: 'id'}, `${id}:`),
            this.p({class: 'message'}, message))
})

/**
 *
 * Require props:
 * 		playerID
 *   	opponentID
 *   	messages
 */
let Chat = Simple.Component({
  emitter: emitter,
  getDefaultProps: function() {
    return {
      messages: []
    }
  },
  init: function() {
    this.emit('chat-register-self')
  },
  //componentDidMount: function() {
  //},
  onInput: function(e) {
    if (e.which === 13) {
      let message = e.target.value.trim()
      if (!message) return
      this.emit('send-message', { message })
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

export default Chat
