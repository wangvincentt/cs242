import socketAPI from '../api/socket_api.js'
import userAPI from '../api/user_api.js'

let menu = {
  'request-top-50-players': function(data, component) {
    userAPI.requestTop50Players(function(res) {
      if (res && res.length) {
        component.setState({leaderboards: res})
      }
    })
  },

  'find-private-match': function({opponentID, size, color, komi}, component) {
    socketAPI.inviteMatch({opponentID, size, color, komi})
  },

  'start-finding-ranked-match': function({playerID, MMR, size}, component) {
    this.state.menuComponent = component
    userAPI.findRankedMatch({playerID, MMR, size})
  },

  'stop-finding-ranked-match': function({playerID}, component) {
    userAPI.stopFindingRankedMatch({playerID})
  },

  'start-finding-public-match': function({playerID, MMR, size}, component) {
    this.state.menuComponent = component
    userAPI.findPublicMatch({playerID, MMR, size})
  },

  'stop-finding-public-match': function({playerID}, component) {
    userAPI.stopFindingPublicMatch({playerID})
  }
}

export default menu
