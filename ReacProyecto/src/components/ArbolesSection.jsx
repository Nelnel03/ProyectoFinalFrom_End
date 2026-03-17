import React, { useState, useEffect } from 'react';
import services from '../services/services';
import '../styles/Arboles.css';

// ── Modal con toda la información del árbol ──────────────────────────────────
function ArbolModal({ arbol, onClose }) {
  if (!arbol) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onClose} title="Cerrar">✕</button>

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
          style={{ display: arbol.imagenUrl ? 'none' : 'flex' }}
        >
          🌳
        </div>

        <div className="modal-body">
          <h2 className="modal-nombre">{arbol.nombre}</h2>
          <p className="modal-cientifico">
            {arbol.nombreCientifico || 'Nombre científico no disponible'}
          </p>

          <div className="modal-info-grid">
            {arbol.familia && (
              <div className="modal-info-item">
                <div className="modal-info-label">Familia</div>
                <div className="modal-info-value">{arbol.familia}</div>
              </div>
            )}
            {arbol.altura && (
              <div className="modal-info-item">
                <div className="modal-info-label">Altura</div>
                <div className="modal-info-value">{arbol.altura}</div>
              </div>
            )}
            {arbol.crecimiento && (
              <div className="modal-info-item">
                <div className="modal-info-label">Crecimiento</div>
                <div className="modal-info-value">{arbol.crecimiento}</div>
              </div>
            )}
            {arbol.clima && (
              <div className="modal-info-item">
                <div className="modal-info-label">Clima</div>
                <div className="modal-info-value">{arbol.clima}</div>
              </div>
            )}
            {arbol.fechaRegistro && (
              <div className="modal-info-item">
                <div className="modal-info-label">Registrado</div>
                <div className="modal-info-value">{arbol.fechaRegistro}</div>
              </div>
            )}
            {arbol.estado && (
              <div className="modal-info-item">
                <div className="modal-info-label">Estado</div>
                <div className="modal-info-value" style={{ textTransform: 'capitalize' }}>
                  {arbol.estado}
                </div>
              </div>
            )}
          </div>

          {arbol.descripcion && (
            <>
              <h3 className="modal-section-title">📋 Descripción</h3>
              <p className="modal-section-text">{arbol.descripcion}</p>
            </>
          )}

          {arbol.cuidados && (
            <>
              <h3 className="modal-section-title">🌱 Cuidados</h3>
              <p className="modal-section-text">{arbol.cuidados}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tarjeta individual de árbol ───────────────────────────────────────────────
function ArbolCard({ arbol, count, onClick }) {
  const [imgError, setImgError] = useState(false);

  const titulo = count !== undefined ? (arbol.tipo || 'mimbro') : arbol.nombre;

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
        <div className="arbol-card-img-placeholder">
          🌳
          <span>Sin imagen</span>
        </div>
      )}

      <div className="arbol-card-body">
        <h3 className="arbol-card-nombre" style={{ textTransform: 'capitalize' }}>{titulo}</h3>
        {arbol.nombreCientifico && (
          <p className="arbol-card-cientifico">{arbol.nombreCientifico}</p>
        )}
        
        {count !== undefined ? (
          <div className="arbol-stats-mini-grid">
            <div className="arbol-stat-pill planted">
              <span className="pill-dot"></span>
              <strong>{count}</strong> Sembrados
            </div>
            {arbol.stats && arbol.stats.planificados > 0 && (
              <div className="arbol-stat-pill planned">
                <span className="pill-dot"></span>
                <strong>{arbol.stats.planificados}</strong> Planeados
              </div>
            )}
            {arbol.stats && arbol.stats.muertos > 0 && (
              <div className="arbol-stat-pill dead">
                <span className="pill-dot"></span>
                <strong>{arbol.stats.muertos}</strong> Muertos
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <span className="arbol-card-badge">{arbol.estado || 'Registrado'}</span>
          </div>
        )}
        
        <p className="arbol-card-hint">🔍 Click para ver más información</p>
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

  // Agrupamos los árboles por su tipo
  const arbolesAgrupados = arboles && arboles.length > 0 ? Object.values(arboles.reduce((acc, arbol) => {
    const tipo = (arbol.tipo || 'mimbro').toLowerCase();
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
      <h2 className="arboles-section-title">🌿 Especies Registradas</h2>
      <p className="arboles-section-subtitle">
        Explora nuestra base de datos forestal agrupada por tipo de árbol — haz click en una tarjeta para ver información exhaustiva de la especie.
      </p>

      {arbolesAgrupados.length > 0 ? (
        <div className="arboles-grid">
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
        <div className="arboles-empty">
          <div className="tree-icon">🌲</div>
          <p>Aún no hay especies registradas en el sistema.</p>
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
