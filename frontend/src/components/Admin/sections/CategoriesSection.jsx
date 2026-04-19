import React, { useState, useEffect, useMemo } from 'react';
import { getAlkategoriak, getFelhasznaloMennyiseg, getLegtobbetVett } from '../../../services/adminService.js';
import { useDebounce } from '../../../hooks/useDebounce.js';

function fmtCur(n) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('hu-HU') + ' Ft';
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [userCount, setUserCount] = useState(null);
  const [topCategory, setTopCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [catRes, countRes, topRes] = await Promise.allSettled([
        getAlkategoriak(),
        getFelhasznaloMennyiseg(),
        getLegtobbetVett(),
      ]);

      if (catRes.status === 'fulfilled' && catRes.value.success) {
        const d = catRes.value.data;
        setCategories(Array.isArray(d) ? d : (d?.data || []));
      }
      if (countRes.status === 'fulfilled' && countRes.value.success) {
        setUserCount(countRes.value.data);
      }
      if (topRes.status === 'fulfilled' && topRes.value.success) {
        setTopCategory(topRes.value.data);
      }
      setLoading(false);
    })();
  }, []);

  const toggleExpand = (id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(categories.map(c => c.id)));
  const collapseAll = () => setExpanded(new Set());

  const debouncedSearch = useDebounce(search, 200);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(cat => {
      const catMatch = (cat.megnevezes || cat.nev || cat.Megnevezes || '').toLowerCase().includes(q);
      const subMatch = (cat.alkategoriak || cat.al_kategoriak || []).some(s =>
        (s.megnevezes || s.nev || s.Megnevezes || '').toLowerCase().includes(q)
      );
      return catMatch || subMatch;
    });
  }, [categories, debouncedSearch]);

  return (
    <div className="adm2-section">
      <div className="adm2-section-head">
        <div>
          <h2 className="adm2-section-title">Alkategóriák &amp; Kategóriák</h2>
          <p className="adm2-section-sub">{categories.length} főkategória</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="adm2-cat-summary">
        <div className="adm2-cat-info-card">
          <span className="adm2-cat-info-label">Összes felhasználó</span>
          <span className="adm2-cat-info-value">{userCount != null ? String(userCount) : '—'}</span>
        </div>
        {topCategory && (
          <div className="adm2-cat-info-card adm2-cat-info--highlight">
            <span className="adm2-cat-info-label">Legtöbbet vett alkategória</span>
            <span className="adm2-cat-info-value">
              {topCategory.megnevezes || topCategory.Megnevezes || topCategory.nev || JSON.stringify(topCategory)}
            </span>
          </div>
        )}
      </div>

      <div className="adm2-toolbar">
        <div className="adm2-search">
          <SearchIcon />
          <input placeholder="Keresés kategória vagy alkategória neve alapján..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="adm2-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="adm2-cat-controls">
          <button className="adm2-btn adm2-btn--xs" onClick={expandAll}>Összes kibont</button>
          <button className="adm2-btn adm2-btn--xs adm2-btn--ghost" onClick={collapseAll}>Összes összecs.</button>
        </div>
      </div>

      {loading ? (
        <div className="adm2-loading"><div className="adm2-spinner" /><span>Betöltés...</span></div>
      ) : filtered.length === 0 ? (
        <div className="adm2-empty"><CatIcon /><p>Nincs kategória</p></div>
      ) : (
        <div className="adm2-cat-tree">
          {filtered.map(cat => {
            const catName = cat.megnevezes || cat.nev || cat.Megnevezes || 'Névtelen';
            const subs = cat.alkategoriak || cat.al_kategoriak || cat.subCategories || [];
            const isOpen = expanded.has(cat.id);

            // Filter subs if searching
            const q = search.toLowerCase().trim();
            const filteredSubs = q
              ? subs.filter(s => (s.megnevezes || s.nev || s.Megnevezes || '').toLowerCase().includes(q))
              : subs;

            return (
              <div key={cat.id} className="adm2-cat-node">
                <div
                  className={`adm2-cat-header ${subs.length ? 'adm2-cat-header--clickable' : ''}`}
                  onClick={() => subs.length && toggleExpand(cat.id)}
                >
                  <div className="adm2-cat-header-left">
                    <span className={`adm2-cat-toggle ${isOpen ? 'adm2-cat-toggle--open' : ''}`}>
                      {subs.length ? (isOpen ? '▾' : '▸') : '  '}
                    </span>
                    <div className={`adm2-cat-dot adm2-cat-dot--${(cat.id % 6) + 1}`} />
                    <span className="adm2-cat-name">{catName}</span>
                  </div>
                  <div className="adm2-cat-header-right">
                    <span className="adm2-cat-count">{subs.length} alkategória</span>
                    <span className="adm2-cat-id">#{cat.id}</span>
                  </div>
                </div>
                {isOpen && filteredSubs.length > 0 && (
                  <div className="adm2-sub-list">
                    {filteredSubs.map(sub => {
                      const subName = sub.megnevezes || sub.nev || sub.Megnevezes || 'Névtelen';
                      return (
                        <div key={sub.id} className="adm2-sub-item">
                          <span className="adm2-sub-bullet">•</span>
                          <span className="adm2-sub-name">{subName}</span>
                          <div className="adm2-sub-meta">
                            {sub.atlag_ar != null && <span className="adm2-sub-price">Ø {fmtCur(sub.atlag_ar)}</span>}
                            <span className="adm2-sub-id">#{sub.id}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const CatIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
