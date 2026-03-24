import React from "react";
import { updateVevesiObjektum, deleteVevesiObjektum } from "../services/api";
import './ShoppingListItem.css'

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
    <li className="shopping-item">
      <div style={{flex:1}}>
        <div className="name">{item.megnevezes}</div>
        <div className="meta">{item.ar} Ft × {item.mennyiseg} {item.alkategoria && (<span>({item.alkategoria})</span>)}</div>
        <div className="meta">Hozzáadta: {item.hozzaado_nev || item.hozzaado || "?"}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <button className="btn-primary" onClick={handleStatusToggle}>
          {item.status === "megveve" ? "Jelöld nincs meg" : "Jelöld megvéve"}
        </button>
        <button className="btn btn-outline-danger" onClick={handleDelete}>Törlés</button>
      </div>
    </li>
  );
}
