'use strict'

let userAPI = {
  signup: function(email, userID, password, callback) {
    $.ajax('/signup', {
      type: 'POST',
      dataType: 'json',
      data: {email, password, userID},
      success: function(res) {
        if (res) {
          if (callback) callback(res)
          else callback(null)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(null)
      }
    })
  },

  signin: function(email, password, callback) {
    $.ajax('/signin', {
      type: 'POST',
      dataType: 'json',
      data: {email, password},
      success: function(res) {
        if (res) {
          if (callback) callback(res)
          else callback(null)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(null)
      }
    })
  },

  checkAuth: function(callback) {
    $.ajax('/auth', {
      type: 'GET',
      dataType: 'json',
      success: function(res) {
        console.log('auth success', res)
        if (res) {
          if (callback) callback(res)
          else callback(null)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(null)
      }
    })
  },

  requestTop50Players: function(callback) {
    $.ajax('/top50', {
      type: 'GET',
      dataType: 'json',
      success: function(res) {
        console.log('get top 50 players', res)
        if (res) {
          if (callback) callback(res)
          else callback(null)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(null)
      }
    })
  },

  findRankedMatch: function({playerID, MMR, size}) {
    $.ajax('/find_ranked_match', {
      type: 'POST',
      dataType: 'json',
      data: {playerID, MMR, size}
    })
  },

  stopFindingRankedMatch: function({playerID}) {
    $.ajax('/stop_finding_ranked_match', {
      type: 'POST',
      dataType: 'json',
      data: {playerID}
    })
  },

  findPublicMatch: function({playerID, MMR, size}) {
    $.ajax('/find_public_match', {
      type: 'POST',
      dataType: 'json',
      data: {playerID, MMR, size}
    })
  },

  stopFindingPublicMatch: function({playerID}) {
    $.ajax('/stop_finding_public_match', {
      type: 'POST',
      dataType: 'json',
      data: {playerID}
    })
  },

  win: function({playerID, opponentID}) {
    $.ajax('/win_ranked', {
      type: 'POST',
      dataType: 'json',
      data: {playerID, opponentID}})
  },

  lose: function({playerID, opponentID}) {
    $.ajax('/lose_ranked', {
      type: 'POST',
      dataType: 'json',
      data: {playerID, opponentID}})
  }

}

export default userAPI
