'use strict'

let express = require('express'),
    app = express(),
    http = require('http').Server(app),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    db_User = require('./schema/User.js'),
    io = require('socket.io')(http)


let crypto = require('crypto'),
    algorithm = 'aes-256-ctr'
function encrypt(text){
  var cipher = crypto.createCipher(algorithm, "asdfnjksaQW");
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

let socketMap = {} // key is userID, value is socket
let inGame = {}

app.use(session({
  secret: '1234567890QWERTY',
}))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/www'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/www/index.html')
})

app.get('/auth', function(req, res) {
  let userID = req.session.userID
  if (userID) {
    db_User.findOne({userID}, function(err, user) {
      res.json({success: true, userID: user.userID, MMR: user.MMR})
    })
  } else {
    res.send('null')
  }
})

app.post('/signin', function(req, res) {
  console.log(req.session.userID)
  let post = req.body,
      email = post.email,
      password = post.password

  if (password) password = encrypt(password)

  console.log(email, password)

  db_User.find({email, password}, function(error, users) {
    if (error || !users || users.length === 0) {
      console.log('signin error')
      res.send('null')
    } else {
      console.log('signin successfully')
      req.session.userID = users[0].userID
      res.json({success: true, userID: users[0].userID, MMR: users[0].MMR})
    }
  })
})

app.post('/signup', function(req, res) {
  let post = req.body,
      email = post.email,
      password = post.password,
      userID = post.userID

  if (password) password = encrypt(password)

  let newUser = db_User({
    email,
    password,
    userID
  })

  newUser.save(function(error) {
    if (error) {
      console.log('signup error', error)
      res.send('null')
    } else {
      console.log('signup successfully')
      req.session.userID = userID
      res.json({success: true, userID: userID, MMR: 1000})
    }
  })
})

app.get('/top50', function(req, res) {
  db_User
    .find({})
    .sort({'MMR': -1})
    .limit(50)
    .exec(function(err, users) {
      if (err) {
        console.log('failed to get top50 users', err)
        res.send('null')
      } else {
        res.json(users.map((user) => {return {userID: user.userID, MMR: user.MMR}} ))
      }
    })
})

app.get('/logout', function(req, res) {
  delete(req.session.userID)
  res.send({success: true})
})


// Ranked Match
let rankedMatchPool = {} // key is playerID, value is {MMR, size}
app.post('/find_ranked_match', function(req, res) {
  let playerID = req.body.playerID,
      MMR = req.body.MMR,
      size = req.body.size

  for (let key in rankedMatchPool) {
    let mmr = rankedMatchPool[key].MMR,
        s = rankedMatchPool[key].size
    if (Math.abs(MMR - mmr) < 100 && s === size) {
      console.log('ranked match: find opponent')
      let color = Math.random() < 0.5 ? 'black' : 'white'
      socketMap[playerID].emit('start-match', {size: size, color: color, opponentID: key, komi: 5.5, ranked: true})
      socketMap[key].emit('start-match', {size: size, color: (color === 'white' ? 'black' : 'white'), opponentID: playerID, komi: 5.5, ranked: true})

      inGame[playerID] = true
      inGame[key] = true

      delete(rankedMatchPool[playerID])
      delete(rankedMatchPool[key])

      return
    }
  }

  // didn't find suitable opponent
  rankedMatchPool[playerID] = {MMR, size}
})

app.post('/stop_finding_ranked_match', function(req, res) {
  let playerID = req.body.playerID

  delete(rankedMatchPool[playerID])
})

// public match
let publicMatchPool = {} // key is playerID, value is {MMR, size}
app.post('/find_public_match', function(req, res) {
  let playerID = req.body.playerID,
      MMR = req.body.MMR,
      size = req.body.size

  for (let key in publicMatchPool) {
    let mmr = publicMatchPool[key].MMR,
        s = publicMatchPool[key].size
    if (Math.abs(MMR - mmr) < 200 && s === size) {
      console.log('public match: find opponent')
      let color = Math.random() < 0.5 ? 'black' : 'white'
      socketMap[playerID].emit('start-match', {size: size, color: color, opponentID: key, komi: 5.5, ranked: false})
      socketMap[key].emit('start-match', {size: size, color: (color === 'white' ? 'black' : 'white'), opponentID: playerID, komi: 5.5, ranked: false})

      inGame[playerID] = true
      inGame[key] = true

      delete(publicMatchPool[playerID])
      delete(publicMatchPool[key])

      return
    }
  }

  // didn't find suitable opponent
  publicMatchPool[playerID] = {MMR, size}
})

