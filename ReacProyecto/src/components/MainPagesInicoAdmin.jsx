import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services/services';
import '../styles/Arboles.css';

const FORM_INICIAL = {
  nombre: '',
  nombreCientifico: '',
  familia: '',
  altura: '',
  crecimiento: '',
  clima: '',
  descripcion: '',
  usos: '',
  cuidados: '',
  imagenUrl: '',
  estado: 'vivo',
  fechaRegistro: new Date().toISOString().split('T')[0],
};

function MainPagesInicoAdmin() {
  const [adminName, setAdminName] = useState('Administrador');
  const [arboles, setArboles] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [tab, setTab] = useState('lista'); // 'lista' | 'agregar'
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // ── Autenticación y carga inicial ───────────────────────────────────────────
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');

    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.rol !== 'admin') {
      navigate('/user');
      return;
    }

    setAdminName(user.nombre);
    cargarArboles();
  }, [navigate]);

  const cargarArboles = async () => {
    setCargando(true);
    try {
      const datos = await services.getArboles();
      setArboles(datos || []);
    } catch (err) {
      mostrarMensaje('Error al cargar los árboles.', 'error');
    } finally {
      setCargando(false);
    }
  };

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3500);
  };

  // ── Handlers del formulario ─────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      mostrarMensaje('El nombre del árbol es obligatorio.', 'error');
      return;
    }

    try {
      if (modoEdicion) {
        await services.putArboles(form, idEditando);
        mostrarMensaje(`✅ Árbol "${form.nombre}" actualizado correctamente.`);
      } else {
        await services.postArboles(form);
        mostrarMensaje(`✅ Árbol "${form.nombre}" agregado correctamente.`);
      }
      resetForm();
      setTab('lista');
      await cargarArboles();
    } catch (err) {
      mostrarMensaje('Error al guardar el árbol. Revise la conexión.', 'error');
    }
  };

  const handleEditar = (arbol) => {
    setForm({ ...FORM_INICIAL, ...arbol });
    setModoEdicion(true);
    setIdEditando(arbol.id);
    setTab('agregar');
  };

  const handleEliminar = async (arbol) => {
    if (!window.confirm(`¿Eliminar el árbol "${arbol.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await services.deleteArboles(arbol.id);
      mostrarMensaje(`🗑️ Árbol "${arbol.nombre}" eliminado.`);
      await cargarArboles();
    } catch (err) {
      mostrarMensaje('Error al eliminar el árbol.', 'error');
    }
  };

  const resetForm = () => {
    setForm({
      ...FORM_INICIAL,
      fechaRegistro: new Date().toISOString().split('T')[0],
    });
    setModoEdicion(false);
    setIdEditando(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1>🌳 Panel de Administración</h1>
          <p>Bienvenido, <strong>{adminName}</strong> — Gestión de especies forestales</p>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Cerrar sesión
        </button>
      </header>

      <main className="admin-main">
        {/* Mensaje de feedback */}
        {mensaje.texto && (
          <div className={`admin-msg ${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

        {/* Tabs de navegación */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'lista' ? 'active' : ''}`}
            onClick={() => { setTab('lista'); resetForm(); }}
          >
            📋 Lista de Árboles ({arboles.length})
          </button>
          <button
            className={`admin-tab ${tab === 'agregar' ? 'active' : ''}`}
            onClick={() => { setTab('agregar'); resetForm(); }}
          >
            {modoEdicion ? '✏️ Editar Árbol' : '➕ Agregar Árbol'}
          </button>
        </div>

        {/* ──── TAB: LISTA ──── */}
        {tab === 'lista' && (
          <div>
            <div className="admin-section-header">
              <h2>Especies Registradas</h2>
              <button className="admin-add-btn" onClick={() => setTab('agregar')}>
                ➕ Nuevo Árbol
              </button>
            </div>

            {cargando ? (
              <div style={{ textAlign: 'center', color: '#86bfa4', padding: '3rem' }}>
                Cargando árboles...
              </div>
            ) : arboles.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#4d7a63', padding: '3rem', fontSize: '1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌲</div>
                <p>No hay árboles registrados. ¡Agrega el primero!</p>
              </div>
            ) : (
              <div className="admin-arboles-lista">
                {arboles.map((arbol) => (
                  <div key={arbol.id} className="admin-arbol-card">
                    {arbol.imagenUrl ? (
                      <img
                        src={arbol.imagenUrl}
                        alt={arbol.nombre}
                        className="admin-arbol-card-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="admin-arbol-card-img-placeholder"
                      style={{ display: arbol.imagenUrl ? 'none' : 'flex' }}
                    >
                      🌳
                    </div>

                    <div className="admin-arbol-card-body">
                      <p className="admin-arbol-card-nombre">{arbol.nombre}</p>
                      <p className="admin-arbol-card-cientifico">
                        {arbol.nombreCientifico || '—'}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: '#66937a', marginBottom: '0.8rem' }}>
                        {arbol.clima ? `🌍 ${arbol.clima}` : ''}{' '}
                        {arbol.altura ? `• 📏 ${arbol.altura}` : ''}
                      </p>
                      <div className="admin-arbol-card-actions">
                        <button
                          className="admin-btn-editar"
                          onClick={() => handleEditar(arbol)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="admin-btn-eliminar"
                          onClick={() => handleEliminar(arbol)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ──── TAB: FORMULARIO ──── */}
        {tab === 'agregar' && (
          <div className="admin-form-card">
            <h2>{modoEdicion ? '✏️ Editar árbol' : '➕ Registrar nuevo árbol'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">

                {/* Nombre */}
                <div className="admin-form-group">
                  <label htmlFor="nombre">Nombre común *</label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Roble, Ceiba, Guanacaste..."
                    required
                  />
                </div>

                {/* Nombre científico */}
                <div className="admin-form-group">
                  <label htmlFor="nombreCientifico">Nombre científico</label>
                  <input
                    id="nombreCientifico"
                    type="text"
                    name="nombreCientifico"
                    value={form.nombreCientifico}
                    onChange={handleChange}
                    placeholder="Ej: Quercus robur"
                  />
                </div>

                {/* Familia */}
                <div className="admin-form-group">
                  <label htmlFor="familia">Familia botánica</label>
                  <input
                    id="familia"
                    type="text"
                    name="familia"
                    value={form.familia}
                    onChange={handleChange}
                    placeholder="Ej: Fagaceae"
                  />
                </div>

                {/* Altura */}
                <div className="admin-form-group">
                  <label htmlFor="altura">Altura promedio</label>
                  <input
                    id="altura"
                    type="text"
                    name="altura"
                    value={form.altura}
                    onChange={handleChange}
                    placeholder="Ej: 20-40 metros"
                  />
                </div>

                {/* Crecimiento */}
                <div className="admin-form-group">
                  <label htmlFor="crecimiento">Velocidad de crecimiento</label>
                  <input
                    id="crecimiento"
                    type="text"
                    name="crecimiento"
                    value={form.crecimiento}
                    onChange={handleChange}
                    placeholder="Ej: Lento (30-60 cm por año)"
                  />
                </div>

                {/* Clima */}
                <div className="admin-form-group">
                  <label htmlFor="clima">Clima ideal</label>
                  <input
                    id="clima"
                    type="text"
                    name="clima"
                    value={form.clima}
                    onChange={handleChange}
                    placeholder="Ej: Tropical húmedo"
                  />
                </div>

                {/* Estado */}
                <div className="admin-form-group">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                  >
                    <option value="vivo">Vivo</option>
                    <option value="en_riesgo">En riesgo</option>
                    <option value="extinto">Extinto</option>
                    <option value="protegido">Protegido</option>
                  </select>
                </div>

                {/* Fecha de registro */}
                <div className="admin-form-group">
                  <label htmlFor="fechaRegistro">Fecha de registro</label>
                  <input
                    id="fechaRegistro"
                    type="date"
                    name="fechaRegistro"
                    value={form.fechaRegistro}
                    onChange={handleChange}
                  />
                </div>

                {/* URL de imagen - full width */}
                <div className="admin-form-group admin-form-full">
                  <label htmlFor="imagenUrl">URL de la imagen</label>
                  <input
                    id="imagenUrl"
                    type="url"
                    name="imagenUrl"
                    value={form.imagenUrl}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen-del-arbol.jpg"
                  />
                  {/* Preview de imagen */}
                  <div className="admin-img-preview-wrap">
                    {form.imagenUrl ? (
                      <img
                        src={form.imagenUrl}
                        alt="Vista previa"
                        className="admin-img-preview"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="admin-img-preview-wrap"
                      style={{
                        display: form.imagenUrl ? 'none' : 'flex',
                        border: 'none',
                        height: '100%',
                      }}
                    >
                      <span className="admin-img-no-preview">🖼️</span>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="admin-form-group admin-form-full">
                  <label htmlFor="descripcion">Descripción general</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Describe el árbol: historia, características destacadas, importancia ecológica..."
                  />
                </div>

                {/* Usos */}
                <div className="admin-form-group admin-form-full">
                  <label htmlFor="usos">Usos</label>
                  <textarea
                    id="usos"
                    name="usos"
                    rows={2}
                    value={form.usos}
                    onChange={handleChange}
                    placeholder="Ej: Madera, medicina, alimentación, construcción..."
                  />
                </div>

                {/* Cuidados */}
                <div className="admin-form-group admin-form-full">
                  <label htmlFor="cuidados">Cuidados y cultivo</label>
                  <textarea
                    id="cuidados"
                    name="cuidados"
                    rows={2}
                    value={form.cuidados}
                    onChange={handleChange}
                    placeholder="Ej: Requiere suelo bien drenado, pleno sol, riego moderado..."
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-btn-cancelar"
                  onClick={() => { resetForm(); setTab('lista'); }}
                >
                  Cancelar
                </button>
                <button type="submit" className="admin-btn-guardar">
                  {modoEdicion ? '💾 Guardar cambios' : '➕ Registrar árbol'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default MainPagesInicoAdmin;