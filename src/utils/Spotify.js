const Spotify = {
  async getUserId(token) {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user ID");
    }

    const jsonResponse = await response.json();
    return jsonResponse.id;
  },

  async createPlaylist(token, userId, name) {
    const endpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      description: 'Playlist creada desde Jammming',
      public: true
    })
  });

  if (!response.ok) {
    throw new Error('No se pudo crear la playlist');
  }

  const jsonResponse = await response.json();
  return jsonResponse.id;
  },

  async addTracksToPlaylist(token, playlistId, trackUris) {
  const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: trackUris
    })
  });

  if (!response.ok) {
    throw new Error('No se pudieron agregar las canciones a la playlist');
  }

  return; 
},

  
  

  async savePlaylist(name, trackUris, token) {
    if (!name || !trackUris.length) {
      return;
    }

    try {
      const userId = await this.getUserId(token);
      const playlistId = await this.createPlaylist(token, userId, name);
      await this.addTracksToPlaylist(token, playlistId, trackUris);
    } catch (error) {
      console.error("Error saving playlist:", error);
      throw error;
    }
  }
};

export default Spotify;
