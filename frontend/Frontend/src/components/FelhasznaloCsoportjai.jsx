import React, { useEffect, useState } from "react";
import { getFelhasznaloCsoportjai } from "./api";

function FelhasznaloCsoportjai({ felhasznaloId }) {
  const [csoportok, setCsoportok] = useState([]);
  const [hiba, setHiba] = useState(null);

  useEffect(() => {
    getFelhasznaloCsoportjai(felhasznaloId)
      .then(setCsoportok)
      .catch(err => setHiba(err.message));
  }, [felhasznaloId]);

  if (hiba) return <p>Hiba: {hiba}</p>;

  return (
    <div>
      <h3>Felhasználó csoportjai</h3>
      <ul>
        {csoportok.map(csoport => (
          <li key={csoport.CsoportId}>
            {csoport.Becenev} – jogosultság: {csoport.JogosultsagSzint}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FelhasznaloCsoportjai;
