import React, { useEffect, useState } from 'react';
import { fetchUsersAPI, deleteUserAPI, updateUserAPI } from '../api/UserAPI';
import './CSS/ListeUtilisateurs.css'; // Importation du CSS

const ListeUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsersAPI();
        setUsers(usersData);
      } catch (error) {
        setError('Erreur lors de la récupération des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <div id="loading-message">Chargement...</div>;
  }

  if (error) {
    return <div id="error-message">{error}</div>;
  }

  const handleEdit = (user) => {
    setIsEditing(true);
    setIsViewing(false);
    setCurrentUser({ ...user });
  };

  const handleViewDetails = (user) => {
    setIsViewing(true);
    setIsEditing(false);
    setCurrentUser({ ...user });
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUserAPI(userId);
      setUsers(users.filter(user => user.id !== userId));
      alert('Utilisateur supprimé avec succès');
    } catch (error) {
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsViewing(false);
    setCurrentUser(null);
  };

  const handleSubmit = async () => {
    try {
      await updateUserAPI(currentUser.id, currentUser);
      setIsEditing(false);
      setIsViewing(false);
      setCurrentUser(null);
      const updatedUsers = await fetchUsersAPI();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  return (
    <div id="utilisateurs-page">
      <div id="utilisateurs-container" className="fade-in">
        <h2 id="page-title">Liste des Utilisateurs</h2>
        {isEditing || isViewing ? (
          <div>
            <h3>{isEditing ? 'Modifier l\'utilisateur' : 'Détails de l\'utilisateur'}</h3>
            <div id="form-container">
              <div>
                <label>Nom:</label>
                <input
                  type="text"
                  value={currentUser.nom}
                  onChange={(e) => setCurrentUser({ ...currentUser, nom: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Prénom:</label>
                <input
                  type="text"
                  value={currentUser.prenom}
                  onChange={(e) => setCurrentUser({ ...currentUser, prenom: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Âge:</label>
                <input
                  type="number"
                  value={currentUser.age}
                  onChange={(e) => setCurrentUser({ ...currentUser, age: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Avatar URL:</label>
                <input
                  type="text"
                  value={currentUser.avatar}
                  onChange={(e) => setCurrentUser({ ...currentUser, avatar: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Photo URL:</label>
                <input
                  type="text"
                  value={currentUser.photo}
                  onChange={(e) => setCurrentUser({ ...currentUser, photo: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              {isEditing ? (
                <div>
                  <button id="form-submit-button" className="form-submit-button" type="button" onClick={handleSubmit}>Valider</button>
                  <button id="form-cancel-button" className="form-cancel-button" type="button" onClick={handleCancel}>Annuler</button>
                </div>
              ) : (
                <button id="form-cancel-button" className="form-cancel-button" type="button" onClick={handleCancel}>Retour à la liste</button>
              )}
            </div>
          </div>
        ) : (
          <table id="utilisateurs-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Âge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.age}</td>
                  <td>
                    <button id="edit-button" onClick={() => handleEdit(user)}>Modifier</button>
                    <button id="view-details-button" onClick={() => handleViewDetails(user)}>Voir Détails</button>
                    <button id="delete-button" onClick={() => handleDelete(user.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListeUtilisateurs;
