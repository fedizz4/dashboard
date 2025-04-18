import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase/firebase';
import './Dashboard.css';

const Prediction = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/');
      } else {
        loadPredictionData();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadPredictionData = () => {
    // Données simulées pour les prédictions
    setPredictionData({
      nextQuarterGrowth: '15.8%',
      riskAssessment: 'Modéré',
      opportunityScore: '82/100',
      resourceAllocation: 'Optimisé'
    });

    setAiInsight("L'IA prévoit une croissance accélérée pour le trimestre prochain");
  };

  return (
    <>
      {/* Contenu Principal spécifique aux Prédictions */}
      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Module de Prédictions RH</h1>
            <div className="ai-insight">
              <span className="pulse-dot"></span>
              <p>{aiInsight}</p>
            </div>
          </div>
        </header>

        <div className="kpi-section">
          <div className="kpi-card holographic">
            <h3>Croissance T3</h3>
            <div className="kpi-value">{predictionData?.nextQuarterGrowth}</div>
            <div className="kpi-trend up">↑ 3.2%</div>
          </div>
          
          <div className="kpi-card holographic">
            <h3>Score Opportunité</h3>
            <div className="kpi-value">{predictionData?.opportunityScore}</div>
            <div className="kpi-trend up">↑ 8 points</div>
          </div>
        </div>

        <div className="chart-container holographic">
          <h3>Projection des Effectifs</h3>
          <div className="chart-placeholder"></div>
        </div>

        <div className="recommendations-section">
          <h2>Recommandations Stratégiques</h2>
          <div className="recommendation-card">
            <p>Augmenter les effectifs du service IT de 15%</p>
            <button className="action-btn">Planifier</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prediction;