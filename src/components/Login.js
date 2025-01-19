import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '/react/mini-projet-react/src/store/actions'; 
import { verifyLogin } from '../api/LoginAPI'; 
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css';

const MAX_TENTATIVES = 3;

const Login = () => {
  const dispatch = useDispatch();
  const [nom, setNom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState([]);
  const [tentatives, setTentatives] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    // Appel à l'API pour vérifier les identifiants
    const result = await verifyLogin(nom, motDePasse);

    if (result.success) {
      localStorage.setItem('token', result.token);
      dispatch(loginSuccess(result.user));
      setMessage(['Connexion réussie ! Bienvenue ' + result.user.prenom + '.']);
      setTentatives(0);

      setIsLoading(true);
      // Délai avant la redirection
      setTimeout(() => {
        setIsLoading(false);
        navigate('/Layout');
      }, 1000); 
    } else {
      const newTentatives = tentatives + 1;
      setTentatives(newTentatives);
      const tentativesRestantes = MAX_TENTATIVES - newTentatives;
      if (newTentatives >= MAX_TENTATIVES) {
        setIsDisabled(true);
        setMessage(['Compte bloqué après 3 tentatives échouées.']);
      } else {
        setMessage([
          'Connexion incorrecte.',
          `Tentatives restantes : ${tentativesRestantes}`
        ]);
      }
    }
  };
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Connexion en cours...</p>
      </div>
    );
  }

  return (
    <div id="login-container">
      <form id="login-form" onSubmit={handleLogin}>
        <h1>Connexion</h1>
        <div>
          <label htmlFor="nom">Nom :</label>
          <input
            id="nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="input-field"
            required
            disabled={isDisabled}
          />
        </div>
        <div>
          <label htmlFor="motDePasse">Mot de passe :</label>
          <input
            id="motDePasse"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="input-field"
            required
            disabled={isDisabled}
          />
        </div>
        <button id="login-button" type="submit" disabled={isDisabled}>LOGIN</button>
        <div id="error-block">
          {message.length > 0 && (
            <ul>
              {message.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
        
        <div id="login-create-account">
          <p>
            <a href="/CreateAccount">Create an account</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
