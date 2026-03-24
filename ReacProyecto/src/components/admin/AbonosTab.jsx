
import React, { useMemo } from 'react';
import '../../styles/MainPagesInicoAdmin.css';

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

      <div className="admin-abonos-layout-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Lado Izquierdo: Gestión de Inventario */}
        <div className="admin-abonos-main-col">
          <div className="admin-abono-form-card" style={{ marginBottom: '2rem' }}>
            <h3>{modoEdicionAbono ? '✏️ Reponer / Editar Stock' : '➕ Registrar Nuevo Producto'}</h3>
            <form onSubmit={handleAbonoSubmit} className="admin-abono-form">
              <div className="admin-form-group">
                <label>Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={formAbono.nombre}
                  onChange={(e) => setFormAbono({...formAbono, nombre: e.target.value})}
                  placeholder="Ej: Compost Orgánico"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label>Cantidad en Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formAbono.stock}
                    onChange={(e) => setFormAbono({...formAbono, stock: e.target.value})}
                    className="admin-input-no-spinner"
                    placeholder="Cantidad..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Unidad</label>
                  <input
                    type="text"
                    required
                    value={formAbono.unidad}
                    onChange={(e) => setFormAbono({...formAbono, unidad: e.target.value})}
                    placeholder="Ej: kg, L"
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>URL de Imagen (Opcional)</label>
                <input
                  type="url"
                  value={formAbono.imagenUrl || ''}
                  onChange={(e) => setFormAbono({...formAbono, imagenUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div className="admin-abono-form-actions">
                <button type="submit" className="admin-btn-save-abono" style={{ flex: 1 }}>
                  {modoEdicionAbono ? '💾 Guardar Cambios' : '➕ Agregar al Sistema'}
                </button>
                {modoEdicionAbono && (
                  <button type="button" onClick={resetFormAbono} className="admin-btn-cancel-abono">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-abonos-list-section">
            <h3 style={{ marginBottom: '1.5rem', color: '#1a3a27' }}>📦 Inventario de Productos</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' }}>
              {(abonos || []).map(abono => (
                <div key={abono.id} className="admin-abono-stat-card" style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '20px', 
                  padding: '1.2rem',
                  border: '1px solid #edf2ef',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#f1f5f2', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {abono.imagenUrl ? (
                        <img src={abono.imagenUrl} alt={abono.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : '🔋'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#1a3a27' }}>{abono.nombre}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Insumo agrícola</p>
                    </div>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#f8fafc', 
                    padding: '0.8rem', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>{abono.stock}</span>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>{abono.unidad}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleEditarAbono(abono)} 
                      style={{ flex: 1, padding: '8px', borderRadius: '10px', backgroundColor: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarAbono(abono.id, abono.nombre)} 
                      style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Historial de Aplicaciones */}
        <div className="admin-abonos-history-col">
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '24px', 
            padding: '2rem', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            minHeight: '600px'
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
                      <div style={{ 
                        backgroundColor: '#20402a', 
                        color: 'white', 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '1rem' 
                      }}>
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
    </div>
  );
}

export default AbonosTab;
