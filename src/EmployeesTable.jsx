import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/firebase';
import './EmployeesTable.css';

const EmployeesTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'importedData'));
        const employeesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees: ", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    setEmployees([...employees].sort((a, b) => {
      const valueA = isNaN(a[key]) ? a[key] : Number(a[key]);
      const valueB = isNaN(b[key]) ? b[key] : Number(b[key]);

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  if (loading) {
    return <div className="loading">Chargement des employés...</div>;
  }

  return (
    <div className="employees-container">
      <h2>Tous les Employés <span className="count">({employees.length})</span></h2>
      
      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('Prénom')}>Prénom {sortConfig.key === 'Prénom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => requestSort('Nom')}>Nom {sortConfig.key === 'Nom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => requestSort('Département')}>Département {sortConfig.key === 'Département' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => requestSort('Score de satisfaction')}>Satisfaction {sortConfig.key === 'Score de satisfaction' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => requestSort('Absences l\'année dernière')}>Absences {sortConfig.key === 'Absences l\'année dernière' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Revenu</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id} className={employee['Score de satisfaction'] <= 2 ? 'high-risk' : ''}>
                <td>{employee.Prénom}</td>
                <td>{employee.Nom}</td>
                <td>{employee.Département}</td>
                <td className={employee['Score de satisfaction'] <= 2 ? 'danger' : ''}>
                  {employee['Score de satisfaction']}/5
                </td>
                <td>{employee['Absences l\'année dernière']} jours</td>
                <td>${employee['Revenu mensuel']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesTable;