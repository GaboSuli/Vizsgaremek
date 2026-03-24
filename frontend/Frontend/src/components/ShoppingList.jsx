import React, { useEffect, useState } from "react";
import { getCsoportVevesiListak } from "../services/api";
import AddItemForm from "./AddItemForm";
import ShoppingListItem from "./ShoppingListItem";
import './ShoppingListItem.css'

export default function ShoppingList({ csoportId }) {
  const [listak, setListak] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchListak = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCsoportVevesiListak(csoportId);
      setListak(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Hiba történt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListak();
    // eslint-disable-next-line
  }, [csoportId]);

  if (loading) return <div>Bevásárlólista betöltése...</div>;
  if (error) return <div style={{color:'red', margin:'16px 0'}}>Hiba: {error}</div>;

  // Feltételezzük, hogy minden csoporthoz egy lista tartozik, vagy az elsőt vesszük
  const lista = listak[0];
  const items = lista && lista.vevesi_objektumok ? lista.vevesi_objektumok : [];

  return (
    <div style={{marginTop:24}}>
      <h3 style={{marginBottom:12}}>Közös bevásárlólista</h3>
      {lista ? (
        <>
          <AddItemForm vevesListaId={lista.id || lista.veves_lista_id} onSuccess={fetchListak} />
          <ul style={{listStyle:'none', padding:0}}>
            {items.length === 0 ? (
              <li style={{color:'#888'}}>Nincs még tétel a listán.</li>
            ) : items.map(item => (
              <ShoppingListItem key={item.id || item.objektum_id} item={item} onChange={fetchListak} />
            ))}
          </ul>
        </>
      ) : (
        <div style={{color:'#888'}}>Nincs elérhető bevásárlólista ehhez a csoporthoz.</div>
      )}
    </div>
  );
}
