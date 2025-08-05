import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleTermChange = (e) => setTerm(e.target.value);

  const search = () => onSearch(term);

  return (
    <div>
      <input onChange={handleTermChange} placeholder="Ingresá un tema" />
      <button onClick={search}>Buscar</button>
    </div>
  );
}

export default SearchBar;
