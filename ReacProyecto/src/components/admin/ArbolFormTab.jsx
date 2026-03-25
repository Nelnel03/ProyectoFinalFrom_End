import React from 'react';
import '../../styles/MainPagesInicoAdmin.css';

function ArbolFormTab({ 
  modoEdicion, 
  handleSubmit, 
  form, 
  handleChange, 
  modoNuevoTipo, 
  tiposDisponibles, 
  setModoNuevoTipo, 
  setForm, 
  resetForm, 
  setTab 
}) {
  return (
    <div className="admin-form-card">
      <h2>{modoEdicion ? 'Editar árbol' : 'Registrar nuevo árbol'}</h2>

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

          {/* Tipo de árbol */}
          <div className="admin-form-group">
            <label htmlFor="tipo">Tipo de Árbol *</label>
            {!modoNuevoTipo ? (
              <select
                id="tipoSelector"
                name="tipoSelector"
                value={form.tipo}
                onChange={handleChange}
                required
              >
                {tiposDisponibles.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
                ))}
                <option value="___nuevo___" className="admin-select-option-bold">Añadir otro tipo...</option>
              </select>
            ) : (
              <div className="admin-type-input-group">
                <input
                  id="tipo"
                  name="tipo"
                  type="text"
                  value={form.tipo}
                  onChange={handleChange}
                  placeholder="Escribe el nuevo tipo..."
                  required
                  className="admin-type-input"
                />
                <button 
                  type="button" 
                  onClick={() => { setModoNuevoTipo(false); setForm({ ...form, tipo: tiposDisponibles[0] || '' }); }}
                  className="admin-btn-cancel-type"
                >
                  Cancelar
                </button>
              </div>
            )}
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
            <label htmlFor="clima">Clima</label>
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
              <option value="muerto">Muerto</option>
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
              {form.imagenUrl && (
                <img
                  src={form.imagenUrl}
                  alt="Vista previa"
                  className="admin-img-preview"
                  onError={(e) => e.target.classList.add('error')}
                />
              )}
              <div className="admin-img-preview-placeholder">
                <span className="admin-img-no-preview"></span>
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
            {modoEdicion ? 'Guardar cambios' : 'Registrar árbol'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArbolFormTab;
