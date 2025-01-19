import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/actions';
import { useNavigate } from 'react-router-dom';
import './CSS/header.css'; 

const Header = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout triggered');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header id="header">
      <div id="user-info-container">
        {user && (
          <>
            <img 
              src={user.avatar} 
              alt="User Avatar" 
              id="user-avatar" 
            />
            <span id="user-name">{user.nom} {user.prenom}</span>
          </>
        )}
      </div>
      <button id="logout-button" onClick={handleLogout}>Déconnexion</button>
    </header>
  );
};

export default Header;
