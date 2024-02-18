const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  username: {type: String, required: true},
  password: {type: String, required: true},
  token: { type: String },
  profilPhoto: { type: String, default: './profil.png' },
});

const User = mongoose.model('users', userSchema);

module.exports = User;
