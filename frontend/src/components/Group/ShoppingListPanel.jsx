import React, { useState, useEffect, useCallback } from 'react';
import {
  getCsoportVevesiListak,
  createVevesiLista,
  deleteVevesiLista,
  addVevesiObjektum,
  updateVevesiObjektum,
  deleteVevesiObjektum,
} from '../../services/api';
import './groups.css';

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

/* ── Single shopping list item ────────────────────────── */
function ListItem({ item, canEdit, onToggle, onDelete }) {
  const done = item.status === 'megveve';
  return (
    <li className="sl-item">
      <input
        type="checkbox"
        className="sl-item-checkbox"
        checked={done}
        disabled={!canEdit}
        onChange={onToggle}
        aria-label={done ? 'Megvéve' : 'Nincs meg'}
      />
      <div className="sl-item-body">
        <div className={`sl-item-name ${done ? 'done' : ''}`}>{item.megnevezes}</div>
        <div className="sl-item-meta">
          {item.ar != null && `${Number(item.ar).toLocaleString('hu-HU')} Ft`}
          {item.mennyiseg != null && item.mennyiseg !== 1 && ` × ${item.mennyiseg}`}
          {item.hozzaado_nev && ` – ${item.hozzaado_nev}`}
        </div>
      </div>
      {canEdit && (
        <button className="sl-item-del" title="Törlés" onClick={onDelete} aria-label="Elem törlése">
          🗑
        </button>
      )}
    </li>
  );
}

/* ── Add item form ────────────────────────────────────── */
function AddItemForm({ listaId, onSuccess }) {
  const [nev, setNev] = useState('');
  const [ar, setAr] = useState('');
  const [mennyiseg, setMennyiseg] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nev.trim()) return;
    setLoading(true);
    setError(null);
    const res = await addVevesiObjektum({
      veves_lista_id: listaId,
      megnevezes: nev.trim(),
      ar: ar !== '' ? Number(ar) : 0,
      mennyiseg: Number(mennyiseg) || 1,
    });
    setLoading(false);
    if (res.success) {
      setNev(''); setAr(''); setMennyiseg(1);
      if (onSuccess) onSuccess();
    } else {
      setError(res.message || 'Hiba az elem hozzáadásakor');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '0.85rem' }}>
      <div className="sl-add-form">
        <input
          className="grp-input"
          type="text"
          placeholder="Termék neve"
          value={nev}
          onChange={(e) => setNev(e.target.value)}
          disabled={loading}
          required
        />
        <input
          className="grp-input"
          type="number"
          placeholder="Ár (Ft)"
          value={ar}
          onChange={(e) => setAr(e.target.value)}
          min="0"
          disabled={loading}
        />
        <input
          className="grp-input"
          type="number"
          placeholder="Db"
          value={mennyiseg}
          onChange={(e) => setMennyiseg(e.target.value)}
          min="1"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="grp-btn grp-btn-primary grp-btn-xs"
        disabled={loading || !nev.trim()}
      >
        {loading ? <><span className="grp-spinner grp-spinner-sm" />Hozzáadás...</> : '+ Hozzáadás'}
      </button>
      {error && <div className="grp-field-error" style={{ marginTop: '0.3rem' }}>{error}</div>}
    </form>
  );
}

