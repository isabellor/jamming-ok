const Spotify = {
  async savePlaylist(name, trackUris, token) {
    if (!name || !trackUris.length) return;

    // Obtener User ID
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userData = await userResponse.json();
    const userId = userData.id;

    // Crear playlist
    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    const playlistData = await playlistResponse.json();
    const playlistId = playlistData.id;

    // Agregar tracks a playlist
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: trackUris }),
    });
  }
};

export default Spotify;
