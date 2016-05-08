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
  if (req.session.userID) {
    res.json({success: true, userID: req.session.userID})
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
      res.json({success: true, userID: users[0].userID})
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
      res.json({success: true, userID: userID})
    }
  })
})

app.get('/logout', function(req, res) {
  delete(req.session.userID)
  res.send({success: true})
})

// helper functions
function makeid() {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


// socket.io
let socketMap = {} // key is userID, value is socket
io.on('connection', function(socket) {
  console.log('user connect: ' + socket.id)

  socket.on('user-logged-in', function(userID) {
    socket.userID = userID
    socketMap[userID] = socket
  })

  socket.on('invite-match', function(opponentID, size) {
    if (opponentID === socket.userID) return

    if (socketMap[opponentID]) {
      // TODO: assume after sent, accpet immediately...
      /*
      socketMap[opponentID].emit('receive-match-invitation', socket.userID)
      socket.emit('invitation-sent', opponentID)
      */
      // assume I am black and opponent is white
      socket.emit('start-match', {size: size, color: 'black', opponentID: opponentID})
      socketMap[opponentID].emit('start-match', {size: size, color: 'white', opponentID: socket.userID})
    } else { // not found
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
      socekt.emit('opponent-disconnect')
    }
  })

  // userID pass twice. so opponentID should score
  socket.on('score', function(userID, opponentID) {
    if (socketMap[opponentID]) {
      socketMap[opponentID].emit('opponent-score', userID)
    } else {
      socekt.emit('opponent-disconnect')
    }
  })

  socket.on("disconnect", function() {
    console.log('user disconnect: ' + socket.userID)
    delete(socketMap[socket.userID])
  })

})




// start server
http.listen(31000, function(){
  console.log('listening on *:31000')
})
