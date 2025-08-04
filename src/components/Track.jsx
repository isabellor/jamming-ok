// src/components/Track.js
import React from 'react';

function Track({ track, onAction, actionLabel }) {
  const handleClick = () => onAction(track);

  return (
    <div>
      <h3>{track.name}</h3>
      <p>{track.artist} | {track.album}</p>
      <button onClick={handleClick}>{actionLabel}</button>
    </div>
  );
}

export default Track;
