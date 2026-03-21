import React, { useState, useEffect } from 'react';
import services from '../services/services';
import '../styles/Arboles.css';
import '../styles/PremiumDashboard.css';

// ── Modal con toda la información del árbol ──────────────────────────────────
function ArbolModal({ arbol, onClose }) {
  if (!arbol) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-cerrar" 
          onClick={onClose} 
          title="Cerrar"
          style={{ 
            position: 'absolute', top: '20px', right: '20px', 
            background: 'white', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 10
          }}
        >✕</button>

        {arbol.imagenUrl ? (
          <img
            src={arbol.imagenUrl}
            alt={arbol.nombre}
            className="modal-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="modal-img-placeholder"
          style={{ display: arbol.imagenUrl ? 'none' : 'flex', height: '300px', background: '#DAD7CD', fontSize: '5rem', alignItems: 'center', justifyContent: 'center' }}
        >
          🌳
        </div>

        <div className="modal-body">
          <h2 className="modal-nombre" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a2e23' }}>{arbol.nombre}</h2>
          <p className="modal-cientifico" style={{ fontSize: '1.2rem', color: '#2f855a', fontStyle: 'italic', marginBottom: '2rem', fontWeight: '700' }}>
            {arbol.nombreCientifico || 'Nombre científico no disponible'}
          </p>

          <div className="modal-info-grid">
            {[
                { label: 'Familia', value: arbol.familia },
                { label: 'Altura', value: arbol.altura },
                { label: 'Crecimiento', value: arbol.crecimiento },
                { label: 'Clima', value: arbol.clima },
                { label: 'Registrado', value: arbol.fechaRegistro },
                { label: 'Estado', value: arbol.estado }
            ].map((item, idx) => item.value ? (
              <div className="modal-info-item" key={idx}>
                <div className="modal-info-label">{item.label}</div>
                <div className="modal-info-value">{item.value}</div>
              </div>
            ) : null)}
          </div>

          {arbol.descripcion && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 className="modal-section-title" style={{ color: '#344E41', borderBottom: '2px solid #A3B18A', display: 'inline-block', marginBottom: '1rem' }}>📋 Descripción</h3>
              <p className="modal-section-text" style={{ lineHeight: '1.8', color: '#444' }}>{arbol.descripcion}</p>
            </div>
          )}

          {arbol.cuidados && (
            <div>
              <h3 className="modal-section-title" style={{ color: '#344E41', borderBottom: '2px solid #A3B18A', display: 'inline-block', marginBottom: '1rem' }}>🌱 Cuidados</h3>
              <p className="modal-section-text" style={{ lineHeight: '1.8', color: '#444' }}>{arbol.cuidados}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tarjeta individual de árbol ───────────────────────────────────────────────
function ArbolCard({ arbol, count, onClick }) {
  const [imgError, setImgError] = useState(false);
  const titulo = count !== undefined ? (arbol.tipo || 'Sin clasificar') : arbol.nombre;

  return (
    <div className="arbol-card" onClick={() => onClick(arbol)}>
      {arbol.imagenUrl && !imgError ? (
        <img
          src={arbol.imagenUrl}
          alt={titulo}
          className="arbol-card-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="arbol-card-img-placeholder" style={{ height: '220px', background: '#DAD7CD', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
          🌳
          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Sin imagen</span>
        </div>
      )}

      <div className="arbol-card-body">
        <h3 className="arbol-card-nombre" style={{ textTransform: 'capitalize', color: '#1a2e23' }}>{titulo}</h3>
        {arbol.nombreCientifico && (
          <p className="arbol-card-cientifico" style={{ color: '#2f855a', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '700' }}>{arbol.nombreCientifico}</p>
        )}
        
        {count !== undefined ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            <span className="arbol-card-badge" style={{ background: '#344E41', color: '#DAD7CD' }}>
              <strong>{count}</strong> Registrados
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <span className="arbol-card-badge">{arbol.estado || 'Registrado'}</span>
          </div>
        )}
        
        <p className="arbol-card-hint" style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#888', fontWeight: 'bold' }}>🔍 CLICK PARA DETALLES</p>
      </div>
    </div>
  );
}

// ── Sección completa de tarjetas (usada en User y Visitante) ──────────────────
function ArbolesSection({ arboles }) {
  const [arbolSeleccionado, setArbolSeleccionado] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    services.getStatsTipos().then(res => setStats(res || []));
  }, []);

  const arbolesAgrupados = arboles && arboles.length > 0 ? Object.values(arboles.reduce((acc, arbol) => {
    const tipo = (arbol.tipo || 'Sin clasificar').toLowerCase();
    const isAlive = arbol.estado !== 'muerto';

    if (!acc[tipo]) {
      const statDelTipo = stats.find(s => s.tipo.toLowerCase() === tipo);
      acc[tipo] = {
        tipo,
        count: 0,
        representante: { ...arbol, stats: statDelTipo },
      };
    }
    
    if (isAlive) {
      acc[tipo].count += 1;
    }
    
    return acc;
  }, {})) : [];

  return (
    <section className="arboles-section">
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#1a2e23', fontWeight: '800' }}>🌿 Especies Registradas</h2>
        <p style={{ fontSize: '1.1rem', color: '#1a202c', marginTop: '0.5rem', fontWeight: '700' }}>
          Explora la diversidad forestal de nuestro corredor biológico.
        </p>
      </div>

      {arbolesAgrupados.length > 0 ? (
        <div className="arboles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {arbolesAgrupados.map((grupo) => (
            <ArbolCard
              key={grupo.tipo}
              arbol={grupo.representante}
              count={grupo.count}
              onClick={setArbolSeleccionado}
            />
          ))}
        </div>
      ) : (
        <div className="arboles-empty" style={{ padding: '5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '30px', border: '2px dashed #ccc' }}>
          <div className="tree-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌲</div>
          <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#888' }}>Aún no hay especies registradas en el sistema.</p>
        </div>
      )}

      {arbolSeleccionado && (
        <ArbolModal
          arbol={arbolSeleccionado}
          onClose={() => setArbolSeleccionado(null)}
        />
      )}
    </section>
  );
}

export { ArbolesSection, ArbolCard, ArbolModal };
export default ArbolesSection;
