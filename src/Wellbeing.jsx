import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase/firebase';
import './Dashboard.css';

const Wellbeing = ({ importedData }) => {
  const [wellbeingData, setWellbeingData] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    loadWellbeingData();
  }, [importedData]); // Recharge quand importedData change

  const loadWellbeingData = () => {
    if (!importedData || importedData.length === 0) return;
    
    // Calcul des métriques globales à partir des données importées
    const totalEmployees = importedData.length;
    const totalWellbeing = importedData.reduce((sum, emp) => sum + (emp.wellbeingScore || 0), 0);
    const avgWellbeing = totalWellbeing / totalEmployees;
    
    setWellbeingData({
      overallScore: avgWellbeing.toFixed(1),
      stressLevel: getStressLevel(avgWellbeing),
      sleepQuality: calculateAvgSleepQuality(importedData),
      engagement: calculateAvgEngagement(importedData),
      teamWellbeing: calculateTeamWellbeing(importedData)
    });
  };

  // Fonctions utilitaires
  const getStressLevel = (score) => {
    if (score < 4) return 'Élevé';
    if (score < 7) return 'Modéré';
    return 'Faible';
  };

  const calculateAvgSleepQuality = (data) => {
    const validEntries = data.filter(emp => emp.sleepQuality).length;
    if (validEntries === 0) return 'N/A';
    const total = data.reduce((sum, emp) => sum + (emp.sleepQuality || 0), 0);
    return (total / validEntries).toFixed(1);
  };

  const calculateAvgEngagement = (data) => {
    const validEntries = data.filter(emp => emp.engagement).length;
    if (validEntries === 0) return 'N/A';
    const total = data.reduce((sum, emp) => sum + (emp.engagement || 0), 0);
    return `${Math.round((total / validEntries) * 10)}%`;
  };

  const calculateTeamWellbeing = (data) => {
    const byDepartment = data.reduce((acc, emp) => {
      if (!emp.department) return acc;
      if (!acc[emp.department]) {
        acc[emp.department] = { total: 0, count: 0 };
      }
      acc[emp.department].total += emp.wellbeingScore || 0;
      acc[emp.department].count++;
      return acc;
    }, {});

    return Object.keys(byDepartment).map(dept => ({
      department: dept,
      score: (byDepartment[dept].total / byDepartment[dept].count).toFixed(1)
    }));
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="wellbeing-content">
      {/* Header et KPI existants */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Analyse du Bien-être</h1>
          <div className="ai-insight">
            <span className="pulse-dot"></span>
            <p>
              {selectedEmployee 
                ? `${selectedEmployee.name} a un score de ${selectedEmployee.wellbeingScore || 'N/A'}` 
                : wellbeingData?.teamWellbeing.length > 0
                  ? `Meilleur département: ${wellbeingData.teamWellbeing[0].department} (${wellbeingData.teamWellbeing[0].score})`
                  : 'Analyse en cours...'
              }
            </p>
          </div>
        </div>
      </header>

      {/* Section KPI */}
      <div className="kpi-section">
        <div className="kpi-card holographic">
          <h3>Score Global</h3>
          <div className="kpi-value">{wellbeingData?.overallScore || 'N/A'}/10</div>
          <div className="kpi-trend up">Moyenne</div>
        </div>
        
        <div className="kpi-card holographic">
          <h3>Qualité de Sommeil</h3>
          <div className="kpi-value">{wellbeingData?.sleepQuality || 'N/A'}/10</div>
          <div className="kpi-trend stable">Moyenne</div>
        </div>
        
        <div className="kpi-card holographic">
          <h3>Niveau de Stress</h3>
          <div className="kpi-value">{wellbeingData?.stressLevel || 'N/A'}</div>
          <div className="kpi-trend stable">Moyenne</div>
        </div>
      </div>

      {/* Section Employés */}
      <div className="employee-selection-section">
        <h2>Analyse individuelle <span className="ai-tag">Bien-être</span></h2>
        
        <div className="employee-selector-container">
          <div className="employee-list-scrollable">
            {importedData && importedData.map(employee => (
              <div 
                key={employee.id || employee.email}
                className={`employee-card ${selectedEmployee?.id === employee.id ? 'selected' : ''}`}
                onClick={() => handleEmployeeSelect(employee)}
              >
                <div className="employee-avatar">
                  {employee.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="employee-info">
                  <h4>{employee.name || 'Nom inconnu'}</h4>
                  <p>{employee.department || 'Département inconnu'}</p>
                </div>
                <div className="employee-wellbeing-score">
                  <div className="score-value">
                    {employee.wellbeingScore ? `${employee.wellbeingScore}/10` : 'N/A'}
                  </div>
                  <div className={`score-bar ${getStressLevel(employee.wellbeingScore).toLowerCase()}`}
                    style={{ width: `${(employee.wellbeingScore || 0) * 10}%` }}>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedEmployee && (
            <div className="employee-detail-card">
              <h3>Détails: {selectedEmployee.name}</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Département:</span>
                  <span>{selectedEmployee.department || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Score Bien-être:</span>
                  <span>{selectedEmployee.wellbeingScore || 'N/A'}/10</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Qualité de sommeil:</span>
                  <span>{selectedEmployee.sleepQuality || 'N/A'}/10</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Niveau de stress:</span>
                  <span>{getStressLevel(selectedEmployee.wellbeingScore)}</span>
                </div>
              </div>
              <div className="action-buttons">
                <button className="action-btn">Planifier entretien</button>
                <button className="action-btn ghost">Voir historique</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wellbeing;