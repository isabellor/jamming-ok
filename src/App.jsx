// src/App.js
import React, { useState } from 'react';
import './App.css';
import Spotify from './auth.jsx';

import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('Nueva Playlist');

  const search = async (term) => {
    const results = await Spotify.search(term);
    setSearchResults(results);
  };

  const addTrack = (track) => {
    if (playlistTracks.find((saved) => saved.id === track.id)) return;
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris);
    setPlaylistName('Nueva Playlist');
    setPlaylistTracks([]);
  };

  return (
    <div>
      <h1>Jammming 🎵</h1>
      <SearchBar onSearch={search} />
      <div className="App-playlist">
        <SearchResults results={searchResults} onAdd={addTrack} />
        <Playlist
          name={playlistName}
          tracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
