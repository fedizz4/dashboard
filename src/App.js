import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import AuthPage from './AuthPage';
import Prediction from './Prediction';
import ImportCSV from './ImportCSV';
import EmployeesTable from './EmployeesTable';
import Wellbeing from './Wellbeing';
import './App.css';

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="loading-screen">Chargement...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Route d'authentification */}
        <Route path="/connexion" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />

        {/* Route principale du dashboard avec sous-routes */}
        <Route 
  path="/dashboard" 
  element={
    user ? (
      <Dashboard>
        <Outlet /> {/* This will render the nested routes */}
      </Dashboard>
    ) : (
      <Navigate to="/connexion" />
    )
  }
>
  <Route path="employees" element={<EmployeesTable />} />
  <Route path="import-csv" element={<ImportCSV />} />
  <Route path="wellbeing" element={<Wellbeing />} />
  <Route path="predictions" element={<Prediction />} /> {/* Move predictions here */}
</Route>

        

        {/* Redirections par défaut */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/connexion"} replace />} />
        
        {/* Route de fallback */}
        <Route path="*" element={<div className="not-found">404 - Page non trouvée</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;