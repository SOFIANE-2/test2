import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/CreateaccountAPI';
import './CSS/CreateAccount.css';

function CreateAccount() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    age: '',
    admin: false,
    MotDePasse: '',
    confirmMotDePasse: '',
    pseudo: '',
    couleur: '',
    Devise: '',
    Pays: '',
    avatar: '',
    email: '',
    photo: '',
  });

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (!password.split('').some((char) => char >= 'A' && char <= 'Z')) {
      errors.push('Le mot de passe doit inclure au moins une lettre majuscule');
    }
    if (!password.split('').some((char) => char >= 'a' && char <= 'z')) {
      errors.push('Le mot de passe doit inclure au moins une lettre minuscule');
    }
    if (!password.split('').some((char) => char >= '0' && char <= '9')) {
      errors.push('Le mot de passe doit inclure au moins un chiffre');
    }
    if (!['!', '@', '#', '$', '%', '^', '&', '*'].some((char) => password.includes(char))) {
      errors.push('Le mot de passe doit inclure au moins un caractère spécial');
    }
    if (password.length < 8) {
      errors.push('Le mot de passe doit comporter au moins 8 caractères');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = [];

    // Validation des champs requis
    Object.entries(form).forEach(([key, value]) => {
      if (value === '' || value === null) {
        currentErrors.push(`${key} est requis`);
      }
    });

    // Validation du mot de passe
    const passwordErrors = validatePassword(form.MotDePasse);
    if (passwordErrors.length > 0) {
      currentErrors.push(...passwordErrors);
    }

    // Validation que les mots de passe correspondent
    if (form.MotDePasse !== form.confirmMotDePasse) {
      currentErrors.push('Les mots de passe ne correspondent pas');
    }

    // Si des erreurs existent, les afficher et ne pas soumettre
    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      return;
    }

    // Création d'une copie du formulaire sans le champ confirmMotDePasse
    const { confirmMotDePasse, ...formWithoutConfirmPassword } = form;

    try {
      // Appel API pour créer l'utilisateur avec les données sans confirmMotDePasse
      await createUser(formWithoutConfirmPassword);
      alert('Compte créé avec succès!');
      navigate('/');  // Rediriger vers la page de connexion
    } catch (err) {
      setErrors(['Erreur lors de la création du compte. Veuillez réessayer plus tard.']);
    }
  };

  return (
    <div id="createaccount-page-container">
      <div id="createaccount-form-container">
        <h2 id="createaccount-title">Créer un compte</h2>
        <form id="createaccount-form" onSubmit={handleSubmit}>
          <div id="form-row-container">
            <div id="form-column-left">
              <input
                id="input-nom"
                type="text"
                placeholder="Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
              <input
                id="input-prenom"
                type="text"
                placeholder="Prénom"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              />
              <input
                id="input-pseudo"
                type="text"
                placeholder="Pseudo"
                value={form.pseudo}
                onChange={(e) => setForm({ ...form, pseudo: e.target.value })}
              />
              <input
                id="input-age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
              <input
                id="input-couleur"
                type="text"
                placeholder="Couleur"
                value={form.couleur}
                onChange={(e) => setForm({ ...form, couleur: e.target.value })}
              />
            </div>

            <div id="form-column-right">
              <input
                id="input-email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                id="input-motdepasse"
                type="password"
                placeholder="Mot de passe"
                value={form.MotDePasse}
                onChange={(e) => setForm({ ...form, MotDePasse: e.target.value })}
              />
              <input
                id="input-confirm-motdepasse"
                type="password"
                placeholder="Confirmer mot de passe"
                value={form.confirmMotDePasse}
                onChange={(e) => setForm({ ...form, confirmMotDePasse: e.target.value })}
              />
              <input
                id="input-devise"
                type="text"
                placeholder="Devise"
                value={form.Devise}
                onChange={(e) => setForm({ ...form, Devise: e.target.value })}
              />
              <input
                id="input-pays"
                type="text"
                placeholder="Pays"
                value={form.Pays}
                onChange={(e) => setForm({ ...form, Pays: e.target.value })}
              />
            </div>
          </div>

          <input
            id="input-avatar"
            type="text"
            placeholder="Avatar URL"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          />
          <input
            id="input-photo"
            type="text"
            placeholder="Photo URL"
            value={form.photo}
            onChange={(e) => setForm({ ...form, photo: e.target.value })}
          />
          <button id="submit-button" type="submit">Créer le compte</button>
        </form>

        {errors.length > 0 && (
          <div id="error-message-container">
            <ul>
              {errors.map((error, index) => (
                <li key={index} className="error-message">{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateAccount;
