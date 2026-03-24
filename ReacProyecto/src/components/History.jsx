import React, { useState, useEffect } from 'react';
import {
    BookOpen, Map as MapIcon, Leaf, Bird, ShieldCheck, HeartHandshake,
    Video, FileText, Headphones, Trophy, Star, ChevronRight,
    MessageSquare, Target, Award, Brain, Users, Activity, CheckCircle
} from 'lucide-react';

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
        <div className="history-dashboard-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '4rem', fontFamily: '"Inter", "Montserrat", sans-serif' }}>

            <style>{`
                .history-dashboard-wrapper * { box-sizing: border-box; }
                .glass-header {
                    background: rgba(255,255,255,0.85); backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 50; padding: 1rem 2rem;
                }
                .hover-card {
                    background: white; border-radius: 16px; padding: 1.5rem; text-align: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer; position: relative; overflow: hidden; border: 1px solid rgba(0,0,0,0.04);
                }
                .hover-card:hover {
                    transform: translateY(-8px); box-shadow: 0 12px 25px rgba(0,0,0,0.08);
                }
                .hover-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
                    background: var(--card-color); transform: scaleX(0); transition: transform 0.3s ease; transform-origin: left;
                }
                .hover-card:hover::before { transform: scaleX(1); }

                .interactive-node {
                    display: flex; align-items: center; gap: 15px; padding: 1rem; border-radius: 12px;
                    cursor: pointer; transition: background 0.2s; border-left: 4px solid transparent;
                }
                .interactive-node.active { background: white; border-left: 4px solid #1a73e8; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .interactive-node:hover:not(.active) { background: rgba(255,255,255,0.5); }

                .quiz-option {
                    display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem;
                    background: #f8faf9; border: 2px solid transparent; border-radius: 12px;
                    cursor: pointer; transition: all 0.2s; font-weight: 500; color: #444;
                }
                .quiz-option:hover { background: #eef2f0; }
                .quiz-option.selected.correct { background: #e8f5e9; border-color: #4caf50; color: #2e7d32; }
                .quiz-option.selected.incorrect { background: #ffebee; border-color: #f44336; color: #c62828; }
                .quiz-option.disabled { pointer-events: none; opacity: 0.6; }

                .filter-btn {
                    padding: 0.5rem 1.2rem; border-radius: 30px; border: 1px solid #ddd;
                    background: white; cursor: pointer; transition: all 0.2s; font-weight: 500; color: #555;
                }
                .filter-btn.active { background: #1a73e8; color: white; border-color: #1a73e8; }
                
                @keyframes bounceMedal {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .medal-animation { animation: bounceMedal 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            `}</style>

            {/* BARRA DE PROGRESO */}
            <div style={{ position: 'fixed', top: 0, left: 0, height: '4px', background: '#1a73e8', width: `${scrollProgress}%`, zIndex: 9999, transition: 'width 0.1s ease' }}></div>

            {/* HEADER TIPO DASHBOARD ESTUDIANTE */}
            <header className="glass-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#1a73e8', padding: '10px', borderRadius: '12px' }}>
                        <Brain color="white" size={26} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#1f2937' }}>EduSpace Interactivo</h1>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Dashboard del Estudiante</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '8px 15px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        <Trophy size={18} color="#f59e0b" />
                        <span style={{ fontWeight: 'bold', color: '#374151' }}>{quizState.correct ? '1' : '0'} Medallas</span>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        US
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                {/* SECCIÓN: ¿QUÉ QUIERES APRENDER HOY? (Hover Cards) */}
                <section>
                    <h2 style={{ fontSize: '1.8rem', color: '#1f2937', marginBottom: '1.5rem', fontWeight: '700', paddingLeft: '10px', borderLeft: '4px solid #1a73e8' }}>¿Qué descubriremos hoy?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.2rem' }}>
                        {exploreTopics.map((topic, i) => (
                            <div key={i} className="hover-card" style={{ '--card-color': topic.color }} onClick={() => setSelectedTopic(i)}>
                                <div style={{ background: `${topic.color}15`, width: '60px', height: '60px', margin: '0 auto 15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: topic.color }}>
                                    {topic.icon}
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#374151', fontWeight: '600' }}>{topic.title}</h3>
                                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', opacity: 0.6 }}>
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                    {/* SECCIÓN: MAPA DE CONOCIMIENTO (Línea de tiempo) */}
                    <section style={{ background: '#f5f7fa', padding: '2rem', borderRadius: '20px', border: '1px solid #eaeaea' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                            <Target size={28} color="#1a73e8" />
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937' }}>Ruta de Aprendizaje</h2>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem' }}>
                            {/* Navegación de nodos */}
                            <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                                {/* Línea conectora */}
                                <div style={{ position: 'absolute', left: '26px', top: '30px', bottom: '30px', width: '2px', background: '#e5e7eb', zIndex: 0 }}></div>
                                {knowledgeNodes.map(node => (
                                    <div
                                        key={node.id}
                                        className={`interactive-node ${activeNode === node.id ? 'active' : ''}`}
                                        onClick={() => setActiveNode(node.id)}
                                        style={{ position: 'relative', zIndex: 1 }}
                                    >
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: activeNode === node.id ? '#1a73e8' : 'white', border: `2px solid ${activeNode === node.id ? '#1a73e8' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeNode === node.id ? 'white' : '#9ca3af', transition: 'all 0.2s' }}>
                                            {node.id}
                                        </div>
                                        <span style={{ fontWeight: activeNode === node.id ? '700' : '500', color: activeNode === node.id ? '#1f2937' : '#6b7280' }}>
                                            {node.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Contenido dinámico */}
                            <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ background: '#eff6ff', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a73e8', marginBottom: '1rem' }}>
                                    {knowledgeNodes.find(n => n.id === activeNode)?.icon}
                                </div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '1.2rem' }}>{knowledgeNodes.find(n => n.id === activeNode)?.title}</h3>
                                <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    {knowledgeNodes.find(n => n.id === activeNode)?.content}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN: GAMIFICACIÓN (Pop Quiz) */}
                    <section style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Star size={28} color="#f59e0b" fill="#f59e0b" />
                                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937' }}>Reto Rápido</h2>
                            </div>
                            {quizState.correct && <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>¡Completado!</span>}
                        </div>

                        {!quizState.answered ? (
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '600', color: '#374151', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                                    ¿Cuál es la función principal de las raíces del Mangle Rojo en el estero?
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div className="quiz-option" onClick={() => setQuizState({ answered: true, correct: false, selectedOption: 1 })}>
                                        A) Producir sombra para las iguanas <CheckCircle size={20} color="transparent" />
                                    </div>
                                    <div className="quiz-option" onClick={() => setQuizState({ answered: true, correct: true, selectedOption: 2 })}>
                                        B) Atrapar sedimentos y prevenir la erosión <CheckCircle size={20} color="transparent" />
                                    </div>
                                    <div className="quiz-option" onClick={() => setQuizState({ answered: true, correct: false, selectedOption: 3 })}>
                                        C) Absorbar agua salada para purificarla <CheckCircle size={20} color="transparent" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 0' }}>
                                {quizState.correct ? (
                                    <>
                                        <div className="medal-animation" style={{ background: '#fef3c7', padding: '20px', borderRadius: '50%', marginBottom: '1rem', border: '4px solid #fde68a' }}>
                                            <Award size={60} color="#f59e0b" />
                                        </div>
                                        <h3 style={{ margin: '0 0 10px', color: '#059669', fontSize: '1.5rem' }}>¡Excelente!</h3>
                                        <p style={{ color: '#4b5563', margin: 0 }}>Has ganado una medalla de Protector Costero.</p>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '50%', marginBottom: '1rem' }}>
                                            <ShieldCheck size={60} color="#ef4444" />
                                        </div>
                                        <h3 style={{ margin: '0 0 10px', color: '#b91c1c', fontSize: '1.5rem' }}>Casi lo logras</h3>
                                        <p style={{ color: '#4b5563', margin: '0 0 15px' }}>El Mangle atrapa sedimentos vitales para evitar la erosión.</p>
                                        <button onClick={() => setQuizState({ answered: false, correct: false, selectedOption: null })} style={{ padding: '8px 20px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Reintentar</button>
                                    </>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {/* SECCIÓN: BIBLIOTECA DE RECURSOS */}
                    <section style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            <BookOpen size={28} color="#9b5de5" />
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937' }}>Biblioteca Multimedia</h2>
                        </div>

                        {/* Filtros */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '5px' }}>
                            {['Todos', 'PDF', 'Video', 'Audio'].map(f => (
                                <button key={f} className={`filter-btn ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Lista de Recursos */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                            {filteredResources.map(res => (
                                <div key={res.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', transition: 'box-shadow 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                                    <div style={{ background: `${res.color}15`, padding: '12px', borderRadius: '10px', color: res.color }}>
                                        {res.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#374151' }}>{res.title}</h4>
                                        <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>Recurso en {res.type}</span>
                                    </div>
                                    <ChevronRight size={18} color="#d1d5db" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECCIÓN: ZONA DE COMUNIDAD */}
                    <section style={{ background: 'linear-gradient(135deg, #1a73e8, #4338ca)', padding: '2rem', borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
                            <MessageSquare size={150} color="white" />
                        </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Users size={28} color="white" />
                                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Comunidad Activa</h2>
                            </div>

                            <p style={{ fontSize: '1.05rem', lineHeight: '1.6', opacity: 0.9, marginBottom: '2rem' }}>
                                Únete a la discusión. Comparte tus descubrimientos y sube fotos del corredor geolocalizado. Tu aporte cuenta para el ranking semanal.
                            </p>

                            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
                                    <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>1</div>
                                        Escuela Central
                                    </span>
                                    <span>240 pts</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#9ca3af', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>2</div>
                                        Grupo ADI Vol.
                                    </span>
                                    <span>185 pts</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#b45309', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>3</div>
                                        Tu pos. (Individual)
                                    </span>
                                    <span>65 pts</span>
                                </div>
                            </div>

                            <button style={{ width: '100%', padding: '12px', marginTop: '1.5rem', background: 'white', color: '#1a73e8', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                                Entrar al Foro
                            </button>
                        </div>
                    </section>
                </div>

            </div>

            {/* MODAL PARA EDUCACIÓN (Índice 3 en exploreTopics) */}
            {selectedTopic === 3 && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ background: 'white', borderRadius: '24px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <button onClick={() => setSelectedTopic(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'} onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4b5563', lineHeight: '1' }}>&times;</span>
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                            <div style={{ background: '#9b5de515', padding: '15px', borderRadius: '15px', color: '#9b5de5' }}>
                                <BookOpen size={40} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '2rem', color: '#1f2937', fontWeight: '800' }}>La Angostura</h2>
                                <p style={{ margin: '5px 0 0', color: '#6b7280', fontSize: '1.1rem' }}>Punto geográfico e histórico clave</p>
                            </div>
                        </div>
                        
                        <div style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.7' }}>
                            <p>La Angostura es una franja de tierra estrecha que conecta el distrito de Chacarita con el centro de la ciudad de Puntarenas. Es un punto geográfico e histórico clave para la región, conocido tanto por su formación natural como por los eventos que han marcado la identidad del "Puerto".</p>
                            
                            <h3 style={{ color: '#1f2937', fontSize: '1.3rem', marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Historia y Formación</h3>
                            <p>La formación de esta zona es de origen geomorfológico. Se trata de una "flecha de arena" o lengüeta que se fue creando poco a poco por la acumulación de sedimentos (arena y lodo) arrastrados por las corrientes del río Barranca, la acción de las mareas y los vientos alisios.</p>
                            <p><strong>Instituto Costarricense de Puertos del Pacífico.</strong></p>

                            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1.5rem' }}>
                                <li style={{ background: '#f9fafb', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #1a73e8' }}><strong>Nombre:</strong> El término "Angostura" describe literalmente el paso estrecho de tierra flanqueado por el Estero de Puntarenas a un lado y el Golfo de Nicoya al otro.</li>
                                <li style={{ background: '#f9fafb', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}><strong>Hito histórico:</strong> Fue el escenario de la Batalla de La Angostura en 1860, donde las fuerzas del gobierno derrotaron a los seguidores del expresidente Juan Rafael Mora Porras, quien posteriormente fue fusilado en Puntarenas.</li>
                                <li style={{ background: '#f9fafb', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}><strong>Tragedia:</strong> Un evento doloroso en su historia moderna fue el accidente de un autobús en 1975, conocido como la Tragedia de la Angostura, donde fallecieron 52 personas al caer el vehículo al estero.</li>
                            </ul>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                <span style={{ background: '#ebf8ff', color: '#3182ce', padding: '4px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold' }}>Facebook +4</span>
                            </div>

                            <h3 style={{ color: '#1f2937', fontSize: '1.3rem', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Conservación del Manglar</h3>
                            <p>La idea de conservar el manglar de esta zona nace de la necesidad de proteger un ecosistema que estaba siendo severamente impactado por la actividad humana (96% de pérdida de bosque costero en áreas intervenidas).</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '1.5rem' }}>
                                <div style={{ background: '#ecfdf5', padding: '20px', borderRadius: '16px', border: '1px solid #d1fae5' }}>
                                    <h4 style={{ margin: '0 0 10px', color: '#059669', fontSize: '1.1rem' }}>Origen de la iniciativa</h4>
                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Proviene de una alianza entre instituciones públicas y privadas como el MOPT, la Municipalidad de Puntarenas, el SINAC, y fundaciones como FUNBAM y Coopenae-Wink.</p>
                                </div>
                                <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                                    <h4 style={{ margin: '0 0 10px', color: '#1d4ed8', fontSize: '1.1rem' }}>Corredor Natural</h4>
                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Recientemente se creó el Corredor Natural La Angostura para combatir la pérdida de bosque costero y mitigar los efectos del cambio climático.</p>
                                </div>
                                <div style={{ background: '#fffbeb', padding: '20px', borderRadius: '16px', border: '1px solid #fef3c7', gridColumn: '1 / -1' }}>
                                    <h4 style={{ margin: '0 0 10px', color: '#d97706', fontSize: '1.1rem' }}>Importancia ecológica</h4>
                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Se busca conservar el manglar porque actúa como un filtro biológico, protege contra la erosión y tormentas, y sirve como criadero de especies marinas esenciales para la economía local.</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                            <button onClick={() => setSelectedTopic(null)} style={{ padding: '12px 30px', background: '#9b5de5', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(155, 93, 229, 0.4)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
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
