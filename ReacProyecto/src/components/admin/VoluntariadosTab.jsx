import React from 'react';
import '../../styles/MainPagesInicoAdmin.css';

function VoluntariadosTab({
  modoEdicionVoluntariado,
  handleVoluntariadoSubmit,
  formVoluntariado,
  setFormVoluntariado,
  resetFormVoluntariado,
  voluntariados,
  handleEditarVoluntariado,
  handleEliminarVoluntariado,
  handleConvertirVoluntariadoAUsuario
}) {
  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title-white">Registro de Voluntariados</h2>
        <p className="admin-section-subtitle-green">Administrar la base de datos oficial de voluntarios y sus asignaciones</p>
      </div>

      <div id="voluntariado-form-container" className="admin-form-card admin-user-form-container">
        <h3 className="admin-user-form-title">
          <span className="admin-user-form-title-icon"></span>
          {modoEdicionVoluntariado ? 'Editar Ficha de Voluntario' : 'Registrar Nuevo Voluntario'}
        </h3>
        
        <form onSubmit={handleVoluntariadoSubmit} className="admin-user-form">
          <div className="admin-form-group admin-form-group-no-margin">
            <label className="admin-user-input-label">Nombre Completo</label>
            <input
              type="text"
              required
              value={formVoluntariado.nombre}
              onChange={(e) => setFormVoluntariado({...formVoluntariado, nombre: e.target.value})}
              placeholder="Ej: Carlos Rodríguez"
              className="admin-user-input"
            />
          </div>
          
          <div className="admin-form-group admin-form-group-no-margin">
            <label className="admin-user-input-label">Área de Interés / Cargo</label>
            <input
              type="text"
              required
              value={formVoluntariado.area}
              onChange={(e) => setFormVoluntariado({...formVoluntariado, area: e.target.value})}
              placeholder="Ej: Siembra, Mantenimiento, Educación..."
              className="admin-user-input"
            />
          </div>

          <div className="admin-form-group admin-form-group-no-margin">
            <label className="admin-user-input-label">Correo Electrónico</label>
            <input
              type="email"
              required
              value={formVoluntariado.email}
              onChange={(e) => setFormVoluntariado({...formVoluntariado, email: e.target.value})}
              placeholder="voluntario@bosque.com"
              className="admin-user-input"
            />
          </div>

          <div className="admin-form-group admin-form-group-no-margin">
            <label className="admin-user-input-label">Teléfono</label>
            <input
              type="text"
              required
              maxLength={8}
              value={formVoluntariado.telefono}
              onChange={(e) => {
                 const value = e.target.value.replace(/\D/g, '');
                 setFormVoluntariado({...formVoluntariado, telefono: value});
              }}
              placeholder="Solo 8 números (ej: 88880000)"
              className="admin-user-input"
            />
          </div>

          <div className="admin-form-group admin-form-group-no-margin">
            <label className="admin-user-input-label">Foto de Perfil (URL)</label>
            <input
              type="text"
              value={formVoluntariado.fotoPerfil || ''}
              onChange={(e) => setFormVoluntariado({...formVoluntariado, fotoPerfil: e.target.value})}
              placeholder="Opcional: https://..."
              className="admin-user-input"
            />
          </div>
          
          <div className="admin-user-form-footer">
            <button type="submit" className="admin-btn-user-submit">
              {modoEdicionVoluntariado ? 'Actualizar Ficha' : 'Registrar Voluntario'}
            </button>
            {modoEdicionVoluntariado && (
              <button type="button" onClick={resetFormVoluntariado} className="admin-btn-user-cancel">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-arboles-lista admin-user-list">
        {voluntariados.filter(vol => vol.rol === 'voluntario').map(vol => (
          <div key={vol.id} className="admin-arbol-card admin-user-card">
            <div className="admin-user-card-header">
              <div className="admin-user-avatar admin-vol-avatar">
                {vol.fotoPerfil ? (
                  <img src={vol.fotoPerfil} alt={vol.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{vol.nombre.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="admin-user-info-text">
                <h3>{vol.nombre}</h3>
                <p className="admin-vol-area">{vol.area}</p>
              </div>
            </div>
            
            <div className="admin-vol-contact-box">
              <p><strong>Email:</strong> {vol.email}</p>
              <p><strong>Tel:</strong> {vol.telefono}</p>
            </div>

            <div className="admin-vol-date">
              Ingreso: {vol.fechaIngreso}
            </div>

            <div className="admin-user-card-footer">
              <button 
                onClick={() => handleEditarVoluntariado(vol)} 
                className="admin-btn-user-edit"
              >
                Editar
              </button>
              <button 
                onClick={() => handleEliminarVoluntariado(vol.id, vol.nombre)} 
                className="admin-btn-user-delete"
              >
                Baja
              </button>
              <button 
                onClick={() => handleConvertirVoluntariadoAUsuario(vol)} 
                className="admin-vol-btn-convert"
              >
                Convertir a Usuario
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VoluntariadosTab;
