const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Logs 
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}
const logFilePath = path.join(logDirectory, 'app.log');

const writeLog = (level, message) => {
    // Formato: [2026-04-09 10:00:00] LEVEL: Mensaje
    const date = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `[${date}] ${level}: ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    console.log(logEntry.trim());
};

// Conexión a Base de Datos
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bitacora';
mongoose.connect(MONGO_URI)
    .then(() => writeLog('INFO', 'Conexión exitosa a base de datos'))
    .catch(err => writeLog('ERROR', 'Fallo en conexión a base de datos: ' + err.message));

// Modelo de Mongoose
const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: { type: Date, default: Date.now }
});
const Event = mongoose.model('Event', EventSchema);

// Rutas API
app.post('/api/events', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        writeLog('INFO', 'Nuevo evento registrado: ' + req.body.title);
        res.status(201).json(newEvent);
    } catch (error) {
        writeLog('ERROR', 'Error al crear evento');
        res.status(500).json({ error: 'Error al crear evento' });
    }
});

app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        writeLog('INFO', 'Consulta de eventos realizada');
        res.status(200).json(events);
    } catch (error) {
        writeLog('ERROR', 'Error al consultar eventos');
        res.status(500).json({ error: 'Error al consultar eventos' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    writeLog('INFO', `Servidor Backend corriendo en puerto ${PORT}`);
});