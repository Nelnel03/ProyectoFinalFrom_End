import React, { useState } from 'react';
import { Gamepad2, Trophy, Star, ChevronRight, CheckCircle, Brain } from 'lucide-react';
import '../styles/History.css';

const HistoryQuiz = () => {
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

    const [quizState, setQuizState] = useState({ current: 0, score: 0, answered: false, correct: false, selectedOption: null, completed: false });

    const handleAnswer = (idx) => {
        if (quizState.answered) return;
        const isCorrect = idx === quizQuestions[quizState.current].correctIndex;
        setQuizState(prev => ({
            ...prev,
            answered: true,
            selectedOption: idx,
            correct: isCorrect,
            score: isCorrect ? prev.score + 1 : prev.score
        }));
    };

    const nextQuestion = () => {
        if (quizState.current < quizQuestions.length - 1) {
            setQuizState(prev => ({
                ...prev,
                current: prev.current + 1,
                answered: false,
                selectedOption: null,
                correct: false
            }));
        } else {
            setQuizState(prev => ({ ...prev, completed: true }));
        }
    };

    const restartQuiz = () => {
        setQuizState({ current: 0, score: 0, answered: false, correct: false, selectedOption: null, completed: false });
    };

    return (
        <div className="history-section history-quiz-section" style={{maxWidth: '800px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)'}}>
            <div className="section-icon-box quiz-bg" style={{background: '#f59e0b15', color: '#f59e0b', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'}}>
                <Gamepad2 size={32} />
            </div>
            <h2 className="section-title" style={{fontSize: '1.8rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem'}}>¡Pon a prueba tu conocimiento!</h2>
            <p className="section-subtitle" style={{color: '#64748b', marginBottom: '2rem'}}>Completa este desafío para ganar medallas de honor.</p>

            {!quizState.completed ? (
                <div className="quiz-card" style={{background: '#f8fafc', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0'}}>
                    <div className="quiz-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                        <div className="quiz-progress-text">
                            <span style={{fontSize: '0.9rem', color: '#64748b'}}>Pregunta {quizState.current + 1} de {quizQuestions.length}</span>
                        </div>
                        <div className="quiz-medals" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef3c7', padding: '0.4rem 0.8rem', borderRadius: '12px'}}>
                            <Trophy size={16} color="#f59e0b" />
                            <span style={{fontWeight: '700', color: '#92400e'}}>{quizState.score}</span>
                        </div>
                    </div>

                    <h3 className="quiz-question" style={{fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem', lineHeight: '1.4'}}>
                        {quizQuestions[quizState.current].question}
                    </h3>

                    <div className="quiz-options" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                        {quizQuestions[quizState.current].options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`quiz-option-btn ${quizState.answered ? (idx === quizQuestions[quizState.current].correctIndex ? 'correct' : (idx === quizState.selectedOption ? 'wrong' : '')) : ''}`}
                                onClick={() => handleAnswer(idx)}
                                disabled={quizState.answered}
                                style={{
                                    padding: '1rem 1.5rem',
                                    borderRadius: '12px',
                                    border: '2px solid #e2e8f0',
                                    background: 'white',
                                    textAlign: 'left',
                                    cursor: quizState.answered ? 'default' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    color: '#475569',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {opt}
                                {quizState.answered && idx === quizQuestions[quizState.current].correctIndex && (
                                    <CheckCircle size={20} color="#10b981" />
                                )}
                            </button>
                        ))}
                    </div>

                    {quizState.answered && (
                        <div className={`quiz-feedback-box ${quizState.correct ? 'success' : 'info'}`} style={{marginTop: '1.5rem', padding: '1.25rem', borderRadius: '15px', background: quizState.correct ? '#ecfdf5' : '#eff6ff', border: `1px solid ${quizState.correct ? '#10b98130' : '#3b82f630'}`}}>
                            <div style={{display: 'flex', gap: '0.75rem'}}>
                                <Star size={20} color={quizState.correct ? '#10b981' : '#3b82f6'} style={{flexShrink: 0}} />
                                <p style={{fontSize: '0.95rem', color: quizState.correct ? '#065f46' : '#1e3a8a', margin: 0}}>
                                    {quizQuestions[quizState.current].feedback}
                                </p>
                            </div>
                            <button className="btn-next-question" onClick={nextQuestion} style={{marginTop: '1rem', width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#1e293b', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                                {quizState.current === quizQuestions.length - 1 ? 'Ver Resultado' : 'Siguiente Pregunta'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="quiz-result-card" style={{textAlign: 'center', background: '#f8fafc', padding: '3rem 2rem', borderRadius: '24px', border: '2px dashed #cbd5e1'}}>
                    <div style={{width: '80px', height: '80px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
                        <Trophy size={40} color="#f59e0b" />
                    </div>
                    <h3 style={{fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem'}}>¡Misión cumplida!</h3>
                    <p style={{color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem'}}>Has finalizado el desafío del Corredor Biológico.</p>
                    
                    <div className="result-stats" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem'}}>
                        <div style={{background: 'white', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'}}>
                            <span style={{display: 'block', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Preguntas</span>
                            <span style={{fontSize: '1.8rem', fontWeight: '800', color: '#1e293b'}}>{quizQuestions.length}</span>
                        </div>
                        <div style={{background: 'white', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'}}>
                            <span style={{display: 'block', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Medallas</span>
                            <span style={{fontSize: '1.8rem', fontWeight: '800', color: '#f59e0b'}}>{quizState.score}</span>
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '1rem'}}>
                        <button onClick={restartQuiz} style={{flex: 1, padding: '1rem', borderRadius: '15px', background: 'white', color: '#1e293b', border: '2px solid #e2e8f0', fontWeight: '700', cursor: 'pointer'}}>Reintentar</button>
                        <button style={{flex: 2, padding: '1rem', borderRadius: '15px', background: 'var(--primary-green)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer'}}>Certificar Puntos</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryQuiz;
