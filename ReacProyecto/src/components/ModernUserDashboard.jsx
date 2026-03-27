import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Edit3, 
  Trees, 
  FileText, 
  Trophy, 
  Compass,
  Map as MapIcon,
  Search,
  Bookmark,
  BookOpen,
  ChevronRight,

  Droplets,
  Sprout,
  Moon,
  LogOut,
  Settings,
  HelpCircle,
  Eye,
  Heart,
  PlusCircle,
  Bell,
  LayoutDashboard,
  UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import services from '../services/services';

import ArbolesSection from './ArbolesSection';
import UserProfile from './UserProfile';
import UserReports from './UserReports';
import UserReportesRobo from './UserReportesRobo';
import MisReportesTab from './MisReportesTab';
import CorridorMap from './CorridorMap';
import History from './History';
import '../styles/ModernUserDashboard.css';



function ModernUserDashboard() {
  const [user, setUser] = useState(null);
  const [arboles, setArboles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Sincronizar tab con la URL si existe
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setCurrentTab(tabFromUrl);
    }

    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.rol !== 'user') {
        navigate('/login'); 
        return;
      }
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
    
    fetchData();
  }, [navigate, searchParams]);

  const fetchData = async () => {
    setCargando(true);
    try {
      const [arbolesData, reportesData] = await Promise.all([
        services.getArboles(),
        services.getReportes()
      ]);
      setArboles(arbolesData || []);
      setReportes(reportesData || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro de que quieres salir?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#064e3b',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, Salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('user');
        navigate('/');
      }
    });
  };


  if (!user) return <div className="modern-loading">Cargando...</div>;

  // Filtrado de árboles
  const filteredArboles = arboles.filter(arbol => 
    arbol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arbol.nombreCientifico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arbol.familia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arbol.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculos para el Dashboard
  const userReports = reportes.filter(r => r.userId === user.id);
  const stats = {
    observations: arboles.length,
    contributions: userReports.length,
    impactPoints: arboles.length * 12, // Ejemplo dinámico
    expeditions: Math.floor(userReports.length / 2) + 1
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <>
            {/* Hero Section */}
            <div className="hero-profile">
              <img 
                src="https://images.unsplash.com/photo-1448375240581-881216bc51b1?q=80&w=2070&auto=format&fit=crop" 
                alt="Bosque" 
                className="hero-bg" 
              />
              <div className="hero-overlay">
                <div className="profile-info-main">
                  <div className="profile-img-container">
                    {user.fotoPerfil ? (
                      <img src={user.fotoPerfil} alt={user.nombre} className="profile-img-large" />
                    ) : (
                      <div className="profile-fallback">{user.nombre.charAt(0)}</div>
                    )}
                  </div>
                  <div className="profile-details">
                    <h1>{user.nombre}</h1>
                    <div className="profile-meta">
                      <span className="badge-role">{user.rol === 'user' ? 'Guardián del Bosque' : user.rol}</span>
                      <div className="location-meta">
                        <MapPin size={14} />
                        <span>La Angostura, Sector Sur</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="btn-edit-profile" onClick={() => setCurrentTab('perfil')}>
                  <Edit3 size={18} />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Observaciones</span>
                <div className="stat-value-container">
                  <span className="stat-value">{stats.observations}</span>
                  <span className="stat-change positive">↑ 12%</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-label">Contribuciones</span>
                <div className="stat-value-container">
                  <span className="stat-value">{stats.contributions}</span>
                  <span className="stat-change positive">¡Nuevo rango!</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-label">Puntos de Impacto</span>
                <div className="stat-value-container">
                  <span className="stat-value">{(stats.impactPoints / 1000).toFixed(1)}k</span>
                  <div style={{width: '60px', height: '4px', background: '#dcfce7', borderRadius: '2px', marginLeft: 'auto'}}>
                    <div style={{width: '70%', height: '100%', background: '#10b981', borderRadius: '2px'}}></div>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-label">Expediciones</span>
                <div className="stat-value-container">
                  <span className="stat-value">{stats.expeditions}</span>
                  <span className="stat-change" style={{color: '#64748b', fontSize: '0.8rem', marginLeft: 'auto'}}>Temporada 4</span>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="dashboard-grid">
              {/* Left Column: Corridor View */}
              <div className="main-section-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <h3>Mi Corredor</h3>
                    <p>Cuenca Baja de La Angostura • Monitoreo en Tiempo Real</p>
                  </div>
                  <div className="header-actions">
                    <button className="icon-btn"><LayoutDashboard size={20} /></button>
                    <a 
                      href="https://www.google.com/maps/@9.9875,-84.795,15z/data=!3m1!1e3" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="icon-btn"
                      title="Abrir en Google Maps"
                    >
                      <Compass size={20} />
                    </a>

                  </div>
                </div>
                <div className="map-placeholder" style={{padding: 0, height: '480px', overflow: 'hidden'}}>
                  <CorridorMap />
                </div>

              </div>

              {/* Right Column: Sidebar Sections */}
              <div className="sidebar-grid-column">
                <div className="habitats-card">
                  <div className="card-header">
                    <h3>Especies Populares</h3>
                    <button className="icon-btn" onClick={() => setCurrentTab('coleccion')} style={{fontSize: '0.8rem'}}>Ver Todo</button>
                  </div>
                  <div className="habitats-list">
                    {arboles.length > 0 ? arboles.slice(0, 3).map((arbol, idx) => (
                      <div className="habitat-item" key={arbol.id || idx}>
                        <img 
                          src={arbol.imagenUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop"} 
                          className="habitat-img" 
                        />
                        <div className="habitat-info">
                          <p className="habitat-name">{arbol.nombre}</p>
                          <p className="habitat-desc">{arbol.nombreCientifico}</p>
                          <div className="habitat-tags">
                              <span className="tag green">{arbol.familia || 'Nativo'}</span>
                              <span className="tag orange">{arbol.clima || 'Tropical'}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} color="#cbd5e1" />
                      </div>
                    )) : (
                      <p style={{fontSize: '0.8rem', color: '#64748b'}}>No hay especies registradas.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Impact Banner */}
            <div className="impact-banner">
              <div className="impact-text-content">
                <h2>Impacto de Conservación</h2>
                <div className="impact-value-big">
                  <span>{stats.observations}</span>
                  <span>hectáreas</span>
                </div>
                <p>
                  A través de las observaciones de {user.nombre.split(' ')[0]} y sus esfuerzos de restauración directa, 
                  {stats.observations} hectáreas de bosque seco tropical han sido protegidas y registradas con éxito.
                </p>
              </div>
              <div className="impact-badges">
                <div className="impact-badge-card">
                  <div className="badge-icon-container">
                    <Sprout size={24} />
                  </div>
                  <p className="badge-name">Plantador de Árboles</p>
                  <span className="badge-label gold">Rango Oro</span>
                </div>
                <div className="impact-badge-card">
                  <div className="badge-icon-container water">
                    <Droplets size={24} />
                  </div>
                  <p className="badge-name">Guardián del Agua</p>
                  <span className="badge-label">Experto</span>
                </div>
                <div className="impact-badge-card">
                  <div className="badge-icon-container seed">
                    <Heart size={24} />
                  </div>
                  <p className="badge-name">Fundador de Semillas</p>
                  <span className="badge-label">Legado</span>
                </div>
                <div className="impact-badge-card">
                  <div className="badge-icon-container night">
                    <Moon size={24} />
                  </div>
                  <p className="badge-name">Vigilante Nocturno</p>
                  <span className="badge-label">Colaborador</span>
                </div>
              </div>
            </div>
          </>
        );
      case 'mapa':
        return (
          <div className="main-section-card" style={{padding: 0, height: '70vh', overflow: 'hidden'}}>
            <CorridorMap />
          </div>
        );
      case 'historia':
        return (
          <div className="main-section-card" style={{padding: 0, height: '70vh', overflowX: 'hidden', overflowY: 'auto'}}>
            <History user={user} />
          </div>
        );

      case 'coleccion':


        return (
          <div className="main-section-card">
            <h2>Especies de árboles en el corredor</h2>
            {cargando ? <p>Cargando especies...</p> : <ArbolesSection arboles={filteredArboles} />}
          </div>
        );
      case 'mis_reportes':
        return <MisReportesTab user={user} />;
      case 'reporte_robo':
        return <UserReportesRobo user={user} onDone={() => setCurrentTab('mis_reportes')} />;
      case 'reportes':
        return <UserReports user={user} onDone={() => setCurrentTab('mis_reportes')} />;
      case 'perfil':
        return <UserProfile user={user} onUpdateUser={setUser} />;
      default:
        return <div>Selecciona una opción</div>;
    }
  };

  return (
    <div className="modern-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="modern-sidebar">
        <div className="sidebar-logo">
          <img src="/src/assets/logo.png" alt="Logo de BioMon" className="sidebar-logo-img" />
          <div className="logo-text">
            <h2>Biomon ADI</h2>
            <span>Portal de Conservación</span>
          </div>
        </div>


        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentTab('dashboard')}
          >
            <LayoutDashboard className="nav-icon" size={18} />
            Panel Principal
          </button>
          <button 
            className={`nav-item ${currentTab === 'coleccion' ? 'active' : ''}`}
            onClick={() => {
                setCurrentTab('coleccion');
                // Scroll up automatically when switching to collection
                window.scrollTo({top: 0, behavior: 'smooth'});
            }}
          >
            <Search className="nav-icon" size={18} />
            Guía de Especies
          </button>
          <button 
            className={`nav-item ${currentTab === 'mis_reportes' ? 'active' : ''}`}
            onClick={() => setCurrentTab('mis_reportes')}
          >
            <Bookmark className="nav-icon" size={18} />
            Mis Solicitudes
          </button>
          <button 
            className={`nav-item ${currentTab === 'mapa' ? 'active' : ''}`}
            onClick={() => setCurrentTab('mapa')}
          >
            <MapIcon className="nav-icon" size={18} />
            Mapas de Campo
          </button>
          <button 
            className={`nav-item ${currentTab === 'historia' ? 'active' : ''}`}
            onClick={() => setCurrentTab('historia')}
          >
            <BookOpen className="nav-icon" size={18} />
            Historia
          </button>
          <button 
            className={`nav-item ${currentTab === 'reporte_robo' || currentTab === 'reportes' ? 'active' : ''}`}
            onClick={() => setCurrentTab('reportes')}
          >

            <Bell className="nav-icon" size={18} />
            Notificaciones
          </button>
          <button 
            className={`nav-item ${currentTab === 'dashboard' ? '' : ''}`} 
            onClick={() => {
                setCurrentTab('dashboard');
                setTimeout(() => {
                    const impactEl = document.querySelector('.impact-banner');
                    impactEl?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }}
          >
            <Trophy className="nav-icon" size={18} />
            Impacto
          </button>

          <button className="btn-new-obs" onClick={() => setCurrentTab('reportes')}>
            <PlusCircle size={18} />
            Nueva Observación
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => setCurrentTab('perfil')}>
            <Settings size={18} />
            Configuración
          </button>
          <button className="nav-item">
            <HelpCircle size={18} />
            Soporte
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="modern-main-content">
        <header className="top-bar">
          <div className="top-bar-nav">
            <button 
              className={`top-bar-nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('dashboard')}
            >
                Panel
            </button>
            <button 
              className={`top-bar-nav-link ${currentTab === 'mapa' ? 'active' : ''}`}
              onClick={() => setCurrentTab('mapa')}
            >
                Mapas de Campo
            </button>
            <button 
              className={`top-bar-nav-link ${currentTab === 'historia' ? 'active' : ''}`}
              onClick={() => setCurrentTab('historia')}
            >
                Historia
            </button>
            <button className="top-bar-nav-link">Comunidad</button>
          </div>




          <div className="top-actions">
            <div className="search-container">
              <Search size={16} color="#64748b" />
              <input 
                type="text" 
                placeholder="Buscar especies de árboles en el corredor..." 
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (currentTab !== 'coleccion' && e.target.value.trim() !== '') {
                        setCurrentTab('coleccion');
                    }
                }}
              />
            </div>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn" onClick={() => setCurrentTab('perfil')}><Settings size={20} /></button>
            <div className="avatar-group" style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              {user.fotoPerfil ? (
                <img src={user.fotoPerfil} alt="Avatar de Usuario" className="user-avatar-small" />
              ) : (
                <div className="user-avatar-placeholder">
                  <User size={20} />
                </div>
              )}
              <button 
                className="icon-btn logout-top" 
                onClick={handleLogout} 
                style={{color: '#ef4444', marginLeft: '0.25rem'}}
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

        </header>

        {/* Content Area */}
        <div className="dynamic-content">
          {renderContent()}
        </div>



      </main>
    </div>
  );
}


export default ModernUserDashboard;
