const express = require('express');
const router = express.Router();

const Usuario = require('../models/Usuario');
const Envio = require('../models/Envio');


// Obtener créditos del usuario por ID
router.get('/usuario/:id/creditos', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ credito: usuario.credito });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener créditos' });
  }
});


// Registrar un nuevo envío
router.post('/envios', async (req, res) => {
  try {
    const {
      _id,
      usuarioId,
      nombre,
      direccion,
      telefono,
      referencia,
      observacion,
      producto
    } = req.body;

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const peso = producto.peso;
    const costo = peso > 3 ? Math.ceil(peso / 3) : 1;

    if (usuario.credito < costo) {
      return res.status(400).json({ mensaje: 'Créditos insuficientes' });
    }

    const envio = new Envio({
      _id,
      usuarioId,
      nombre,
      direccion,
      telefono,
      referencia,
      observacion,
      producto
    });

    await envio.save();

    usuario.credito -= costo;
    await usuario.save();

    res.json({ mensaje: 'Envío ha sido registrado', envio });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar envío' });
  }
});


// Obtener envíos por usuario
router.get('/envios/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const envios = await Envio.find({ usuarioId });

    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar envíos' });
  }
});


// Eliminar envío y reembolsar créditos
router.delete('/envios/:envioId', async (req, res) => {
  try {
    const { envioId } = req.params;
    const envio = await Envio.findById(envioId);

    if (!envio) {
      return res.status(404).json({ mensaje: 'Envío no encontrado' });
    }

    const usuario = await Usuario.findById(envio.usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const peso = envio.producto.peso;
    const creditoReembolsado = peso > 3 ? Math.ceil(peso / 3) : 1;

    usuario.credito += creditoReembolsado;
    await usuario.save();

    await envio.deleteOne();

    res.json({ mensaje: 'Envío eliminado y crédito reembolsado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar envío' });
  }
});

module.exports = router;