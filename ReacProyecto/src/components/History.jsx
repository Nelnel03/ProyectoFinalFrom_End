import React, { useState, useEffect } from 'react';
import {
    BookOpen, Map as MapIcon, Leaf, Bird, ShieldCheck, HeartHandshake,
    Video, FileText, Headphones, Trophy, Star, ChevronRight,
    MessageSquare, Target, Award, Brain, Users, Activity, CheckCircle
} from 'lucide-react';
import '../styles/History.css';

const History = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [quizState, setQuizState] = useState({ current: 0, score: 0, answered: false, correct: false, selectedOption: null, completed: false });
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
        { title: 'Fauna Costera', icon: <Bird size={32} />, color: '#f4a261' },
        { title: 'Protección', icon: <ShieldCheck size={32} />, color: '#1a73e8' },
        { title: 'Educación', icon: <BookOpen size={32} />, color: '#9b5de5' },
        { title: 'Voluntariado', icon: <Users size={32} />, color: '#e63946' },
        { title: 'Conócenos', icon: <HeartHandshake size={32} />, color: '#8ac926' },
    ];

    // 16 Preguntas generadas a partir del contenido
    const quizQuestions = [
        {
            question: '¿Cuál es la función principal de las raíces del Mangle Rojo en el estero?',
            options: ['Producir sombra', 'Atrapar sedimentos y prevenir erosión', 'Filtrar agua dulce'],
            correctIndex: 1,
            feedback: 'El Mangle Rojo atrapa sedimentos vitales para evitar la erosión costera.'
        },
        {
            question: '¿Cuántas hectáreas de bosque primario perdió Puntarenas entre 2002 y 2024?',
            options: ['Menos de 1,000 hectáreas', 'Cerca de 10,000 hectáreas', 'Más de 4,380 hectáreas'],
            correctIndex: 2,
            feedback: 'Puntarenas perdió más de 4,380 hectáreas, por eso la deforestación es crítica.'
        },
        {
            question: '¿Qué especie de manglar es conocida por tener raíces que salen del suelo (pneumatóforos)?',
            options: ['Mangle Blanco', 'Mangle Negro', 'Mangle Botoncillo'],
            correctIndex: 1,
            feedback: 'El Mangle Negro es dominante por su alta tolerancia a la salinidad y sus peculiares raíces.'
        },
        {
            question: '¿Qué reptil es conocido como "lagartija Jesucristo" por correr sobre el agua?',
            options: ['Garrobo', 'Basilisco', 'Iguana verde'],
            correctIndex: 1,
            feedback: 'El basilisco gana este apodo gracias a su increíble habilidad para desplazarse sobre el agua.'
        },
        {
            question: '¿En qué año se declaró el Humedal Estero Puntarenas como Área Silvestre Protegida?',
            options: ['1985', '2015', '2001'],
            correctIndex: 2,
            feedback: 'Fue declarado ASP en el año 2001 (HEPyMA).'
        },
        {
            question: '¿Cuál fundación lidera proyectos masivos de restauración de manglares en el Estero?',
            options: ['NATUWA', 'Fundación Tierra Pura', 'FUNBAM'],
            correctIndex: 1,
            feedback: 'Fundación Tierra Pura lidera la restauración específica dentro del Estero.'
        },
        {
            question: '¿A quiénes se da prioridad para los "Empleos Verdes" en BioMon ADI?',
            options: ['A estudiantes extranjeros', 'A pescadores industriales', 'A mujeres de la zona'],
            correctIndex: 2,
            feedback: 'El proyecto empodera socialmente dando prioridad a mujeres locales y brindando capacitaciones.'
        },
        {
            question: '¿Qué evento histórico sucedió en La Angostura en el año 1860?',
            options: ['Batalla de La Angostura', 'Batalla de Rivas', 'Tragedia del bus'],
            correctIndex: 0,
            feedback: 'Las fuerzas del gobierno derrotaron a los seguidores de Juan Rafael Mora Porras en esta batalla.'
        },
        {
            question: '¿Cuál de estas es una planta arrastrada y suculenta adaptada a las dunas y arena?',
            options: ['Lengua de Suegra', 'Verdolaga de Playa', 'Uva de Playa'],
            correctIndex: 1,
            feedback: 'La Verdolaga de Playa coloniza áreas arenosas cerquitas de la marea alta.'
        },
        {
            question: '¿Qué mamífero visitante es muy habitual en Porto Bello, atraído por alimentos?',
            options: ['El Oso Hormiguero', 'El Mapache', 'El Jaguar'],
            correctIndex: 1,
            feedback: 'Los mapaches y los pizotes son visitantes extremadamente habituales por la actividad humana.'
        },
        {
            question: '¿Qué invertebrados de barro son fundamentales en la base alimenticia del manglar?',
            options: ['Cangrejos rojos y violinistas', 'Langostas y camarones', 'Erizos de mar y anémonas'],
            correctIndex: 0,
            feedback: 'Ambos tipos de cangrejos habitan entre las raíces del manglar alimentando el ecosistema.'
        },
        {
            question: '¿Qué entidad pública protege las zonas verdes y derechos de vía en La Angostura?',
            options: ['SINAC', 'MOPT', 'Incofer'],
            correctIndex: 1,
            feedback: 'La Dirección de Seguridad y Embellecimiento de Carreteras del MOPT tiene esta función.'
        },
        {
            question: '¿Cuál tecnología precisa se usa para detectar tala ilegal en los manglares actualmente?',
            options: ['Monitoreo con Drones', 'Satélites meteorológicos', 'Radares submarinos'],
            correctIndex: 0,
            feedback: 'Los drones de precisión ayudan activamente a vigilar la deforestación y los rellenos.'
        },
        {
            question: '¿A qué animales se les ayuda preparando sus dietas en el voluntariado de NATUWA?',
            options: ['Mamíferos marinos', 'Aves de corral', 'Animales rescatados como perezosos y jaguares'],
            correctIndex: 2,
            feedback: 'Voluntarios ayudan en la dieta de monos, jaguares, dantas y perezosos en NATUWA.'
        },
        {
            question: '¿Cuál recurso hídrico sirve como sitio de "crianza" para peces como corvina y robalo?',
            options: ['El Golfo de Nicoya', 'El Estero de Puntarenas', 'Río Barranca'],
            correctIndex: 1,
            feedback: 'Los alevines crecen seguros en el Estero debido a la protección de las raíces de mangle.'
        },
        {
            question: 'Este esfuerzo digital y tecnológico transforma observadores en "Protectores Costeros":',
            options: ['Redes locales de comercio', 'La Plataforma BioMon ADI', 'Juntas vecinales'],
            correctIndex: 1,
            feedback: 'BioMon ADI busca el monitoreo participativo para salvar el futuro de la biodiversidad.'
        }
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
                        <span>{quizState.score} Medallas</span>
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
                                <h2>Reto Rápido ({quizState.completed ? 'Finalizado' : `${quizState.current + 1}/16`})</h2>
                            </div>
                            <span className="quiz-completed-badge" style={{ background: '#f59e0b', color: 'white' }}>Puntaje: {quizState.score}</span>
                        </div>

                        {quizState.completed ? (
                            <div className="quiz-result-container">
                                <div className="medal-animation medal-shine-container">
                                    <Trophy size={60} color="#f59e0b" />
                                </div>
                                <h3 className="quiz-result-title success">¡Desafío Completado!</h3>
                                <p className="quiz-result-text">Has acertado {quizState.score} de 16 preguntas sobre el Corredor Natural.</p>
                                <button className="btn-retry-quiz" onClick={() => setQuizState({ current: 0, score: 0, answered: false, correct: false, selectedOption: null, completed: false })}>Volver a jugar</button>
                            </div>
                        ) : !quizState.answered ? (
                            <div className="quiz-question-container">
                                <p className="quiz-question-text">
                                    {quizQuestions[quizState.current].question}
                                </p>
                                <div className="quiz-options-list">
                                    {quizQuestions[quizState.current].options.map((opt, i) => (
                                        <div 
                                            key={i} 
                                            className="quiz-option" 
                                            onClick={() => {
                                                const isCorrect = i === quizQuestions[quizState.current].correctIndex;
                                                setQuizState({ ...quizState, answered: true, correct: isCorrect, selectedOption: i, score: isCorrect ? quizState.score + 1 : quizState.score });
                                            }}
                                        >
                                            <span style={{ fontWeight: '500' }}>{['A)', 'B)', 'C)'][i]}</span> {opt} <CheckCircle size={20} className="quiz-option-icon" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="quiz-result-container">
                                {quizState.correct ? (
                                    <>
                                        <div className="medal-animation medal-shine-container">
                                            <Award size={60} color="#f59e0b" />
                                        </div>
                                        <h3 className="quiz-result-title success">¡Correcto!</h3>
                                        <p className="quiz-result-text">{quizQuestions[quizState.current].feedback}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="quiz-fail-icon-container">
                                            <ShieldCheck size={60} color="#ef4444" />
                                        </div>
                                        <h3 className="quiz-result-title fail">Incorrecto</h3>
                                        <p className="quiz-result-text">{quizQuestions[quizState.current].feedback}</p>
                                    </>
                                )}
                                <button 
                                    className="btn-retry-quiz" 
                                    onClick={() => {
                                        if (quizState.current + 1 < quizQuestions.length) {
                                            setQuizState({ ...quizState, current: quizState.current + 1, answered: false, correct: false, selectedOption: null });
                                        } else {
                                            setQuizState({ ...quizState, answered: false, completed: true });
                                        }
                                    }}
                                >
                                    {quizState.current + 1 < quizQuestions.length ? 'Siguiente Pregunta' : 'Ver Resultados'}
                                </button>
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

            {/* MODAL PARA FLORA COSTERA (Índice 0 en exploreTopics) */}
            {selectedTopic === 0 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#2a9d8f15', color: '#2a9d8f' }}>
                                <Leaf size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Flora Costera</h2>
                                <p>Vegetación de transición y ecosistema urbano</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            <p>La zona de Chacarita, que se extiende desde su playa principal hasta el sector de Porto Bello (cerca del Yacht Club), se caracteriza por una vegetación de transición que combina el bosque seco tropical, el ecosistema de manglar y especies ornamentales urbanas. Las plantas más comunes que se pueden observar en este recorrido son:</p>
                            
                            <h3 className="modal-subsection-title" style={{ color: '#2a9d8f' }}>Vegetación de Playa y Litoral</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Son las especies que bordean directamente la costa y están adaptadas a suelos arenosos y salinidad.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Almendro de Playa (Terminalia catappa):</strong> Es uno de los árboles más emblemáticos de la zona. Recientemente se sembraron 300 unidades adicionales como parte del Corredor Natural La Angostura para mitigar la deforestación y proveer sombra en la ruta principal.</li>
                                <li className="modal-list-item border-orange"><strong>Uva de Playa (Coccoloba uvifera):</strong> Un arbusto de hojas redondeadas y coriáceas muy común en la línea de costa de Chacarita y Playa Pochote. Sus frutos son comestibles y atraen a aves y monos.</li>
                                <li className="modal-list-item border-blue"><strong>Palma de Coco (Cocos nucifera):</strong> Aunque es una especie introducida, es omnipresente en los jardines de los hoteles y casas frente al mar en todo el sector de Porto Bello.</li>
                                <li className="modal-list-item border-amber"><strong>Verdolaga de Playa (Sesuvium portulacastrum):</strong> Una planta rastrera suculenta que coloniza las dunas y zonas arenosas cercanas a la marea alta.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#2a9d8f', marginTop: '1.5rem' }}>Flora del Manglar (Sector Estero y Cocal)</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Dado que Porto Bello y gran parte de Chacarita colindan con el Estero de Puntarenas, la vegetación de manglar es fundamental.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Mangle Negro (Avicennia germinans):</strong> Es la especie dominante en las partes internas del manglar de esta zona por su alta tolerancia a la salinidad. Se reconoce por sus raíces que salen del suelo (pneumatóforos).</li>
                                <li className="modal-list-item border-blue"><strong>Mangle Blanco (Laguncularia racemosa):</strong> Muy común por su rápido crecimiento y capacidad de repoblar áreas perturbadas.</li>
                                <li className="modal-list-item border-red"><strong>Mangle Rojo (Rhizophora mangle):</strong> Ubicado en la orilla de los canales del estero, visible desde los puentes y embarcaderos.</li>
                                <li className="modal-list-item border-orange"><strong>Mangle Botoncillo (Conocarpus erectus):</strong> Se encuentra en las partes más secas de la transición entre el manglar y la zona urbana.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#2a9d8f', marginTop: '1.5rem' }}>Árboles Urbanos y Frutales</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>En los barrios de Chacarita y las avenidas principales, predominan especies que brindan sombra y frutos.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Árboles de Sombra:</strong> El Guanacaste (Enterolobium cyclocarpum), el Roble de Sabana (Tabebuia rosea) y el Malinche (Delonix regia) son comunes en los parques y aceras de la comunidad.</li>
                                <li className="modal-list-item border-amber"><strong>Frutales:</strong> En los patios y zonas residenciales abundan los árboles de Mango, Jocote, Nance, Cítricos (limón, naranja) y Papaturro.</li>
                                <li className="modal-list-item border-blue"><strong>Plantas de Jardín:</strong> La Lengua de Suegra (Sansevieria trifasciata) y diversos tipos de Cactus y Suculentas son populares en las viviendas por su resistencia al calor extremo de la zona.</li>
                            </ul>
                            
                            <div className="grid-two-cards" style={{ marginTop: '1.5rem' }}>
                                <div className="info-card-colored bg-green-light grid-full">
                                    <h4 className="text-green-dark">Esfuerzos de Restauración</h4>
                                    <p>Como parte de los esfuerzos de restauración del Corredor Natural La Angostura, también se están introduciendo especies nativas como la Flor Blanca, el Poró y el Vainillo, seleccionadas técnicamente por su capacidad de atraer polinizadores y adaptarse a los suelos salinos del sector.</p>
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

            {/* MODAL PARA FAUNA COSTERA (Índice 1 en exploreTopics) */}
            {selectedTopic === 1 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#f4a26115', color: '#f4a261' }}>
                                <Bird size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Fauna Costera</h2>
                                <p>Reptiles, mamíferos, aves y vida acuática</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            <p>Los animales más comunes que se pueden observar en esta zona específica incluyen:</p>
                            
                            <h3 className="modal-subsection-title" style={{ color: '#f4a261' }}>Reptiles y Anfibios</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Es el grupo más visible para los visitantes y residentes de la zona.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Garrobos e Iguanas:</strong> El garrobo (Ctenosaura similis) es extremadamente común en las áreas secas, tapias y jardines de los hoteles, mientras que la iguana verde (Iguana iguana) suele preferir las ramas de los árboles cerca del agua.</li>
                                <li className="modal-list-item border-amber"><strong>Cocodrilos:</strong> En el Estero de Puntarenas y los canales que bordean Chacarita (barrios San Luis, Bellavista y Fraicaciano) es muy frecuente el avistamiento de cocodrilos americanos (Crocodylus acutus), algunos de gran tamaño (4 a 5 metros), especialmente después de lluvias fuertes cuando pueden aparecer en vías públicas.</li>
                                <li className="modal-list-item border-blue"><strong>Basiliscos:</strong> Conocidos como "lagartijas Jesucristo" por su capacidad de correr sobre el agua, habitan en las orillas de los manglares y el estero.</li>
                                <li className="modal-list-item border-orange"><strong>Tortugas Marinas:</strong> Aunque el desove es limitado por la actividad urbana, se reportan tortugas verdes y carey en las aguas cercanas al muelle y el sector de El Inglés.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#f4a261', marginTop: '1.5rem' }}>Mamíferos</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-orange"><strong>Mapaches y Pizotes:</strong> El mapache (Procyon lotor) y el pizote (Nasua narica) son visitantes habituales en las zonas residenciales y turísticas de Porto Bello, atraídos por la disponibilidad de alimentos.</li>
                                <li className="modal-list-item border-amber"><strong>Monos Carablanca:</strong> En los parches de manglar y árboles altos cerca del Yacht Club y la Angostura, es común ver tropas de monos carablanca (Cebus imitator).</li>
                                <li className="modal-list-item border-green"><strong>Perezosos:</strong> Tanto el perezoso de dos dedos como el de tres dedos habitan en la vegetación costera y de transición de la zona.</li>
                                <li className="modal-list-item border-blue"><strong>Ardillas y Murciélagos:</strong> La ardilla gris es muy común en los árboles de las avenidas, mientras que diversas especies de murciélagos son fundamentales para el control de insectos en la ciudad.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#f4a261', marginTop: '1.5rem' }}>Aves</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>La zona es un punto estratégico para la observación de aves marinas y terrestres.</p>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-blue"><strong>Aves Marinas y Playeras:</strong> Pelícanos pardos, fragatas (tijeretas de mar), gaviotas y diversos tipos de charranes son constantes en la línea de playa.</li>
                                <li className="modal-list-item border-green"><strong>Garzas y aves de Estero:</strong> En las zonas bajas y de manglar abundan la garza real, la garceta azul, el ibis blanco y el martín pescador.</li>
                                <li className="modal-list-item border-red"><strong>Psitácidos:</strong> Es muy común ver y escuchar bandadas de pericos frentirrojos (Psittacara finschi) y loras que cruzan la ciudad al amanecer y atardecer.</li>
                                <li className="modal-list-item border-orange"><strong>Aves Urbanas:</strong> El zanate grande, palomas de Castilla y el yigüirro son omnipresentes en los parques y jardines de Chacarita.</li>
                            </ul>
                            
                            <h3 className="modal-subsection-title" style={{ color: '#f4a261', marginTop: '1.5rem' }}>Fauna Marina e Invertebrados</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-orange"><strong>Cangrejos:</strong> En las zonas de barro del estero y las raíces de los manglares de Chacarita, los cangrejos rojos y los cangrejos violinistas (Uca spp.) son fundamentales en la base de la cadena alimenticia.</li>
                                <li className="modal-list-item border-blue"><strong>Peces del Estero:</strong> Especies como el robalo, el pargo y la corvina son comunes en las aguas del estero, las cuales sirven como sitios de crianza para estos juveniles antes de salir al mar abierto.</li>
                            </ul>

                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* MODAL PARA PROTECCIÓN (Índice 2 en exploreTopics) */}
            {selectedTopic === 2 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#1a73e815', color: '#1a73e8' }}>
                                <ShieldCheck size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Protección y Seguridad</h2>
                                <p>Marco legal, instituciones y vigilancia</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            
                            <h3 className="modal-subsection-title" style={{ color: '#1a73e8' }}>¿Qué los protege?</h3>
                            <p>La zona está bajo la protección legal del <strong>Humedal Estero Puntarenas y Manglares Asociados (HEPyMA)</strong>, declarado Área Silvestre Protegida (ASP) desde el año 2001. Además, existe el <strong>Corredor Natural La Angostura</strong>, una estrategia de conectividad para regenerar el bosque costero y mitigar la deforestación urbana.</p>

                            <h3 className="modal-subsection-title" style={{ color: '#1a73e8', marginTop: '1.5rem' }}>¿Qué instituciones los protegen?</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>SINAC y MINAE:</strong> (Sistema Nacional de Áreas de Conservación y Ministerio de Ambiente y Energía) Son los entes rectores de la administración y vigilancia de los recursos naturales.</li>
                                <li className="modal-list-item border-blue"><strong>Municipalidad de Puntarenas:</strong> Participa activamente en la gestión de corredores biológicos urbanos.</li>
                                <li className="modal-list-item border-orange"><strong>MOPT:</strong> (Dirección de Seguridad y Embellecimiento de Carreteras) Encargado de proteger las zonas verdes y derechos de vía en la ruta de la Angostura.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#1a73e8', marginTop: '1.5rem' }}>¿Qué medidas de seguridad poseen?</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-amber"><strong>Guardaparques:</strong> Realizan labores fundamentales de control, protección y educación ambiental en el sitio.</li>
                                <li className="modal-list-item border-red"><strong>Monitoreo con Drones:</strong> Se utiliza tecnología de alta precisión para detectar cambios en el terreno, tala ilegal o rellenos en los manglares.</li>
                                <li className="modal-list-item border-blue"><strong>Leyes y Vedas:</strong> Existen prohibiciones permanentes (vedas) para la extracción de especies vulnerables, como la chucheca, y leyes estrictas contra el tráfico de vida silvestre.</li>
                            </ul>

                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* MODAL PARA VOLUNTARIADO (Índice 4 en exploreTopics) */}
            {selectedTopic === 4 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#e6394615', color: '#e63946' }}>
                                <Users size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Voluntariados Activos</h2>
                                <p>Organizaciones y actividades en la zona</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            
                            <h3 className="modal-subsection-title" style={{ color: '#e63946' }}>¿Dónde se organizan los voluntariados?</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Fundación Tierra Pura:</strong> Lidera proyectos masivos de restauración de manglares en el Estero.</li>
                                <li className="modal-list-item border-orange"><strong>NATUWA (Santuario de Vida Silvestre):</strong> Ubicado cerca de Aranjuez, ofrece programas de voluntariado para el rescate y cuidado de fauna neotropical.</li>
                                <li className="modal-list-item border-blue"><strong>FUNBAM (Fundación Banco Ambiental):</strong> Organiza jornadas de reforestación en la zona de la Angostura junto a empresas privadas y el gobierno.</li>
                                <li className="modal-list-item border-amber"><strong>Universidades (UNED y UCR):</strong> Estudiantes y voluntarios realizan jornadas periódicas de limpieza y educación ambiental en las playas de Puntarenas y Chacarita.</li>
                            </ul>

                            <h3 className="modal-subsection-title" style={{ color: '#e63946', marginTop: '1.5rem' }}>¿Qué actividades se realizan?</h3>
                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>Reforestación Costera:</strong> Siembra de árboles nativos como el almendro de playa, flor blanca y mangle botoncillo para crear bosques urbanos.</li>
                                <li className="modal-list-item border-blue"><strong>Limpieza de Playas y Manglares:</strong> Recolección de residuos sólidos y plásticos para evitar daños ecológicos y mejorar el atractivo turístico.</li>
                                <li className="modal-list-item border-amber"><strong>Restauración Hidrológica:</strong> Participación en cuadrillas locales para abrir y limpiar canales que permitan el flujo natural del agua en los manglares.</li>
                                <li className="modal-list-item border-orange"><strong>Apoyo en el Cuidado de Fauna:</strong> En santuarios como NATUWA, los voluntarios ayudan en la preparación de dietas para animales rescatados (monos, perezosos, jaguares) y el mantenimiento de sus recintos.</li>
                                <li className="modal-list-item border-red"><strong>Educación Ambiental:</strong> Colaboración en charlas y talleres para concientizar a la comunidad sobre el valor de los ecosistemas locales.</li>
                            </ul>

                        </div>
                        <div className="modal-footer-center">
                            <button className="btn-modal-action" onClick={() => setSelectedTopic(null)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PARA CONÓCENOS (Índice 5 en exploreTopics) */}
            {selectedTopic === 5 && (
                <div className="history-modal-overlay">
                    <div className="history-modal-container">
                        <button className="btn-modal-close" onClick={() => setSelectedTopic(null)}>
                            <span className="modal-close-icon">&times;</span>
                        </button>
                        <div className="modal-header-flex">
                            <div className="modal-header-icon-box" style={{ background: '#8ac92615', color: '#8ac926' }}>
                                <HeartHandshake size={40} />
                            </div>
                            <div className="modal-header-text">
                                <h2>Conócenos</h2>
                                <p>Misión, Visión y el origen de BioMon ADI</p>
                            </div>
                        </div>
                        
                        <div className="modal-body-scrollable">
                            
                            <div className="grid-two-cards" style={{ marginBottom: '1.5rem' }}>
                                <div className="info-card-colored bg-green-light">
                                    <h4 className="text-green-dark" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Misión</h4>
                                    <p>Restaurar y preservar la conectividad ecológica del Corredor Natural La Angostura mediante la reforestación estratégica con especies nativas, el monitoreo biológico participativo y la educación ambiental integral. Buscamos transformar la matriz urbana de Puntarenas en un paisaje resiliente que genere empleos verdes, empodere a la comunidad local y garantice un refugio seguro para la biodiversidad costera.</p>
                                </div>
                                <div className="info-card-colored bg-blue-light">
                                    <h4 className="text-blue-dark" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Visión</h4>
                                    <p>Ser la plataforma comunitaria líder en la gestión de corredores biológicos urbanos en Costa Rica, reconocida por integrar tecnología de monitoreo, participación ciudadana y sostenibilidad socioeconómica. Aspiramos a convertir a Puntarenas en un modelo global de convivencia armónica entre el desarrollo humano y la naturaleza, donde la identidad cultural y la salud del ecosistema prosperen de la mano.</p>
                                </div>
                            </div>
                            
                            <h3 className="modal-subsection-title" style={{ color: '#8ac926' }}>¿Por qué se creó BioMon ADI?</h3>
                            <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1rem' }}>La plataforma BioMon ADI nació como una respuesta tecnológica y comunitaria a una crisis ambiental histórica en Puntarenas. Los motivos principales de su creación son:</p>

                            <ul className="modal-list-elegant">
                                <li className="modal-list-item border-green"><strong>De la Fragmentación a la Conectividad:</strong> Históricamente, La Angostura era un tómbolo natural de manglares y arena. La urbanización y la construcción de carreteras convirtieron este paso vital en una "barrera de asfalto" que aisló a las especies. BioMon ADI se crea para gestionar el "renacer" de este ecosistema, reconstruyendo el puente biológico necesario para la fauna.</li>
                                <li className="modal-list-item border-orange"><strong>Mitigación de la Pérdida de Bosque:</strong> Entre 2002 y 2024, Puntarenas perdió más de 4,380 hectáreas de bosque primario. BioMon ADI surge para centralizar los esfuerzos de reforestación (como la siembra de almendros de playa, mangle botoncillo y flor blanca) y asegurar que cada árbol plantado contribuya a la captura de carbono y a la resiliencia climática.</li>
                                <li className="modal-list-item border-blue"><strong>Empoderamiento y Empleos Verdes:</strong> El proyecto no es solo ambiental, sino social. Se creó para administrar y visibilizar los "Empleos Verdes", dando prioridad a mujeres de la zona y ofreciendo capacitación integral en áreas que van desde la educación financiera hasta la ciberhigiene.</li>
                                <li className="modal-list-item border-amber"><strong>Ciencia Ciudadana y Monitoreo:</strong> La "Bio" en BioMon se refiere al monitoreo biológico. La página busca que los vecinos de Chacarita, El Carmen y La Angostura dejen de ser espectadores y se conviertan en "Protectores Costeros", utilizando herramientas digitales para registrar avistamientos de fauna y el estado de la flora sembrada.</li>
                                <li className="modal-list-item border-red"><strong>Alianza Interinstitucional:</strong> Se creó como el núcleo digital del convenio entre la ADI La Angostura, Coopenae-Wink, FUNBAM, el MOPT y la Municipalidad de Puntarenas, facilitando la transparencia y la participación comunitaria en el desarrollo sostenible de la región.</li>
                            </ul>

                            <div className="info-card-colored" style={{ background: '#8ac92620', borderLeft: '4px solid #8ac926', marginTop: '1.5rem', padding: '1rem' }}>
                                <p style={{ margin: 0, fontWeight: '500', color: '#333' }}>
                                    Esta plataforma representa el compromiso de <strong>"salvar el futuro juntos"</strong>, transformando un punto crítico de vulnerabilidad en un motor de vida y aprendizaje para las nuevas generaciones de puntarenenses.
                                </p>
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
