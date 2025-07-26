const clientId = "c4f1000e4ee643f98fbcac390edf188d";
const redirectUri = "https://spotifyjammingproyect.netlify.app";
const scopes = ["playlist-modify-public", "playlist-modify-private"];

function generateRandomString(length) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => possible.charAt(x % possible.length))
    .join("");
}

function generateCodeChallenge(codeVerifier) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier)).then((hash) => {
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  });
}

export async function redirectToSpotifyLogin() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const authUrl =
    "https://accounts.spotify.com/authorize" +
    `?client_id=${clientId}` +
    "&response_type=code" +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes.join(" "))}` +
    "&code_challenge_method=S256" +
    `&code_challenge=${codeChallenge}`;

  window.location.href = authUrl;
}

export async function getAccessToken() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return null;

  const codeVerifier = localStorage.getItem("spotify_code_verifier");

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const data = await response.json();
  return data.access_token;
}
