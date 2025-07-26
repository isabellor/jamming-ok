const Spotify = {
  async savePlaylist(name, uris, token) {
    if (!name || !uris.length || !token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // Obtener el ID del usuario
    const userResponse = await fetch("https://api.spotify.com/v1/me", { headers });
    const userData = await userResponse.json();
    const userId = userData.id;

    // Crear la playlist
    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    const playlistData = await playlistResponse.json();
    const playlistId = playlistData.id;

    // Agregar tracks
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers,
      body: JSON.stringify({ uris })
    });
  }
};

export default Spotify;
