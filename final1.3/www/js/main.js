'use strict'

import Simple from './Simple/Simple.js'
import Game from './components/game.js'
import Menu from './components/menu.js'

function preload() {
  let images = new Array()
	for (let i = 0; i < arguments.length; i++) {
		images[i] = new Image()
		images[i].src = arguments[i]
	}
  return images
}

// preload images for faster rendering
preload(
  './images/jie.png',
  './images/suicide.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/w1.png',
  './images/b.png',
  './images/mark_b.png',
  './images/mark_w.png',
  './images/default-user-64.png'
)

// loading screen
$('.loading-screen .logo').fadeIn(1000, ()=> {
  setTimeout(()=> {
    $('.loading-screen .logo').fadeOut(1000, ()=> {
      $('.loading-screen').remove()
    })
  }, 1600)
})

let game = Game()
Simple.render(Game(), document.getElementById('game'))
