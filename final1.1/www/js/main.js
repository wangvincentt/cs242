'use strict'
let Stone = require('./stone.js').Stone
let Board = require('./board.js')
let socketAPI = require('./api/socket_api.js')
let userAPI = require('./api/user_api.js')
let Menu = require('./menu.js')
let Signup_Login = require('./signup_login.js')
let BoardMenu = require('./board_menu.js')

class GameManager {
  constructor() {
    this.$game = $('.game')
    userAPI.checkAuth((res)=> {
      if (res && res.success) {
        this.playerID = res.userID
        // $('.user-id').html('User ID: ' + this.playerID)
        socketAPI.userLoggedIn(this.playerID)
        this.showMenu()
      } else {
        this.signup_login_page = new Signup_Login()
        this.signup_login_page.appendTo($('.game'))
      }
    })

    document.body.addEventListener('touchmove', function(e){ e.preventDefault()})

    // this.startNewMatch(19, 'white', 'opponentID')
  }

  setPlayerID(id) {
    this.playerID = id
  }

  startNewMatch(size, playerColor, opponentID) {
    this.board = new Board({  size,
                              playerColor,
                              playerID: this.playerID,
                              opponentID,
                              gameManager: this})
    this.board.render(this.$game)
    // this.board.appendTo(this.$game)

    this.boardMenu = new BoardMenu(this.board)
    this.boardMenu.appendTo(this.$game)
  }

  updateBoardMenu() {
    this.boardMenu.forceUpdate()
  }

  showMenu() {
    if (this.signup_login_page) {
      this.signup_login_page.remove()
      this.signup_login_page = null
    }

    if (this.board) {
      this.board.remove()
      this.board = null
    }

    if (this.boardMenu) {
      this.boardMenu.remove()
      this.boardMenu = null
    }

    // TODO: remove
    /*
    if (this.board) {
    }
    */

    this.menu = new Menu(this)
    this.menu.appendTo($('.game'))
  }
}

// 没什么卵用的 loading screen
$('.loading-screen .logo').fadeIn(1000, ()=> {
  setTimeout(()=> {
    $('.loading-screen .logo').fadeOut(1000, ()=> {
      $('.loading-screen').remove()
    })
  }, 1600)
})

window.gameManager = new GameManager()

// let board = new Board({size: 9})
//board.board[1][1] = {color: 'black'}
// board.score()
