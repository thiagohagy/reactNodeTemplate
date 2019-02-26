const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema({
    name: String,
    module: String,
    justRoot: { type : Boolean, default: true }
});

module.exports = mongoose.model('SystemModules', Schema);
