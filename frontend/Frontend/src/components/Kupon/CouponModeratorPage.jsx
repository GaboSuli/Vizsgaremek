import React, { useState, useEffect, useCallback } from 'react';
import { getAllKupons } from '../../services/kuponService.js';
import CouponList from './CouponList.jsx';
import CreateCouponModal from './CreateCouponModal.jsx';
import EditCouponModal from './EditCouponModal.jsx';
import DeleteCouponDialog from './DeleteCouponDialog.jsx';
import './CouponModeratorPage.css';
import './Coupon.css';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function CouponModeratorPage() {
  const [kupons, setKupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadKupons = useCallback(async () => {
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

  useEffect(() => { loadKupons(); }, [loadKupons]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleCreated = () => {
    setShowCreate(false);
    showSuccess('A kupon sikeresen létrehozva.');
    loadKupons();
  };

  const handleUpdated = () => {
    setEditTarget(null);
    showSuccess('A kupon sikeresen frissítve.');
    loadKupons();
  };

  const handleDeleted = () => {
    setDeleteTarget(null);
    showSuccess('A kupon sikeresen törölve.');
    loadKupons();
  };

  return (
    <div className="cmp-page">
      <div className="page-container">
        {/* Header */}
        <div className="cmp-header">
          <div className="cmp-header-left">
            <div className="cmp-header-icon">
              <ShieldIcon />
            </div>
            <div>
              <h1 className="page-title">Kupon Moderátor</h1>
              <p className="cmp-subtitle">Admin felület a kuponok kezeléséhez</p>
            </div>
          </div>
          <button className="btn btn-primary cmp-btn-create" onClick={() => setShowCreate(true)}>
            <PlusIcon />
            Új kupon
          </button>
        </div>

        {/* Stats row */}
        <div className="cmp-stats">
          <div className="cmp-stat-card">
            <span className="cmp-stat-value">{kupons.length}</span>
            <span className="cmp-stat-label">Összes kupon</span>
          </div>
          <div className="cmp-stat-card cmp-stat-card--success">
            <span className="cmp-stat-value">
              {kupons.filter(k => {
                const today = new Date().toISOString().split('T')[0];
                return k.lejarasi_datum >= today && k.kezdesi_datum <= today;
              }).length}
            </span>
            <span className="cmp-stat-label">Aktív kupon</span>
          </div>
          <div className="cmp-stat-card cmp-stat-card--warning">
            <span className="cmp-stat-value">
              {kupons.filter(k => {
                const today = new Date().toISOString().split('T')[0];
                return k.kezdesi_datum > today;
              }).length}
            </span>
            <span className="cmp-stat-label">Hamarosan</span>
          </div>
          <div className="cmp-stat-card cmp-stat-card--danger">
            <span className="cmp-stat-value">
              {kupons.filter(k => {
                const today = new Date().toISOString().split('T')[0];
                return k.lejarasi_datum < today;
              }).length}
            </span>
            <span className="cmp-stat-label">Lejárt</span>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="alert alert-success cmp-alert">
            ✓ {successMsg}
            <button className="alert-close" onClick={() => setSuccessMsg('')}>×</button>
          </div>
        )}

        {/* Coupon list */}
        <CouponList
          kupons={kupons}
          loading={loading}
          error={error}
          isModerator={true}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
          onRetry={loadKupons}
        />
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateCouponModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
      {editTarget && (
        <EditCouponModal
          kupon={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={handleUpdated}
        />
      )}
      {deleteTarget && (
        <DeleteCouponDialog
          kupon={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
