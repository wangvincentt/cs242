/*
  My Simple and silly front end library called "Simple"
 */
class Simple {
  constructor() {
    this.state = {}
    this.$el = null
  }

  setState(newState) {
    // copy state and then rerender dom element
    for (let key in newState) {
      this.state[key] = newState[key]
    }

    this.forceUpdate()
  }

  forceUpdate() {
    let $new = this._render()

    if (this.$el) {
      this.$el.replaceWith($new)
      this.$el = $new
    } else {
      this.$el = $new
    }
  }

  _render() {
    let res = this.render()
    if (typeof(res) === 'string') {
      return $(res)
    } else {
      return res
    }
  }

  appendTo($element) {
    if (!this.$el) {
      this.$el = this._render()
    }
    $element.append(this.$el)
  }

  remove() {
    if (this.$el) {
      this.$el.remove()
      this.$el = null
    }
  }

  render() {
    throw 'Simple Exception: render function not implemented'
    return null
  }
}

module.exports = Simple
