import React, { useState, useEffect } from 'react';
import services from '../services/services';
import Swal from 'sweetalert2';

function ReporteForm({ user, onReportSubmitted }) {
  const [fase, setFase] = useState('inicio'); // 'inicio', 'trabajando', 'revision'
  const [tipoTarea, setTipoTarea] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState('00:00:00');

  const tareasDisponibles = [
    "Mantenimiento",
    "Plantación",
    "Recolección de plásticos y basura",
    "Colocación de abonos"
  ];

  // Recuperar sesión activa de sessionStorage al cargar
  useEffect(() => {
    const savedSession = sessionStorage.getItem(`vol_session_${user.id}`);
    if (savedSession) {
      const { start, task } = JSON.parse(savedSession);
      setStartTime(new Date(start));
      setTipoTarea(task);
      setFase('trabajando');
    }
  }, [user.id]);

  // Timer para mostrar tiempo en vivo
  useEffect(() => {
    let interval;
    if (fase === 'trabajando' && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now - startTime;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setTiempoTranscurrido(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [fase, startTime]);

  const handleIniciarTrabajo = () => {
    if (!tipoTarea) {
      Swal.fire('Atención', 'Por favor selecciona el tipo de trabajo.', 'warning');
      return;
    }
    const now = new Date();
    setStartTime(now);
    setFase('trabajando');
    sessionStorage.setItem(`vol_session_${user.id}`, JSON.stringify({
      start: now.toISOString(),
      task: tipoTarea
    }));
  };

  const handleFinalizarTrabajo = () => {
    const now = new Date();
    setEndTime(now);
    setFase('revision');
    sessionStorage.removeItem(`vol_session_${user.id}`);
  };

  const calcularHoras = () => {
    if (!startTime || !endTime) return 0;
    const diffMs = endTime - startTime;
    return (diffMs / 3600000).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const horasTrabajadas = calcularHoras();
    const nuevoReporte = {
      voluntarioId: user.id,
      voluntarioNombre: user.nombre,
      tipoTarea,
      horaInicio: startTime.toLocaleTimeString(),
      horaFin: endTime.toLocaleTimeString(),
      horas: parseFloat(horasTrabajadas),
      tareas: comentarios || `Trabajo de ${tipoTarea}`,
      fecha: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      estado: 'enviado'
    };

    try {
      await services.postReporteVoluntariado(nuevoReporte);
      Swal.fire('¡Éxito!', 'Tu reporte ha sido enviado al administrador.', 'success');
      if (onReportSubmitted) onReportSubmitted();
    } catch (error) {
      Swal.fire('Error', 'No se pudo enviar el reporte.', 'error');
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    if (fase === 'trabajando') {
      Swal.fire({
        title: '¿Cancelar trabajo actual?',
        text: "Se perderá el registro del tiempo actual.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonText: 'No, seguir trabajando',
        confirmButtonText: 'Sí, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.removeItem(`vol_session_${user.id}`);
          setFase('inicio');
          setStartTime(null);
          setTipoTarea('');
        }
      });
    } else {
      setFase('inicio');
      setStartTime(null);
      setEndTime(null);
    }
  };

  return (
    <div className="reporte-form-container" style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      marginTop: '2rem',
      maxWidth: '600px',
      margin: '2rem auto',
      borderTop: '5px solid #1a4d2e'
    }}>
      
      {fase === 'inicio' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#1a4d2e', marginBottom: '1.5rem' }}>🔧 Iniciar Nueva Tarea</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Selecciona el tipo de trabajo que vas a realizar hoy.</p>
          
          <div style={{ marginBottom: '2rem' }}>
            <select
              value={tipoTarea}
              onChange={(e) => setTipoTarea(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid #e5e7eb',
                fontSize: '1.1rem',
                appearance: 'none',
                backgroundColor: '#f9fafb',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Selecciona una labor --</option>
              {tareasDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button
            onClick={handleIniciarTrabajo}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#1a4d2e',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'transform 0.1s, background-color 0.2s',
              boxShadow: '0 4px 10px rgba(26, 77, 46, 0.3)'
            }}
          >
            ▶️ Iniciar Trabajo
          </button>
        </div>
      )}

      {fase === 'trabajando' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👷</div>
          <h2 style={{ color: '#1a4d2e', marginBottom: '0.5rem' }}>Trabajando en:</h2>
          <h3 style={{ color: '#2e6b46', marginBottom: '2rem', fontSize: '1.5rem' }}>{tipoTarea}</h3>
          
          <div style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            fontFamily: 'monospace',
            color: '#1a4d2e',
            backgroundColor: '#f0fdf4',
            padding: '1rem',
            borderRadius: '15px',
            marginBottom: '2rem',
            border: '2px solid #34d399'
          }}>
            {tiempoTranscurrido}
          </div>

          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Empezaste a las: {startTime.toLocaleTimeString()}</p>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={handleCancelar}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🛑 Cancelar
            </button>
            <button
              onClick={handleFinalizarTrabajo}
              style={{
                flex: 2,
                padding: '12px',
                backgroundColor: '#1a4d2e',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              🏁 Finalizar y Reportar
            </button>
          </div>
        </div>
      )}

      {fase === 'revision' && (
        <div>
          <h2 style={{ color: '#1a4d2e', marginBottom: '1.5rem', textAlign: 'center' }}>✅ Resumen del Trabajo</h2>
          
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            borderLeft: '4px solid #1a4d2e'
          }}>
            <p><strong>Labor:</strong> {tipoTarea}</p>
            <p><strong>Inicio:</strong> {startTime.toLocaleTimeString()}</p>
            <p><strong>Fin:</strong> {endTime.toLocaleTimeString()}</p>
            <p style={{ fontSize: '1.2rem', color: '#1a4d2e', marginTop: '10px' }}>
              <strong>Total Horas:</strong> {calcularHoras()}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Comentarios adicionales (opcional):
              </label>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Describe brevemente lo que hiciste..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleCancelar}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#e5e7eb',
                  color: '#4b5563',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ⬅️ Atrás
              </button>
              <button
                type="submit"
                disabled={enviando}
                style={{
                  flex: 2,
                  padding: '12px',
                  backgroundColor: enviando ? '#9ca3af' : '#1a4d2e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  cursor: enviando ? 'not-allowed' : 'pointer'
                }}
              >
                {enviando ? 'Enviando...' : '🚀 Enviar Reporte'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ReporteForm;
