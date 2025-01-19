import React, { useEffect, useState } from 'react';
import { fetchUsersAPI } from '../api/UserAPI';
import './CSS/StatisticsDashboard.css';

const StatisticsDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    adminUsers: 0,
    visitorUsers: 0,
    topColors: [],
    demandes: {
      approuvees: 0,
      rejetees: 0,
      enAttente: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);

        const usersData = await fetchUsersAPI();
  
        let colorCounts = {};
        let demandesStats = {
          approuvees: 0,
          rejetees: 0,
          enAttente: 0,
        };
  
        const statData = {
          totalUsers: usersData.length,
          adminUsers: usersData.filter(user => user.admin).length,
          visitorUsers: usersData.filter(user => !user.admin).length,
        };
  
        usersData.forEach(user => {
          if (user.couleur) {
            colorCounts[user.couleur] = (colorCounts[user.couleur] || 0) + 1;
          }
  
          // Vérification des demandes de l'utilisateur
          if (user.requests) {
            user.requests.forEach(request => {
              // Vérifier si la demande est valide avant de lire ses propriétés
              if (request && request.status) {
                if (request.status === 'Approuvée') {
                  demandesStats.approuvees++;
                } else if (request.status === 'Rejetée') {
                  demandesStats.rejetees++;
                } else if (request.status === 'En attente') {
                  demandesStats.enAttente++;
                }
              }
            });
          }
        });
  
        const topColors = Object.entries(colorCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5)
          .map(([color, count]) => ({
            color,
            count,
            percentage: ((count / statData.totalUsers) * 100).toFixed(2),
          }));
  
        setStatistics({
          ...statData,
          topColors,
          demandes: demandesStats,
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
        setError('Impossible de charger les statistiques');
      } finally {
        setLoading(false);
      }
    };
  
    loadStatistics();
  }, []);
  

  if (loading) {
    return <div>Chargement des statistiques...</div>;
  }
  if (error) {
    return <div>{`Erreur: ${error}`}</div>;
  }

  return (
    <div className="statistics-dashboard">
      <h2>Tableau de Bord des Statistiques</h2>
      <table className="statistics-table">
        <thead>
          <tr>
            <th>Statistiques Générales</th>
            <th>Valeur</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Utilisateurs</td>
            <td>{statistics.totalUsers}</td>
          </tr>
          <tr>
            <td>Administrateurs</td>
            <td>{statistics.adminUsers}</td>
          </tr>
          <tr>
            <td>Visiteurs</td>
            <td>{statistics.visitorUsers}</td>
          </tr>
        </tbody>

        <thead>
          <tr>
            <th>Statistiques des Demandes</th>
            <th>Valeur</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Demandes en Attente</td>
            <td>{statistics.demandes.enAttente}</td>
          </tr>
          <tr>
            <td>Demandes Approuvées</td>
            <td>{statistics.demandes.approuvees}</td>
          </tr>
          <tr>
            <td>Demandes Rejetées</td>
            <td>{statistics.demandes.rejetees}</td>
          </tr>
        </tbody>

        <thead>
          <tr>
            <th>Top 5 Couleurs les Plus Utilisées</th>
            <th>Pourcentage</th>
          </tr>
        </thead>
        <tbody>
          {statistics.topColors.map(({ color, count, percentage }) => (
            <tr key={color}>
              <td>
                <div
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    marginRight: '10px',
                  }}
                ></div>
                {color} ({count} utilisateurs)
              </td>
              <td>{percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsDashboard;
