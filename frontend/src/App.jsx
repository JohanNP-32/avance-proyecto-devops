import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Conectando...");

  // Colores de estado
  const statusColors = {
    "DB lista ": "#22c55e",
    "inicializando DB...": "#f59e0b",
    "error": "#ef4444",
    "listo": "#3b82f6"
  };

  async function initDb() {
    try {
      setStatus("inicializando DB...");
      await fetch(`${API_URL}/api/init`);
      setStatus("DB lista ✅");
    } catch (err) {
      setStatus("error");
    }
  }

  async function loadNotes() {
    try {
      const res = await fetch(`${API_URL}/api/notes`);
      const json = await res.json();
      setNotes(json.data || []);
      setStatus("listo");
    } catch (err) {
      setStatus("error");
    }
  }

  async function addNote(e) {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setText("");
      await loadNotes();
    } catch (err) {
      alert("Error al guardar la nota");
    }
  }

  useEffect(() => {
    (async () => {
      await initDb();
      await loadNotes();
    })();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>Bitácora de Eventos</h1>
        </header>

        <form onSubmit={addNote} style={styles.form}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué tienes en mente hoy?"
            style={styles.input}
          />
          <button style={styles.button}>Publicar</button>
        </form>

        <div style={styles.listContainer}>
          <h2 style={styles.subTitle}>Entradas Recientes</h2>
          {notes.length === 0 ? (
            <p style={styles.emptyText}>No hay notas aún. ¡Escribe la primera!</p>
          ) : (
            notes.map((n) => (
              <div key={n.id} style={styles.noteItem}>
                <span style={styles.noteId}>#{n.id}</span>
                <p style={styles.noteText}>{n.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "500px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    padding: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
    margin: 0
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "white",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px"
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s"
  },
  subTitle: {
    fontSize: "18px",
    color: "#374151",
    marginBottom: "16px"
  },
  noteItem: {
    padding: "12px",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px"
  },
  noteId: {
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: "bold",
    marginTop: "2px"
  },
  noteText: {
    margin: 0,
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: "1.5"
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "14px",
    marginTop: "20px"
  }
};