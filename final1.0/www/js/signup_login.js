'use strict'
let Simple = require('./simple.js')
let userAPI = require('./api/user_api.js')
let socketAPI = require('./api/socket_api.js')

class Signup_Login extends Simple {
  constructor() {
    super()
    this.state = {
      showLogin: true
    }
  }

  render() {
    let $email = $(`<div class="email field"> <input placeholder="Email" /> </div>`)
    let $userID = $(`<div class="userID field  ${this.state.showLogin?'hide':'show'}"> <input placeholder="User ID" /> </div>`)
    let $password = $('<div class="password field"> <input placeholder="Password" type="password" /> </div>')

    let $switch = $(`<a class="switch"> ${this.state.showLogin ? 'Don\'t have account yet? Click me ':'Already have an account? Click me'} </a>`)

    let $go = $('<div class="go"> Go </div>')

    let $container = $('<div class="container"></div>')

    $container.append($email)
    $container.append($userID)
    $container.append($password)
    $container.append($switch)
    $container.append($go)

    let $pageElement = $(`
      <div class="signup-login-page">
      </div>
      `)

    $pageElement.append($container)

    $switch.click(()=> {
      this.setState({showLogin: !this.state.showLogin})
    })

    $go.click(()=> {
      let email = $('input', $email).val().trim(),
          userID = $('input', $userID).val().trim(),
          password = $('input', $password).val()

      if (this.state.showLogin) { // login
        // missing information
        if (!email.length || !password.length) {
          return
        }
        console.log('login')
        userAPI.signin(email, password, (res)=> {
          console.log(res)
          if (!res) {
            alert('Failed to signin')
          } else {
            // $('.user-id').html('User ID: ' + res.userID)
            window.gameManager.setPlayerID(res.userID)
            window.gameManager.showMenu()
            socketAPI.userLoggedIn(res.userID)
          }
        })
      } else {
        // missing information
        if (!email.length || !userID.length || !password.length) {
          return
        }
        console.log('signup')
        userAPI.signup(email, userID, password, (res)=> {
          console.log(res)
          if (!res) {
            alert('Failed to signup')
          } else {
            // $('.user-id').html('User ID: ' + res.userID)
            window.gameManager.setPlayerID(res.userID)
            window.gameManager.showMenu()
            socketAPI.userLoggedIn(res.userID)
          }
        })
      }
    })

    return $pageElement
  }
}

module.exports = Signup_Login
