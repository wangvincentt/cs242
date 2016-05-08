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
  }
}

module.exports = userAPI
