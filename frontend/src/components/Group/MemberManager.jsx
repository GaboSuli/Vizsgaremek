import React, { useState, useEffect, useCallback } from 'react';
import {
  getCsoportFelhasznalok,
  addCsoportTag,
  editCsoportTag,
  deleteCsoportTag,
} from '../../services/api';
import Avatar from '../Profile/Avatar.jsx';
import './groups.css';

function roleLabel(lvl) {
  const n = Number(lvl);
  if (n >= 3) return 'Admin';
  if (n === 2) return 'Moderátor';
  if (n === 1) return 'Tag';
  return 'Vendég';
}
function roleBadgeClass(lvl) {
  const n = Number(lvl);
  if (n >= 3) return 'grp-badge-admin';
  if (n === 2) return 'grp-badge-mod';
  return 'grp-badge-member';
}

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

export default function MemberManager({ csoportId, isAdmin, currentUserId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add member state
  const [addId, setAddId] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ becenev: '', jogosultsag_szint: 1 });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState(null); // tagsag_id

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getCsoportFelhasznalok(csoportId);
    setLoading(false);
    if (res.success) {
      setMembers(Array.isArray(res.data) ? res.data : []);
    } else {
      setError(res.message || 'Nem sikerült betölteni a tagokat');
    }
  }, [csoportId]);

  useEffect(() => { load(); }, [load]);

  // Add member
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addId.trim()) return;
    setAdding(true);
    setAddError(null);
    const res = await addCsoportTag(Number(csoportId), Number(addId));
    setAdding(false);
    if (res.success) {
      setAddId('');
      load();
    } else {
      setAddError(res.message || 'Hiba a tag hozzáadásakor');
    }
  };

  // Start editing
  const startEdit = (member) => {
    setEditId(member.id ?? member.felhasznalo_id);
    setEditForm({
      becenev: member.becenev ?? '',
      jogosultsag_szint: member.jogosultsag_szint ?? 1,
    });
    setSaveError(null);
  };

  // Save edit
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    const res = await editCsoportTag(csoportId, {
      becenev: editForm.becenev,
      jogosultsag_szint: editForm.jogosultsag_szint,
      mastValtoztatniId: editId,
    });
    setSaving(false);
    if (res.success) {
      setEditId(null);
      load();
    } else {
      setSaveError(res.message || 'Hiba a mentés során');
    }
  };

  // Delete
  const handleDelete = async () => {
    const tagsagId = confirmDelete;
    setConfirmDelete(null);
    const res = await deleteCsoportTag(tagsagId);
    if (res.success) {
      load();
    } else {
      setError(res.message || 'Hiba a törlés során');
    }
  };

  return (
    <div>
      {/* Add member – only admin can add */}
      {isAdmin && (
        <form className="mm-add-form" onSubmit={handleAdd}>
          <div style={{ flex: 1 }}>
            <label className="grp-label" htmlFor="mm-uid">Felhasználó ID</label>
            <input
              id="mm-uid"
              className="grp-input"
              type="number"
              min="1"
              value={addId}
              onChange={(e) => { setAddId(e.target.value); setAddError(null); }}
              placeholder="pl. 42"
              disabled={adding}
            />
          </div>
          <button
            type="submit"
            className="grp-btn grp-btn-primary"
            disabled={adding || !addId.trim()}
            style={{ alignSelf: 'flex-end' }}
          >
            {adding ? <><span className="grp-spinner grp-spinner-sm" />Hozzáadás...</> : '+ Tag hozzáadása'}
          </button>
        </form>
      )}
      {addError && <div className="grp-alert grp-alert-error" style={{ marginBottom: '0.75rem' }}>{addError}</div>}

      {/* Member list */}
      {loading ? (
        <div className="grp-loading" style={{ padding: '1.5rem 0' }}>
          <div className="grp-spinner" />
          <span>Tagok betöltése...</span>
        </div>
      ) : error ? (
        <div className="grp-alert grp-alert-error">{error}</div>
      ) : members.length === 0 ? (
        <div style={{ color: 'var(--clr-text-3)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
          Nincsenek megjeleníthető tagok.
        </div>
      ) : (
        <ul className="mm-member-list">
          {members.map((m, i) => {
            const memberId = m.id ?? m.felhasznalo_id ?? i;
            const isMe = currentUserId && (m.felhasznalo_id === currentUserId || m.id === currentUserId);
            const isEditing = editId === memberId;

            return (
              <li key={memberId} className="mm-member-item">
                {/* Avatar */}
                <Avatar src={m.profilkep_url} name={m.nev} size="sm" className="mm-member-avatar" />

                {isEditing ? (
                  <form className="mm-edit-row" onSubmit={handleSave}>
                    <input
                      className="grp-input"
                      style={{ maxWidth: '140px' }}
                      type="text"
                      value={editForm.becenev}
                      onChange={(e) => setEditForm(p => ({ ...p, becenev: e.target.value }))}
                      placeholder="Becenév"
                    />
                    {isAdmin && (
                      <input
                        className="grp-input"
                        style={{ maxWidth: '80px' }}
                        type="number"
                        min="0"
                        max="3"
                        value={editForm.jogosultsag_szint}
                        onChange={(e) => setEditForm(p => ({ ...p, jogosultsag_szint: e.target.value }))}
                        placeholder="Szint"
                      />
                    )}
                    {saveError && <span style={{ fontSize: '0.78rem', color: 'var(--clr-danger)' }}>{saveError}</span>}
                    <button type="submit" className="grp-btn grp-btn-primary grp-btn-xs" disabled={saving}>
                      {saving ? '...' : 'Mentés'}
                    </button>
                    <button type="button" className="grp-btn grp-btn-secondary grp-btn-xs" onClick={() => setEditId(null)}>
                      Mégse
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="mm-member-info">
                      <div className="mm-member-name">
                        {m.nev ?? 'Névtelen'}
                        {isMe && <span style={{ fontSize: '0.72rem', color: 'var(--clr-primary)', marginLeft: '0.4rem' }}>(Te)</span>}
                      </div>
                      {m.becenev && <div className="mm-member-nick">{m.becenev}</div>}
                      {m.created_at && (
                        <div className="mm-member-nick">
                          Csatlakozott: {new Date(m.created_at).toLocaleDateString('hu-HU')}
                        </div>
                      )}
                    </div>

                    {m.jogosultsag_szint !== undefined && (
                      <span className={`grp-badge ${roleBadgeClass(m.jogosultsag_szint)}`}>
                        {roleLabel(m.jogosultsag_szint)}
                      </span>
                    )}

                    <div className="mm-member-actions">
                      {(isAdmin || isMe) && (
                        <button
                          className="grp-btn grp-btn-ghost grp-btn-icon grp-btn-xs"
                          title="Szerkesztés"
                          onClick={() => startEdit(m)}
                        >
                          ✏️
                        </button>
                      )}
                      {(isAdmin || isMe) && (
                        <button
                          className="grp-btn grp-btn-danger grp-btn-icon grp-btn-xs"
                          title={isMe ? 'Kilépés a csoportból' : 'Tag eltávolítása'}
                          onClick={() => setConfirmDelete(m.tagsag_id ?? m.id ?? memberId)}
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {confirmDelete !== null && (
        <ConfirmDialog
          message="Biztosan eltávolítod ezt a tagságot? Ez a művelet nem vonható vissza."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
