import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("listo");

  async function initDb() {
    setStatus("inicializando DB...");
    await fetch(`${API_URL}/api/init`);
    setStatus("DB lista ✅");
  }

  async function loadNotes() {
    setStatus("cargando notas...");
    const res = await fetch(`${API_URL}/api/notes`);
    const json = await res.json();
    setNotes(json.data || []);
    setStatus("listo");
  }

  async function addNote(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setStatus("guardando...");
    await fetch(`${API_URL}/api/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    await loadNotes();
  }

  useEffect(() => {
    (async () => {
      await initDb();
      await loadNotes();
    })();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720 }}>
      <h1>Docker Full Stack Demo</h1>
      <p><b>Status:</b> {status}</p>

      <form onSubmit={addNote} style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe una nota..."
          style={{ flex: 1, padding: 10 }}
        />
        <button style={{ padding: "10px 14px" }}>Agregar</button>
      </form>

      <h2 style={{ marginTop: 24 }}>Notas</h2>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            #{n.id} — {n.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
