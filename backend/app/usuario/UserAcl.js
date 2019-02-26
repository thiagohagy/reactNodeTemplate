const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Usuario'
  },
  modules: [
    {
        module: String,
        name: String,
        level: String,
    },
],
});


module.exports = mongoose.model('ACL', Schema);
