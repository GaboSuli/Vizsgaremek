import React, { useEffect, useState } from "react";
import { getFelhasznaloCsoportjai } from "../services/api";
import { useNavigate } from "react-router-dom";


function FelhasznaloCsoportjai() {
  const [csoportok, setCsoportok] = useState([]);
  const [hiba, setHiba] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getFelhasznaloCsoportjai()
      .then(data => setCsoportok(Array.isArray(data) ? data : []))
      .catch(err => setHiba(err.message || "Hiba történt"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Betöltés...</div>;
  if (hiba) return <div style={{color:'red'}}>Hiba: {hiba}</div>;

  return (
    <div>
      <h3>Csoportjaim</h3>
      {csoportok.length === 0 ? (
        <div>Nincs még csoportod.</div>
      ) : (
        <ul style={{listStyle:'none', padding:0}}>
          {csoportok.map(csoport => (
            <li
              key={csoport.id || csoport.CsoportId}
              style={{ marginBottom: 8 }}
            >
              <button
                style={{
                  background: '#f5faff',
                  border: '1px solid #007bff',
                  color: '#007bff',
                  borderRadius: 4,
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'underline',
                  width: '100%',
                  textAlign: 'left'
                }}
                onClick={() => navigate(`/csoport/${csoport.id || csoport.CsoportId}`)}
              >
                {csoport.megnevezes || csoport.Becenev} <span style={{fontSize:12, color:'#555'}}>– jogosultság: {csoport.jogosultsag_szint || csoport.JogosultsagSzint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FelhasznaloCsoportjai;
