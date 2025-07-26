import { useState } from "react";
import TrackList from "./TrackList";

export default function Playlist({ playlistName, onNameChange, tracks = [], onRemove, onSave }) {
  // Estado local para controlar el input, sincronizado con playlistName
  const [name, setName] = useState(playlistName);

  // Actualizamos el estado local y notificamos al padre
  const handleNameChange = (event) => {
    setName(event.target.value);
    onNameChange(event.target.value);
  };

  return (
    <div>
      <input 
        type="text" 
        value={name} 
        onChange={handleNameChange} 
        style={{ fontSize: "1.5em", fontWeight: "bold", marginBottom: "1rem" }}
      />
      <TrackList tracks={tracks} onRemove={onRemove} isRemoval={true} />
      <button onClick={onSave}>Save to Spotify</button>
    </div>
  );
}
