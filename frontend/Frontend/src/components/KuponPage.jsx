import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../context/useAuth.js';
import { getAllKupons, getActiveKupons, getExpiredKupons } from '../services/kuponService';
import './KuponPage.css';

export default function KuponPage() {
  const [kupons, setKupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [allKupons, setAllKupons] = useState([]);

  const auth = useAuth();

  const loadAllKupons = useCallback(async () => {
    try {
      setLoading(true);
      const userId = auth.user?.id;
      const result = await getAllKupons(userId);
      const list = (result && Array.isArray(result.data)) ? result.data : [];
      setAllKupons(list.filter(Boolean));
      // if current filter is 'all' show full list, otherwise we'll fetch filtered in another effect
      if (filter === 'all') setKupons(list.filter(Boolean));
      setError(null);
    } catch (err) {
      setError(err?.message || 'Hiba a kuponok betöltésekor');
      setKupons([]);
      setAllKupons([]);
    } finally {
      setLoading(false);
    }
  }, [auth.user, filter]);

  const loadFilteredKupons = useCallback(async () => {
    if (!auth.user) return;
    try {
      setLoading(true);
      const userId = auth.user?.id;
      if (filter === 'active') {
        const resp = await getActiveKupons(userId);
        setKupons((resp && Array.isArray(resp.data)) ? resp.data : []);
      } else if (filter === 'expired') {
        const resp = await getExpiredKupons(userId);
        setKupons((resp && Array.isArray(resp.data)) ? resp.data : []);
      } else {
        // all
        setKupons(allKupons);
      }
      setError(null);
    } catch (err) {
      setError(err?.message || 'Hiba a kuponok betöltésekor');
      setKupons([]);
    } finally {
      setLoading(false);
    }
  }, [auth.user, filter, allKupons]);

  useEffect(() => {
    if (auth.user) loadAllKupons();
    else {
      setAllKupons([]);
      setKupons([]);
      setLoading(false);
    }
  }, [auth.user, loadAllKupons]);

  useEffect(() => {
    // when filter changes, fetch accordingly
    if (auth.user) loadFilteredKupons();
  }, [filter, auth.user, loadFilteredKupons]);

  const getFilteredKupons = () => {
    // kupons is already filtered by backend when filter !== 'all'
    return kupons.filter(Boolean);
  };

  const todayForCounts = new Date().toISOString().split('T')[0];
  const activeCount = allKupons.filter(k => k && k.KezdesiDatum && k.LejarasiDatum && k.KezdesiDatum <= todayForCounts && k.LejarasiDatum >= todayForCounts).length;
  const expiredCount = allKupons.filter(k => k && k.LejarasiDatum && k.LejarasiDatum < todayForCounts).length;

  const isKuponExpired = (lejarasiDatum) => new Date(lejarasiDatum) < new Date();

  const isKuponActive = (kezdesiDatum, lejarasiDatum) => {
    const today = new Date().toISOString().split('T')[0];
    return kezdesiDatum <= today && lejarasiDatum >= today;
  };

  const filteredKupons = getFilteredKupons();

  return (
    <div className="kp-page">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Kuponok</h1>
            <p className="page-subtitle">Kezelje és kövesse nyomon kedvezményes kuponjait</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error} <button className="alert-close" onClick={() => setError(null)}>×</button></div>}

        {/* Filter tabs */}
        <div className="tabs" style={{marginBottom:'1.5rem'}}>
          <button className={`tab-btn${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
            Összes <span className="badge badge-primary" style={{marginLeft:6}}>{allKupons.length}</span>
          </button>
          <button className={`tab-btn${filter === 'active' ? ' active' : ''}`} onClick={() => setFilter('active')}>
            Aktív <span className="badge badge-success" style={{marginLeft:6}}>{activeCount}</span>
          </button>
          <button className={`tab-btn${filter === 'expired' ? ' active' : ''}`} onClick={() => setFilter('expired')}>
            Lejárt <span className="badge badge-danger" style={{marginLeft:6}}>{expiredCount}</span>
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Kuponok betöltése...</p>
          </div>
        ) : filteredKupons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" >🎟️</div>
            <h3>Nincsenek {filter === 'active' ? 'aktív' : filter === 'expired' ? 'lejárt' : ''} kuponok</h3>
          </div>
        ) : (
          <div className="kp-grid">
            {filteredKupons
              .filter(k => filter !== 'expired' ? !isKuponExpired(k.LejarasiDatum) : true)
              .map(kupon => (
              <div key={kupon.id} className={`kp-card${isKuponExpired(kupon.LejarasiDatum) ? ' expired' : ''}`}>
                <div className="kp-card-header">
                  <span className="kp-kod">{kupon.Kod}</span>
                  {isKuponActive(kupon.KezdesiDatum, kupon.LejarasiDatum) ? (
                    <span className="badge badge-success">Aktív</span>
                  ) : isKuponExpired(kupon.LejarasiDatum) ? (
                    <span className="badge badge-danger">Lejárt</span>
                  ) : (
                    <span className="badge badge-warning">Hamarosan</span>
                  )}
                </div>

                <div className="kp-details">
                  {kupon.HasznalatiHely && (
                    <div className="kp-detail-row">
                      <span className="kp-detail-label">Felhasználási hely</span>
                      <span className="kp-detail-value">{kupon.HasznalatiHely}</span>
                    </div>
                  )}
                  <div className="kp-detail-row">
                    <span className="kp-detail-label">Kezdési dátum</span>
                    <span className="kp-detail-value">{kupon.KezdesiDatum}</span>
                  </div>
                  <div className="kp-detail-row">
                    <span className="kp-detail-label">Lejárat</span>
                    <span className={`kp-detail-value${isKuponExpired(kupon.LejarasiDatum) ? ' expired-text' : ''}`}>{kupon.LejarasiDatum}</span>
                  </div>
                  {kupon.Megjegyzes && (
                    <div className="kp-detail-row">
                      <span className="kp-detail-label">Megjegyzés</span>
                      <span className="kp-detail-value">{kupon.Megjegyzes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
