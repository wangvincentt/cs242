let Simple = require('./simple.js')
import {Chat} from './chat.js'

class BoardMenu extends Simple{
  constructor(board) {
    super()
    this.board = board
  }

  render() {

    let $menu = $(`
<div class="board-menu">
  <div class="players">
    <div class="player">
      <div class="card black ${this.board.getColorForCurrentTurn() === 'black' ? 'this-turn' : ''}">
        <div class="profile-image"> </div>
        <p class="name"> ${this.board.playerColor === 'black' ? this.board.playerID : this.board.opponentID} </p>

        ${this.board.playerColor === 'black' ?
          (this.board.isMyTurn() ?
          ` <div class="button-group">
              <div class="pass"> <div class="btn pass-btn"> Pass </div> </div>
              <div class="resign"> <div class="btn resign-btn"> Resign </div> </div>
            </div>` : '<div class="button-group"> White to move</div>')
         : ''}

      </div>
    </div>
    <div class="player">
      <div class="card white ${this.board.getColorForCurrentTurn() === 'white' ? 'this-turn' : ''}">
        <div class="profile-image"> </div>
        <p class="name"> ${this.board.playerColor === 'white' ? this.board.playerID : this.board.opponentID} </p>

        ${this.board.playerColor === 'white' ?
          (this.board.isMyTurn() ?
          ` <div class="button-group">
              <div class="pass"> <div class="btn pass-btn"> Pass </div> </div>
              <div class="resign"> <div class="btn resign-btn"> Resign </div> </div>
            </div>` : '<div class="button-group"> Black to move </div>')
         : ''}
      </div>
    </div>
  </div>
</div>
`)

    $('.pass-btn', $menu).click(()=>{
      this.board.pass()
    })

    $('.resign-btn', $menu).click(()=>{
      this.board.resign()
    })

    // create Chat
    let chat = Chat({playerID: this.board.playerID, opponentID: this.board.opponentID})
    chat.appendTo($menu[0])

    return $menu
  }
}

module.exports = BoardMenu
