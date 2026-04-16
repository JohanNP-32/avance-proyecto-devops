import { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        minHeight: '100vh',
        fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        backgroundColor: '#0a0e17',
        color: '#f0f2f5',
        overflowX: 'hidden',
    },
    header: {
        textAlign: 'center',
        padding: '40px 20px',
        borderBottom: '1px solid #1a2336',
        backgroundColor: '#111726',
    },
    title: {
        fontSize: '2.5rem',
        color: '#1a75ff',
        margin: '0 0 10px 0',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#b0b8c6',
        fontWeight: 'normal',
    },
    mainSection: {
        width: '95%',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '40px',
    },
    formPanel: {
        backgroundColor: '#111726',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        border: '1px solid #1a2336',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: 'fit-content',
    },
    sectionTitleFormal: {
        fontSize: '1.4rem',
        marginBottom: '10px',
        color: '#f0f2f5',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#b0b8c6',
    },
    input: {
        padding: '14px',
        backgroundColor: '#0a0e17',
        border: '1px solid #1a2336',
        borderRadius: '8px',
        fontSize: '1rem',
        width: '100%',
        boxSizing: 'border-box',
        color: '#f0f2f5',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '14px 28px',
        backgroundColor: '#1a75ff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        alignSelf: 'flex-start',
    },
    buttonHover: {
        backgroundColor: '#0056e0',
    },
    eventsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    eventGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',
    },
    eventCard: {
        backgroundColor: '#111726',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        borderLeft: '5px solid #1a75ff',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '20px',
    },
    eventHeaderArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    eventTitle: {
        margin: '0',
        fontSize: '1.4rem',
        color: '#f0f2f5',
    },
    eventDesc: {
        margin: '0',
        color: '#b0b8c6',
        lineHeight: '1.6',
    },
    eventMeta: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '5px',
        fontSize: '0.85rem',
        color: '#888',
    },
    idCode: {
        backgroundColor: '#0a0e17',
        padding: '4px 8px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        color: '#888',
    }
};

const initialSimulatedEvents = [
    {
        _id: "evt-001",
        title: "Obra de Teatro: La Dama de Negro",
        description: "Función nocturna en el teatro principal con elenco nacional.",
        date: new Date(Date.now() - 86400000).toISOString(),
        level: "SUCCESS"
    },
    {
        _id: "evt-002",
        title: "Concierto de Rock Alternativo",
        description: "Presentación en vivo de bandas locales en el foro cultural.",
        date: new Date(Date.now() - 172800000).toISOString(),
        level: "WARNING"
    },
    {
        _id: "evt-003",
        title: "Festival Gastronómico",
        description: "Evento con comida típica, food trucks y degustaciones.",
        date: new Date(Date.now() - 259200000).toISOString(),
        level: "INFO"
    },
    {
        _id: "evt-004",
        title: "Exposición de Arte Contemporáneo",
        description: "Galería con obras de artistas emergentes.",
        date: new Date(Date.now() - 345600000).toISOString(),
        level: "SUCCESS"
    }
];

function App() {
    const [events, setEvents] = useState(initialSimulatedEvents);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/events`);
            if (response.data && response.data.length > 0) {
                setEvents(response.data);
            }
        } catch (error) {
            console.error("Backend no disponible, usando datos locales");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newEvent = {
            _id: `evt-${Math.random().toString(36).substring(2, 9)}`,
            title: title,
            description: description,
            date: new Date().toISOString(),
            level: "INFO"
        };

        setEvents([newEvent, ...events]);
        setTitle('');
        setDescription('');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/events`, { title, description });
        } catch (error) {
            console.error("Registro guardado solo localmente (backend desconectado)");
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'SUCCESS': return '#28a745';
            case 'WARNING': return '#ffc107';
            case 'ERROR': return '#dc3545';
            default: return '#1a75ff';
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Bitácora Social</h1>
                <p style={styles.subtitle}>Registro de eventos y salidas.</p>
            </header>

            <main style={styles.mainSection}>
                <section style={styles.formPanel}>
                    <h2 style={styles.sectionTitleFormal}>Registrar Nuevo Evento</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="eventTitle">Título del Evento</label>
                            <input 
                                id="eventTitle"
                                type="text" 
                                placeholder="Ej. Viaje a la playa" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="eventDesc">Descripción Detallada</label>
                            <input 
                                id="eventDesc"
                                type="text" 
                                placeholder="Ej. Salida de fin de semana..." 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                                style={styles.input}
                            />
                        </div>
                        <button 
                            type="submit" 
                            style={isHovered ? {...styles.button, ...styles.buttonHover} : styles.button}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Registrar Evento +
                        </button>
                    </form>
                </section>

                <section style={styles.eventsSection}>
                    <h2 style={styles.sectionTitleFormal}>Eventos Recientes ({events.length})</h2>
                    <div style={styles.eventGrid}>
                        {events.map(ev => (
                            <div key={ev._id} style={{...styles.eventCard, borderLeftColor: getLevelColor(ev.level)}}>
                                <div style={styles.eventHeaderArea}>
                                    <h3 style={styles.eventTitle}>{ev.title}</h3>
                                    <p style={styles.eventDesc}>{ev.description}</p>
                                </div>
                                <div style={styles.eventMeta}>
                                    <span style={{color: getLevelColor(ev.level), fontWeight: 'bold'}}>{ev.level}</span>
                                    <span>ID: <code style={styles.idCode}>{ev._id.substring(0,8)}</code></span>
                                    <span>{new Date(ev.date).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;