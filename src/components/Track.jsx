import React from 'react';

function Track({ track, onAdd, onRemove, isRemoval }) {
  const handleAdd = () => onAdd(track);
  const handleRemove = () => onRemove(track);

  return (
    <div>
      <h3>{track.name}</h3>
      <p>{track.artist} | {track.album}</p>
      {isRemoval ? <button onClick={handleRemove}>-</button> : <button onClick={handleAdd}>+</button>}
    </div>
  );
}

export default Track;
