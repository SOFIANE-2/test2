import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './CSS/Accueil.css';

const Accueil = () => {
  const user = useSelector((state) => state.auth.user);
  const [requestType, setRequestType] = useState('');
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [holidayType, setHolidayType] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserRequests();
    }
  }, [user]);

  const fetchUserRequests = async () => {
    try {
      const response = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`);
      setUserRequests(response.data.requests || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    }
  };

  if (!user) {
    return <div id="accueil-container">Veuillez vous connecter pour soumettre une demande.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestType || (requestType === 'congé' && (!holidayStartDate || !holidayEndDate || !holidayType || !description)) || (requestType === 'demission' && !description)) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    setIsSubmitting(true);

    let newRequest = {};

    if (requestType === 'conge') {
      newRequest = {
        title: `Congé: ${holidayType}`,
        startDate: holidayStartDate,
        endDate: holidayEndDate,
        type: holidayType,
        description,
        status: 'En attente',
        createdAt: new Date().toISOString(),
      };
    } else if (requestType === 'demission') {
      newRequest = {
        title: 'Démission',
        description,
        status: 'En attente',
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const userResponse = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`);
      const currentUser = userResponse.data;

      const updatedRequests = currentUser.requests 
        ? [...currentUser.requests, newRequest] 
        : [newRequest];

      await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`, {
        ...currentUser,
        requests: updatedRequests,
      });

      setUserRequests(updatedRequests);
      setMessage('Votre demande a été soumise avec succès.');
      setHolidayStartDate('');
      setHolidayEndDate('');
      setHolidayType('');
      setDescription('');
      setRequestType('');
    } catch (error) {
      setMessage('Erreur lors de l\'envoi de la demande. Veuillez réessayer plus tard.');
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = async (requestIndex) => {
    try {
      const userResponse = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`);
      const currentUser = userResponse.data;

      const updatedRequests = currentUser.requests.filter((_, index) => index !== requestIndex);

      await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`, {
        ...currentUser,
        requests: updatedRequests,
      });

      setUserRequests(updatedRequests);
      setMessage('Demande supprimée avec succès.');
    } catch (error) {
      setMessage('Erreur lors de la suppression de la demande.');
      console.error('Erreur:', error);
    }
  };

  return (
    <div id="accueil-container">
      <h2 id="accueil-title">Bienvenue sur la page d'accueil !</h2>
      <p id="accueil-description">Cette page est l'endroit où vous pouvez soumettre et gérer vos demandes.</p>
      
      <h3 id="accueil-subtitle">Faire une demande</h3>
      <form id="accueil-formulaire" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="requestType">Type de demande :</label>
          <select
            id="requestType"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            required
          >
            <option value="">Sélectionner un type de demande</option>
            <option value="conge">Congé</option>
            <option value="demission">Démission</option>
          </select>
        </div>

        {requestType === 'conge' && (
          <>
            <div>
              <label htmlFor="holidayStartDate">Date de début du Congé :</label>
              <input
                type="date"
                id="holidayStartDate"
                value={holidayStartDate}
                onChange={(e) => setHolidayStartDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="holidayEndDate">Date de fin du Congé :</label>
              <input
                type="date"
                id="holidayEndDate"
                value={holidayEndDate}
                onChange={(e) => setHolidayEndDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="holidayType">Type de Congé :</label>
              <select
                id="holidayType"
                value={holidayType}
                onChange={(e) => setHolidayType(e.target.value)}
                required
              >
                <option value="">Sélectionner un type de congé</option>
                <option value="vacances">Vacances</option>
                <option value="maladie">Maladie</option>
                <option value="personnel">Raison personnelle</option>
              </select>
            </div>
          </>
        )}

        {requestType === 'demission' && (
          <div>
            <label htmlFor="description">Description :</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre demande"
              required
            ></textarea>
          </div>
        )}

        <button type="submit" id="accueil-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
        </button>
      </form>

      {message && <p id="accueil-message">{message}</p>}

      <h3 id="accueil-subtitle">Vos demandes</h3>
      {userRequests.length === 0 ? (
        <p>Vous n'avez pas encore de demandes.</p>
      ) : (
        <div id="accueil-requests-list">
          <ul>
            {userRequests.map((request, index) => (
              <li key={index}>
                <strong>{request.title}</strong>
                <p>{request.description}</p>
                <p>Statut : {request.status}</p>
                <button onClick={() => handleDeleteRequest(index)}>
                  Supprimer la demande
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Accueil;
