import React from 'react';
import TrackList from './TrackList';

function SearchResults({ searchResults, onAdd }) {
  return (
    <div>
      <h2>Resultados</h2>
      <TrackList tracks={searchResults} onAdd={onAdd} isRemoval={false} />
    </div>
  );
}

export default SearchResults;
