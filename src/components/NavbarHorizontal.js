import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './CSS/navbarHorizontal.css'; 

const NavbarHorizontal = () => {
  const user = useSelector(state => state.auth.user);
  return (
    <nav id="navbar-horizontal">
      <ul>
        <li><Link to="/layout/accueil">Accueil</Link></li>
        <li><Link to="/layout/voir-mon-profile">Voir Mon Profil</Link></li>
        <li><Link to="/layout/change-color">Modifier Couleur</Link></li>
        {user?.admin && (
          <>
            <li><Link to="/layout/liste-utilisateurs">Liste Utilisateurs</Link></li>
            <li><Link to="/layout/ajouter-utilisateur">Ajouter Utilisateur</Link></li>
            <li><Link to="/layout/demande-utilisateur">Demande Utilisateur</Link></li>
            <li><Link to="/layout/statistique">Stats</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavbarHorizontal;
