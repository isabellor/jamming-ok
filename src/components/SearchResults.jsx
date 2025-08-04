// src/components/SearchResults.js
import React from 'react';
import TrackList from './TrackList';

function SearchResults({ results, onAdd }) {
  return (
    <div>
      <h2>Resultados</h2>
      <TrackList tracks={results} onAction={onAdd} actionLabel="+" />
    </div>
  );
}

export default SearchResults;
