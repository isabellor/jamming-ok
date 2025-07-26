import { useContext, useEffect, useState } from "react";
import { AuthContext }  from "./auth/Auth.jsx"; 
import { getAccessToken, redirectToSpotifyLogin } from "./auth/SpotifyAuth.js";
import Spotify from "./utils/Spotify.js";

import SearchBar from "./components/SearchBar.jsx";
import SearchResults from "./components/SearchResults.jsx";
import Playlist from "./components/Playlist.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const { token, login, logout } = useContext(AuthContext);

  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("Mi Playlist");

  useEffect(() => {
    const accessTokenFromUrl = getAccessToken();
    if (!token && accessTokenFromUrl) {
      login(accessTokenFromUrl);
    }
  }, [token, login]);

  if (!token) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Para usar Jammming necesitas iniciar sesión en Spotify</h2>
        <button onClick={redirectToSpotifyLogin}>Iniciar sesión con Spotify</button>
      </div>
    );
  }

  const addTrack = (track) => {
    if (!playlistTracks.find((t) => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
      toast.success(`Agregaste "${track.name}"`);
    }
  };

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
    toast.info(`Removiste "${track.name}"`);
  };

  const savePlaylist = async () => {
    const trackUris = playlistTracks.map((t) => t.uri);
    try {
      await Spotify.savePlaylist(playlistName, trackUris, token);
      toast.success("Playlist guardada en Spotify!");
      setPlaylistName("Nueva Playlist");
      setPlaylistTracks([]);
    } catch (error) {
      toast.error("Error guardando la playlist");
    }
  };

  const handleSearch = async (term) => {
    // Aquí puedes implementar la búsqueda real con la API Spotify (GET /search)
    // Por ahora simulamos con datos fijos o vacíos
    toast.info(`Buscando: ${term}`);
    setSearchResults([]); // O la respuesta real
  };

  return (
    <div className="App" style={{ padding: "1rem" }}>
      <button onClick={logout} style={{ float: "right" }}>
        Logout
      </button>
      <SearchBar onSearch={handleSearch} />
      <SearchResults tracks={searchResults} onAdd={addTrack} />
      <Playlist
        playlistName={playlistName}
        onNameChange={setPlaylistName}
        tracks={playlistTracks}
        onRemove={removeTrack}
        onSave={savePlaylist}
      />
      <ToastContainer />
    </div>
  );
}
