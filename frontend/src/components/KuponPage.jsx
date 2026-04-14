import React, { useState, useEffect, useCallback } from 'react';
import { getAllKupons } from '../services/kuponService';
import CouponList from './Kupon/CouponList.jsx';
import './Kupon/Coupon.css';
import './KuponPage.css';

const TicketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M2 4.5C2 3.12 3.12 2 4.5 2h15C20.88 2 22 3.12 22 4.5v6c-1 0-2 1-2 2s1 2 2 2v6c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 22 2 20.88 2 19.5v-6c1 0 2-1 2-2s-1-2-2-2v-6z"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/>
    <line x1="15" y1="15" x2="15.01" y2="15"/>
    <line x1="9.5" y1="14.5" x2="14.5" y2="9.5"/>
  </svg>
);

export default function KuponPage() {
  const [kupons, setKupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllKupons();
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : (res.raw && Array.isArray(res.raw) ? res.raw : []);
        setKupons(list.filter(Boolean));
      } else {
        setError(res.message || 'Nem sikerült betölteni a kuponokat.');
      }
    } catch {
      setError('Hálózati hiba a kuponok betöltésekor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="kp-page">
      <div className="page-container">
        {/* Header */}
        <div className="kp-header">
          <div className="kp-header-icon">
            <TicketIcon />
          </div>
          <div>
            <h1 className="page-title">Kuponok</h1>
            <p className="kp-subtitle">Böngéssz az elérhető kedvezményes kuponok között</p>
          </div>
        </div>

        {/* Coupon list with search/filter/sort */}
        <CouponList
          kupons={kupons}
          loading={loading}
          error={error}
          isModerator={false}
          onRetry={load}
        />
      </div>
    </div>
  );
}


