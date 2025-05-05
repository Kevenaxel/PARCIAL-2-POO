const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  _id: String,
  nombre: String,
  credito: Number
});

module.exports = mongoose.model('Usuario', usuarioSchema);