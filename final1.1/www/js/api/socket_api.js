'use strict'

let Board = require('../board.js')

if (!window.socket) {
  window.socket = io()
}

let socket = window.socket

let socketAPI = {
  inviteMatch: function(opponentID, size) {
    socket.emit('invite-match', opponentID, size)
  },

  sendMove: function(opponentID, row, col) {
    socket.emit('send-move', [opponentID, row, col])
  },

  userLoggedIn: function(userID) {
    socket.emit('user-logged-in', userID)
  },

  resign: function(userID, opponentID) {
    socket.emit('resign', userID, opponentID)
  },

  score: function(userID, opponentID) {
    socket.emit('score', userID, opponentID)
  }
}

/*
不再需要产生随机 ID
 */
/*
socket.on('generate-user-id', function(userID) {
  console.log('get userID: ', userID)
  $('.user-id').html('User ID: ' + userID)
})
*/

socket.on('opponent-not-found', function(opponentID) {
  alert('opponent ' + opponentID + ' not found')
})

socket.on('invitation-sent', function(opponentID) {
  alert('opponent ' + opponentID + ' not found')
})

socket.on('receive-match-invitation', function(opponentID) {
  alert('receive match invitation from ' + opponentID)
})

socket.on('start-match', function(data) {
  let size = data.size,
      color = data.color,
      opponentID = data.opponentID

  $('.menu').remove()
  window.gameManager.startNewMatch(size, color, opponentID)
})

socket.on('receive-move', function(data) {
  let row = data[0],
      col = data[1]

  if (row === -1 || col === -1) { // pass
    window.gameManager.board.nextTurn(true)
  } else {
    window.gameManager.board.addStone(row, col)
  }
})

socket.on('opponent-resign', function() {
  window.gameManager.board.opponentResign()
})

socket.on('opponent-score', function() {
  window.gameManager.board.score()
})

socket.on('opponent-disconnect', function(opponentID) {
  alert('opponent disconnect: ' + opponentID)
})

module.exports = socketAPI
