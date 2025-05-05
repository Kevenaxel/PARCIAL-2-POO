const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//Conexiones hacia mongoDB
const app = express();
app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectando a la plataforma MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

//Servidor corriendo perfectamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});