const clientId = 'c4f1000e4ee643f98fbcac390edf188d'; // Reemplaza por tu clientId real
const redirectUri = 'https://spotifyjammingproyect.netlify.app/callback'; // Debe coincidir con la URI registrada en Spotify Dashboard
const scopes = ['playlist-modify-public', 'playlist-modify-private'];

let codeVerifier;
let accessToken;

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export const Spotify = {
  async redirectToAuthCodeFlow() {
    codeVerifier = generateRandomString(128);
    localStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString(16);

    const args = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scopes.join(' '),
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    window.location = `https://accounts.spotify.com/authorize?${args}`;
  },

  async getAccessToken(codeFromUrl) {
    const storedVerifier = localStorage.getItem('code_verifier');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: codeFromUrl,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: storedVerifier,
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
  },

  getToken() {
    return accessToken;
  },

  async search(term) {
    const token = this.getToken();
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();
    if (!jsonResponse.tracks) return [];
    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;

    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const userResponse = await fetch('https://api.spotify.com/v1/me', { headers });
    const userData = await userResponse.json();
    const userId = userData.id;

    const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name }),
    });

    const playlistData = await createResponse.json();
    const playlistId = playlistData.id;

    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ uris: trackUris }),
    });
  }
};
