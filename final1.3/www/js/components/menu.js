import Simple from '../Simple/Simple.js'
import emitter from '../emitters/emitter.js'

let Menu = Simple.Component({
  emitter: emitter,
  getDefaultProps: function() {
    return {playerID: null, MMR: 0}
  },
  init: function() {
    /**
     *  MAIN_MENU
     *  SHOW_BOARD_SIZE
     *  SHOW_MATCH_OPTIONS
     *  SHOW_LEARDERBOARDS
     *  SHOW_PUBLIC_MATCH
     *  SHOW_RANKED_MATCH
     *  RANKED_MATCH_FINDING_GAME
     *  PUBLIC_MATCH_FINDING_GAME
     */
    this.state = {  page: 'MAIN_MENU',
                    size: null,
                    color: 'black',
                    komi: 5.5,
                    opponentID: '',
                    leaderboards: [],
                    time: 0}
  },

  selectBoardSize: function(size, e) {
    e.stopPropagation()
    e.preventDefault()
    this.state.size = size
    this.setState({page: 'SHOW_MATCH_OPTIONS'})
  },
  rankedSelectBoardSize: function(size) {
    this.emit('start-finding-ranked-match', {playerID: this.props.playerID, MMR: this.props.MMR, size})

    this.setState({page: 'RANKED_MATCH_FINDING_GAME'})

    let time = 0
    this.interval = setInterval(()=> {
      time += 1
      this.setState({time})
    }, 1000)
  },
  stopFindingRankedMatch: function() {
    this.emit('stop-finding-ranked-match', {playerID: this.props.playerID})

    clearInterval(this.interval)
    this.setState({page: 'SHOW_RANKED_MATCH', time: 0})
  },
  stopTimer: function() {
    clearInterval(this.interval)
  },
  publicSelectBoardSize: function(size) {
    this.emit('start-finding-public-match', {playerID: this.props.playerID, MMR: this.props.MMR, size})

    this.setState({page: 'PUBLIC_MATCH_FINDING_GAME'})

    let time = 0
    this.interval = setInterval(()=> {
      time += 1
      this.setState({time})
    }, 1000)
  },
  stopFindingPublicMatch: function() {
    this.emit('stop-finding-public-match', {playerID: this.props.playerID})

    clearInterval(this.interval)
    this.setState({page: 'SHOW_PUBLIC_MATCH', time: 0})
  },
  selectColor: function(color) {
    this.setState({color})
  },
  showBoardSize: function(e) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({page: 'SHOW_BOARD_SIZE'})
  },
  play: function(mode) {
    let komi = this.refs.komi.value

    if (isNaN(komi) || komi.trim() === '') {
      toastr.warning('komi ' + komi + ' is an invalid number')
      return
    }

    komi = Number(komi)

    let opponentID = this.refs.opponentID.value
    if (!opponentID) {
      toastr.warning('please enter opponent ID')
      return
    }

    this.state.komi = komi
    this.state.opponentID = opponentID

    let size = this.state.size,
        color = this.state.color

    if (color === 'random') {
      if (Math.random() < 0.5) {
        color = 'black'
      } else {
        color = 'white'
      }
    }

    this.emit('find-private-match', {opponentID, size, color, komi})
  },

  showLeaderboards: function() {
    this.emit('request-top-50-players')
    this.setState({page: 'SHOW_LEARDERBOARDS'})
  },

  showPublicMatch: function() {
    this.setState({page: 'SHOW_PUBLIC_MATCH'})
  },

  showRankedMatch: function() {
    this.setState({page: 'SHOW_RANKED_MATCH'})
  },

  MMRNotHightEnough: function() {
    toastr.warning('Sorry, you MMR ' + this.props.MMR + ' is not high enough to challenge this board size')
  },

  render: function() {
    if (this.state.page === 'SHOW_MATCH_OPTIONS') {
      return this.div({class: 'menu'},
                this.div({class: 'pick-opponent'},
                  this.p({class: 'title'}, 'Opponent ID'),
                  this.input({placeholder: 'opponent id here', value: this.state.opponentID, ref: 'opponentID', input: ()=> {this.state.opponentID = this.refs.opponentID.value}})),
                this.div({class: 'pick-color'},
                  this.p({class: 'title'}, 'Your Color'),
                  this.div({class: 'color-group'},
                    this.div({class: 'black color ' + (this.state.color === 'black' ? 'selected' : ''), click: this.selectColor.bind(this, 'black')}, this.span('Black')),
                    this.div({class: 'white color ' + (this.state.color === 'white' ? 'selected' : ''), click: this.selectColor.bind(this, 'white')}, this.span('White')),
                    this.div({class: 'random color ' + (this.state.color === 'random' ? 'selected' : ''), click: this.selectColor.bind(this, 'random')}, this.span('Random')))),
                this.div({class: 'pick-komi'},
                  this.p({class: 'title'}, 'Komi'),
                  this.input({value: this.state.komi, ref: 'komi'})),
                this.div({class: 'bottom-button-group'},
                  this.div({class: 'small-btn', click: this.showBoardSize.bind(this)},
                    this.span('back')),
                  this.div({class: 'small-btn play', click: this.play.bind(this, 'private')},
                    this.span('play'))))
    } else if (this.state.page === 'SHOW_BOARD_SIZE') {
       return this.div({class: 'menu'},
                this.p({class: 'menu-title'}, 'Board Size'),
                this.div({class: 'button play', size: '19', click: this.selectBoardSize.bind(this, 19)},
                  this.span({size: '19'}, '19x19')),
                this.div({class: 'button play', size: '13', click: this.selectBoardSize.bind(this, 13)},
                  this.span({size: '13'}, '13x13')),
                this.div({class: 'button play', size: '9', click: this.selectBoardSize.bind(this, 9)},
                  this.span({size: '9'}, '9x9')),
                this.div({class: 'button back', click: ()=> {this.setState({page: 'MAIN_MENU'})}},
                  this.span('Back')))
    } else if (this.state.page === 'SHOW_LEARDERBOARDS') {
      let leaderboards = this.state.leaderboards.sort((x, y) => x.MMR < y.MMR) // sort by MMR
      let list = leaderboards.map(l => {
        return this.div({class: 'player ' + (l.userID === this.props.playerID ? 'me' : '')},
                  this.p({class: 'ID'}, 'ID: ',
                    this.span(l.userID)),
                  this.p({class: 'MMR'}, l.MMR))
      })
      return this.div({class: 'leaderboards'},
              this.p({class: 'title'}, 'Your MMR is ', this.span(this.props.MMR)),
              this.div({class: 'list'}, list),
              this.div({class: 'btn', click: ()=> {this.setState({page: 'MAIN_MENU'})}}, this.span('Back')))

    } else if (this.state.page === 'SHOW_RANKED_MATCH') {
      return this.div({class: 'menu ranked'},
               this.p({class: 'menu-title'}, 'Board Size'),
               this.div({class: 'button play' + (this.props.MMR < 1600 ? ' locked' : '' ), size: '19', click: (this.props.MMR < 1600 ? this.MMRNotHightEnough.bind(this) : this.rankedSelectBoardSize.bind(this, 19))},
                 this.span({size: '19'}, '19x19')),
               this.div({class: 'button play' + (this.props.MMR < 1300 ? ' locked' : '' ), size: '13', click: (this.props.MMR < 1300 ? this.MMRNotHightEnough.bind(this) : this.rankedSelectBoardSize.bind(this, 13))},
                 this.span({size: '13'}, '13x13')),
               this.div({class: 'button play', size: '9', click: this.rankedSelectBoardSize.bind(this, 9)},
                 this.span({size: '9'}, '9x9')),
               this.div({class: 'button back', click: ()=> {this.setState({page: 'MAIN_MENU'})}},
                 this.span('Back')))
    } else if (this.state.page === 'RANKED_MATCH_FINDING_GAME') {
      return this.div({class: 'menu ranked'},
                this.p({style: 'font-size: 32px;'}, 'Finding Match ...'),
                this.p({style: 'font-size: 18px; margin-left: 32px;'}, `${this.state.time}s`),
                this.div({click: this.stopFindingRankedMatch.bind(this), style: 'padding: 12px; border: 2px solid white; width: 143px; text-align: center; margin-top: 32px; cursor: pointer;'}, 'Stop Finding Match'))
    } else if (this.state.page === 'SHOW_PUBLIC_MATCH') {
      return this.div({class: 'menu public'},
               this.p({class: 'menu-title'}, 'Board Size'),
               this.div({class: 'button play', size: '19', click: this.publicSelectBoardSize.bind(this, 19)},
                 this.span({size: '19'}, '19x19')),
               this.div({class: 'button play', size: '13', click: this.publicSelectBoardSize.bind(this, 13)},
                 this.span({size: '13'}, '13x13')),
               this.div({class: 'button play', size: '9', click: this.publicSelectBoardSize.bind(this, 9)},
                 this.span({size: '9'}, '9x9')),
               this.div({class: 'button back', click: ()=> {this.setState({page: 'MAIN_MENU'})}},
                 this.span('Back')))
    } else if (this.state.page === 'PUBLIC_MATCH_FINDING_GAME') {
      return this.div({class: 'menu public'},
                this.p({style: 'font-size: 32px;'}, 'Finding Match ...'),
                this.p({style: 'font-size: 18px; margin-left: 32px;'}, `${this.state.time}s`),
                this.div({click: this.stopFindingPublicMatch.bind(this), style: 'padding: 12px; border: 2px solid white; width: 143px; text-align: center; margin-top: 32px; cursor: pointer;'}, 'Stop Finding Match'))
    } else {// if (this.state.page === 'MAIN_MENU') {
      return this.div({class: 'menu'},
                this.p({class: 'menu-title'}, `Go! ${this.props.playerID}`),
                this.div({class: 'button private-match',
                          click: ()=> {this.setState({page: 'SHOW_BOARD_SIZE'})}},
                  this.span('Private Match')),
                this.div({class: 'button public-match', click: this.showPublicMatch.bind(this)},
                  this.span('Public Match')),
                this.div({class: 'button', click: this.showRankedMatch.bind(this)},
                  this.span('Ranked Match')),
                this.div({class: 'button', click: this.showLeaderboards.bind(this)},
                  this.span('Leaderboards')))
    }
  }
})

export default Menu
