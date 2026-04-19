import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useLocation, Link } from 'react-router-dom';
import { DOC_STRUCTURE, flattenSections, searchDocs } from './docsData';
import './DocsPage.css';

// ─────────────────────────────────────────────────────────────────────────────
// Inline text parser – handles **bold**, *italic*, `code`, [text](url)
// ─────────────────────────────────────────────────────────────────────────────
function parseInline(text) {
  if (!text) return null;
  const parts = [];
  const re = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;
  let lastIdx = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    if (match[1]) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={match.index}>{match[4]}</em>);
    } else if (match[5]) {
      parts.push(<code key={match.index} className="docs-inline-code">{match[6]}</code>);
    } else if (match[7]) {
      const href = match[9];
      const isAnchor = href.startsWith('#');
      if (isAnchor) {
        parts.push(
          <a key={match.index} href={href} className="docs-inline-link"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(href.slice(1));
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}>
            {match[8]}
          </a>
        );
      } else {
        parts.push(
          <a key={match.index} href={href} className="docs-inline-link" target="_blank" rel="noopener noreferrer">
            {match[8]}
          </a>
        );
      }
    }
    lastIdx = re.lastIndex;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

// ─────────────────────────────────────────────────────────────────────────────
// Block renderers
// ─────────────────────────────────────────────────────────────────────────────
function HeadingBlock({ block }) {
  const Tag = `h${block.level}`;
  const cls = `docs-h${block.level}`;
  return (
    <Tag className={cls} id={block.id}>
      {block.level === 1 && <span className="docs-h1-accent" aria-hidden="true" />}
      {parseInline(block.text)}
    </Tag>
  );
}

function ParagraphBlock({ block }) {
  return <p className="docs-paragraph">{parseInline(block.text)}</p>;
}

const CALLOUT_META = {
  info:    { icon: 'ℹ️',  label: 'Információ' },
  warning: { icon: '⚠️',  label: 'Figyelmeztetés' },
  success: { icon: '✅',  label: 'Siker' },
  tip:     { icon: '💡',  label: 'Tipp' },
  danger:  { icon: '🚨',  label: 'Figyelem' },
};

function CalloutBlock({ block }) {
  const meta = CALLOUT_META[block.variant] || CALLOUT_META.info;
  return (
    <div className={`docs-callout docs-callout--${block.variant}`}>
      <div className="docs-callout-icon">{meta.icon}</div>
      <div className="docs-callout-body">
        {block.title && <strong className="docs-callout-title">{block.title}</strong>}
        <p className="docs-callout-text">{parseInline(block.text)}</p>
      </div>
    </div>
  );
}

function CodeBlock({ block }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(block.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="docs-code-wrap">
      <div className="docs-code-header">
        <span className="docs-code-lang">{block.language || 'code'}</span>
        <button className="docs-code-copy" onClick={copy} aria-label="Kód másolása">
          {copied ? '✅ Másolva' : '📋 Másolás'}
        </button>
      </div>
      <pre className="docs-code"><code>{block.code}</code></pre>
    </div>
  );
}

function ListBlock({ block }) {
  const Tag = block.ordered ? 'ol' : 'ul';
  return (
    <Tag className={`docs-list docs-list--${block.ordered ? 'ordered' : 'unordered'}`}>
      {block.items.map((item, i) => (
        <li key={i} className="docs-list-item">{parseInline(item)}</li>
      ))}
    </Tag>
  );
}

