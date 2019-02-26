const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Usuario'
  },
});


module.exports = mongoose.model('Usuario', Schema);
