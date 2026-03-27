import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../context/useAuth.js';
import './UserProfile.css';

const endpoints = {
  profile: 'http://127.0.0.1:8000/api/felhasznalo',
  lists: 'http://127.0.0.1:8000/api/felhasznalo/vevesiListak',
  groups: 'http://127.0.0.1:8000/api/felhasznalo/csoportjai',
  costsByCategory: 'http://127.0.0.1:8000/api/felhasznalo/osszKoltesei',
  monthlyCosts: 'http://127.0.0.1:8000/api/felhasznalo/eHaviKoltesei',
  yearlyCosts: 'http://127.0.0.1:8000/api/felhasznalo/eEviKoltesei',
};

export default function UserProfile() {
  const auth = useAuth();
  const [profile, setProfile] = useState(null);
  const [lists, setLists] = useState([]);
  const [groups, setGroups] = useState([]);
  const [costsByCategory, setCostsByCategory] = useState([]);
  const [monthlyCosts, setMonthlyCosts] = useState(null);
  const [yearlyCosts, setYearlyCosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('auth_token');

  // Sync theme from user data to DOM
  useEffect(() => {
    if (auth.user?.tema_id === 2) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [auth.user?.tema_id]);

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
      } catch {
        setProfile(null);
        setLists([]);
        setGroups([]);
        setCostsByCategory([]);
        setMonthlyCosts(null);
        setYearlyCosts(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  if (loading) return (
    <div className="up-loading">
      <div className="spinner" />
      <p>Betöltés...</p>
    </div>
  );

  return (
    <div className="up-page">
      <div className="up-container">
        {/* Profile card */}
        {profile && (
          <div className="up-card">
            <div className="up-card__header">
              <div className="up-avatar">{(profile.nev || 'U')[0]?.toUpperCase()}</div>
              <div>
                <h2 className="up-card__title">{profile.nev || profile.name}</h2>
                <p className="up-card__subtitle">{profile.email}</p>
              </div>
            </div>
            {profile.becenev && (
              <div className="up-card__body">
                <span className="up-badge">🎭 {profile.becenev}</span>
              </div>
            )}
          </div>
        )}

        {/* Stats grid */}
        <div className="up-grid">
          {/* Monthly costs */}
          <div className="up-stat-card">
            <div className="up-stat-label">📅 Havi költség</div>
            <div className="up-stat-value">
              {monthlyCosts ? `${monthlyCosts.osszeg?.toLocaleString('hu-HU') || 0} Ft` : '—'}
            </div>
          </div>

          {/* Yearly costs */}
          <div className="up-stat-card">
            <div className="up-stat-label">📆 Éves költség</div>
            <div className="up-stat-value">
              {yearlyCosts ? `${yearlyCosts.osszeg?.toLocaleString('hu-HU') || 0} Ft` : '—'}
            </div>
          </div>

          {/* Lists count */}
          <div className="up-stat-card">
            <div className="up-stat-label">📝 Vevési listák</div>
            <div className="up-stat-value">{lists.length}</div>
          </div>

          {/* Groups count */}
          <div className="up-stat-card">
            <div className="up-stat-label">👥 Csoportok</div>
            <div className="up-stat-value">{groups.length}</div>
          </div>
        </div>

        {/* Categories breakdown */}
        {costsByCategory.length > 0 && (
          <div className="up-card">
            <div className="up-card__header">
              <h3 className="up-card__title">💰 Költségek alkategóriák szerint</h3>
            </div>
            <div className="up-card__body">
              <div className="up-category-list">
                {costsByCategory.map((cat) => (
                  <div key={cat.alKategoria_id} className="up-category-row">
                    <span className="up-category-name">{cat.alKategoriaNev}</span>
                    <span className="up-category-cost">{cat.osszeg?.toLocaleString('hu-HU') || 0} Ft</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lists section */}
        {lists.length > 0 && (
          <div className="up-card">
            <div className="up-card__header">
              <h3 className="up-card__title">📝 Vevési listák</h3>
            </div>
            <div className="up-card__body">
              <div className="up-list">
                {lists.map((list) => (
                  <div key={list.id} className="up-list-item">
                    <span className="up-list-icon">📋</span>
                    <span className="up-list-text">{list.megnevezes || list.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Groups section */}
        {groups.length > 0 && (
          <div className="up-card">
            <div className="up-card__header">
              <h3 className="up-card__title">👥 Csoportok</h3>
            </div>
            <div className="up-card__body">
              <div className="up-list">
                {groups.map((group) => (
                  <div key={group.id} className="up-list-item">
                    <span className="up-list-icon">👫</span>
                    <span className="up-list-text">{group.megnevezes || group.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
