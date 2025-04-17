import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase/firebase';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [predictionData, setPredictionData] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  // Vérification de l'authentification et chargement des données
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

  const loadDashboardData = () => {
    // Simuler le chargement des données
    setEmployeeData([
      { id: 1, name: 'Marie Dupont', department: 'Marketing', riskLevel: 'Élevé', status: 'À risque' },
      { id: 2, name: 'Jean Martin', department: 'IT', riskLevel: 'Faible', status: 'Stable' },
      { id: 3, name: 'Sophie Leroy', department: 'RH', riskLevel: 'Moyen', status: 'Surveillance' },
      { id: 4, name: 'Pierre Bernard', department: 'Finance', riskLevel: 'Élevé', status: 'À risque' },
      { id: 5, name: 'Lucie Petit', department: 'Marketing', riskLevel: 'Faible', status: 'Stable' },
    ]);

    setPredictionData({
      turnoverRate: '12.5%',
      absenteeism: '8.2%',
      avgPerformance: '4.2/5',
      highRiskCount: 2,
    });

    setNotifications([
      { id: 1, message: 'Marie Dupont montre des signes de départ imminent', priority: 'high' },
      { id: 2, message: 'Analyse des enquêtes complétée - 3 insights clés', priority: 'medium' },
      { id: 3, message: 'Mise à jour du système terminée', priority: 'low' },
    ]);

    // Générer un insight IA aléatoire
    const insights = [
      "L'analyse prédictive indique une augmentation de 15% du turnover dans le département Marketing",
      "Les employés avec 2-5 ans d'ancienneté montrent les plus hauts niveaux de satisfaction",
      "Votre équipe IT a une productivité 23% plus élevée les mardis et jeudis",
    ];
    setAiInsight(insights[Math.floor(Math.random() * insights.length)]);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Futuriste */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>HR<span>AI</span></h2>
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
            onClick={() => setActiveTab('analytics')}
          >
            <i className="icon">📊</i>
            {sidebarOpen && <span>Analytique</span>}
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'predictions' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictions')}
          >
            <i className="icon">🔮</i>
            {sidebarOpen && <span>Prédictions</span>}
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <i className="icon">👥</i>
            {sidebarOpen && <span>Employés</span>}
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'wellbeing' ? 'active' : ''}`}
            onClick={() => setActiveTab('wellbeing')}
          >
            <i className="icon">🧠</i>
            {sidebarOpen && <span>Bien-être</span>}
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="icon">📄</i>
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
        {/* Header Futuriste */}
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

        {/* KPI Cards Futuristes */}
        <div className="kpi-section">
          <div className="kpi-card holographic">
            <h3>Taux de Turnover</h3>
            <div className="kpi-value">{predictionData?.turnoverRate}</div>
            <div className="kpi-trend up">↑ 2.3%</div>
            <div className="kpi-sparkline"></div>
          </div>
          
          <div className="kpi-card holographic">
            <h3>Absentéisme</h3>
            <div className="kpi-value">{predictionData?.absenteeism}</div>
            <div className="kpi-trend down">↓ 1.5%</div>
            <div className="kpi-sparkline"></div>
          </div>
          
          <div className="kpi-card holographic">
            <h3>Performance Moy.</h3>
            <div className="kpi-value">{predictionData?.avgPerformance}</div>
            <div className="kpi-trend up">↑ 0.4</div>
            <div className="kpi-sparkline"></div>
          </div>
          
          <div className="kpi-card holographic danger">
            <h3>Employés à Risque</h3>
            <div className="kpi-value">{predictionData?.highRiskCount}</div>
            <div className="kpi-trend up">↑ 1</div>
            <div className="kpi-sparkline"></div>
          </div>
        </div>

        {/* Graphiques et Visualisations */}
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

        {/* Tableau des Employés à Risque */}
        <div className="risk-table-section">
          <h2>Employés à Risque <span className="ai-tag">Analyse IA</span></h2>
          <div className="table-container holographic">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Département</th>
                  <th>Niveau de Risque</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map(employee => (
                  <tr key={employee.id} className={`risk-${employee.riskLevel.toLowerCase()}`}>
                    <td>{employee.name}</td>
                    <td>{employee.department}</td>
                    <td>
                      <div className="risk-meter">
                        <div 
                          className={`risk-level ${employee.riskLevel.toLowerCase()}`}
                          style={{ width: employee.riskLevel === 'Élevé' ? '90%' : employee.riskLevel === 'Moyen' ? '60%' : '30%' }}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${employee.status === 'À risque' ? 'danger' : employee.status === 'Surveillance' ? 'warning' : 'success'}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn">Intervenir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications IA */}
        <div className="notifications-section">
          <h2>Alertes Intelligentes <span className="ai-tag">Temps Réel</span></h2>
          <div className="notifications-grid">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-card ${notification.priority}`}
              >
                <div className="notification-header">
                  <span className="notification-priority"></span>
                  <span className="notification-time">Il y a 2h</span>
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
      </div>
    </div>
  );
};

export default Dashboard;