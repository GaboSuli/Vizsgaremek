import React, { useState, useMemo } from 'react';
import CouponCard from './CouponCard.jsx';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const SortIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="15" y2="12"/>
    <line x1="3" y1="18" x2="9" y2="18"/>
  </svg>
);

function getStatus(kezdesi_datum, lejarasi_datum) {
  const today = new Date().toISOString().split('T')[0];
  if (!lejarasi_datum) return 'unknown';
  if (lejarasi_datum < today) return 'expired';
  if (kezdesi_datum && kezdesi_datum > today) return 'upcoming';
  return 'active';
}

export default function CouponList({ kupons = [], loading, error, isModerator = false, onEdit, onDelete, onRetry }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('lejarasi_datum_asc');

  const today = new Date().toISOString().split('T')[0];
  const activeCount  = kupons.filter(k => getStatus(k.kezdesi_datum, k.lejarasi_datum) === 'active').length;
  const expiredCount = kupons.filter(k => getStatus(k.kezdesi_datum, k.lejarasi_datum) === 'expired').length;
  const upcomingCount = kupons.filter(k => getStatus(k.kezdesi_datum, k.lejarasi_datum) === 'upcoming').length;

  const filtered = useMemo(() => {
    let list = [...kupons];

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(k =>
        (k.kod || '').toLowerCase().includes(q) ||
        (k.hasznalasi_hely || '').toLowerCase().includes(q) ||
        (k.kedvezmeny || '').toString().toLowerCase().includes(q) ||
        (k.megjegyzes || '').toLowerCase().includes(q)
      );
    }

    // filter by status
    if (filter !== 'all') {
      list = list.filter(k => getStatus(k.kezdesi_datum, k.lejarasi_datum) === filter);
    }

    // sort
    list.sort((a, b) => {
      switch (sort) {
        case 'lejarasi_datum_asc':
          return (a.lejarasi_datum || '').localeCompare(b.lejarasi_datum || '');
        case 'lejarasi_datum_desc':
          return (b.lejarasi_datum || '').localeCompare(a.lejarasi_datum || '');
        case 'kezdesi_datum_asc':
          return (a.kezdesi_datum || '').localeCompare(b.kezdesi_datum || '');
        case 'kezdesi_datum_desc':
          return (b.kezdesi_datum || '').localeCompare(a.kezdesi_datum || '');
        case 'kod_asc':
          return (a.kod || '').localeCompare(b.kod || '');
        case 'kod_desc':
          return (b.kod || '').localeCompare(a.kod || '');
        default:
          return 0;
      }
    });

    return list;
  }, [kupons, search, filter, sort]);

  if (loading) {
    return (
      <div className="coup-loading">
        <div className="spinner" />
        <p>Kuponok betöltése...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coup-error-state">
        <div className="coup-error-icon">⚠️</div>
        <h3>Hiba a betöltés során</h3>
        <p>{error}</p>
        {onRetry && (
          <button className="btn btn-primary btn-sm" onClick={onRetry}>Újrapróbálás</button>
        )}
      </div>
    );
  }

  return (
    <div className="coup-list-wrap">
      {/* Controls: search + filter + sort */}
      <div className="coup-controls">
        <div className="coup-search-wrap">
          <span className="coup-search-icon"><SearchIcon /></span>
          <input
            type="text"
            className="coup-search"
            placeholder="Keresés kód, hely, kedvezmény alapján..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="coup-search-clear" onClick={() => setSearch('')} title="Törlés">×</button>
          )}
        </div>

        <div className="coup-filter-tabs">
          <button
            className={`coup-filter-btn${filter === 'all' ? ' coup-filter-btn--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Összes <span className="badge badge-gray">{kupons.length}</span>
          </button>
          <button
            className={`coup-filter-btn${filter === 'active' ? ' coup-filter-btn--active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Aktív <span className="badge badge-success">{activeCount}</span>
          </button>
          <button
            className={`coup-filter-btn${filter === 'upcoming' ? ' coup-filter-btn--active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Hamarosan <span className="badge badge-warning">{upcomingCount}</span>
          </button>
          <button
            className={`coup-filter-btn${filter === 'expired' ? ' coup-filter-btn--active' : ''}`}
            onClick={() => setFilter('expired')}
          >
            Lejárt <span className="badge badge-danger">{expiredCount}</span>
          </button>
        </div>

        <div className="coup-sort-wrap">
          <span className="coup-sort-icon"><SortIcon /></span>
          <select
            className="coup-sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="lejarasi_datum_asc">Lejárat (legkorábbi)</option>
            <option value="lejarasi_datum_desc">Lejárat (legkésőbbi)</option>
            <option value="kezdesi_datum_asc">Kezdés (legkorábbi)</option>
            <option value="kezdesi_datum_desc">Kezdés (legkésőbbi)</option>
            <option value="kod_asc">Kód (A → Z)</option>
            <option value="kod_desc">Kód (Z → A)</option>
          </select>
        </div>
      </div>

      {/* Results info */}
      {search && (
        <p className="coup-results-info">
          {filtered.length} találat a(z) „{search}" keresésre
        </p>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="coup-empty">
          <div className="coup-empty-icon">🎟️</div>
          <h3>Nincsenek{filter !== 'all' ? ` ${filter === 'active' ? 'aktív' : filter === 'expired' ? 'lejárt' : 'hamarosan érvényes'}` : ''} kuponok</h3>
          {search && <p>Próbálj más keresési kifejezést.</p>}
        </div>
      ) : (
        <div className="coup-grid">
          {filtered.map(kupon => (
            <CouponCard
              key={kupon.id}
              kupon={kupon}
              isModerator={isModerator}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