/* ── Single list accordion ────────────────────────────── */
function ListCard({ lista, canEdit, onListDeleted, onItemChanged }) {
  const [open, setOpen] = useState(false);
  const [confirmDeleteList, setConfirmDeleteList] = useState(false);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  const items = lista.vevesobjektum ?? lista.veves_objektumok ?? [];

  const handleDeleteList = async () => {
    setConfirmDeleteList(false);
    await deleteVevesiLista(lista.id);
    if (onListDeleted) onListDeleted();
  };

  const handleToggleItem = async (item) => {
    await updateVevesiObjektum(item.id, {
      ...item,
      status: item.status === 'megveve' ? 'nincs meg' : 'megveve',
    });
    if (onItemChanged) onItemChanged();
  };

  const handleDeleteItem = async () => {
    const itemId = confirmDeleteItem;
    setConfirmDeleteItem(null);
    await deleteVevesiObjektum(itemId);
    if (onItemChanged) onItemChanged();
  };

  const doneCount = items.filter(i => i.status === 'megveve').length;

  return (
    <div className="sl-list-card">
      <div className="sl-list-header" onClick={() => setOpen(o => !o)}>
        <div className="sl-list-header-left">
          <span>🛒</span>
          <span className="sl-list-name">{lista.megnevezes}</span>
          <span className="sl-list-count">{doneCount}/{items.length} kész</span>
        </div>
        <div className="sl-list-actions" onClick={(e) => e.stopPropagation()}>
          {canEdit && (
            <button
              className="grp-btn grp-btn-danger grp-btn-icon grp-btn-xs"
              title="Lista törlése"
              onClick={() => setConfirmDeleteList(true)}
            >
              🗑
            </button>
          )}
        </div>
        <span className={`sl-chevron ${open ? 'open' : ''}`}>▼</span>
      </div>

      {open && (
        <div className="sl-items">
          {canEdit && (
            <AddItemForm listaId={lista.id} onSuccess={onItemChanged} />
          )}

          {items.length === 0 ? (
            <div style={{ color: 'var(--clr-text-3)', fontSize: '0.85rem', textAlign: 'center', padding: '0.5rem 0' }}>
              A lista üres. {canEdit ? 'Adj hozzá egy elemet fent!' : ''}
            </div>
          ) : (
            <ul className="sl-item-list">
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  item={item}
                  canEdit={canEdit}
                  onToggle={() => handleToggleItem(item)}
                  onDelete={() => setConfirmDeleteItem(item.id)}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {confirmDeleteList && (
        <ConfirmDialog
          message={`Biztosan törlöd a(z) „${lista.megnevezes}" listát és az összes elemét?`}
          onConfirm={handleDeleteList}
          onCancel={() => setConfirmDeleteList(false)}
        />
      )}
      {confirmDeleteItem !== null && (
        <ConfirmDialog
          message="Biztosan törlöd ezt a terméket a listáról?"
          onConfirm={handleDeleteItem}
          onCancel={() => setConfirmDeleteItem(null)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ShoppingListPanel – main export
   ══════════════════════════════════════════════════════ */
export default function ShoppingListPanel({ csoportId, canEdit }) {
  const [listak, setListak] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New list form
  const [newListName, setNewListName] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [createError, setCreateError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getCsoportVevesiListak(csoportId);
    setLoading(false);
    if (res.success) {
      setListak(Array.isArray(res.data) ? res.data : []);
    } else {
      setError(res.message || 'Nem sikerült betölteni a bevásárlólistákat');
    }
  }, [csoportId]);

  useEffect(() => { load(); }, [load]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    setCreatingList(true);
    setCreateError(null);
    const res = await createVevesiLista({ megnevezes: newListName.trim(), csoport_id: Number(csoportId) });
    setCreatingList(false);
    if (res.success) {
      setNewListName('');
      load();
    } else {
      setCreateError(res.message || 'Hiba a lista létrehozásakor');
    }
  };

  return (
    <div>
      {/* New list form */}
      {canEdit && (
        <form className="sl-newlist-form" onSubmit={handleCreateList} style={{ marginBottom: '1rem' }}>
          <input
            className="grp-input"
            type="text"
            placeholder="Új lista neve..."
            value={newListName}
            onChange={(e) => { setNewListName(e.target.value); setCreateError(null); }}
            disabled={creatingList}
            maxLength={80}
          />
          <button
            type="submit"
            className="grp-btn grp-btn-primary"
            disabled={creatingList || !newListName.trim()}
          >
            {creatingList ? <><span className="grp-spinner grp-spinner-sm" />Létrehozás...</> : '+ Új lista'}
          </button>
        </form>
      )}
      {createError && <div className="grp-alert grp-alert-error" style={{ marginBottom: '0.75rem' }}>{createError}</div>}

      {loading ? (
        <div className="grp-loading" style={{ padding: '1.5rem 0' }}>
          <div className="grp-spinner" />
          <span>Listák betöltése...</span>
        </div>
      ) : error ? (
        <div className="grp-alert grp-alert-error">{error}</div>
      ) : listak.length === 0 ? (
        <div style={{ color: 'var(--clr-text-3)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
          Nincs még bevásárlólista ebben a csoportban.
          {canEdit && ' Hozz létre egyet fent!'}
        </div>
      ) : (
        <div className="sl-accordion">
          {listak.map((lista) => (
            <ListCard
              key={lista.id}
              lista={lista}
              canEdit={canEdit}
              onListDeleted={load}
              onItemChanged={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}
