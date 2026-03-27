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
  handleBanUsuario,
  handleActivarUsuario,
  handleConvertirUsuarioAVoluntariado
}) {
  const [subTab, setSubTab] = React.useState('activos'); // 'activos' | 'cancelados'
  const [busqueda, setBusqueda] = React.useState(''); // Nuevo estado para búsqueda de usuarios
  return (
    <div>
      <div className="admin-section-header admin-section-header-flex">
        <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            <h2 className="admin-section-title-white">Gestión de Usuarios</h2>
            <p className="admin-section-subtitle-green">Administrar accesos y cuentas del sistema</p>
          </div>
          
          <div className="admin-controls-row">
            <div className="admin-search-box">
              <input 
                type="text" 
                placeholder="Buscar usuario por nombre o correo..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="admin-search-input"
                style={{ width: '250px' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="admin-tabs-container" style={{ padding: '0 0.5rem', marginBottom: '1.5rem' }}>
        <div className="admin-tabs-pills" style={{ background: 'rgba(58, 90, 64, 0.1)', padding: '5px', borderRadius: '15px' }}>
          <button 
            onClick={() => setSubTab('activos')} 
            className={`admin-tab-pill ${subTab === 'activos' ? 'active' : ''}`}
          >
            Usuarios Activos
          </button>
          <button 
            onClick={() => setSubTab('cancelados')} 
            className={`admin-tab-pill ${subTab === 'cancelados' ? 'active' : ''}`}
            style={{ color: subTab === 'cancelados' ? 'white' : '#e53e3e' }}
          >
            Usuarios Cancelados
          </button>
        </div>
      </div>

      <div className="admin-arboles-lista admin-user-list">
        {usuarios
          .filter(user => user.rol !== 'voluntario')
          .filter(user => {
            if (subTab === 'activos') return user.status !== 'banned';
            return user.status === 'banned';
          })
          .filter(user => 
            user.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            user.email.toLowerCase().includes(busqueda.toLowerCase())
          )
          .map(user => (
          <div key={user.id} className="admin-arbol-card admin-user-card" style={{ border: user.status === 'banned' ? '1px solid #feb2b2' : '' }}>
            <div className="admin-user-card-header">
              <div className={`admin-user-avatar ${user.rol}`}>
                {user.fotoPerfil ? (
                  <img src={user.fotoPerfil} alt={user.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  user.rol === 'admin' ? 'Admin' : 'User'
                )}
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

            {user.status === 'banned' && (
              <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#fff5f5', borderRadius: '8px', border: '1px solid #feb2b2' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#c53030', textTransform: 'uppercase', marginBottom: '4px' }}>Motivo de Cancelación:</span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#742a2a', fontStyle: 'italic' }}>"{user.motivoBan}"</p>
              </div>
            )}

            <div className="admin-user-card-footer">
              {user.status !== 'banned' ? (
                <>
                  <button 
                    onClick={() => handleEditarUsuario(user)} 
                    className="admin-btn-user-edit"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleBanUsuario(user.id, user.nombre)} 
                    disabled={user.rol === 'admin'} 
                    className="admin-btn-user-delete"
                    style={{ background: '#feb2b2', color: '#c53030' }}
                    title={user.rol === 'admin' ? "No se puede cancelar administradores principales" : ""}
                  >
                    Cancelar Cuenta
                  </button>
                  {user.rol !== 'admin' && (
                    <button 
                      onClick={() => handleConvertirUsuarioAVoluntariado(user)} 
                      className="admin-btn-user-convert"
                    >
                      Convertir a Voluntario
                    </button>
                  )}
                </>
              ) : (
                <button 
                  onClick={() => handleActivarUsuario(user.id, user.nombre)} 
                  className="admin-btn-user-edit"
                  style={{ flex: '1', background: '#c6f6d5', color: '#22543d' }}
                >
                  Reactivar Cuenta
                </button>
              )}
            </div>
          </div>
        ))}
        {usuarios.filter(user => user.rol !== 'voluntario').filter(user => subTab === 'activos' ? user.status !== 'banned' : user.status === 'banned').filter(user => user.nombre.toLowerCase().includes(busqueda.toLowerCase()) || user.email.toLowerCase().includes(busqueda.toLowerCase())).length === 0 && (
          <div className="admin-no-results" style={{ gridColumn: '1/-1', width: '100%' }}>
            No se encontraron usuarios que coincidan con el nombre o correo ingresado.
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', borderTop: '2px dashed rgba(58, 90, 64, 0.2)', paddingTop: '2rem' }}>
        {subTab === 'activos' && (
          <div id="user-form-container" className="admin-form-card admin-user-form-container">
            <h3 className="admin-user-form-title">
              <span className="admin-user-form-title-icon"></span>
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
                <label className="admin-user-input-label">Foto de Perfil (URL)</label>
                <input
                  type="text"
                  value={formUsuario.fotoPerfil || ''}
                  onChange={(e) => setFormUsuario({...formUsuario, fotoPerfil: e.target.value})}
                  placeholder="Opcional: https://..."
                  className="admin-user-input"
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
        )}
      </div>

    </div>
  );
}

export default UsuariosTab;
