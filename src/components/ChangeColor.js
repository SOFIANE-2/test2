import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeColor } from '../store/actions';
import { updateColorAPI } from '../api/UserAPI';
import './CSS/ChangeColor.css';

const ChangeColor = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [newColor, setNewColor] = useState(user?.couleur || '');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (user) {
      if (user?.age < 15 && !user?.admin) {
        setMessage("Vous devez être administrateur ou avoir plus de 15 ans pour changer votre couleur.");
        setMessageType('error');
      } else {
        setMessage('');
        setMessageType('');
      }
    }
  }, [user]);

  const handleChangeColor = async () => {
    if (!user || (user?.age < 15 && !user?.admin)) {
      setMessage("Vous n'êtes pas autorisé à changer la couleur.");
      setMessageType('error');
      return;
    }

    try {
      if (!user?.id) {
        throw new Error('Utilisateur non identifié');
      }

      const updatedUser = await updateColorAPI(user.id, newColor);

      dispatch(changeColor(updatedUser.couleur)); // Mise à jour de la couleur dans le store
      setMessage('Couleur mise à jour avec succès!');
      setMessageType('success');
    } catch (error) {
      console.error('Error while updating color:', error);

      if (error.response && error.response.status === 401) {
        setMessage('Votre session a expiré. Veuillez vous reconnecter.');
        setMessageType('error');
      } else {
        setMessage('Erreur lors de la mise à jour de la couleur.');
        setMessageType('error');
      }
    }
  };

  const colorStyle = {
    '--bg-color': newColor, // Application de la couleur sélectionnée à la div
  };

  if (!user || (user?.age < 15 && !user?.admin)) {
    return <div className="change-color-message-container change-color-error">{message}</div>;
  }

  return (
    <div className="change-color-page-container" style={colorStyle}>
      <h2 className="change-color-title">Modifier la couleur de votre profil</h2>
      <p className="change-color-current-color">
        Couleur actuelle : 
        <span className="change-color-current-color-value">{user?.couleur}</span>
      </p>

      <div className="change-color-select-container">
        <label htmlFor="change-color-select">Choisissez une nouvelle couleur :</label>
        <select
          id="change-color-select-input"
          className="change-color-select-input"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        >
          <option value="lightblue">Bleu clair</option>
          <option value="lightgreen">Vert clair</option>
          <option value="lightcoral">Corail clair</option>
          <option value="lightyellow">Jaune clair</option>
          <option value="lavender">Lavande</option>
          <option value="peachpuff">Pêche claire</option>
          <option value="mintcream">Menthe</option>
          <option value="lightpink">Rose clair</option>
          <option value="lightseagreen">Vert mer clair</option>
          <option value="skyblue">Bleu ciel</option>
          <option value="lightgoldenrodyellow">Jaune doré clair</option>
          <option value="thistle">Chardon clair</option>
          <option value="wheat">Blé clair</option>
          <option value="beige">Beige</option>
          <option value="aliceblue">Bleu Alice</option>
          <option value="honeydew">Miel clair</option>
          <option value="powderblue">Bleu poudre</option>
          <option value="mistyrose">Rose brume</option>
          <option value="snow">Neige</option>
          <option value="floralwhite">Blanc floral</option>
          <option value="seashell">Coquillage</option>
        </select>
      </div>

      <button
        id="change-color-submit-button"
        className="change-color-submit-button"
        onClick={handleChangeColor}
      >
        Valider
      </button>

      {message && (
        <p className={`change-color-message-container ${messageType}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ChangeColor;
