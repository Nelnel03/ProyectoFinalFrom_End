import React, { useState, useEffect } from 'react';
import services from '../services/services';
import Swal from 'sweetalert2';
import '../styles/ReporteForm.css';

function ReporteForm({ user, onReportSubmitted }) {
  const [fase, setFase] = useState('inicio'); // 'inicio', 'trabajando', 'revision'
  const [tipoTarea, setTipoTarea] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [pruebas, setPruebas] = useState('');
  const [enviando, setEnviando] = useState(false);

  const tareasDisponibles = [
    "Mantenimiento",
    "Plantación",
    "Recolección de plásticos y basura",
    "Colocación de abonos"
  ];

  // Recuperar sesión activa de localStorage al cargar
  useEffect(() => {
    if (!user?.id) return;
    const savedSession = localStorage.getItem(`vol_session_${user.id}`);
    if (savedSession) {
      const { start, task } = JSON.parse(savedSession);
      setStartTime(new Date(start));
      setTipoTarea(task);
      setFase('trabajando');
    }
  }, [user?.id]);

  const handleIniciarTrabajo = () => {
    if (!tipoTarea) {
      Swal.fire('Atención', 'Por favor selecciona el tipo de trabajo.', 'warning');
      return;
    }
    const now = new Date();
    setStartTime(now);
    setFase('trabajando');
    if (user?.id) {
        localStorage.setItem(`vol_session_${user.id}`, JSON.stringify({
          start: now.toISOString(),
          task: tipoTarea
        }));
    }
  };

  const handleFinalizarTrabajo = () => {
    const now = new Date();
    setEndTime(now);
    setFase('revision');
    if (user?.id) {
        localStorage.removeItem(`vol_session_${user.id}`);
    }
  };

  const calcularHoras = () => {
    if (!startTime || !endTime) return 0;
    const diffMs = endTime - startTime;
    return (diffMs / 3600000).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pruebas.trim()) {
      Swal.fire('Atención', 'Debes adjuntar pruebas de tu trabajo (URL o descripción de evidencia).', 'warning');
      return;
    }

    if (pruebas.trim().length < 15) {
      Swal.fire('Atención', 'La descripción de las pruebas debe tener al menos 15 caracteres.', 'warning');
      return;
    }

    setEnviando(true);

    const horasTrabajadas = calcularHoras();
    const nuevoReporte = {
      voluntarioId: user?.id || 'anonimo',
      voluntarioNombre: user?.nombre || 'Anónimo',
      voluntarioEmail: user?.email || 'Sin correo',
      tipoTarea,
      horaInicio: startTime.toLocaleTimeString(),
      horaFin: endTime.toLocaleTimeString(),
      horas: parseFloat(horasTrabajadas),
      tareas: comentarios || `Trabajo de ${tipoTarea}`,
      pruebas,
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
          if (user?.id) {
            localStorage.removeItem(`vol_session_${user.id}`);
          }
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
    <div className="reporte-form-card">
      
      {fase === 'inicio' && (
        <div className="form-content-center">
          <h2 className="form-main-title">Iniciar Nueva Tarea</h2>
          <p className="form-subtitle">Selecciona el tipo de trabajo que vas a realizar hoy.</p>
          
          <div className="form-group-margin">
            <select
              value={tipoTarea}
              onChange={(e) => setTipoTarea(e.target.value)}
              className="task-select"
            >
              <option value="">-- Selecciona una labor --</option>
              {tareasDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button
            onClick={handleIniciarTrabajo}
            className="start-work-btn"
          >
            Iniciar Trabajo
          </button>
        </div>
      )}

      {fase === 'trabajando' && (
        <div className="form-content-center">
          <h2 className="form-main-title">Tarea en progreso</h2>
          <h3 className="task-in-progress-title">{tipoTarea}</h3>
          
          <div className="timer-box">
            <p className="timer-active-text">El tiempo se está registrando...</p>
            <p className="timer-hint">Puedes cerrar esta página y volver cuando termines.</p>
          </div>

          <p className="start-time-text">Iniciado a las: {startTime ? startTime.toLocaleTimeString() : '--:--'}</p>

          <div className="btn-group">
            <button
              onClick={handleCancelar}
              className="cancel-btn"
            >
              Cancelar
            </button>
            <button
              onClick={handleFinalizarTrabajo}
              className="finish-btn"
            >
              Finalizar y Reportar
            </button>
          </div>
        </div>
      )}

      {fase === 'revision' && (
        <div>
          <h2 className="form-main-title form-content-center">Resumen del Trabajo</h2>
          
          <div className="report-summary">
            <p><strong>Labor:</strong> {tipoTarea}</p>
            <p><strong>Inicio:</strong> {startTime ? startTime.toLocaleTimeString() : '--:--'}</p>
            <p><strong>Fin:</strong> {endTime ? endTime.toLocaleTimeString() : '--:--'}</p>
            <p className="summary-total-hours">
              <strong>Total Horas:</strong> {calcularHoras()}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group-margin">
              <label className="form-label-bold">
                Pruebas del trabajo (Link o descripción):
              </label>
              <input
                type="text"
                value={pruebas}
                onChange={(e) => setPruebas(e.target.value)}
                placeholder="Pega aquí el link de tus fotos o describe la evidencia..."
                required
                className="evidence-input"
              />
            </div>

            <div className="form-group-margin">
              <label className="obs-label-gray">
                Comentarios adicionales (opcional):
              </label>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Describe qué lograste hoy..."
                rows="3"
                className="obs-textarea"
              />
            </div>

            <div className="btn-group">
              <button
                type="button"
                onClick={handleCancelar}
                className="back-btn"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="submit-report-btn"
              >
                {enviando ? 'Enviando...' : 'Enviar Reporte'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ReporteForm;
