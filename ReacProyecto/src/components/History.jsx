import React, { useState, useEffect } from 'react';
import {
    BookOpen, Map as MapIcon, Leaf, Bird, ShieldCheck, HeartHandshake,
    Video, FileText, Headphones, Trophy, Star, ChevronRight,
    MessageSquare, Target, Award, Brain, Users, Activity, CheckCircle
} from 'lucide-react';
import '../styles/History.css';

const History = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [quizState, setQuizState] = useState({ answered: false, correct: false, selectedOption: null });
    const [activeNode, setActiveNode] = useState(1);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [selectedTopic, setSelectedTopic] = useState(null);

    // 1. Barra de progreso de navegación
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (totalScroll / windowHeight) * 100;
            setScrollProgress(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Datos para el Mapa de Conocimiento (Línea de tiempo interactiva)
    const knowledgeNodes = [
        { id: 1, title: 'El Origen', icon: <MapIcon size={24} />, content: 'La Angostura es un tómbolo que conecta la península de Puntarenas. Históricamente era un paso de arenas blancas y manglares.' },
        { id: 2, title: 'La Fragmentación', icon: <Activity size={24} />, content: 'Con la construcción de carreteras, este ecosistema sufrió y lo que era un corredor de especies se convirtió en una barrera de asfalto.' },
        { id: 3, title: 'El Renacer', icon: <ShieldCheck size={24} />, content: 'El proyecto del Corredor Biológico nace para restaurar la conectividad, reconstruyendo el puerto seguro para la vida silvestre.' },
        { id: 4, title: 'La Comunidad', icon: <HeartHandshake size={24} />, content: 'El éxito radica en la ADI y la comunidad. Cuidar estas plantas protege contra el cambio climático y fomenta el equilibrio.' }
    ];

    // Datos para la Biblioteca de Recursos
    const resources = [
        { id: 1, type: 'PDF', title: 'Guía de Reforestación Local', icon: <FileText size={20} />, color: '#e63946' },
        { id: 2, type: 'Video', title: 'Documental: Especies Nativas', icon: <Video size={20} />, color: '#1a73e8' },
        { id: 3, type: 'Audio', title: 'Podcast: Voces de la Angostura', icon: <Headphones size={20} />, color: '#f4a261' },
        { id: 4, type: 'PDF', title: 'Manual de Cuidados del Mangle', icon: <FileText size={20} />, color: '#e63946' },
        { id: 5, type: 'Video', title: 'Avistamiento de Aves (Tutorial)', icon: <Video size={20} />, color: '#1a73e8' },
    ];

    const filteredResources = activeFilter === 'Todos' ? resources : resources.filter(r => r.type.includes(activeFilter));

    // Datos para explorar (Hover Cards)
    const exploreTopics = [
        { title: 'Flora Costera', icon: <Leaf size={32} />, color: '#2a9d8f' },
        { title: 'Aves Migratorias', icon: <Bird size={32} />, color: '#f4a261' },
        { title: 'Protección', icon: <ShieldCheck size={32} />, color: '#1a73e8' },
        { title: 'Educación', icon: <BookOpen size={32} />, color: '#9b5de5' },
        { title: 'Voluntariado', icon: <Users size={32} />, color: '#e63946' },
        { title: 'Sustentabilidad', icon: <HeartHandshake size={32} />, color: '#8ac926' },
    ];

    return (
        <div className="history-dashboard-wrapper">

            {/* BARRA DE PROGRESO */}
            <div className="history-scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

            {/* HEADER TIPO DASHBOARD ESTUDIANTE */}
            <header className="glass-header">
                <div className="header-brand">
                    <div className="brand-icon-wrapper">
                        <Brain color="white" size={26} />
                    </div>
                    <div className="brand-text">
                        <h1>EduSpace Interactivo</h1>
                        <p>Dashboard del Estudiante</p>
                    </div>
                </div>
                <div className="header-user-actions">
                    <div className="user-stats-badge">
                        <Trophy size={18} color="#f59e0b" />
                        <span>{quizState.correct ? '1' : '0'} Medallas</span>
                    </div>
                    <div className="user-avatar-circle">
                        US
                    </div>
                </div>
            </header>

            <div className="history-main-content">

                {/* SECCIÓN: ¿QUÉ QUIERES APRENDER HOY? (Hover Cards) */}
                <section>
                    <h2 className="section-title-elegant">¿Qué descubriremos hoy?</h2>
                    <div className="hover-cards-grid">
                        {exploreTopics.map((topic, i) => (
                            <div key={i} className="hover-card" style={{ '--card-color': topic.color }} onClick={() => setSelectedTopic(i)}>
                                <div className="hover-card-icon-container" style={{ background: `${topic.color}15`, color: topic.color }}>
                                    {topic.icon}
                                </div>
                                <h3>{topic.title}</h3>
                                <div className="hover-card-footer-icon">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="history-two-columns">

                    {/* SECCIÓN: MAPA DE CONOCIMIENTO (Línea de tiempo) */}
                    <section className="learning-path-section">
                        <div className="learning-path-header">
                            <Target size={28} color="#1a73e8" />
                            <h2>Ruta de Aprendizaje</h2>
                        </div>

                        <div className="learning-path-layout">
                            {/* Navegación de nodos */}
                            <div className="nodes-navigation">
                                {/* Línea conectora */}
                                <div className="nodes-connector-line"></div>
                                {knowledgeNodes.map(node => (
                                    <div
                                        key={node.id}
                                        className={`interactive-node ${activeNode === node.id ? 'active' : ''}`}
                                        onClick={() => setActiveNode(node.id)}
                                    >
                                        <div className={`node-number-circle ${activeNode === node.id ? 'node-bullet-active' : 'node-bullet-inactive'}`}>
                                            {node.id}
                                        </div>
                                        <span className={`node-title-text ${activeNode === node.id ? 'node-text-active' : 'node-text-inactive'}`}>
                                            {node.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Contenido dinámico */}
                            <div className="path-content-card">
                                <div className="path-content-icon">
                                    {knowledgeNodes.find(n => n.id === activeNode)?.icon}
                                </div>
                                <h3>{knowledgeNodes.find(n => n.id === activeNode)?.title}</h3>
                                <p>
                                    {knowledgeNodes.find(n => n.id === activeNode)?.content}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN: GAMIFICACIÓN (Pop Quiz) */}
                    <section className="quiz-card-section">
                        <div className="quiz-header">
                            <div className="quiz-header-title">
                                <Star size={28} color="#f59e0b" fill="#f59e0b" />
                                <h2>Reto Rápido</h2>
                            </div>
                            {quizState.correct && <span className="quiz-completed-badge">¡Completado!</span>}
                        </div>

                        {!quizState.answered ? (
                            <div className="quiz-question-container">
                                <p className="quiz-question-text">
                                    ¿Cuál es la función principal de las raíces del Mangle Rojo en el estero?
                                </p>
                                <div className="quiz-options-list">
                                    <div className="quiz-option" onClick={() => setQuizState({ answered: true, correct: false, selectedOption: 1 })}>
                                        A) Producir sombra para las iguanas <CheckCircle size={20} className="quiz-option-icon" />
                                    </div>
                                    <div className="quiz-option" onClick={() => setQuizState({ answered: true, correct: true, selectedOption: 2 })}>
                                        B) Atrapar sedimentos y prevenir la erosión <CheckCircle size={20} className="quiz-option-icon" />
                                    </div>
                                    <div className="quiz-option" onClick={() => setQuizState({ answered: true, correct: false, selectedOption: 3 })}>
                                        C) Absorbar agua salada para purificarla <CheckCircle size={20} className="quiz-option-icon" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="quiz-result-container">
                                {quizState.correct ? (
                                    <>
                                        <div className="medal-animation medal-shine-container">
                                            <Award size={60} color="#f59e0b" />
                                        </div>
                                        <h3 className="quiz-result-title success">¡Excelente!</h3>
                                        <p className="quiz-result-text">Has ganado una medalla de Protector Costero.</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="quiz-fail-icon-container">
                                            <ShieldCheck size={60} color="#ef4444" />
                                        </div>
                                        <h3 className="quiz-result-title fail">Casi lo logras</h3>
                                        <p className="quiz-result-text">El Mangle atrapa sedimentos vitales para evitar la erosión.</p>
                                        <button className="btn-retry-quiz" onClick={() => setQuizState({ answered: false, correct: false, selectedOption: null })}>Reintentar</button>
                                    </>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                <div className="history-two-columns">
                    {/* SECCIÓN: BIBLIOTECA DE RECURSOS */}
                    <section className="library-section">
                        <div className="library-header">
                            <BookOpen size={28} color="#9b5de5" />
                            <h2>Biblioteca Multimedia</h2>
                        </div>

                        {/* Filtros */}
                        <div className="library-filters">
                            {['Todos', 'PDF', 'Video', 'Audio'].map(f => (
                                <button key={f} className={`filter-btn ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Lista de Recursos */}
                        <div className="resources-scroll-list">
                            {filteredResources.map(res => (
                                <div key={res.id} className="resource-item-card">
                                    <div className="resource-icon-box" style={{ background: `${res.color}15`, color: res.color }}>
                                        {res.icon}
                                    </div>
                                    <div className="resource-info">
                                        <h4>{res.title}</h4>
                                        <span className="resource-meta">Recurso en {res.type}</span>
                                    </div>
                                    <ChevronRight size={18} color="#d1d5db" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECCIÓN: ZONA DE COMUNIDAD */}
                    <section className="community-hero-card">
                        <div className="community-bg-icon">
                            <MessageSquare size={150} color="white" />
                        </div>
                        <div className="community-card-content">
                            <div className="community-header">
                                <Users size={28} color="white" />
                                <h2>Comunidad Activa</h2>
                            </div>

                            <p className="community-description">
                                Únete a la discusión. Comparte tus descubrimientos y sube fotos del corredor geolocalizado. Tu aporte cuenta para el ranking semanal.
                            </p>

                            <div className="ranking-table-glass">
                                <div className="ranking-row">
                                    <span className="ranking-name-cell">
                                        <div className="ranking-pos-circle pos-1">1</div>
                                        Escuela Central
                                    </span>
                                    <span>240 pts</span>
                                </div>
                                <div className="ranking-row">
                                    <span className="ranking-name-cell">
                                        <div className="ranking-pos-circle pos-2">2</div>
                                        Grupo ADI Vol.
                                    </span>
                                    <span>185 pts</span>
                                </div>
                                <div className="ranking-row">
                                    <span className="ranking-name-cell">
                                        <div className="ranking-pos-circle pos-3">3</div>
                                        Tu pos. (Individual)
                                    </span>
                                    <span>65 pts</span>
                                </div>
                            </div>

                            <button className="btn-community-forum">
                                Entrar al Foro
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {/* MODAL PARA EDUCACIÓN (Índice 3 en exploreTopics) */}
            {selectedTopic === 3 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#9b5de515', color: '#9b5de5' }}>
                                <BookOpen size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2 className="modal-h2">La Angostura</h2>
                                <p>Punto geográfico e histórico clave</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            <p>La Angostura es una franja de tierra estrecha que conecta el distrito de Chacarita con el centro de la ciudad de Puntarenas. Es un punto geográfico e histórico clave para la región, conocido tanto por su formación natural como por los eventos que han marcado la identidad del "Puerto".</p>
                            
                            <h3 className="modal-subsection-title">Historia y Formación</h3>
                            <p>La formación de esta zona es de origen geomorfológico. Se trata de una "flecha de arena" o lengüeta que se fue creando poco a poco por la acumulación de sedimentos (arena y lodo) arrastrados por las corrientes del río Barranca, la acción de las mareas y los vientos alisios.</p>
                            <p><strong>Instituto Costarricense de Puertos del Pacífico.</strong></p>

                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-blue"><strong>Nombre:</strong> El término "Angostura" describe literalmente el paso estrecho de tierra flanqueado por el Estero de Puntarenas a un lado y el Golfo de Nicoya al otro.</li>
                                <li className="modal-list-item border-orange"><strong>Hito histórico:</strong> Fue el escenario de la Batalla de La Angostura en 1860, donde las fuerzas del gobierno derrotaron a los seguidores del expresidente Juan Rafael Mora Porras, quien posteriormente fue fusilado en Puntarenas.</li>
                                <li className="modal-list-item border-red"><strong>Tragedia:</strong> Un evento doloroso en su historia moderna fue el accidente de un autobús en 1975, conocido como la Tragedia de la Angostura, donde fallecieron 52 personas al caer el vehículo al estero.</li>
                            </ul>

                            <div className="modal-tag-container">
                                <span className="modal-tag">Facebook +4</span>
                            </div>

                            <h3 className="modal-subsection-title">Conservación del Manglar</h3>
                            <p>La idea de conservar el manglar de esta zona nace de la necesidad de proteger un ecosistema que estaba siendo severamente impactado por la actividad humana (96% de pérdida de bosque costero en áreas intervenidas).</p>
                            
                            <div className="grid-two-cards">
                                <div className="info-card-colored bg-green-light">
                                    <h4 className="text-green-dark">Origen de la iniciativa</h4>
                                    <p>Proviene de una alianza entre instituciones públicas y privadas como el MOPT, la Municipalidad de Puntarenas, el SINAC, y fundaciones como FUNBAM y Coopenae-Wink.</p>
                                </div>
                                <div className="info-card-colored bg-blue-light">
                                    <h4 className="text-blue-dark">Corredor Natural</h4>
                                    <p>Recientemente se creó el Corredor Natural La Angostura para combatir la pérdida de bosque costero y mitigar los efectos del cambio climático.</p>
                                </div>
                                <div className="info-card-colored bg-amber-light grid-full">
                                    <h4 className="text-amber-dark">Importancia ecológica</h4>
                                    <p>Se busca conservar el manglar porque actúa como un filtro biológico, protege contra la erosión y tormentas, y sirve como criadero de especies marinas esenciales para la economía local.</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
