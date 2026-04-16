const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => res.json({ ok: true, service: "backend" }));

// Inicializa tabla y datos (idempotente)
app.get("/api/init", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text VARCHAR(255) NOT NULL
      );
    `);

    const [rows] = await pool.query("SELECT COUNT(*) as c FROM notes;");
    if (rows[0].c === 0) {
      await pool.query("INSERT INTO notes (text) VALUES (?), (?), (?)", [
        "Hola desde MySQL 👋",
        "React → Express → MySQL",
        "Todo corriendo en Docker 🐳",
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
    const [rows] = await pool.query("SELECT * FROM notes ORDER BY id DESC;");
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Crear nota
app.post("/api/notes", async (req, res) => {
  const { text } = req.body;
  if (!text || !String(text).trim()) {
    return res.status(400).json({ ok: false, error: "text es requerido" });
  }

  try {
    const [result] = await pool.query("INSERT INTO notes (text) VALUES (?);", [
      String(text).trim(),
    ]);
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Backend escuchando en :${port}`));
