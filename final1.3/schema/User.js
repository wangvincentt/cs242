'use strict'
let mongoose = require('mongoose'),
    Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1/go')

/**
 * Check database connection
 **/
let db = mongoose.connection

db.on("error", function(){
  console.log("Failed to connect to database: go User");
})

db.once("open", function(callback){
  console.log("Connected to database: go User");
})

// create schema
var userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    userID: {type: String, required: true, unique: true},
    MMR: {type: Number, required: false, default: 1000}
})

// create model that uses the schema
let db_User = mongoose.model("User", userSchema);

// make this available to our users.
module.exports = db_User