function StepsBlock({ block }) {
  return (
    <div className="docs-steps">
      {block.steps.map((step, i) => (
        <div key={i} className="docs-step">
          <div className="docs-step-num">{i + 1}</div>
          <div className="docs-step-content">
            <div className="docs-step-header">
              {step.icon && <span className="docs-step-icon">{step.icon}</span>}
              <strong className="docs-step-title">{step.title}</strong>
            </div>
            <p className="docs-step-text">{parseInline(step.text)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CardsBlock({ block }) {
  return (
    <div className="docs-cards">
      {block.cards.map((card, i) => (
        <div key={i} className="docs-card" style={{ '--card-color': card.color || 'var(--clr-primary)' }}>
          <div className="docs-card-icon" style={{ background: `${card.color || 'var(--clr-primary)'}18`, color: card.color || 'var(--clr-primary)' }}>
            {card.icon}
          </div>
          <strong className="docs-card-title">{card.title}</strong>
          <p className="docs-card-text">{parseInline(card.text)}</p>
        </div>
      ))}
    </div>
  );
}

function ImageBlock({ block }) {
  if (block.mock) {
    return (
      <figure className="docs-image-figure">
        <div className="docs-image-mock" style={{ '--mock-color': block.mockColor || 'var(--clr-primary)' }}>
          <div className="docs-image-mock-chrome">
            <span /><span /><span />
            <div className="docs-image-mock-url">szaldon.app</div>
          </div>
          <div className="docs-image-mock-body">
            <div className="docs-image-mock-icon">{block.mockIcon || '🖥️'}</div>
            <div className="docs-image-mock-label">{block.mockLabel || block.alt}</div>
            <div className="docs-image-mock-bars">
              <div className="docs-image-mock-bar" style={{ width: '75%' }} />
              <div className="docs-image-mock-bar" style={{ width: '55%' }} />
              <div className="docs-image-mock-bar" style={{ width: '90%' }} />
            </div>
          </div>
        </div>
        {block.caption && <figcaption className="docs-image-caption">{block.caption}</figcaption>}
      </figure>
    );
  }
  return (
    <figure className="docs-image-figure">
      <img src={block.src} alt={block.alt} className="docs-image" loading="lazy" />
      {block.caption && <figcaption className="docs-image-caption">{block.caption}</figcaption>}
    </figure>
  );
}

function TableBlock({ block }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            {block.headers.map((h, i) => (
              <th key={i}>{parseInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{parseInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BadgesBlock({ block }) {
  return (
    <div className="docs-badges">
      {block.items.map((item, i) => (
        <span key={i} className="docs-badge">{item}</span>
      ))}
    </div>
  );
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'heading':  return <HeadingBlock block={block} />;
    case 'paragraph': return <ParagraphBlock block={block} />;
    case 'callout':  return <CalloutBlock block={block} />;
    case 'code':     return <CodeBlock block={block} />;
    case 'list':     return <ListBlock block={block} />;
    case 'steps':    return <StepsBlock block={block} />;
    case 'cards':    return <CardsBlock block={block} />;
    case 'image':    return <ImageBlock block={block} />;
    case 'table':    return <TableBlock block={block} />;
    case 'divider':  return <hr className="docs-divider" />;
    case 'badges':   return <BadgesBlock block={block} />;
    default:         return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────
function DocsSidebar({ activeId, onNavigate, isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(DOC_STRUCTURE.map((ch) => [ch.id, true]))
  );
  const inputRef = useRef(null);

  useEffect(() => {
    setResults(query.trim() ? searchDocs(query) : []);
  }, [query]);

  const toggleChapter = useCallback((id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleSelect = useCallback(
    (sectionId) => {
      onNavigate(sectionId);
      setQuery('');
      setResults([]);
    },
    [onNavigate]
  );

  return (
    <aside className={`docs-sidebar${isOpen ? ' docs-sidebar--open' : ''}`} aria-label="Dokumentáció navigáció">
      {/* Logo */}
      <div className="docs-sidebar-logo">
        <img src="/szaldon.png" alt="Szaldon" className="docs-logo-img" />
        <div>
          <div className="docs-logo-name">Szaldon</div>
          <div className="docs-logo-sub">Használati útmutató</div>
        </div>
      </div>

      {/* Search */}
      <div className="docs-search-wrap">
        <div className="docs-search-row">
          <span className="docs-search-icon" aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="docs-search-input"
            placeholder="Keresés a dokumentációban…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Dokumentáció keresése"
          />
          {query && (
            <button className="docs-search-clear" onClick={() => setQuery('')} aria-label="Törlés">×</button>
          )}
        </div>

        {results.length > 0 && (
          <div className="docs-search-results" role="listbox">
            {results.map((r) => (
              <button
                key={r.sectionId}
                className="docs-search-result"
                role="option"
                onClick={() => handleSelect(r.sectionId)}
              >
                <span className="docs-search-result-chapter">
                  {r.chapterIcon} {r.chapterTitle}
                </span>
                <span className="docs-search-result-title">
                  {r.matchType === 'title' && <span className="docs-search-tag">Cím</span>}
                  {r.sectionTitle}
                </span>
              </button>
            ))}
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="docs-search-empty">Nincs találat „{query}" keresésre</div>
        )}
      </div>

      {/* Navigation */}
      <nav className="docs-nav" aria-label="Tartalomjegyzék">
        {DOC_STRUCTURE.map((chapter) => {
          const isExpanded = expanded[chapter.id];
          const hasActive = chapter.sections.some((s) => s.id === activeId);
          return (
            <div key={chapter.id} className={`docs-nav-chapter${hasActive ? ' docs-nav-chapter--active' : ''}`}>
              <button
                className={`docs-nav-chapter-btn${isExpanded ? ' expanded' : ''}`}
                onClick={() => toggleChapter(chapter.id)}
                aria-expanded={isExpanded}
              >
                <span className="docs-nav-chapter-icon" aria-hidden="true">{chapter.icon}</span>
                <span className="docs-nav-chapter-title">{chapter.title}</span>
                <span className={`docs-nav-chapter-arrow${isExpanded ? ' rotated' : ''}`} aria-hidden="true">›</span>
              </button>

              {isExpanded && (
                <div className="docs-nav-sections">
                  {chapter.sections.map((section) => (
                    <button
                      key={section.id}
                      className={`docs-nav-section${activeId === section.id ? ' active' : ''}`}
                      onClick={() => handleSelect(section.id)}
                      aria-current={activeId === section.id ? 'true' : undefined}
                    >
                      <span className="docs-nav-section-dot" aria-hidden="true" />
                      {section.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="docs-sidebar-footer">
        <span>Szaldon v1.0.0 · 2025</span>
        <Link to="/" className="docs-sidebar-home">← Vissza az alkalmazásba</Link>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress bar
// ─────────────────────────────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const main = document.querySelector('.docs-main');
      if (!main) return;
      const { scrollTop, scrollHeight, clientHeight } = main;
      const pct = scrollHeight - clientHeight > 0
        ? (scrollTop / (scrollHeight - clientHeight)) * 100
        : 0;
      setProgress(pct);
    };
    const main = document.querySelector('.docs-main');
    if (main) main.addEventListener('scroll', onScroll, { passive: true });
    return () => { if (main) main.removeEventListener('scroll', onScroll); };
  }, []);
  return (
    <div className="docs-progress-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
      <div className="docs-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main DocsPage component
// ─────────────────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const location = useLocation();
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const allSections = useMemo(() => flattenSections(), []);
  const mainRef = useRef(null);

  // ── On mount: read URL hash ──────────────────────────────────────────────
  useEffect(() => {
    const hash = location.hash.slice(1);
    const initialId = hash && allSections.some((s) => s.id === hash)
      ? hash
      : allSections[0]?.id;

    setActiveId(initialId);

    if (initialId) {
      setTimeout(() => {
        const el = document.getElementById(initialId);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 150);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Intersection Observer (scroll spy) ──────────────────────────────────
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActiveId(id);
          window.history.replaceState(null, '', `${location.pathname}#${id}`);
        }
      },
      { root: mainEl, rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );

    allSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSections]);

  // ── Navigate to section ──────────────────────────────────────────────────
  const navigateTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const main = mainRef.current;
      if (main) {
        const offset = el.offsetTop - 80;
        main.scrollTo({ top: offset, behavior: 'smooth' });
      }
      setActiveId(id);
      window.history.replaceState(null, '', `${location.pathname}#${id}`);
    }
    setSidebarOpen(false);
  }, [location.pathname]);

  // ── Keyboard shortcut: / → focus search ─────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const input = document.querySelector('.docs-search-input');
        if (input) input.focus();
      }
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="docs-root" data-sidebar={sidebarOpen ? 'open' : 'closed'}>
      <ReadingProgress />

      {/* ── Mobile header ── */}
      <header className="docs-mobile-header">
        <button
          className="docs-hamburger"
          onClick={() => setSidebarOpen((s) => !s)}
          aria-label={sidebarOpen ? 'Menü bezárása' : 'Menü megnyitása'}
          aria-expanded={sidebarOpen}
        >
          <span /><span /><span />
        </button>
        <div className="docs-mobile-header-title">
          <img src="/szaldon.png" alt="" className="docs-mobile-logo" aria-hidden="true" />
          <span>Dokumentáció</span>
        </div>
        <Link to="/" className="docs-mobile-back" aria-label="Vissza az alkalmazásba">←</Link>
      </header>

      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="docs-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <DocsSidebar
        activeId={activeId}
        onNavigate={navigateTo}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main content ── */}
      <main className="docs-main" ref={mainRef} id="docs-main-scroll">
        <div className="docs-content">
          {DOC_STRUCTURE.map((chapter) => (
            <div key={chapter.id} className="docs-chapter" id={`chapter-${chapter.id}`}>
              <div className="docs-chapter-header">
                <span className="docs-chapter-icon" aria-hidden="true">{chapter.icon}</span>
                <h2 className="docs-chapter-title">{chapter.title}</h2>
              </div>

              {chapter.sections.map((section, si) => (
                <section
                  key={section.id}
                  id={section.id}
                  className={`docs-section${activeId === section.id ? ' docs-section--active' : ''}`}
                  aria-labelledby={`${section.id}-title`}
                >
                  <div className="docs-section-inner">
                    {section.content.map((block, bi) => (
                      <ContentBlock key={bi} block={block} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ))}

          {/* Footer */}
          <footer className="docs-footer">
            <div className="docs-footer-inner">
              <img src="/szaldon.png" alt="Szaldon" className="docs-footer-logo" />
              <div className="docs-footer-text">
                <strong>Szaldon</strong> – Pénzügyi Nyomkövető Alkalmazás
                <br />
                <span>Dokumentáció v1.0.0 · 2025</span>
              </div>
              <Link to="/" className="docs-footer-link">Vissza az alkalmazásba →</Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