app.post('/stop_finding_public_match', function(req, res) {
  let playerID = req.body.playerID

  delete(publicMatchPool[playerID])
})

app.post('/win_ranked', function(req, res) {
  let playerID = req.body.playerID,
      opponentID = req.body.opponentID
  db_User.findOne({userID: playerID}, function(err, user) {
    user.MMR += 24
    user.save()
  })
})

app.post('/lose_ranked', function(req, res) {
  let playerID = req.body.playerID,
      opponentID = req.body.opponentID
  db_User.findOne({userID: playerID}, function(err, user) {
    user.MMR -= 25
    user.save()
  })})

// helper functions
function makeid() {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


// socket.io
io.on('connection', function(socket) {
  console.log('user connect: ' + socket.id)

  socket.on('user-logged-in', function(userID) {
    socket.userID = userID
    socketMap[userID] = socket
  })

  socket.on('invite-match', function(opponentID, size, color, komi) {
    if (opponentID === socket.userID) return

    if (inGame[opponentID]) {
      socket.emit('opponnet-in-game', opponentID)
      return
    }

    if (socketMap[opponentID]) {
      // TODO: assume after sent, accpet immediately...
      socketMap[opponentID].emit('receive-match-invitation', opponentID, socket.userID, size, (color === 'white' ? 'black' : 'white'), komi)
      socket.emit('invitation-sent', opponentID)
      return
    } else { // not found
      socket.emit('opponent-not-found', opponentID)
    }
  })

  socket.on('accept-invitation', function(data) {
    let playerID = socket.userID,
        opponentID = data.opponentID,
        size = data.size,
        color = data.color,
        komi = data.komi

    if (inGame[opponentID]) {
      socket.emit('opponnet-in-game', opponentID)
      return
    }

    if (socketMap[opponentID]) {
      // assume I am black and opponent is white
      socket.emit('start-match', {size: size, color: color, opponentID: opponentID, komi: komi, ranked: false})
      socketMap[opponentID].emit('start-match', {size: size, color: (color === 'white' ? 'black' : 'white'), opponentID: socket.userID, komi: komi, ranked: false})

      inGame[socket.userID] = true
      inGame[opponentID] = true
    } else {
      socket.emit('opponent-not-found', opponentID)
    }
  })

  socket.on('send-move', function(data) {
    let opponentID = data[0],
        row = data[1],
        col = data[2]
    if (socketMap[opponentID]) {
      socketMap[opponentID].emit('receive-move', [row, col])
    } else {
      socket.emit('opponent-disconnect', opponentID)
    }
  })

  // userID resign
  socket.on('resign', function(userID, opponentID) {
    if (socketMap[opponentID]) {
      socketMap[opponentID].emit('opponent-resign', userID)
    } else {
      socket.emit('opponent-disconnect')
    }
  })

  // userID pass twice. so opponentID should score
  socket.on('score', function(userID, opponentID) {
    if (socketMap[opponentID]) {
      socketMap[opponentID].emit('opponent-score', userID)
    } else {
      socket.emit('opponent-disconnect')
    }
  })

  socket.on('send-message', function(userID, opponentID, message) {
    if (socketMap[opponentID]) {
      socketMap[opponentID].emit('receive-message', userID, message)
    } else {
      socket.emit('opponent-disconnect')
    }
  })

  socket.on("disconnect", function() {
    console.log('user disconnect: ' + socket.userID)
    inGame[socket.userID] = false
    delete(socketMap[socket.userID])
    delete(rankedMatchPool[socket.userID])
    delete(publicMatchPool[socket.userID])
  })

})




// start server
http.listen(31000, function(){
  console.log('listening on *:31000')
})
