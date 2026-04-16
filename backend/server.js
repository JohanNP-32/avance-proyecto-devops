const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión (Usando el nombre del servicio de Docker)
const MONGO_URI = process.env.MONGO_URL || "mongodb://mongodb:27017/bitacora";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));

// Definir el Esquema de la Nota
const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Note = mongoose.model("Note", NoteSchema);

// Health check
app.get("/", (req, res) => res.json({ ok: true, service: "backend" }));

// Inicializa datos si la DB está vacía
app.get("/api/init", async (req, res) => {
  try {
    const count = await Note.countDocuments();
    if (count === 0) {
      await Note.insertMany([
        { text: "Obra de teatro: El Fantasma de la Ópera - Palacio de Bellas Artes" },
        { text: "Concierto: Metallica M72 World Tour - Foro Sol" },
        { text: "Exposición: El Mundo de Tim Burton - Museo Franz Mayer" },
        { text: "Estreno: Dune Part Two - Función de media noche" }
      ]);
    }
    res.json({ ok: true, message: "DB inicializada" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Listar notas
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ date: -1 });
    // Mapeamos para que el frontend vea "id" en lugar de "_id" si es necesario
    const data = notes.map(n => ({ id: n._id, text: n.text }));
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Crear nota
app.post("/api/notes", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ ok: false, error: "text es requerido" });

  try {
    const newNote = new Note({ text });
    await newNote.save();
    res.status(201).json({ ok: true, id: newNote._id });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Backend escuchando en :${port}`));