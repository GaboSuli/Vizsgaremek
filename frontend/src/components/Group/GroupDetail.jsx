import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFelhasznaloCsoportjai, deleteCsoport } from '../../services/api';
import useAuth from '../../context/useAuth';
import MemberManager from './MemberManager';
import ShoppingListPanel from './ShoppingListPanel';
import EditGroupModal from './EditGroupModal';
import './groups.css';

const TIPUS_LABELS = { 1: 'Család', 2: 'Egyesület', 3: 'Vállalat' };

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="grp-confirm-backdrop">
      <div className="grp-confirm">
        <div className="grp-confirm-icon">⚠️</div>
        <h3>Megerősítés szükséges</h3>
        <p>{message}</p>
        <div className="grp-confirm-btns">
          <button className="grp-btn grp-btn-secondary" onClick={onCancel}>Mégse</button>
          <button className="grp-btn grp-btn-danger" onClick={onConfirm}>Törlés</button>
        </div>
      </div>
    </div>
  );
}

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [csoport, setCsoport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const currentUserId = user?.id;

  // Fetch the group details by loading the user's groups and finding the matching one
  const loadCsoport = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getFelhasznaloCsoportjai();
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Nem sikerült betölteni a csoport adatait');
      return;
    }

    const raw = res.data;
    let allGroups = [];
    if (Array.isArray(raw)) {
      if (raw.length > 0 && raw[0].csoportok != null) {
        allGroups = Array.isArray(raw[0].csoportok) ? raw[0].csoportok : [];
      } else if (raw.length > 0 && raw[0].megnevezes != null) {
        allGroups = raw;
      }
    } else if (raw && typeof raw === 'object' && Array.isArray(raw.csoportok)) {
      allGroups = raw.csoportok;
    }

    const found = allGroups.find(g => String(g.id) === String(id));
    if (found) {
      setCsoport(found);
    } else {
      // Group exists but user may not be owner; set minimal info from id
      setCsoport({ id: Number(id), megnevezes: `Csoport #${id}`, keszito_felhasznalo_id: null });
    }
  }, [id]);

  useEffect(() => { loadCsoport(); }, [loadCsoport]);

  const handleDelete = async () => {
    setConfirmDelete(false);
    setDeleteError(null);
    const res = await deleteCsoport(id);
    if (res.success) {
      navigate('/groups');
    } else {
      setDeleteError(res.message || 'Nem sikerült törölni a csoportot');
    }
  };

  const isCreator = csoport && currentUserId && csoport.keszito_felhasznalo_id === currentUserId;
  const name = csoport?.megnevezes ?? `Csoport #${id}`;
  const tipusLabel = csoport ? (TIPUS_LABELS[csoport.csoport_tipus_id] ?? null) : null;

  return (
    <div className="grd-page">
      {/* Back navigation */}
      <button className="grd-back" onClick={() => navigate('/groups')}>
        ← Vissza a csoportokhoz
      </button>

      {/* Alerts */}
      {deleteError && (
        <div className="grp-alert grp-alert-error">
          {deleteError}
          <button className="grp-alert-close" onClick={() => setDeleteError(null)}>×</button>
        </div>
      )}

      {loading ? (
        <div className="grp-loading">
          <div className="grp-spinner" />
          <span>Csoport betöltése...</span>
        </div>
      ) : error ? (
        <div className="grp-alert grp-alert-error">{error}</div>
      ) : (
        <>
          {/* Hero header */}
          <div className="grd-hero">
            <div className="grd-hero-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="grd-hero-info">
              <h1>{name}</h1>
              <div className="grd-hero-badges">
                {tipusLabel && (
                  <span className="grp-badge grp-badge-type">{tipusLabel}</span>
                )}
                {isCreator && (
                  <span className="grp-badge grp-badge-admin">Admin (Saját)</span>
                )}
              </div>
            </div>
            {isCreator && (
              <div className="grd-hero-actions">
                <button className="grp-btn grp-btn-ghost" onClick={() => setShowEdit(true)}>
                  ✏️ Szerkesztés
                </button>
                <button className="grp-btn grp-btn-danger" onClick={() => setConfirmDelete(true)}>
                  🗑 Törlés
                </button>
              </div>
            )}
          </div>

          {/* Two-column layout */}
          <div className="grd-grid">
            {/* Members panel */}
            <div className="grd-panel">
              <div className="grd-panel-header">
                <div className="grd-panel-header-left">
                  <span>👥</span>
                  <h2 className="grd-panel-title">Tagok</h2>
                </div>
              </div>
              <div className="grd-panel-body">
                <MemberManager
                  csoportId={id}
                  isAdmin={isCreator}
                  currentUserId={currentUserId}
                />
              </div>
            </div>

            {/* Shopping lists panel */}
            <div className="grd-panel">
              <div className="grd-panel-header">
                <div className="grd-panel-header-left">
                  <span>🛒</span>
                  <h2 className="grd-panel-title">Bevásárlólisták</h2>
                </div>
              </div>
              <div className="grd-panel-body">
                <ShoppingListPanel
                  csoportId={id}
                  canEdit={true}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit modal */}
      {showEdit && csoport && (
        <EditGroupModal
          csoport={csoport}
          onClose={() => setShowEdit(false)}
          onUpdated={loadCsoport}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <ConfirmDialog
          message={`Biztosan törlöd a(z) „${name}" csoportot? Az összes bevásárlólista és tagság is törlődik!`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
