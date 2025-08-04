// src/components/Playlist.js
import React from 'react';
import TrackList from './TrackList';

function Playlist({ name, tracks, onRemove, onNameChange, onSave }) {
  return (
    <div>
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <TrackList tracks={tracks} onAction={onRemove} actionLabel="–" />
      <button onClick={onSave}>Guardar en Spotify</button>
    </div>
  );
}

export default Playlist;
