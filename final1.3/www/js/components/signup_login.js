'use strict'
import Simple from '../Simple/Simple.js'
import emitter from '../emitters/emitter.js'

let Signup_Login = Simple.Component({
  emitter: emitter,
  init: function() {
    this.state = {showLogin: true}
  },
  render: function() {
    return (
          this.div({class: 'signup-login-page'},
            this.div({class: 'container'},
              this.div({class: 'email field'},
                this.input({placeholder: 'Email', ref: 'email'})),
              this.div({class: `userID field ${this.state.showLogin?'hide':'show'}`},
                this.input({placeholder: 'User ID', ref: 'userID'})),
              this.div({class: 'password field'},
                this.input({placeholder: 'Password', type: 'password', ref: 'password'})),
              this.div({class: 'go', click: this.go.bind(this)}, 'Go'),
              this.a({class: 'switch', click: ()=> {this.setState({showLogin: !this.state.showLogin})}},
                (this.state.showLogin ? 'Don\'t have account yet? Click me' : 'Already have an account? Click me'))))
              )
  },
  go: function() {
    let email = this.refs.email.value,
        userID = this.refs.userID.value,
        password = this.refs.password.value

    if (this.state.showLogin) { // login
      // missing information
      if (!email.length || !password.length) {
        return
      }

      this.emit('login', {email, password})
    } else {
      // missing information
      if (!email.length || !userID.length || !password.length) {
        return
      }

      this.emit('signup', {email, userID, password})
    }
  }
})

export default Signup_Login
