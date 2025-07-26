import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search for a song..." 
        value={searchTerm} 
        onChange={handleChange} 
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
