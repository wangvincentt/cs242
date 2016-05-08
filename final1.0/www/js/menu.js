'use strict'
let socketAPI = require('./api/socket_api.js')
let Simple = require('./simple.js')

class Menu extends Simple {
  constructor(gameManager) {
    super()
    this.gameManager = gameManager

    this.state = {
      showBoardSize: false
    }
  }

  render() {
    if (this.state.showBoardSize) {
      let $menu = $( `<div class="menu">
                      <p class="menu-title"> Board Size </p>
                      <div class="button play" size="19"> <span size="19"> 19x19 </span> </div>
                      <div class="button play" size="13"> <span size="13"> 13x13 </span> </div>
                      <div class="button play" size="9"> <span size="9"> 9x9 </span> </div>
                      <div class="button back"> <span> Back </span> </div>
                    </div>`)

      $('.play', $menu).click((event)=> {
        let size = parseInt(event.target.getAttribute('size'))

        let opponentID = prompt('enter opponent id')
        socketAPI.inviteMatch(opponentID, size)
      })

      $('.back', $menu).click((event)=> {
        this.setState({showBoardSize: false})
      })

      return $menu
    } else {
      let $menu = $(` <div class="menu">
                        <p class="menu-title"> Go! ${this.gameManager.playerID} </p>
                        <div class="button private-match"> <span> Private Match </span> </div>
                        <div class="button public-match"> <span> Public Match </span> </div>
                        <div class="button"> <span> Bot Match </span> </div>
                      </div>`)

      $('.private-match', $menu).click(()=> {
        this.setState({showBoardSize: true})
      })

      $('.public-match', $menu).click(()=> {
        console.log('public match')
      })

      return $menu
    }
  }
}

module.exports = Menu
