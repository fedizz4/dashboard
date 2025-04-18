import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { auth } from './firebase/firebase';
import './Dashboard.css';

const Dashboard = ({ importedData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [predictionData, setPredictionData] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [clickedTab, setClickedTab] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Détermine l'onglet actif basé sur l'URL
  const activeTab = location.pathname.includes('employees') ? 'employees' :
                   location.pathname.includes('predictions') ? 'predictions' :
                   location.pathname.includes('wellbeing') ? 'wellbeing' :
                   location.pathname.includes('reports') ? 'reports' : 'analytics';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/');
      } else {
        setUserEmail(user.email);
        loadDashboardData();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (importedData && importedData.length > 0) {
      loadDashboardData();
    }
  }, [importedData]);

  const loadDashboardData = () => {
    if (!importedData || importedData.length === 0) return;

    const totalEmployees = importedData.length;
    const highRiskEmployees = importedData.filter(emp => emp.riskLevel === 'Élevé');
    const highRiskCount = highRiskEmployees.length;
    const turnoverRate = ((highRiskCount / totalEmployees) * 100).toFixed(1) + '%';

    const hasPerformanceData = importedData.some(emp => emp.performance !== undefined);
    const avgPerformance = hasPerformanceData
      ? (importedData.reduce((sum, emp) => sum + (emp.performance || 0), 0) / totalEmployees).toFixed(1) + '/5'
      : 'N/A';

    setPredictionData({
      turnoverRate,
      highRiskCount,
      avgPerformance,
      totalEmployees
    });

    const generatedNotifications = highRiskEmployees
      .slice(0, 3)
      .map((emp, index) => ({
        id: index + 1,
        message: `${emp.name || 'Un employé'} montre des signes de départ imminent`,
        priority: 'high'
      }));

    setNotifications([
      ...generatedNotifications,
      {
        id: generatedNotifications.length + 1,
        message: `Analyse complétée sur ${totalEmployees} employés`,
        priority: 'medium'
      }
    ]);

    const insights = generateInsights(importedData);
    setAiInsight(insights[Math.floor(Math.random() * insights.length)]);
  };

  const generateInsights = (data) => {
    const insights = [];
    if (data.length === 0) return ["Chargement des données..."];

    const departmentStats = data.reduce((acc, emp) => {
      if (!emp.department) return acc;
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});

    const largestDept = Object.entries(departmentStats).sort((a, b) => b[1] - a[1])[0];
    if (largestDept) {
      insights.push(`Le département ${largestDept[0]} représente ${Math.round((largestDept[1]/data.length)*100)}% des employés`);
    }

    const riskCount = data.reduce((acc, emp) => {
      const level = emp.riskLevel || 'Inconnu';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    if (riskCount['Élevé'] > 0) {
      insights.push(`${riskCount['Élevé']} employés à haut risque détectés`);
    }

    insights.push("Prêt pour l'analyse prédictive");
    insights.push("Données à jour et complètes");

    return insights;
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const createParticle = (x, y, color) => {
    const particle = document.createElement('div');
    particle.className = 'tab-particle';
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.backgroundColor = color;
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  };

  const handleTabClick = (tabName, e, color = '#00ffff') => {
    setClickedTab(tabName);
    
    if (e) {
      const buttonRect = e.currentTarget.getBoundingClientRect();
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;
      
      for (let i = 0; i < 8; i++) {
        createParticle(centerX, centerY, color);
      }
    }
    
    setTimeout(() => setClickedTab(null), 1500);

    // Navigation simplifiée
    if (tabName === 'analytics') {
      navigate('/dashboard');
    } else {
      navigate(tabName);
    }
  };

  const renderDashboardContent = () => {
    if (!importedData || importedData.length === 0) {
      return <div className="loading-data">Chargement des données...</div>;
    }

    return (
      <>
        <div className="kpi-section">
          <div className="kpi-card holographic">
            <h3>Taux de Turnover</h3>
            <div className="kpi-value">{predictionData?.turnoverRate || 'N/A'}</div>
            <div className="kpi-trend up">Temps réel</div>
          </div>
          
          <div className="kpi-card holographic">
            <h3>Employés à Risque</h3>
            <div className="kpi-value">{predictionData?.highRiskCount || '0'}</div>
            <div className="kpi-trend danger">À surveiller</div>
          </div>
          
          <div className="kpi-card holographic">
            <h3>Performance Moy.</h3>
            <div className="kpi-value">{predictionData?.avgPerformance || 'N/A'}</div>
            <div className="kpi-trend stable">Mise à jour</div>
          </div>
          
          <div className="kpi-card holographic">
            <h3>Total Employés</h3>
            <div className="kpi-value">{predictionData?.totalEmployees || '0'}</div>
            <div className="kpi-trend">Base active</div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-container holographic">
            <h3>Tendance du Turnover</h3>
            <div className="chart-placeholder"></div>
          </div>
          
          <div className="chart-container holographic">
            <h3>Répartition par Département</h3>
            <div className="chart-placeholder pie"></div>
          </div>
        </div>

        <div className="risk-table-section">
          <h2>Employés à Risque <span className="ai-tag">Analyse IA</span></h2>
          <div className="table-container holographic">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Département</th>
                  <th>Niveau de Risque</th>
                  <th>Dernière Éval.</th>
                </tr>
              </thead>
              <tbody>
                {importedData
                  .filter(emp => emp.riskLevel === 'Élevé')
                  .slice(0, 5)
                  .map((employee, index) => (
                    <tr key={employee.id || index} className="risk-high">
                      <td>{employee.name || 'Non spécifié'}</td>
                      <td>{employee.department || 'Non spécifié'}</td>
                      <td>
                        <div className="risk-meter">
                          <div className="risk-level high" style={{ width: '90%' }}></div>
                        </div>
                      </td>
                      <td>{employee.lastEvaluation || 'N/A'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="notifications-section">
          <h2>Alertes Intelligentes <span className="ai-tag">Temps Réel</span></h2>
          <div className="notifications-grid">
            {notifications.map(notification => (
              <div key={notification.id} className={`notification-card ${notification.priority}`}>
                <div className="notification-header">
                  <span className="notification-priority"></span>
                  <span className="notification-time">Aujourd'hui</span>
                </div>
                <p>{notification.message}</p>
                <div className="notification-actions">
                  <button className="action-btn">Voir</button>
                  <button className="action-btn ghost">Ignorer</button>
                </div>
                <div className="neon-border"></div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2><span>AI</span></h2>
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
            onClick={(e) => handleTabClick('analytics', e, '#00ffff')}
          >
            <span className="icon">📊</span>
            {sidebarOpen && <span>Analytique</span>}
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'predictions' ? 'active' : ''}`}
            onClick={(e) => handleTabClick('predictions', e, '#00ffff')}
          >
            <span className="icon">🔮</span>
            {sidebarOpen && <span>Prédictions</span>}
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={(e) => handleTabClick('employees', e, '#ff6bff')}
          >
            <span className="icon">👥</span>
            {sidebarOpen && <span>Employés</span>}
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'wellbeing' ? 'active' : ''}`}
            onClick={(e) => handleTabClick('wellbeing', e, '#00ff88')}
          >
            <span className="icon">🧠</span>
            {sidebarOpen && <span>Bien-être</span>}
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={(e) => handleTabClick('reports', e, '#ffa500')}
          >
            <span className="icon">📄</span>
            {sidebarOpen && <span>Rapports</span>}
          </button>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{userEmail.charAt(0).toUpperCase()}</div>
            {sidebarOpen && (
              <div className="user-details">
                <p className="user-email">{userEmail}</p>
                <button onClick={handleLogout} className="logout-btn">
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Tableau de Bord RH Prédictif</h1>
            <div className="ai-insight">
              <span className="pulse-dot"></span>
              <p>{aiInsight}</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="notification-bell">
              <i className="icon">🔔</i>
              {notifications.length > 0 && (
                <span className="notification-count">{notifications.length}</span>
              )}
            </div>
          </div>
        </header>

        {activeTab === 'analytics' ? renderDashboardContent() : <Outlet />}
      </div>
    </div>
  );
};

export default Dashboard;