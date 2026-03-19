import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../services/api";
import GroupMembersList from "./GroupMembersList";
import AddMemberForm from "./AddMemberForm";
import ShoppingList from "./ShoppingList";

export default function GroupDetailPage() {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await apiCall(`/csoport/${id}/felhasznalok`);
      if (res.success) setMembers(res.data);
      else setError(res.message);
    } catch (e) {
      setError(e.message || "Hiba történt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div style={{color:'red', margin:'16px 0'}}>Hiba: {error}</div>;

  return (
    <div style={{maxWidth:600, margin:'0 auto', padding:'24px 0'}}>
      <h2 style={{marginBottom:24}}>Csoport részletei</h2>
      {/* <div>{group && group.megnevezes}</div> */}

      <section style={{marginBottom:32}}>
        <h3 style={{marginBottom:12}}>Tagok kezelése</h3>
        <AddMemberForm csoportId={id} onSuccess={fetchMembers} />
        <GroupMembersList members={members} csoportId={id} onChange={fetchMembers} />
      </section>

      <section>
        <ShoppingList csoportId={id} />
      </section>
    </div>
  );
}
