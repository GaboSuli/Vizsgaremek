import React, { useState } from "react";
import { addCsoportTag } from "../services/api";

export default function AddMemberForm({ csoportId, onSuccess }) {
  const [felhasznaloId, setFelhasznaloId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addCsoportTag(csoportId, felhasznaloId);
      setFelhasznaloId("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Hiba történt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom:16}}>
      <label>
        Új tag felhasználó ID:
        <input
          type="text"
          value={felhasznaloId}
          onChange={e => setFelhasznaloId(e.target.value)}
          required
          disabled={loading}
        />
      </label>
      <button type="submit" disabled={loading || !felhasznaloId}>Hozzáadás</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
