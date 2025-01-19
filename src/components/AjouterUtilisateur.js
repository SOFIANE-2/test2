import React, { useState, useEffect } from 'react';
import './CSS/AjouterUtilisateur.css';

function PromotionAdmin() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Erreur lors de la récupération des utilisateurs.');
      }
    };

    fetchUsers();
  }, []);

  const handleAdminToggle = async (userId) => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, admin: !user.admin } : user
      );
      setUsers(updatedUsers);

      const userToUpdate = updatedUsers.find(user => user.id === userId);
      await fetch(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToUpdate),
      });

      setError('');
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'utilisateur.');
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.prenom} ${user.nom}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const adminUsers = filteredUsers.filter(user => user.admin);
  const nonAdminUsers = filteredUsers.filter(user => !user.admin);

  return (
    <div className="promotion-admin-container">
      <h2 className="promotion-admin-title">Ajouter Utilisateur</h2>
      {error && <p className="promotion-admin-error">{error}</p>}

      <div className="promotion-admin-search-container">
        <input
          type="text"
          id="promotion-admin-search"
          className="promotion-admin-search"
          placeholder="Rechercher par nom ou prénom"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h3 className="promotion-admin-section-title">Utilisateurs Administrateurs</h3>
      <table className="promotion-admin-table" id="promotion-admin-table-admin">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {adminUsers.map(user => (
            <tr key={user.id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>
              <td>
                <label className="promotion-admin-switch">
                  <input
                    type="checkbox"
                    checked={user.admin}
                    onChange={() => handleAdminToggle(user.id)}
                  />
                  <span className="promotion-admin-slider"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="promotion-admin-section-title">Utilisateurs Non-Administrateurs</h3>
      <table className="promotion-admin-table" id="promotion-admin-table-non-admin">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {nonAdminUsers.map(user => (
            <tr key={user.id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>
              <td>
                <label className="promotion-admin-switch">
                  <input
                    type="checkbox"
                    checked={user.admin}
                    onChange={() => handleAdminToggle(user.id)}
                  />
                  <span className="promotion-admin-slider"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PromotionAdmin;
