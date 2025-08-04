// src/components/TrackList.js
import React from 'react';
import Track from './Track';

function TrackList({ tracks, onAction, actionLabel }) {
  return (
    <div>
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          onAction={onAction}
          actionLabel={actionLabel}
        />
      ))}
    </div>
  );
}

export default TrackList;
