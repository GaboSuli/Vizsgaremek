import React from "react";
import { updateVevesiObjektum, deleteVevesiObjektum } from "../services/api";

export default function ShoppingListItem({ item, onChange }) {
  const handleStatusToggle = async () => {
    try {
      await updateVevesiObjektum(item.id || item.objektum_id, {
        ...item,
        status: item.status === "megveve" ? "nincs meg" : "megveve"
      });
      if (onChange) onChange();
    } catch (err) {
      alert(err.message || "Hiba történt");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Biztosan törlöd ezt az elemet?")) return;
    try {
      await deleteVevesiObjektum(item.id || item.objektum_id);
      if (onChange) onChange();
    } catch (err) {
      alert(err.message || "Hiba történt");
    }
  };

  return (
    <li style={{marginBottom:10, padding:8, border:'1px solid #eee', borderRadius:4, background:'#fafcff'}}>
      <div style={{fontWeight:500, marginBottom:2}}>{item.megnevezes}</div>
      <div style={{fontSize:14, color:'#555'}}>
        {item.ar} Ft × {item.mennyiseg}
        {item.alkategoria && (
          <span style={{marginLeft:8, color:'#888'}}>({item.alkategoria})</span>
        )}
      </div>
      <div style={{fontSize:13, color:'#888'}}>Hozzáadta: {item.hozzaado_nev || item.hozzaado || "?"}</div>
      <div style={{marginTop:4}}>
        Státusz: <span style={{color: item.status === "megveve" ? "green" : "#c00", fontWeight:500}}>{item.status === "megveve" ? "Megvéve" : "Nincs meg"}</span>
        <button onClick={handleStatusToggle} style={{marginLeft:12, padding:'2px 10px', borderRadius:4, border:'1px solid #007bff', background:'#f5faff', color:'#007bff', cursor:'pointer'}}>
          {item.status === "megveve" ? "Jelöld nincs meg" : "Jelöld megvéve"}
        </button>
        <button onClick={handleDelete} style={{marginLeft:8, padding:'2px 10px', borderRadius:4, border:'1px solid #c00', background:'#fff5f5', color:'#c00', cursor:'pointer'}}>Törlés</button>
      </div>
    </li>
  );
}
