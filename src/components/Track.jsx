export default function Track({ track, onAdd, onRemove, isRemoval }) {
  return (
    <div className="Track">
      <h3>{track.name}</h3>
      <p>{track.artist} | {track.album}</p>
      {isRemoval ? (
        <button onClick={() => onRemove(track)}>Remove</button>
      ) : (
        <button onClick={() => onAdd(track)}>Add</button>
      )}
    </div>
  );
}
