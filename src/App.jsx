import { useEffect, useState } from 'react';
import { Spotify } from './utils/Spotify.js';
import SearchBar from './components/SearchBar.jsx';
import SearchResults from './components/SearchResults.jsx';
import Playlist from './components/Playlist.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [token, setToken] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('Nueva Playlist');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!token && code) {
      Spotify.getAccessToken(code).then(access => {
        setToken(access);
        window.history.pushState({}, '', '/'); // Limpia la URL
      });
    }
  }, [token]);

  if (!token) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Conecta con Spotify para usar la app</h2>
        <button onClick={Spotify.redirectToAuthCodeFlow}>
          Iniciar sesión con Spotify
        </button>
      </div>
    );
  }

  const handleSearch = async (term) => {
    const results = await Spotify.search(term);
    setSearchResults(results);
  };

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
    const uris = playlistTracks.map(t => t.uri);
    await Spotify.savePlaylist(playlistName, uris);
    toast.success('¡Playlist guardada!');
    setPlaylistName('Nueva Playlist');
    setPlaylistTracks([]);
  };

  return (
    <div className="App" style={{ padding: '1rem' }}>
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

export default App;
