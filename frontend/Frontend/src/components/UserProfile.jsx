import React, { useEffect, useState } from 'react';
import axios from 'axios';

const endpoints = {
  profile: 'http://127.0.0.1:8000/api/felhasznalo',
  lists: 'http://127.0.0.1:8000/api/felhasznalo/vevesiListak',
  groups: 'http://127.0.0.1:8000/api/felhasznalo/csoportjai',
  costsByCategory: 'http://127.0.0.1:8000/api/felhasznalo/osszKoltesei',
  monthlyCosts: 'http://127.0.0.1:8000/api/felhasznalo/eHaviKoltesei',
  yearlyCosts: 'http://127.0.0.1:8000/api/felhasznalo/eEviKoltesei',
};

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [lists, setLists] = useState([]);
  const [groups, setGroups] = useState([]);
  const [costsByCategory, setCostsByCategory] = useState([]);
  const [monthlyCosts, setMonthlyCosts] = useState(null);
  const [yearlyCosts, setYearlyCosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [profileRes, listsRes, groupsRes, costsCatRes, monthlyRes, yearlyRes] = await Promise.all([
          axios.get(endpoints.profile, config),
          axios.get(endpoints.lists, config),
          axios.get(endpoints.groups, config),
          axios.get(endpoints.costsByCategory, config),
          axios.get(endpoints.monthlyCosts, config),
          axios.get(endpoints.yearlyCosts, config),
        ]);
        setProfile(profileRes.data);
        setLists(listsRes.data);
        setGroups(groupsRes.data);
        setCostsByCategory(costsCatRes.data);
        setMonthlyCosts(monthlyRes.data);
        setYearlyCosts(yearlyRes.data);
      } catch (err) {
        setProfile(null);
        setLists([]);
        setGroups([]);
        setCostsByCategory([]);
        setMonthlyCosts(null);
        setYearlyCosts(null);
        console.error('Adatok lekérése sikertelen:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  if (loading) return <div>Betöltés...</div>;

  return (
    <div className="user-profile">
      <h2>Profil</h2>
      {profile && (
        <div className="profile-section">
          <p><strong>Név:</strong> {profile.nev || profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {profile.becenev && <p><strong>Becenév:</strong> {profile.becenev}</p>}
        </div>
      )}
      <h3>Vevési listák</h3>
      <ul>
        {lists.map(list => (
          <li key={list.id}>{list.megnevezes || list.name}</li>
        ))}
      </ul>
      <h3>Csoportok</h3>
      <ul>
        {groups.map(group => (
          <li key={group.id}>{group.megnevezes || group.name}</li>
        ))}
      </ul>
      <h3>Költségek alkategóriák szerint</h3>
      <ul>
        {costsByCategory.map(cat => (
          <li key={cat.alKategoria_id}>{cat.alKategoriaNev}: {cat.osszeg} Ft</li>
        ))}
      </ul>
      <h3>Havi költség</h3>
      <p>{monthlyCosts ? `${monthlyCosts.osszeg} Ft` : 'Nincs adat'}</p>
      <h3>Éves költség</h3>
      <p>{yearlyCosts ? `${yearlyCosts.osszeg} Ft` : 'Nincs adat'}</p>
    </div>
  );
}
