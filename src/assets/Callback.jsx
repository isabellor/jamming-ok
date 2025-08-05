// src/pages/Callback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessTokenFromCode } from '../auth/SpotifyAuth.js';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      getAccessTokenFromCode(code).then(token => {
        localStorage.setItem('spotify_access_token', token);
        navigate('/'); // volvemos al inicio
      });
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <p>Autenticando...</p>;
}
