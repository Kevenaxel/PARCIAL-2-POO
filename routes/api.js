const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Envio = require('../models/Envio');

// GET: consultar saldo de un usuario
router.get('/usuario/:id/credito', async (req, res) => {
  try {
    const cliente = await Usuario.findById(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Usuario no localizado' });
    res.json({ credito: cliente.credito });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo consultar el crédito disponible' });
  }
});

// POST: crear un nuevo envío
router.post('/envios', async (req, res) => {
  try {
    const { usuarioId, nombre, direccion, telefono, referencia, observacion, producto } = req.body;

    console.log('Datos de envío:', req.body);

    const cliente = await Usuario.findById(usuarioId);
    if (!cliente) return res.status(404).json({ mensaje: 'No se encontró el usuario' });

    const { peso, bultos } = producto;

    // Cálculo del costo estimado por peso y cantidad de bultos
    const costoEnvio = Math.ceil((peso / 3) + (bultos * 0.5));

    if (cliente.credito < costoEnvio) {
      return res.status(400).json({ mensaje: 'Fondos insuficientes para este envío' });
    }

    const envioNuevo = new Envio({
      usuarioId,
      nombre,
      direccion,
      telefono,
      referencia,
      observacion,
      producto
    });

    await envioNuevo.save();
    cliente.credito -= costoEnvio;

    console.log('Crédito actualizado tras registrar el envío:', cliente.credito);

    await cliente.save();

    res.json({ mensaje: 'Envío guardado correctamente', envio: envioNuevo });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo procesar el envío' });
  }
});

// GET: obtener todos los envíos de un usuario
router.get('/envios/:usuarioId', async (req, res) => {
  try {
    const lista = await Envio.find({ usuarioId: req.params.usuarioId });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los envíos del usuario' });
  }
});

// DELETE: cancelar envío y restaurar crédito
router.delete('/envios/:envioId', async (req, res) => {
  try {
    console.log('Procesando eliminación de envío ID:', req.params.envioId);

    const envio = await Envio.findById(req.params.envioId);
    if (!envio) return res.status(404).json({ mensaje: 'Envío no encontrado' });

    const propietario = await Usuario.findById(envio.usuarioId);
    if (!propietario) return res.status(404).json({ mensaje: 'Usuario relacionado no encontrado' });

    const pesoEnvio = envio.producto.peso;
    const devolucion = pesoEnvio <= 3 ? 1 : Math.ceil(pesoEnvio / 3);

    propietario.credito += devolucion;

    console.log('Saldo actualizado antes de guardar:', propietario.credito);

    await propietario.save();
    await envio.deleteOne();

    res.json({ mensaje: 'Envío eliminado y saldo reembolsado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al intentar eliminar el registro' });
  }
});

module.exports = router;
