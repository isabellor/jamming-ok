// src/App.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { redirectToSpotifyLogin, fetchAccessToken, search, savePlaylist, getAccessToken } from "./utils/Spotify";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";

export default function App() {
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("Mi Playlist");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");

    if (code) {
      fetchAccessToken(code).then(() => {
        setTokenLoaded(true);
        navigate("/");
      });
    }
  }, [location, navigate]);

  const handleLogin = () => {
    redirectToSpotifyLogin();
  };

  const handleSearch = async (term) => {
    const results = await search(term);
    setSearchResults(results);
  };

  const addTrack = (track) => {
    if (!playlistTracks.find(t => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter(t => t.id !== track.id));
  };

  const handleSave = async () => {
    const uris = playlistTracks.map(t => t.uri);
    await savePlaylist(playlistName, uris);
    setPlaylistName("Nueva Playlist");
    setPlaylistTracks([]);
  };

  if (!getAccessToken() && !tokenLoaded) {
    return <button onClick={handleLogin}>Login con Spotify</button>;
  }

  return (
    <div className="App">
      <h1>Jammming</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResults searchResults={searchResults} onAdd={addTrack} />
      <Playlist
        playlistName={playlistName}
        onNameChange={setPlaylistName}
        tracks={playlistTracks}
        onRemove={removeTrack}
        onSave={handleSave}
      />
    </div>
  );
}
