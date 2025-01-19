import React from 'react';
import { useSelector } from 'react-redux';
import './CSS/Profile.css';

const VoirProfil = () => {
  const user = useSelector((state) => state.auth.user);  
  if (!user) {
    return <div id="profile-not-logged-in-message">Utilisateur non connecté</div>;
  }

  return (
    <div id="profile-section">
      <h2 id="profile-heading">Profil de {user.nom} {user.prenom}</h2>
      <form id="profile-details-form">
        <div className="profile-data-field" id="profile-field-name">
          <label htmlFor="name">Nom:</label>
          <input
            id="name"
            type="text"
            value={user.nom}
            readOnly
            className="profile-input-field"
          />
        </div>
        <div className="profile-data-field" id="profile-field-firstname">
          <label htmlFor="firstname">Prénom:</label>
          <input
            id="firstname"
            type="text"
            value={user.prenom}
            readOnly
            className="profile-input-field"
          />
        </div>
        <div className="profile-data-field" id="profile-field-username">
          <label htmlFor="username">Pseudo:</label>
          <input
            id="username"
            type="text"
            value={user.pseudo}
            readOnly
            className="profile-input-field"
          />
        </div>
        <div className="profile-data-field" id="profile-field-age">
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            value={user.age}
            readOnly
            className="profile-input-field"
          />
        </div>
        <div className="profile-data-field" id="profile-field-color">
          <label htmlFor="color">Couleur préférée:</label>
          <input
            id="color"
            type="text"
            value={user.couleur}
            readOnly
            className="profile-input-field"
          />
        </div>
        <div className="profile-data-field" id="profile-field-motto">
          <label htmlFor="motto">Devise:</label>
          <input
            id="motto"
            type="text"
            value={user.Devise}
            readOnly
            className="profile-input-field"
          />
        </div>
        <div className="profile-data-field" id="profile-field-country">
          <label htmlFor="country">Pays:</label>
          <input
            id="country"
            type="text"
            value={user.Pays}
            readOnly
            className="profile-input-field"
          />
        </div>
        <div className="profile-data-field" id="profile-field-email">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={user.email}
            readOnly
            className="profile-input-field"
          />
        </div>
      </form>
    </div>
  );
};

export default VoirProfil;
