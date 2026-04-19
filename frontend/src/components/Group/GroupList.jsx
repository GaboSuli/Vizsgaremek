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
const TIPUS_KEY    = { 1: 'purple',  2: 'blue',       3: 'green' };
const JOGSZINT_LABELS = { 0: 'Olvasó', 1: 'Tag', 2: 'Admin', 3: 'Tulajdonos' };

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

function GroupCard({ group, isOwned, onDelete, onClick }) {
  const name       = group.megnevezes ?? '—';
  const tipusId    = group.csoport_tipus_id;
  const tipusLabel = group.csoport_tipus_neve ?? TIPUS_LABELS[tipusId] ?? `Típus #${tipusId}`;
  const tipusKey   = TIPUS_KEY[tipusId] ?? 'default';
  const jogszint   = group.jogosultsag_szint ?? 1;
  const jogszintLabel = isOwned ? 'Tulajdonos' : (JOGSZINT_LABELS[jogszint] ?? `Szint ${jogszint}`);
  const tagokSzama = group.tagok_szama ?? group.csoport_tagsag_count ?? null;
  const roleKey    = isOwned ? 'owner' : String(jogszint);
  const createdAt  = group.created_at
    ? new Date(group.created_at).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <div
      className="grp-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* ── Top row: avatar + name + actions ── */}
      <div className="grp-card-top">
        <div className={`grp-card-avatar grp-card-avatar--${tipusKey}`}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="grp-card-title-wrap">
          <span className="grp-card-name">{name}</span>
          <span className={`grp-badge-tip grp-badge-tip--${tipusKey}`}>{tipusLabel}</span>
        </div>
        <div className="grp-card-acts">
          {isOwned && onDelete && (
            <button
              className="grp-icon-btn grp-icon-btn--del"
              title="Csoport törlése"
              aria-label="Csoport törlése"
              onClick={(e) => { e.stopPropagation(); onDelete(group.id); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          )}
          <span className="grp-card-arrow" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        </div>
      </div>

      {/* ── Separator ── */}
      <div className="grp-card-sep" />

      {/* ── Info grid: ID / Tagok / Szerepkör / Létrehozva ── */}
      <div className="grp-card-meta-grid">
        <div className="grp-meta-item">
          <span className="grp-meta-label">Azonosító</span>
          <code className="grp-meta-id">#{group.id}</code>
        </div>
        <div className="grp-meta-item">
          <span className="grp-meta-label">Tagok</span>
          <span className="grp-meta-stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {tagokSzama != null ? `${tagokSzama} fő` : '—'}
          </span>
        </div>
        <div className="grp-meta-item">
          <span className="grp-meta-label">Szerepkör</span>
          <span className={`grp-badge-role grp-badge-role--${roleKey}`}>{jogszintLabel}</span>
        </div>
        {createdAt && (
          <div className="grp-meta-item">
            <span className="grp-meta-label">Létrehozva</span>
            <span className="grp-meta-date">{createdAt}</span>
          </div>
        )}
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
      const raw = groupRes.data;
      let extracted = [];
      if (Array.isArray(raw)) {
        if (raw.length > 0 && raw[0].csoportok != null) {
          extracted = Array.isArray(raw[0].csoportok) ? raw[0].csoportok : [];
        } else if (raw.length > 0 && raw[0].megnevezes != null) {
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
      const all = Array.isArray(listRes.data) ? listRes.data : [];
      setPersonalLists(all.filter(l => !l.csoport_id));
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

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

  // Split into owned (creator) and invited (member only)
  const ownedGroups = groups.filter(g => g.keszito_felhasznalo_id === currentUserId);
  const invitedGroups = groups.filter(g => g.keszito_felhasznalo_id !== currentUserId);

  const filteredOwned = ownedGroups.filter(g =>
    (g.megnevezes ?? '').toLowerCase().includes(search.toLowerCase())
  );
  const filteredInvited = invitedGroups.filter(g =>
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

      {/* Stats summary */}
      {!loading && groups.length > 0 && (
        <div className="grp-stats-row">
          <div className="grp-stat-chip">
            <span className="grp-stat-chip-val">{groups.length}</span>
            <span className="grp-stat-chip-lbl">csoport</span>
          </div>
          <div className="grp-stat-chip">
            <span className="grp-stat-chip-val">{ownedGroups.length}</span>
            <span className="grp-stat-chip-lbl">saját</span>
          </div>
          <div className="grp-stat-chip">
            <span className="grp-stat-chip-val">{invitedGroups.length}</span>
            <span className="grp-stat-chip-lbl">meghívott</span>
          </div>
        </div>
      )}

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

      {/* Loading */}
      {loading ? (
        <div className="grp-loading">
          <div className="grp-spinner" />
          <span>Csoportok betöltése...</span>
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
          {/* ── Saját csoportok ── */}
          <div className="grp-section-label">
            Saját csoportok ({filteredOwned.length})
          </div>
          {filteredOwned.length === 0 ? (
            <div className="grp-section-empty">
              {search ? 'Nincs találat a saját csoportok között.' : 'Még nem hoztál létre csoportot.'}
            </div>
          ) : (
            <div className="grp-grid">
              {filteredOwned.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isOwned={true}
                  onDelete={(id) => setConfirmDeleteId(id)}
                  onClick={() => navigate(`/csoport/${group.id}`)}
                />
              ))}
            </div>
          )}

          {/* ── Meghívott csoportok ── */}
          <div className="grp-section-label" style={{ marginTop: '2rem' }}>
            Csoportok ahová meghívtak ({filteredInvited.length})
          </div>
          {filteredInvited.length === 0 ? (
            <div className="grp-section-empty">
              {search ? 'Nincs találat a meghívott csoportok között.' : 'Még nem hívtak meg egyetlen csoportba sem.'}
            </div>
          ) : (
            <div className="grp-grid">
              {filteredInvited.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isOwned={false}
                  onDelete={null}
                  onClick={() => navigate(`/csoport/${group.id}`)}
                />
              ))}
            </div>
          )}
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
