// src/utils/Spotify.js
const clientId = "TU_CLIENT_ID";
const redirectUri = "https://spotifyjammingproyect.netlify.app/callback";
const scopes = [
  "playlist-modify-public",
  "playlist-modify-private"
];

let codeVerifier;
let accessToken = '';

function generateCodeVerifier(length = 128) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function redirectToSpotifyLogin() {
  codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("verifier", codeVerifier);

  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scopes.join(" ")
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

  window.location = url;
}

export async function fetchAccessToken(code) {
  codeVerifier = localStorage.getItem("verifier");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = await response.json();
  accessToken = data.access_token;
  return accessToken;
}

export function getAccessToken() {
  return accessToken;
}

export async function search(term) {
  const token = getAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const jsonResponse = await response.json();

  if (!jsonResponse.tracks) return [];

  return jsonResponse.tracks.items.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    uri: track.uri
  }));
}

export async function savePlaylist(name, uris) {
  if (!name || !uris.length) return;
  const token = getAccessToken();

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const userResponse = await fetch("https://api.spotify.com/v1/me", { headers });
  const userData = await userResponse.json();

  const createResponse = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name })
  });

  const playlistData = await createResponse.json();

  await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
    method: "POST",
    headers,
    body: JSON.stringify({ uris })
  });
}
