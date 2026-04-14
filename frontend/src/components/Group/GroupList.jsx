import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFelhasznaloCsoportjai,
  getFelhasznaloVevesiListak,
  deleteCsoport,
} from '../../services/api';
import useAuth from '../../context/useAuth';
import CreateGroupModal from './CreateGroupModal';
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

export default function GroupList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [groups, setGroups] = useState([]);
  const [personalLists, setPersonalLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const currentUserId = user?.id;

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [groupRes, listRes] = await Promise.all([
      getFelhasznaloCsoportjai(),
      getFelhasznaloVevesiListak(),
    ]);
    setLoading(false);

    if (groupRes.success) {
      // API returns [{..., csoportok: [...]}] – extract nested groups
      const raw = groupRes.data;
      let extracted = [];
      if (Array.isArray(raw)) {
        if (raw.length > 0 && raw[0].csoportok != null) {
          // Standard format: user object with csoportok relationship
          extracted = Array.isArray(raw[0].csoportok) ? raw[0].csoportok : [];
        } else if (raw.length > 0 && raw[0].megnevezes != null) {
          // Flat array of group objects
          extracted = raw;
        }
      } else if (raw && typeof raw === 'object' && Array.isArray(raw.csoportok)) {
        extracted = raw.csoportok;
      }
      setGroups(extracted);
    } else {
      setError(groupRes.message || 'Nem sikerült betölteni a csoportokat');
    }

    if (listRes.success) {
      // Personal lists = where csoport_id is null
      const all = Array.isArray(listRes.data) ? listRes.data : [];
      setPersonalLists(all.filter(l => !l.csoport_id));
    }
  }, []);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  const handleDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeleteError(null);
    const res = await deleteCsoport(id);
    if (res.success) {
      loadGroups();
    } else {
      setDeleteError(res.message || 'Nem sikerült törölni a csoportot');
    }
  };

  const filtered = groups.filter(g =>
    (g.megnevezes ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grp-page">
      {/* Header */}
      <div className="grp-header">
        <div className="grp-header-left">
          <h1>Csoportok</h1>
          <p>Bevásárlócsoportjaid kezelése és áttekintése</p>
        </div>
        <button className="grp-btn grp-btn-primary" onClick={() => setShowCreate(true)}>
          + Új csoport
        </button>
      </div>

      {/* Error alerts */}
      {error && (
        <div className="grp-alert grp-alert-error">
          {error}
          <button className="grp-alert-close" onClick={() => setError(null)}>×</button>
        </div>
      )}
      {deleteError && (
        <div className="grp-alert grp-alert-error">
          {deleteError}
          <button className="grp-alert-close" onClick={() => setDeleteError(null)}>×</button>
        </div>
      )}

      {/* Search */}
      {groups.length > 0 && (
        <div className="grp-search-wrap">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3a6 6 0 100 12A6 6 0 009 3zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          <input
            className="grp-search"
            type="search"
            placeholder="Csoport keresése..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Groups section */}
      {loading ? (
        <div className="grp-loading">
          <div className="grp-spinner" />
          <span>Csoportok betöltése...</span>
        </div>
      ) : filtered.length === 0 && search ? (
        <div className="grp-empty">
          <div className="grp-empty-icon">🔍</div>
          <h3>Nincs találat</h3>
          <p>Próbálj más keresési kifejezést!</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="grp-empty">
          <div className="grp-empty-icon">👥</div>
          <h3>Még nincsenek csoportjaid</h3>
          <p>Hozz létre egy új csoportot és hívj meg másokat!</p>
          <button className="grp-btn grp-btn-primary" onClick={() => setShowCreate(true)}>
            + Első csoport létrehozása
          </button>
        </div>
      ) : (
        <>
          <div className="grp-section-label">Saját csoportok ({filtered.length})</div>
          <div className="grp-grid">
            {filtered.map(group => {
              const name = group.megnevezes ?? '—';
              const isCreator = group.keszito_felhasznalo_id === currentUserId;
              const tipusLabel = TIPUS_LABELS[group.csoport_tipus_id] ?? `Típus #${group.csoport_tipus_id}`;

              return (
                <div key={group.id} className="grp-card" role="button" tabIndex={0}
                  onClick={() => navigate(`/csoport/${group.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/csoport/${group.id}`)}
                >
                  <div className="grp-card-avatar">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="grp-card-body">
                    <div className="grp-card-name">{name}</div>
                    <div className="grp-card-meta">
                      <span className="grp-badge grp-badge-type">{tipusLabel}</span>
                      {isCreator && (
                        <span className="grp-badge grp-badge-admin">Admin</span>
                      )}
                    </div>
                  </div>
                  {isCreator && (
                    <button
                      className="grp-btn grp-btn-danger grp-btn-icon grp-btn-xs"
                      title="Csoport törlése"
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(group.id); }}
                    >
                      🗑
                    </button>
                  )}
                  <div className="grp-card-arrow">›</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Personal shopping lists section */}
      {personalLists.length > 0 && (
        <div className="grp-personal-section">
          <div className="grp-section-label">Saját személyes bevásárlólisták ({personalLists.length})</div>
          <div className="grp-personal-grid">
            {personalLists.map(lista => {
              const items = lista.vevesobjektum ?? lista.veves_objektumok ?? [];
              return (
                <div key={lista.id} className="grp-personal-card">
                  <div className="grp-personal-card-name">{lista.megnevezes}</div>
                  <div className="grp-personal-card-count">{items.length} elem</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreated={loadGroups}
        />
      )}

      {confirmDeleteId !== null && (
        <ConfirmDialog
          message="Biztosan törlöd ezt a csoportot? Az összes bevásárlólista és tagság is törlődik!"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
