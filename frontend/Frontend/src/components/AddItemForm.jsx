import React, { useState } from "react";
import { addVevesiObjektum } from "../services/api";
import './AddItemForm.css'

export default function AddItemForm({ vevesListaId, onSuccess }) {
  const [megnevezes, setMegnevezes] = useState("");
  const [ar, setAr] = useState("");
  const [mennyiseg, setMennyiseg] = useState(1);
  const [alKategoriaId, setAlKategoriaId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addVevesiObjektum({
        veves_lista_id: vevesListaId,
        alKategoria_id: alKategoriaId,
        megnevezes,
        ar,
        mennyiseg
      });
      setMegnevezes("");
      setAr("");
      setMennyiseg(1);
      setAlKategoriaId("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Hiba történt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form" style={{marginBottom:16}}>
      <input
        type="text"
        placeholder="Termék neve"
        value={megnevezes}
        onChange={e => setMegnevezes(e.target.value)}
        required
        disabled={loading}
      />
      <input
        type="number"
        placeholder="Ár"
        value={ar}
        onChange={e => setAr(e.target.value)}
        required
        min="0"
        disabled={loading}
      />
      <input
        type="number"
        placeholder="Mennyiség"
        value={mennyiseg}
        onChange={e => setMennyiseg(e.target.value)}
        min="1"
        required
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Alkategória ID"
        value={alKategoriaId}
        onChange={e => setAlKategoriaId(e.target.value)}
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading}>Hozzáadás</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
