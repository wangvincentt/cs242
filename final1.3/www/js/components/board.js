import Simple from '../Simple/Simple.js'
import emitter from '../emitters/emitter.js'

let Stone = Simple.Component({

})

let GridTouch = Simple.Component({
  emitter: emitter,
  init: function() {
    this.state = {
      hover: false,
      showIcon: false
    }
  },
  onClick: function(e) {
    e.preventDefault()
    e.stopPropagation()

    let row = this.props.row,
        col = this.props.col,
        board = this.props.board

    this.emit('board-put-stone', {row, col})
  },

  onMouseEnter: function() {
    this.setState({hover: true})
  },

  onMouseLeave: function() {
    this.setState({hover: false})
  },

  render: function() {
    let row = this.props.row,
        col = this.props.col,
        gridSize = this.props.gridSize,
        board = this.props.board

    let style = {
      width: gridSize,
      height: gridSize,
      // background: 'rgba(88, 149, 40, 0.5)'
    }

    if (row < board.size - 1 && col < board.size - 1) {
      style.left = -gridSize/2
      style.top = -gridSize/2
    } else if (row === board.size - 1 && col === board.size - 1) {
      style.right = -gridSize/2
      style.bottom = -gridSize/2
    } else if (row === board.size - 1) {
      style.left = -gridSize/2
      style.bottom = -gridSize/2
    } else if (col === board.size - 1) {
      style.right = -gridSize/2
      style.top = -gridSize/2
    }

    if (board.board[row][col]) {
      let s = board.board[row][col]
      style.backgroundImage = `url("${s.image}")`
      style.borderRadius = gridSize + 'px'

      let mark = null
      if (board.lastMove && board.lastMove[0] === row && board.lastMove[1] === col) {
        mark = this.div({ class: s.color === 'black' ? 'mark-w' : 'mark-b',
                          style: {
                            width: gridSize,
                            height: gridSize
                          }})
      }

      return  this.div({class: `stone ${s.color}`,
                        style: style},
                      mark)
    }

    if (this.state.showIcon) {
      return this.div({ class: this.state.showIcon,
                        style: style})
    }

    let dot = null

    if (board.size === 9) {
      if ((row === 2 || row === 6) && (col === 2 || col === 6) || (row === 4 && col === 4)) {
        dot = this.div({class: 'dot'})
      }
    }

    if (board.size === 13) {
      if ((row === 3 || row === 9) && (col === 3 || col === 9) || (row === 6 && col === 6)) {
        dot = this.div({class: 'dot'})
      }
    }

    if (board.size === 19) {
      if ((row === 3 || row === 9 || row === 15) && (col === 3 || col === 9 || col === 15) || (row === 9 && col === 9)) {
        dot = this.div({class: 'dot dot-19'})
      }
    }
    
    return this.div({ class: 'grid-touch',
                      style: style,
                      click: this.onClick.bind(this),
                      mouseenter: this.onMouseEnter.bind(this),
                      mouseleave: this.onMouseLeave.bind(this)},
                    dot,
                    ((this.state.hover && board.isMyTurn()) ?
                    this.div({class: `stone ${board.turn % 2 === 0 ? 'black' : 'white'}`,
                              style: {
                                width: gridSize,
                                height: gridSize,
                                borderRadius: gridSize+'px',
                                backgroundImage: `url("${board.getStoneImage()}")`,
                                opacity: 0.5
                              }})
                      : null))
  }
})

let GridRow = Simple.Component({
  render: function() {
    let row = this.props.row,
        i = row,
        board = this.props.board,
        boardSize = 664 - 96,
        gridSize = (boardSize) / (board.size - 1)

    let grids = []
    for (let j = 0; j < board.size - 1; j++) {
      grids.push(
        this.div({style: { width: gridSize, height: gridSize}, class: 'grid'},
          GridTouch({row: i, col: j, gridSize: gridSize, board: board}),
          (j === board.size - 2 ? GridTouch({row: i, col: j+1, gridSize: gridSize, board: board}) : null),
          (i === board.size - 2 ? GridTouch({row: i+1, col: j, gridSize: gridSize, board: board}) : null),
          ((i === board.size - 2 && j === board.size - 2) ? GridTouch({row: i+1, col: j+1, gridSize: gridSize, board: board}) : null)
        )
      )
    }
    return this.div({class: 'grid-row'}, grids)
  }
})

let Board = Simple.Component({
  emitter: emitter,
  getDefaultProps: function() {
    return {
      board: null
    }
  },
  init: function() {
    this.emit('board-register-self')
  },
  render: function() {
    let board = this.props.board

    let gridRow = []
    for (let i = 0; i < board.size - 1; i++) {
      gridRow.push(GridRow({row: i, board: board}))
    }
    return this.div({class: 'board'},
              gridRow)
  }
})

export default Board
