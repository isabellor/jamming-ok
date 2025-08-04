import { useEffect, useState } from "react";
import { getAccessToken, redirectToSpotifyLogin } from "./SpotifyAuth.js";

import Spotify from "./utils/Spotify.js";

import SearchBar from "./components/SearchBar.jsx"
import SearchResults from "./components/SearchResults.jsx";
import Playlist from "./components/Playlist.jsx";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [token, setToken] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("Mi Playlist");

  useEffect(() => {
    const tokenFromUrl = getAccessToken();
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, []);

  if (!token) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Para usar Jammming necesitas iniciar sesión en Spotify</h2>
        <button onClick={redirectToSpotifyLogin}>Iniciar sesión con Spotify</button>
      </div>
    );
  }

  const addTrack = (track) => {
    if (!playlistTracks.find(t => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
      toast.success(`Agregaste "${track.name}"`);
    }
  };

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter(t => t.id !== track.id));
    toast.info(`Removiste "${track.name}"`);
  };

  const savePlaylist = async () => {
    const trackUris = playlistTracks.map(t => t.uri);
    try {
      await Spotify.savePlaylist(playlistName, trackUris, token);
      toast.success("Playlist guardada en Spotify!");
      setPlaylistName("Nueva Playlist");
      setPlaylistTracks([]);
    } catch {
      toast.error("Error guardando la playlist");
    }
  };

  const handleSearch = async (term) => {
    // Aquí iría la búsqueda real, por ahora vacía
    toast.info(`Buscando: ${term}`);
    setSearchResults([]);
  };

  return (
    <div className="App" style={{ padding: "1rem" }}>
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
