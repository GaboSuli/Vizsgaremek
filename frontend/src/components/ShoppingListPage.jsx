import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useAuth from '../context/useAuth.js';
import { apiCall } from '../services/api.js';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Modal, Form, InputGroup } from 'react-bootstrap';
import {
  getAllShoppingLists,
  getShoppingListsByUser,
  createShoppingList,
  updateShoppingList,
  addItemToList,
  removeItemFromList,
  deleteShoppingList,
} from '../services/shoppingListService';
import './ShoppingListPage.css';

export default function ShoppingListPage() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingListId, setEditingListId] = useState(null);
  const [stats, setStats] = useState(null);
  const [totalEstimate, setTotalEstimate] = useState(null);
  const [kategoriak, setKategoriak] = useState([]);

  const [listFormData, setListFormData] = useState({
    Nev: ''
  });

  const [itemFormData, setItemFormData] = useState({
    Megnevezes: '',
    Kategoria: '',
    Alkategoria: '',
    Ar: 0,
    MennyisegTipusMertekegyseg: 'Darab',
    Mennyiseg: 1
  });

  const auth = useAuth();

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch { return dateStr; }
  };

  const formatMoney = (amount) => {
    const num = Number(amount) || 0;
    return num.toLocaleString('hu-HU') + ' Ft';
  };

  const loadLists = useCallback(async () => {
    try {
      setLoading(true);
      const userId = auth.user?.id;
      const result = userId ? await getShoppingListsByUser(userId) : await getAllShoppingLists();

      // Normalize result.data into an array to avoid rendering errors when API returns null/undefined/single object
      let listsData = [];
      if (result && result.data) {
        if (Array.isArray(result.data)) listsData = result.data;
        else listsData = [result.data];
      } else {
        // If the service returned an error object without data, fallback to empty list
        listsData = [];
      }

      // Normalize field names from backend (lowercase keys) to UI expected keys
      listsData = listsData.map(l => {
        const items = l.vevesobjektum || l.VevesiLista || l.vevesi_lista || l.vevesiLista || l.items || [];
        const nev = l.megnevezes || l.Nev || l.nev || '';
        const letrehoz = l.created_at || l.Letrehozas || l.letrehozas || '';
        const osszesen = l.Osszesen || l.osszesen || l.total || 0;
        const tetelek = l.TeteiekSzama || l.teteiek_szama || (Array.isArray(items) ? items.length : 0);

        // Normalize item fields from backend snake_case to UI keys
        const normalizedItems = (Array.isArray(items) ? items : []).map(item => ({
          ...item,
          Megnevezes: item.megnevezes || item.Megnevezes || '',
          Alkategoria: item.al_kategoria?.megnevezes || item.alKategoria?.megnevezes || item.alkategoria || item.Alkategoria || '-',
          Ar: Number(item.ar ?? item.Ar ?? 0),
          Mennyiseg: Number(item.mennyiseg ?? item.Mennyiseg ?? 0),
          MennyisegTipusMertekegyseg: item.mennyiseg_tipus || item.MennyisegTipusMertekegyseg || '',
        }));

        // Calculate total from items if not provided
        const calculatedTotal = normalizedItems.reduce((sum, item) => sum + (item.Ar * item.Mennyiseg), 0);

        return {
          ...l,
          Nev: nev,
          Letrehozas: letrehoz,
          Osszesen: osszesen || calculatedTotal,
          TeteiekSzama: tetelek || normalizedItems.length,
          VevesiLista: normalizedItems
        };
      });

      setLists(listsData);

      // Calculate stats directly from loaded lists for accuracy
      let totalItems = 0;
      let totalCost = 0;
      listsData.forEach(list => {
        const items = list.VevesiLista || [];
        totalItems += items.length;
        items.forEach(item => {
          totalCost += (item.Ar || 0) * (item.Mennyiseg || 1);
        });
      });
      const computedStats = {
        totalLists: listsData.length,
        totalItems,
        totalCost,
        averageCostPerList: listsData.length > 0 ? Math.round(totalCost / listsData.length) : 0,
      };
      setStats(computedStats);

      setError(null);
    } catch (err) {
      setError(err.message || 'Hiba a betöltéskor');
    } finally {
      setLoading(false);
    }
  }, [auth.user]);

  // Call loadLists when auth.user becomes available. loadLists is defined above.
  useEffect(() => {
    if (auth.user) loadLists();
  }, [auth.user, loadLists]);

  // Keep selectedList in sync with lists after reload
  useEffect(() => {
    if (selectedList) {
      const updated = lists.find(l => l.id === selectedList.id);
      if (updated) setSelectedList(updated);
    }
  }, [lists]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load categories from API
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

  const handleOpenListModal = (list = null) => {
    if (list) {
      setEditingListId(list.id);
      setListFormData({ Nev: list.Nev });
    } else {
      setEditingListId(null);
      setListFormData({ Nev: '' });
    }
    setShowModal(true);
  };

  const handleOpenItemModal = () => {
    setItemFormData({
      Megnevezes: '',
      Kategoria: '',
      Alkategoria: '',
      Ar: 0,
      MennyisegTipusMertekegyseg: 'Darab',
      Mennyiseg: 1
    });
    setShowItemModal(true);
  };

  const handleSaveList = async () => {
    if (!listFormData.Nev.trim()) {
      alert('Kérjük adjon meg egy nevet!');
      return;
    }

    try {
      setLoading(true);
      if (editingListId) {
        const result = await updateShoppingList(editingListId, listFormData);
        if (result && result.success) {
          await loadLists();
          setShowModal(false);
          setError(null);
        } else {
          setError(result.message || 'Hiba a mentéskor');
        }
      } else {
        // Backend requires felhasznalo_id and csoport_id. Include current user id and the list name as 'nev'.
        const payload = {
          megnevezes: listFormData.Nev
        };
        const result = await createShoppingList(payload);
        if (result && result.success) {
          // reload lists from server to get consistent structure
          await loadLists();
          setShowModal(false);
          setError(null);
        } else {
          setError(result.message || 'Hiba a mentéskor');
        }
      }
    } catch (err) {
      setError(err.error || err.message || 'Hiba a mentéskor');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!itemFormData.Megnevezes.trim()) {
      alert('Kérjük adjon meg egy terméknevet!');
      return;
    }

    try {
      setLoading(true);
      // Map UI form fields to the backend expected keys to avoid validation (422)
      // Parse Ar: extract first number from text (e.g. "kb 500", "akciós 999", "1200 Ft")
      const parsedAr = parseFloat(String(itemFormData.Ar).replace(',', '.').match(/[\d.]+/)?.[0]) || 0;
      const itemPayload = {
        megnevezes: itemFormData.Megnevezes,
        alKategoria_id: itemFormData.Alkategoria || null,
        ar: parsedAr,
        mennyiseg: itemFormData.Mennyiseg || 0,
        mennyiseg_tipus: itemFormData.MennyisegTipusMertekegyseg
      };

      const result = await addItemToList(selectedList.id, itemPayload);
      if (result && result.success) {
        await loadLists();
        setShowItemModal(false);
        setError(null);
      } else {
        setError(result.message || 'Hiba az elemhozzáadáskor');
      }
    } catch (err) {
      setError(err.error || err.message || 'Hiba az elemhozzáadáskor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Biztosan törölni szeretné ezt a tételt?')) {
      try {
        const result = await removeItemFromList(selectedList.id, itemId);
        if (result && result.success) {
          await loadLists();
        } else {
          setError(result.message || 'Hiba a törléskor');
        }
      } catch (err) {
        setError(err.error || err.message || 'Hiba a törléskor');
      }
    }
  };

  const handleDeleteList = async (id) => {
    if (window.confirm('Biztosan törölni szeretné ezt a bevásárlólistát?')) {
      try {
        const result = await deleteShoppingList(id);
        if (result && result.success) {
          await loadLists();
          if (selectedList?.id === id) {
            setSelectedList(null);
            setTotalEstimate(null);
          }
        } else {
          setError(result.message || 'Hiba a törléskor');
        }
      } catch (err) {
        setError(err.error || err.message || 'Hiba a törléskor');
      }
    }
  };

  const handleSelectList = async (list) => {
    setSelectedList(list);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setListFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Flat list of all alkategoria items for the product dropdown
  const allAlkategoriak = useMemo(() => {
    const items = [];
    kategoriak.forEach(kat => {
      (kat.alkategoriak || []).forEach(alkat => {
        items.push({ ...alkat, kategoriaNev: kat.megnevezes });
      });
    });
    return items;
  }, [kategoriak]);

  const handleItemFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Kategoria') {
      // Reset alkategoria when category changes
      setItemFormData(prev => ({
        ...prev,
        Kategoria: value,
        Alkategoria: '',
        Megnevezes: ''
      }));
      return;
    }

    if (name === 'Alkategoria') {
      // When selecting a product from the dropdown, auto-fill name + id
      const selected = allAlkategoriak.find(a => String(a.id) === String(value));
      setItemFormData(prev => ({
        ...prev,
        Alkategoria: value,
        Megnevezes: selected ? selected.megnevezes : prev.Megnevezes
      }));
      return;
    }

    setItemFormData(prev => ({
      ...prev,
      [name]: name === 'Ar'
        ? value  // store raw text; parse on submit
        : name === 'Mennyiseg' ? parseFloat(value) || 0 : value
    }));
  };

  // Filtered alkategoria based on selected category
  const filteredAlkategoriak = useMemo(() => {
    if (!itemFormData.Kategoria) return allAlkategoriak;
    return allAlkategoriak.filter(a => String(a.kategoria_id || a.kategoriak_id) === String(itemFormData.Kategoria));
  }, [allAlkategoriak, itemFormData.Kategoria]);

  if (loading && !selectedList) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Bevásárlólisták betöltése...</p>
      </div>
    );
  }

  return (
    <div className="sl-page">
      <div className="page-container">
        {/* Page header */}
        <div className="page-header" style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'16px'}}>
          <div>
            <h1 className="page-title">🛒 Bevásárlólisták</h1>
            <p className="page-subtitle">Hozz létre és kezeld bevásárlólistáidat</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenListModal()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Új lista
          </button>
        </div>

        {error && <div className="alert alert-danger" style={{marginBottom:'20px'}}>{error}</div>}

        {/* Stats row */}
        <div className="dashboard-stats" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'16px', marginBottom:'28px'}}>
          {[
            { label: 'Összes lista', value: stats ? stats.totalLists : lists.length },
            { label: 'Összes tétel', value: stats ? stats.totalItems : 0 },
            { label: 'Összköltség', value: formatMoney(stats ? stats.totalCost : 0) },
            { label: 'Átlag/lista', value: formatMoney(stats ? stats.averageCostPerList : 0) },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            </div>
          ))}
        </div>


        {!selectedList ? (
          // Lista nézet
          <Row>
            {lists.length === 0 ? (
              <Col xs={12}>
                <Alert variant="info">Nincsenek bevásárlólisták. Hozzon létre egy új listát!</Alert>
              </Col>
            ) : (
              (lists || []).map(list => (
                <Col key={list.id} xs={12} md={6} lg={4} className="mb-4">
                  <Card className="list-card">
                    <Card.Body>
                      <h5 className="list-title">{list?.Nev || 'Név nélkül'}</h5>
                      <div className="list-meta">
                        <small className="text-muted">
                          Létrehozva: {formatDate(list?.Letrehozas)}
                        </small>
                      </div>
                      <div className="list-info mb-3">
                        <span className="info-badge">
                          <strong>{list?.TeteiekSzama ?? (Array.isArray(list?.VevesiLista) ? list.VevesiLista.length : 0)}</strong> tétel
                        </span>
                        <span className="info-badge total">
                          <strong>{formatMoney(list?.Osszesen)}</strong>
                        </span>
                      </div>
                      <div className="list-actions">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSelectList(list)}
                          className="btn-action"
                        >
                          Megtekintés
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleOpenListModal(list)}
                          className="btn-action"
                        >
                          Szerkesztés
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteList(list.id)}
                          className="btn-action"
                        >
                          Törlés
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        ) : (
          // Részletek nézet
          <Card className="detail-card">
            <Card.Header className="detail-header">
              <div className="detail-title-section">
                <h4 className="mb-0">{selectedList.Nev}</h4>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedList(null);
                    setTotalEstimate(null);
                  }}
                >
                  ← Vissza
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {/* Költségbecslés */}
              {totalEstimate && (
                <Alert variant="info" className="estimate-box">
                  <h6>💰 Becsült költség:</h6>
                  <p className="mb-0">
                    <strong>{totalEstimate.description}</strong>
                  </p>
                </Alert>
              )}

              {/* Tételek táblázata - desktop */}
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
                        <th>Műveletek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedList?.VevesiLista || []).map(item => (
                        <tr key={item.id}>
                          <td><strong>{item.Megnevezes || item.megnevezes}</strong></td>
                          <td>{item.Alkategoria || item.alkategoria || '-'}</td>
                          <td>{formatMoney(item.Ar || item.ar)}</td>
                          <td>{item.Mennyiseg || item.mennyiseg} {item.MennyisegTipusMertekegyseg || item.mennyiseg_tipus || ''}</td>
                          <td><strong>{formatMoney((item.Ar || item.ar || 0) * (item.Mennyiseg || item.mennyiseg || 0))}</strong></td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              ✕
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="summary-row">
                        <td colSpan="4"><strong>Összesen:</strong></td>
                        <td><strong>{formatMoney(selectedList?.Osszesen)}</strong></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Tételek kártyák - mobil/tablet */}
              <div className="sl-detail-cards d-lg-none mb-4">
                {(selectedList?.VevesiLista || []).length === 0 ? (
                  <p className="text-muted text-center">Még nincsenek tételek.</p>
                ) : (
                  <>
                    {(selectedList?.VevesiLista || []).map(item => (
                      <div key={item.id} className="sl-item-card">
                        <div className="sl-item-card-header">
                          <strong>{item.Megnevezes || item.megnevezes}</strong>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            ✕
                          </Button>
                        </div>
                        <div className="sl-item-card-body">
                          <div className="sl-item-row">
                            <span className="sl-item-label">Kategória</span>
                            <span>{item.Alkategoria || item.alkategoria || '-'}</span>
                          </div>
                          <div className="sl-item-row">
                            <span className="sl-item-label">Egységár</span>
                            <span>{formatMoney(item.Ar || item.ar)}</span>
                          </div>
                          <div className="sl-item-row">
                            <span className="sl-item-label">Mennyiség</span>
                            <span>{item.Mennyiseg || item.mennyiseg} {item.MennyisegTipusMertekegyseg || item.mennyiseg_tipus || ''}</span>
                          </div>
                          <div className="sl-item-row sl-item-row-total">
                            <span className="sl-item-label">Összesen</span>
                            <strong>{formatMoney((item.Ar || item.ar || 0) * (item.Mennyiseg || item.mennyiseg || 0))}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="sl-total-card">
                      <strong>Összesen:</strong>
                      <strong>{formatMoney(selectedList?.Osszesen)}</strong>
                    </div>
                  </>
                )}
              </div>

              <Button
                variant="success"
                onClick={handleOpenItemModal}
                className="btn-add-item"
              >
                + Tétel hozzáadása
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Lista módosítás Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingListId ? 'Bevásárlólista szerkesztése' : 'Új bevásárlólista'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Lista neve *</Form.Label>
              <Form.Control
                type="text"
                name="Nev"
                value={listFormData.Nev}
                onChange={handleFormChange}
                placeholder="pl. Heti bevásárlás"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Mégse
          </Button>
          <Button variant="primary" onClick={handleSaveList} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {editingListId ? 'Mentés' : 'Létrehozás'}
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
              <Form.Select
                name="Kategoria"
                value={itemFormData.Kategoria}
                onChange={handleItemFormChange}
              >
                <option value="">-- Összes kategória --</option>
                {kategoriak.map(kat => (
                  <option key={kat.id} value={kat.id}>
                    {kat.megnevezes}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Termék *</Form.Label>
              <Form.Select
                name="Alkategoria"
                value={itemFormData.Alkategoria}
                onChange={handleItemFormChange}
              >
                <option value="">-- Válassz terméket --</option>
                {itemFormData.Kategoria ? (
                  filteredAlkategoriak.map(alkat => (
                    <option key={alkat.id} value={alkat.id}>
                      {alkat.megnevezes}
                    </option>
                  ))
                ) : (
                  kategoriak.map(kat => (
                    <optgroup key={kat.id} label={kat.megnevezes}>
                      {(kat.alkategoriak || []).map(alkat => (
                        <option key={alkat.id} value={alkat.id}>
                          {alkat.megnevezes}
                        </option>
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
                  <Form.Control
                    type="text"
                    name="Ar"
                    value={itemFormData.Ar}
                    onChange={handleItemFormChange}
                    placeholder="pl. 1200, kb 500, akciós 999"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mennyiség</Form.Label>
                  <Form.Control
                    type="number"
                    name="Mennyiseg"
                    value={itemFormData.Mennyiseg}
                    onChange={handleItemFormChange}
                    placeholder="1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mértékegység</Form.Label>
              <Form.Select
                name="MennyisegTipusMertekegyseg"
                value={itemFormData.MennyisegTipusMertekegyseg}
                onChange={handleItemFormChange}
              >
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
          <Button variant="secondary" onClick={() => setShowItemModal(false)}>
            Mégse
          </Button>
          <Button variant="success" onClick={handleAddItem} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Hozzáadás
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
