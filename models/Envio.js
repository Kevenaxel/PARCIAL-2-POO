const mongoose = require('mongoose'); // Envio hacia el Mongoose antes de poder utilizarlo

const envioSchema = new mongoose.Schema({
  usuarioId: { type: String, required: true },
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
}, { timestamps: true }); 

module.exports = mongoose.model('Envio', envioSchema);