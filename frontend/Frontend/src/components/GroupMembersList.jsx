import React, { useState } from "react";
import { editCsoportTag, deleteCsoportTag } from "../services/api";

export default function GroupMembersList({ members, csoportId, onChange }) {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ becenev: "", jogosultsag_szint: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const startEdit = (member) => {
    setEditId(member.id || member.felhasznalo_id);
    setForm({
      becenev: member.becenev || member.Becenev || "",
      jogosultsag_szint: member.jogosultsag_szint || member.JogosultsagSzint || ""
    });
    setError(null);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await editCsoportTag(csoportId, {
        becenev: form.becenev,
        jogosultsag_szint: form.jogosultsag_szint,
        mastValtoztatniId: editId
      });
      setEditId(null);
      if (onChange) onChange();
    } catch (err) {
      setError(err.message || "Hiba történt");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tagsagId) => {
    if (!window.confirm("Biztosan törlöd ezt a tagságot?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteCsoportTag(tagsagId);
      if (onChange) onChange();
    } catch (err) {
      setError(err.message || "Hiba történt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{marginTop:16}}>
      <ul style={{listStyle:'none', padding:0}}>
        {members.length === 0 ? (
          <li style={{color:'#888'}}>Nincs tag ebben a csoportban.</li>
        ) : members.map(member => (
          <li key={member.id || member.felhasznalo_id} style={{marginBottom:8}}>
            {editId === (member.id || member.felhasznalo_id) ? (
              <form onSubmit={handleEdit} style={{display:'inline'}}>
                <input
                  type="text"
                  value={form.becenev}
                  onChange={e => setForm(f => ({ ...f, becenev: e.target.value }))}
                  placeholder="Becenév"
                  required
                  style={{marginRight:8}}
                />
                <input
                  type="number"
                  value={form.jogosultsag_szint}
                  onChange={e => setForm(f => ({ ...f, jogosultsag_szint: e.target.value }))}
                  placeholder="Jogosultság szint"
                  min="0"
                  required
                  style={{width:60, marginRight:8}}
                />
                <button type="submit" disabled={loading} style={{marginRight:4}}>Mentés</button>
                <button type="button" onClick={() => setEditId(null)} disabled={loading}>Mégse</button>
              </form>
            ) : (
              <>
                <span style={{fontWeight:500}}>{member.nev || member.Nev}</span> <span style={{color:'#888'}}>({member.becenev || member.Becenev})</span> <span style={{fontSize:12, color:'#555'}}>– jogosultság: {member.jogosultsag_szint || member.JogosultsagSzint}</span>
                <button onClick={() => startEdit(member)} disabled={loading} style={{marginLeft:8}}>Szerkeszt</button>
                <button onClick={() => handleDelete(member.tagsag_id || member.id || member.felhasznalo_id)} disabled={loading} style={{marginLeft:4}}>Törlés</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
    </div>
  );
}
