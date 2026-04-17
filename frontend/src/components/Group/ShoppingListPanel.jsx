import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Row, Col, Spinner, Card } from 'react-bootstrap';
import {
  getCsoportVevesiListak,
  createVevesiLista,
  deleteVevesiLista,
  addVevesiObjektum,
  deleteVevesiObjektum,
} from '../../services/api';
import { apiCall } from '../../services/api';
import '../ShoppingListPage.css';

const formatMoney = (amount) => {
  const num = Number(amount) || 0;
  return num.toLocaleString('hu-HU') + ' Ft';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch { return dateStr; }
};

export default function ShoppingListPanel({ csoportId, canEdit }) {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [kategoriak, setKategoriak] = useState([]);
  const [listName, setListName] = useState('');

  const [itemFormData, setItemFormData] = useState({
    Megnevezes: '',
    Kategoria: '',
    Alkategoria: '',
    Ar: 0,
    MennyisegTipusMertekegyseg: 'Darab',
    Mennyiseg: 1,
  });

  const normalizeLists = (raw) => {
    return (Array.isArray(raw) ? raw : []).map(l => {
      const items = l.vevesobjektum || l.VevesiLista || l.items || [];
      const normalizedItems = items.map(item => ({
        ...item,
        Megnevezes: item.megnevezes || item.Megnevezes || '',
        Alkategoria: item.al_kategoria?.megnevezes || item.alKategoria?.megnevezes || item.alkategoria || item.Alkategoria || '-',
        Ar: Number(item.ar ?? item.Ar ?? 0),
        Mennyiseg: Number(item.mennyiseg ?? item.Mennyiseg ?? 0),
        MennyisegTipusMertekegyseg: item.mennyiseg_tipus || item.MennyisegTipusMertekegyseg || '',
      }));
      const calculatedTotal = normalizedItems.reduce((sum, i) => sum + i.Ar * i.Mennyiseg, 0);
      return {
        ...l,
        Nev: l.megnevezes || l.Nev || '',
        Letrehozas: l.created_at || l.Letrehozas || '',
        Osszesen: l.Osszesen || l.osszesen || calculatedTotal,
        TeteiekSzama: normalizedItems.length,
        VevesiLista: normalizedItems,
      };
    });
  };

  const loadLists = async () => {
    setLoading(true);
    setError(null);
    const res = await getCsoportVevesiListak(csoportId);
    setLoading(false);
    if (res.success) {
      const normalized = normalizeLists(res.data);
      setLists(normalized);
      setSelectedList(prev => {
        if (!prev) return prev;
        const updated = normalized.find(l => l.id === prev.id);
        return updated || prev;
      });
    } else {
      setError(res.message || 'Nem sikerült betölteni a bevásárlólistákat');
    }
  };

  const load = loadLists;
  const loadRef = React.useRef(loadLists);

  useEffect(() => {
    const fn = loadRef.current;
    fn();
  }, [csoportId]);

  useEffect(() => {
    const loadKategoriak = async () => {
      try {
        const result = await apiCall('/alkategoriak');
        if (result && result.success && Array.isArray(result.data)) {
          setKategoriak(result.data);
        }
      } catch { /* silent */ }
    };
    loadKategoriak();
  }, []);

  const allAlkategoriak = useMemo(() => {
    const items = [];
    kategoriak.forEach(kat => {
      (kat.alkategoriak || []).forEach(alkat => {
        items.push({ ...alkat, kategoriaNev: kat.megnevezes });
      });
    });
    return items;
  }, [kategoriak]);

  const filteredAlkategoriak = useMemo(() => {
    if (!itemFormData.Kategoria) return allAlkategoriak;
    return allAlkategoriak.filter(a => String(a.kategoria_id || a.kategoriak_id) === String(itemFormData.Kategoria));
  }, [allAlkategoriak, itemFormData.Kategoria]);

  const handleCreateList = async () => {
    if (!listName.trim()) return;
    setLoading(true);
    const res = await createVevesiLista({ megnevezes: listName.trim(), csoport_id: Number(csoportId) });
    if (res.success) {
      setListName('');
      setShowModal(false);
      await load();
    } else {
      setError(res.message || 'Hiba a lista létrehozásakor');
    }
    setLoading(false);
  };

  const handleDeleteList = async (id) => {
    if (!window.confirm('Biztosan törölni szeretné ezt a bevásárlólistát?')) return;
    const res = await deleteVevesiLista(id);
    if (res.success) {
      if (selectedList?.id === id) setSelectedList(null);
      await load();
    } else {
      setError(res.message || 'Hiba a törléskor');
    }
  };

  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Kategoria') {
      setItemFormData(prev => ({ ...prev, Kategoria: value, Alkategoria: '', Megnevezes: '' }));
      return;
    }
    if (name === 'Alkategoria') {
      const selected = allAlkategoriak.find(a => String(a.id) === String(value));
      setItemFormData(prev => ({ ...prev, Alkategoria: value, Megnevezes: selected ? selected.megnevezes : prev.Megnevezes }));
      return;
    }
    setItemFormData(prev => ({
      ...prev,
      [name]: name === 'Ar'
        ? value  // store raw text; parse on submit
        : name === 'Mennyiseg' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddItem = async () => {
    if (!itemFormData.Megnevezes.trim()) {
      alert('Kérjük adjon meg egy terméknevet!');
      return;
    }
    setLoading(true);
    // Parse Ar: extract first number from text (e.g. "kb 500", "akciós 999", "1200 Ft")
    const parsedAr = parseFloat(String(itemFormData.Ar).replace(',', '.').match(/[\d.]+/)?.[0]) || 0;
    const res = await addVevesiObjektum({
      veves_lista_id: selectedList.id,
      megnevezes: itemFormData.Megnevezes,
      alKategoria_id: itemFormData.Alkategoria || null,
      ar: parsedAr,
      mennyiseg: itemFormData.Mennyiseg || 1,
      mennyiseg_tipus: itemFormData.MennyisegTipusMertekegyseg,
    });
    setLoading(false);
    if (res.success) {
      setShowItemModal(false);
      setItemFormData({ Megnevezes: '', Kategoria: '', Alkategoria: '', Ar: 0, MennyisegTipusMertekegyseg: 'Darab', Mennyiseg: 1 });
      await load();
    } else {
      setError(res.message || 'Hiba az elem hozzáadásakor');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Biztosan törölni szeretné ezt a tételt?')) return;
    const res = await deleteVevesiObjektum(itemId);
    if (res.success) {
      await load();
    } else {
      setError(res.message || 'Hiba a törléskor');
    }
  };

  if (loading && lists.length === 0) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" size="sm" />
        <span className="ms-2">Betöltés...</span>
      </div>
    );
  }

  return (
    <div className="sl-page" style={{ minHeight: 'unset' }}>
      <div style={{ padding: 0 }}>
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          {selectedList ? (
            <Button variant="secondary" size="sm" onClick={() => setSelectedList(null)}>← Vissza</Button>
          ) : (
            <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>{lists.length} lista</span>
          )}
          {!selectedList && canEdit && (
            <button className="btn btn-primary btn-sm" onClick={() => { setListName(''); setShowModal(true); }}>
              + Új lista
            </button>
          )}
          {selectedList && canEdit && (
            <button className="btn btn-success btn-sm" onClick={() => {
              setItemFormData({ Megnevezes: '', Kategoria: '', Alkategoria: '', Ar: 0, MennyisegTipusMertekegyseg: 'Darab', Mennyiseg: 1 });
              setShowItemModal(true);
            }}>
              + Tétel hozzáadása
            </button>
          )}
        </div>

        {!selectedList ? (
          /* Lista nézet – kártyák */
          <Row>
            {lists.length === 0 ? (
              <Col xs={12}>
                <div style={{ color: 'var(--clr-text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
                  Nincs még bevásárlólista ebben a csoportban.{canEdit && ' Hozz létre egyet!'}
                </div>
              </Col>
            ) : (
              lists.map(list => (
                <Col key={list.id} xs={12} md={6} lg={4} className="mb-3">
                  <Card className="list-card">
                    <Card.Body>
                      <h5 className="list-title">{list.Nev || 'Név nélkül'}</h5>
                      <div className="list-meta">
                        <small className="text-muted">Létrehozva: {formatDate(list.Letrehozas)}</small>
                      </div>
                      <div className="list-info mb-3">
                        <span className="info-badge"><strong>{list.TeteiekSzama}</strong> tétel</span>
                        <span className="info-badge total"><strong>{formatMoney(list.Osszesen)}</strong></span>
                      </div>
                      <div className="list-actions">
                        <Button variant="primary" size="sm" className="btn-action" onClick={() => setSelectedList(list)}>
                          Megtekintés
                        </Button>
                        {canEdit && (
                          <Button variant="outline-danger" size="sm" className="btn-action" onClick={() => handleDeleteList(list.id)}>
                            Törlés
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        ) : (
          /* Részletek nézet */
          <Card className="detail-card">
            <Card.Header className="detail-header">
              <div className="detail-title-section">
                <h4 className="mb-0">{selectedList.Nev}</h4>
              </div>
            </Card.Header>
            <Card.Body>
              {/* Desktop táblázat */}
              <div className="sl-detail-table d-none d-lg-block mb-4">
                <div className="table-responsive">
                  <Table hover className="items-table">
                    <thead>
                      <tr>
                        <th>Termék</th>
                        <th>Kategória</th>
                        <th>Egységár</th>
                        <th>Mennyiség</th>
                        <th>Összesen</th>
                        {canEdit && <th>Műveletek</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedList.VevesiLista || []).length === 0 ? (
                        <tr><td colSpan={canEdit ? 6 : 5} className="text-center text-muted">Még nincsenek tételek.</td></tr>
                      ) : (
                        (selectedList.VevesiLista || []).map(item => (
                          <tr key={item.id}>
                            <td><strong>{item.Megnevezes}</strong></td>
                            <td>{item.Alkategoria}</td>
                            <td>{formatMoney(item.Ar)}</td>
                            <td>{item.Mennyiseg} {item.MennyisegTipusMertekegyseg}</td>
                            <td><strong>{formatMoney(item.Ar * item.Mennyiseg)}</strong></td>
                            {canEdit && (
                              <td>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem(item.id)}>✕</Button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                      <tr className="summary-row">
                        <td colSpan={canEdit ? 4 : 4}><strong>Összesen:</strong></td>
                        <td><strong>{formatMoney(selectedList.Osszesen)}</strong></td>
                        {canEdit && <td></td>}
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Mobil kártyák */}
              <div className="sl-detail-cards d-lg-none mb-4">
                {(selectedList.VevesiLista || []).length === 0 ? (
                  <p className="text-muted text-center">Még nincsenek tételek.</p>
                ) : (
                  <>
                    {(selectedList.VevesiLista || []).map(item => (
                      <div key={item.id} className="sl-item-card">
                        <div className="sl-item-card-header">
                          <strong>{item.Megnevezes}</strong>
                          {canEdit && (
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem(item.id)}>✕</Button>
                          )}
                        </div>
                        <div className="sl-item-card-body">
                          <div className="sl-item-row">
                            <span className="sl-item-label">Kategória</span>
                            <span>{item.Alkategoria}</span>
                          </div>
                          <div className="sl-item-row">
                            <span className="sl-item-label">Egységár</span>
                            <span>{formatMoney(item.Ar)}</span>
                          </div>
                          <div className="sl-item-row">
                            <span className="sl-item-label">Mennyiség</span>
                            <span>{item.Mennyiseg} {item.MennyisegTipusMertekegyseg}</span>
                          </div>
                          <div className="sl-item-row sl-item-row-total">
                            <span className="sl-item-label">Összesen</span>
                            <strong>{formatMoney(item.Ar * item.Mennyiseg)}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="sl-total-card">
                      <strong>Összesen:</strong>
                      <strong>{formatMoney(selectedList.Osszesen)}</strong>
                    </div>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Új lista Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Új bevásárlólista</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Lista neve *</Form.Label>
            <Form.Control
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="pl. Heti bevásárlás"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Mégse</Button>
          <Button variant="primary" onClick={handleCreateList} disabled={loading || !listName.trim()}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Létrehozás
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tétel hozzáadás Modal */}
      <Modal show={showItemModal} onHide={() => setShowItemModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tétel hozzáadása</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Kategória</Form.Label>
              <Form.Select name="Kategoria" value={itemFormData.Kategoria} onChange={handleItemFormChange}>
                <option value="">-- Összes kategória --</option>
                {kategoriak.map(kat => (
                  <option key={kat.id} value={kat.id}>{kat.megnevezes}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Termék *</Form.Label>
              <Form.Select name="Alkategoria" value={itemFormData.Alkategoria} onChange={handleItemFormChange}>
                <option value="">-- Válassz terméket --</option>
                {itemFormData.Kategoria ? (
                  filteredAlkategoriak.map(alkat => (
                    <option key={alkat.id} value={alkat.id}>{alkat.megnevezes}</option>
                  ))
                ) : (
                  kategoriak.map(kat => (
                    <optgroup key={kat.id} label={kat.megnevezes}>
                      {(kat.alkategoriak || []).map(alkat => (
                        <option key={alkat.id} value={alkat.id}>{alkat.megnevezes}</option>
                      ))}
                    </optgroup>
                  ))
                )}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Egységár (Ft)</Form.Label>
                  <Form.Control type="text" name="Ar" value={itemFormData.Ar} onChange={handleItemFormChange} placeholder="pl. 1200, kb 500, akciós 999" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mennyiség</Form.Label>
                  <Form.Control type="number" name="Mennyiseg" value={itemFormData.Mennyiseg} onChange={handleItemFormChange} placeholder="1" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Mértékegység</Form.Label>
              <Form.Select name="MennyisegTipusMertekegyseg" value={itemFormData.MennyisegTipusMertekegyseg} onChange={handleItemFormChange}>
                <option>Darab</option>
                <option>Kg</option>
                <option>Liter</option>
                <option>Ml</option>
                <option>Dkg</option>
                <option>Csomag</option>
                <option>Doboz</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowItemModal(false)}>Mégse</Button>
          <Button variant="success" onClick={handleAddItem} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Hozzáadás
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
