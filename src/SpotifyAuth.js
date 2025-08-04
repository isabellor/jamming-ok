const clientId = "c4f1000e4ee643f98fbcac390edf188d";
const redirectUri = "https://spotifyjammingproyect.netlify.app"; // tu deploy
const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
];

let accessToken = "";

export function getAccessToken() {
  if (accessToken) return accessToken;

  const hash = window.location.hash;
  if (hash) {
    const tokenMatch = hash.match(/access_token=([^&]*)/);
    const expiresInMatch = hash.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Limpiar URL
      window.history.pushState("", document.title, window.location.pathname);

      // Expirar token
      setTimeout(() => accessToken = "", expiresIn * 1000);

      return accessToken;
    }
  }
  return "";
}

export function redirectToSpotifyLogin() {
  const authUrl =
    `https://accounts.spotify.com/authorize?client_id=${clientId}` +
    `&response_type=token` +
    `&scope=${encodeURIComponent(scopes.join(" "))}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  window.location = authUrl;
}
