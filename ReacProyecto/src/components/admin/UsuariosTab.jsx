import React from 'react';
import '../../styles/MainPagesInicoAdmin.css';

function UsuariosTab({
  modoEdicionUsuario,
  handleUserSubmit,
  formUsuario,
  setFormUsuario,
  resetFormUsuario,
  usuarios,
  handleEditarUsuario,
  handleEliminarUsuario,
  handleConvertirUsuarioAVoluntariado
}) {
  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title-white">Gestión de Usuarios</h2>
        <p className="admin-section-subtitle-green">Administrar accesos y cuentas del sistema</p>
      </div>

      <div id="user-form-container" className="admin-form-card admin-user-form-container">
        <h3 className="admin-user-form-title">
          <span className="admin-user-form-title-icon">{modoEdicionUsuario ? '' : ''}</span>
          {modoEdicionUsuario ? 'Editar Usuario' : 'Crear Usuarios'}
        </h3>
        
        <form onSubmit={handleUserSubmit} className="admin-user-form">
          <div className="admin-form-group admin-form-group-no-margin">
            <label className="admin-user-input-label">Nombre Completo</label>
            <input
              type="text"
              required
              value={formUsuario.nombre}
              onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})}
              placeholder="Ej: Juan Pérez"
              className="admin-user-input"
            />
          </div>
          
          <div className="admin-form-group admin-form-group-no-margin">
            <label className="admin-user-input-label">Correo Electrónico</label>
            <input
              type="email"
              required
              value={formUsuario.email}
              onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})}
              placeholder="usuario@ejemplo.com"
              className="admin-user-input"
            />
          </div>
          
          <div className="admin-form-group admin-form-group-no-margin">
            <label className="admin-user-input-label">Contraseña</label>
            <input
              type="password"
              required={!modoEdicionUsuario}
              value={formUsuario.password}
              onChange={(e) => setFormUsuario({...formUsuario, password: e.target.value})}
              placeholder={modoEdicionUsuario ? "Dejar en blanco para no cambiar..." : "••••••••"}
              className="admin-user-input"
              maxLength="15"
            />
          </div>
          
          <div className="admin-form-group admin-form-group-no-margin">
            <label className="admin-user-input-label">Rol de Acceso</label>
            <select
              value={formUsuario.rol}
              onChange={(e) => setFormUsuario({...formUsuario, rol: e.target.value})}
              disabled={formUsuario.rol === 'admin'} // Un admin no puede bajarse el rango ni a otros
              className="admin-user-select"
            >
              <option value="user">Usuario (Solo visualista)</option>
              {formUsuario.rol === 'admin' && (
                 <option value="admin">Administrador (Control total)</option>
              )}
            </select>
          </div>
          
          <div className="admin-user-form-footer">
            <button type="submit" className="admin-btn-user-submit">
              {modoEdicionUsuario ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
            {modoEdicionUsuario && (
              <button type="button" onClick={resetFormUsuario} className="admin-btn-user-cancel">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-arboles-lista admin-user-list">
        {usuarios.filter(user => user.rol !== 'voluntario').map(user => (
          <div key={user.id} className="admin-arbol-card admin-user-card">
            <div className="admin-user-card-header">
              <div className={`admin-user-avatar ${user.rol}`}>
                {user.rol === 'admin' ? 'A' : 'U'}
              </div>
              <div className="admin-user-info-text">
                <h3>{user.nombre}</h3>
                <p>{user.email}</p>
              </div>
            </div>
            
            <div className="admin-user-id-badge">
              <span className="admin-user-id-label">ID</span>
              <span className="admin-user-id-value">#{user.id}</span>
            </div>

            <div className={`admin-user-role-badge ${user.rol}`}>
              <span className="admin-user-role-dot"></span>
              {user.rol === 'admin' ? 'Administrador' : 'Usuario'}
            </div>

            <div className="admin-user-card-footer">
              <button 
                onClick={() => handleEditarUsuario(user)} 
                className="admin-btn-user-edit"
              >
                Editar
              </button>
              <button 
                onClick={() => handleEliminarUsuario(user.id, user.nombre)} 
                disabled={user.rol === 'admin'} 
                className="admin-btn-user-delete"
                title={user.rol === 'admin' ? "No se puede eliminar administradores principales" : ""}
              >
                Borrar
              </button>
              {user.rol !== 'admin' && (
                <button 
                  onClick={() => handleConvertirUsuarioAVoluntariado(user)} 
                  className="admin-btn-user-convert"
                >
                  Convertir a Voluntario
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsuariosTab;
