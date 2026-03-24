import React, { useMemo } from 'react';

function AbonosTab({
  modoEdicionAbono,
  handleAbonoSubmit,
  formAbono,
  setFormAbono,
  resetFormAbono,
  abonos,
  arboles,
  handleEditarAbono,
  handleEliminarAbono
}) {
  
  // Agregamos el historial de aplicaciones de todos los árboles
  const historialAplicaciones = useMemo(() => {
    const listado = [];
    (arboles || []).forEach(arbol => {
      if (arbol.historialAbono && Array.isArray(arbol.historialAbono)) {
        arbol.historialAbono.forEach(reg => {
          listado.push({
            ...reg,
            nombreArbol: arbol.nombre,
            idArbol: arbol.id
          });
        });
      }
    });
    // Ordenar por fecha y hora descendente
    return listado.sort((a, b) => {
      const fechaA = new Date(`${a.fecha} ${a.hora || '00:00'}`);
      const fechaB = new Date(`${b.fecha} ${b.hora || '00:00'}`);
      return fechaB - fechaA;
    });
  }, [arboles]);

  return (
    <div className="admin-abonos-container">
      <div className="admin-section-header">
        <h2 style={{ color: '#20402a' }}>🌿 Gestión de Abonos y Fertilizantes</h2>
        <p style={{ color: '#66937a' }}>Control de inventario, reposición de insumos y registro de aplicaciones</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Lado Izquierdo: Formulario e Inventario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="admin-abono-form-card" style={{ backgroundColor: '#20402a', border: 'none', boxShadow: '0 8px 30px rgba(32, 64, 42, 0.2)' }}>
            <h3 style={{ color: '#f0f2f0', fontWeight: '800' }}>{modoEdicionAbono ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
            <form onSubmit={handleAbonoSubmit} className="admin-abono-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-form-group">
                <label style={{ color: '#a7bcaf', fontSize: '0.75rem' }}>Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={formAbono.nombre}
                  onChange={(e) => setFormAbono({...formAbono, nombre: e.target.value})}
                  placeholder="Ej: Compost Orgánico"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label style={{ color: '#a7bcaf', fontSize: '0.75rem' }}>Stock Actual</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formAbono.stock}
                    onChange={(e) => setFormAbono({...formAbono, stock: e.target.value})}
                    className="admin-input-no-spinner"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </div>
                <div className="admin-form-group">
                  <label style={{ color: '#a7bcaf', fontSize: '0.75rem' }}>Unidad</label>
                  <input
                    type="text"
                    required
                    value={formAbono.unidad}
                    onChange={(e) => setFormAbono({...formAbono, unidad: e.target.value})}
                    placeholder="kg, L, sacos"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label style={{ color: '#a7bcaf', fontSize: '0.75rem' }}>Imagen URL</label>
                <input
                  type="url"
                  value={formAbono.imagenUrl || ''}
                  onChange={(e) => setFormAbono({...formAbono, imagenUrl: e.target.value})}
                  placeholder="https://..."
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                />
              </div>
              <div className="admin-abono-form-actions" style={{ marginTop: '0.5rem' }}>
                <button type="submit" className="admin-btn-save-abono" style={{ width: '100%', backgroundColor: '#10b981', padding: '12px' }}>
                  {modoEdicionAbono ? '💾 Guardar Cambios' : '➕ Registrar Abono'}
                </button>
                {modoEdicionAbono && (
                  <button type="button" onClick={resetFormAbono} className="admin-btn-cancel-abono" style={{ width: '100%' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {abonos.map(abono => (
              <div key={abono.id} className="admin-abono-stat-card" style={{ padding: '1rem', border: '1px solid #e2e8f0' }}>
                <div className="admin-abono-card-body" style={{ gap: '0.8rem' }}>
                  <div className="admin-abono-icon" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                    {abono.imagenUrl ? (
                      <img src={abono.imagenUrl} alt={abono.nombre} className="admin-abono-img-preview" />
                    ) : '🔋'}
                  </div>
                  <div className="admin-abono-info">
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '2px' }}>{abono.nombre}</h4>
                    <div className="admin-abono-stock-badge">
                      <span className="stock-number" style={{ fontSize: '1.1rem' }}>{abono.stock}</span>
                      <span className="stock-unit" style={{ fontSize: '0.75rem' }}>{abono.unidad}</span>
                    </div>
                  </div>
                </div>
                <div className="admin-abono-card-footer" style={{ borderTop: 'none', paddingTop: '0.5rem', gap: '5px' }}>
                  <button onClick={() => handleEditarAbono(abono)} style={{ padding: '5px' }} className="btn-edit-stock" title="Editar">✏️</button>
                  <button onClick={() => handleEliminarAbono(abono.id, abono.nombre)} style={{ padding: '5px' }} className="btn-delete-abono" title="Eliminar">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lado Derecho: Historial de Aplicaciones */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '24px', 
          padding: '2rem', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          minHeight: '500px'
        }}>
          <h3 style={{ borderBottom: '2px solid #f2f4f1', paddingBottom: '1rem', marginBottom: '1.5rem', color: '#1a3a27' }}>
            📊 Historial de Aplicaciones
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {historialAplicaciones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                <p style={{ fontSize: '3rem', margin: 0 }}>📋</p>
                <p>No se han registrado aplicaciones de abono recientemente.</p>
              </div>
            ) : (
              historialAplicaciones.slice(0, 50).map((reg, idx) => (
                <div key={`${reg.idArbol}-${idx}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#20402a', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1rem' }}>
                       🥗
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '700', color: '#1a3a27' }}>{reg.abono}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Aplicado en: <strong>{reg.nombreArbol}</strong></p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: '#20402a' }}>{reg.fecha.split('-').reverse().join('/')}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{reg.hora || '--:--'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AbonosTab;
