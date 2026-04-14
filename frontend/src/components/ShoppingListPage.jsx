import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../context/useAuth.js';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Modal, Form, InputGroup } from 'react-bootstrap';
import {
  getAllShoppingLists,
  getShoppingListsByUser,
  createShoppingList,
  updateShoppingList,
  addItemToList,
  removeItemFromList,
  deleteShoppingList,
  estimateTotalCost,
  getShoppingListStats,
  getShoppingListById
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

  const [listFormData, setListFormData] = useState({
    Nev: ''
  });

  const [itemFormData, setItemFormData] = useState({
    Megnevezes: '',
    Alkategoria: '',
    Ar: 0,
    MennyisegTipusMertekegyseg: 'Darab',
    Mennyiseg: 1
  });

  const auth = useAuth();

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
        const items = l.VevesiLista || l.vevesi_lista || l.vevesiLista || l.items || [];
        const nev = l.Nev || l.nev || l.megnevezes || '';
        const letrehoz = l.Letrehozas || l.letrehozas || l.created_at || '';
        const osszesen = l.Osszesen || l.osszesen || l.total || 0;
        const tetelek = l.TeteiekSzama || l.teteiek_szama || (Array.isArray(items) ? items.length : 0);
        return {
          ...l,
          Nev: nev,
          Letrehozas: letrehoz,
          Osszesen: osszesen,
          TeteiekSzama: tetelek,
          VevesiLista: items
        };
      });

      setLists(listsData);

      const statsResult = await getShoppingListStats(userId);
      setStats(statsResult && statsResult.data ? statsResult.data : null);

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
          felhasznalo_id: auth.user?.id || null,
          csoport_id: null,
          nev: listFormData.Nev
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
      const itemPayload = {
        megnevezes: itemFormData.Megnevezes,
        alKategoria_id: itemFormData.Alkategoria || null,
        ar: itemFormData.Ar || 0,
        mennyiseg: itemFormData.Mennyiseg || 0,
        mennyiseg_tipus: itemFormData.MennyisegTipusMertekegyseg
      };

      const result = await addItemToList(selectedList.id, itemPayload);
      if (result && result.success) {
        // refresh the selected list from server
        const refreshed = await getShoppingListById(selectedList.id);
        if (refreshed && refreshed.success) {
          setSelectedList(refreshed.data);
          await loadLists();
        }
        setShowItemModal(false);
        const estimateResult = await estimateTotalCost(selectedList.id);
        setTotalEstimate(estimateResult.data);
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
          const refreshed = await getShoppingListById(selectedList.id);
          if (refreshed && refreshed.success) {
            setSelectedList(refreshed.data);
            await loadLists();
          }
          const estimateResult = await estimateTotalCost(selectedList.id);
          setTotalEstimate(estimateResult.data);
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
    try {
      // refresh selected list from server
      const refreshed = await getShoppingListById(list.id);
      if (refreshed && refreshed.success) setSelectedList(refreshed.data);
      const estimateResult = await estimateTotalCost(list.id);
      setTotalEstimate(estimateResult.data);
    } catch {
      // silent
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setListFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    setItemFormData(prev => ({
      ...prev,
      [name]: name === 'Ar' || name === 'Mennyiseg' ? parseFloat(value) || 0 : value
    }));
  };

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
        {stats && (
          <div className="dashboard-stats" style={{marginBottom:'28px'}}>
            {[
              { label: 'Összes lista', value: stats.totalLists },
              { label: 'Összes tétel', value: stats.totalItems },
              { label: 'Összköltség', value: `${(stats.totalCost / 1000).toFixed(0)}k Ft` },
              { label: 'Átlag/lista', value: `${(stats.averageCostPerList / 1000) | 0}k Ft` },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}


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
                          Létrehozva: {list?.Letrehozas || '-'}
                        </small>
                      </div>
                      <div className="list-info mb-3">
                        <span className="info-badge">
                          <strong>{list?.TeteiekSzama ?? (Array.isArray(list?.VevesiLista) ? list.VevesiLista.length : 0)}</strong> tétel
                        </span>
                        <span className="info-badge total">
                          <strong>{((list?.Osszesen || 0) / 1000).toFixed(1)}k Ft</strong>
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

              {/* Tételek táblázata */}
              <div className="table-responsive mb-4">
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
                        <td><strong>{item.Megnevezes}</strong></td>
                        <td>{item.Alkategoria}</td>
                        <td>{item.Ar} Ft</td>
                        <td>{item.Mennyiseg} {item.MennyisegTipusMertekegyseg}</td>
                        <td><strong>{(item.Ar * item.Mennyiseg).toLocaleString()} Ft</strong></td>
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
                      <td><strong>{((selectedList?.Osszesen || 0) / 1000).toFixed(1)}k Ft</strong></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
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
              <Form.Label>Termék neve *</Form.Label>
              <Form.Control
                type="text"
                name="Megnevezes"
                value={itemFormData.Megnevezes}
                onChange={handleItemFormChange}
                placeholder="pl. Kenyér"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kategória</Form.Label>
              <Form.Control
                type="text"
                name="Alkategoria"
                value={itemFormData.Alkategoria}
                onChange={handleItemFormChange}
                placeholder="pl. Pékáru"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Egységár (Ft)</Form.Label>
                  <Form.Control
                    type="number"
                    name="Ar"
                    value={itemFormData.Ar}
                    onChange={handleItemFormChange}
                    placeholder="0"
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
