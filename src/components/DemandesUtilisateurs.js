import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './CSS/DemandeUtilisateur.css'

const DemandesUtilisateurs = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  // Fonction pour vérifier si les données sont bien formatées
  const verifyRequestData = (data) => {
    if (!data) {
      console.error('Aucune donnée reçue.');
      return false;
    }
    if (!Array.isArray(data)) {
      console.error('Les données ne sont pas un tableau.');
      return false;
    }
    return true;
  };

  // Récupérer tous les utilisateurs avec leurs demandes
  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire');

      if (!verifyRequestData(response.data)) {
        setError('Données mal formatées.');
        setLoading(false);
        return;
      }

      // Collecter toutes les demandes de tous les utilisateurs
      const toutesLesDemandes = response.data.reduce((acc, utilisateur) => {
        if (utilisateur.requests && Array.isArray(utilisateur.requests)) {
          utilisateur.requests.forEach((demande, index) => {
            if (demande && demande.status !== undefined) {
              acc.push({
                ...demande,
                utilisateurId: utilisateur.id,
                nomUtilisateur: utilisateur.nom || utilisateur.username || 'Utilisateur',
                status: demande.status || 'En attente'
              });
            }
          });
        }

        return acc;
      }, []);

      setDemandes(toutesLesDemandes);
      setLoading(false);
    } catch (err) {
      setError('Impossible de charger les demandes');
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'une demande
  const updateDemandeStatus = async (utilisateurId, demandeIndex, nouveauStatut) => {
    try {
      const utilisateurResponse = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${utilisateurId}`);
      const utilisateur = utilisateurResponse.data;

      if (utilisateur.requests) {
        utilisateur.requests[demandeIndex].status = nouveauStatut;

        await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${utilisateurId}`, utilisateur);

        fetchDemandes();
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Supprimer une demande
  const rejeterDemande = async (utilisateurId, demandeIndex) => {
    try {
      const utilisateurResponse = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${utilisateurId}`);
      const utilisateur = utilisateurResponse.data;
  
      if (utilisateur.requests) {
        utilisateur.requests[demandeIndex].status = "Rejetée";
  
        await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${utilisateurId}`, utilisateur);
  
        fetchDemandes();
      }
    } catch (err) {
      alert('Erreur lors du rejet de la demande');
    }
  };


  useEffect(() => {
    if (user?.admin) {
      fetchDemandes();
    }
  }, [user]);


  if (!user?.admin) {
    return <div>Vous n'avez pas les droits pour voir cette page.</div>;
  }


  if (loading) {
    return <div>Chargement des demandes...</div>;
  }


  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div id="demandes-container">
      <h2>Demandes des Utilisateurs</h2>
  
      {loading && <p className="message loading">Chargement des demandes...</p>}
      {error && <p className="message error">{error}</p>}
  
      <table id="demandes-table">
        <thead>
          <tr>
            <th>Titre de la Demande</th>
            <th>Utilisateur</th>
            <th>Statut Actuel</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((demande, index) => (
            <tr key={`${demande.utilisateurId}-${index}`}>
              <td>{demande.title || 'Titre indisponible'}</td>
              <td>{demande.nomUtilisateur || 'Nom inconnu'}</td>
              <td>{demande.status || 'Statut inconnu'}</td>
              <td>
                <div className="actions-buttons">
                  <button 
                    onClick={() => {
                      alert(`Détails de la demande:\n\nTitre: ${demande.title}\n\nDescription: ${demande.description}`);
                    }}
                  >
                    Afficher
                  </button>
                  <button 
                    onClick={() => updateDemandeStatus(demande.utilisateurId, index, 'En attente')}
                    disabled={demande.status === 'En attente'}
                  >
                    Mettre en Attente
                  </button>
                  <button 
                    onClick={() => updateDemandeStatus(demande.utilisateurId, index, 'Approuvée')}
                    disabled={demande.status === 'Approuvée'}
                  >
                    Approuver
                  </button>
                  <button 
                    onClick={() => rejeterDemande(demande.utilisateurId, index)}
                    disabled={demande.status === 'Rejetée'}
                  >
                    Rejeter
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {demandes.length === 0 && <p className="message">Aucune demande trouvée.</p>}
    </div>
  );
};

export default DemandesUtilisateurs;
