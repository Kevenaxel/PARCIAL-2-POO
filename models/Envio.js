const mongoose = require('mongoose');

const envioSchema = new mongoose.Schema({
  _id: String,
  usuarioId: String,
  nombre: String,
  direccion: String,
  telefono: String,
  referencia: String,
  observacion: String,
  producto: {
    descripcion: String,
    peso: Number,
    bultos: Number,
    fecha_entrega: String
  }
});

module.exports = mongoose.model('Envio', envioSchema);