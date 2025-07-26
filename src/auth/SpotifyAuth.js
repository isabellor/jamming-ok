// src/SpotifyAuth.js

const clientId = "c4f1000e4ee643f98fbcac390edf188d";  // poné tu Client ID de Spotify
const redirectUri = "https://spotifyjammingproyect.netlify.app";  // tu URI de redirección registrada en Spotify
const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
  // agregá otros scopes que necesites
];

let accessToken = "";
let expiresIn = 0;

export function getAccessToken() {
  // Verificamos si el token ya está guardado
  if (accessToken) return accessToken;

  // Buscamos el token en la URL (hash)
  const hash = window.location.hash;

  if (hash) {
    // Extraemos el access_token y expires_in usando RegExp
    const tokenMatch = hash.match(/access_token=([^&]*)/);
    const expiresInMatch = hash.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      expiresIn = Number(expiresInMatch[1]);

      // Limpiar el hash de la URL para evitar problemas
      window.history.pushState("", document.title, window.location.pathname);

      // Timer para borrar el token cuando expire
      setTimeout(() => accessToken = "", expiresIn * 1000);

      return accessToken;
    }
  }

  // Si no hay token en URL, devolver vacío para pedir login
  return "";
}

export function redirectToSpotifyLogin() {
  const authUrl = 
    `https://accounts.spotify.com/authorize?client_id=${clientId}` +
    `&response_type=token` +
    `&scope=${encodeURIComponent(scopes.join(" "))}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

 console.log("Spotify Auth URL:", authUrl);

  window.location = authUrl;
}
