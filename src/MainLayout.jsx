import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { auth } from './firebase/firebase';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Utilise le même CSS que Dashboard

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  // Détermine l'onglet actif basé sur l'URL
  const activeTab = location.pathname.includes('predictions') ? 'predictions' : 'analytics';

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/connexion');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Futuriste */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>ZZKBS<span>AI</span></h2>
          <button 
            className="toggle-sidebar" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Réduire le menu' : 'Agrandir le menu'}
          >
            {sidebarOpen ? '◄' : '►'}
          </button>
        </div>
        
        <div className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <i className="icon">📊</i>
            {sidebarOpen && <span>Analytique</span>}
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'predictions' ? 'active' : ''}`}
            onClick={() => navigate('/predictions')}
          >
            <i className="icon">🔮</i>
            {sidebarOpen && <span>Prédictions</span>}
          </button>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</div>
            {sidebarOpen && (
              <div className="user-details">
                <p className="user-email">{user?.email}</p>
                <button onClick={handleLogout} className="logout-btn">
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu Principal (changera selon la route) */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;