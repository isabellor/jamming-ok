import TrackList from "./TrackList";

export default function SearchResults({ tracks, onAdd }) {
  return (
    <div>
      <h2>Search Results</h2>
      <TrackList tracks={tracks} onAdd={onAdd} isRemoval={false} />
      
    </div>
  );
}
