import React, { useState, useEffect } from 'react';
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
  getShoppingListStats
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

  useEffect(() => {
    if (auth.user) loadLists();
  }, [auth.user]);

  const loadLists = async () => {
    try {
      setLoading(true);
      const userId = auth.user?.id;
      const result = userId ? await getShoppingListsByUser(userId) : await getAllShoppingLists();
      setLists(result.data);
      
      const statsResult = await getShoppingListStats(userId);
      setStats(statsResult.data);
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Hiba a betöltéskor');
    } finally {
      setLoading(false);
    }
  };

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
      let result;

      if (editingListId) {
        result = await updateShoppingList(editingListId, listFormData);
        setLists(lists.map(l => l.id === editingListId ? result.data : l));
      } else {
        result = await createShoppingList(listFormData);
        setLists([...lists, result.data]);
      }

      setShowModal(false);
      setError(null);
    } catch (err) {
      setError(err.error || 'Hiba a mentéskor');
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
      const result = await addItemToList(selectedList.id, itemFormData);
      setSelectedList(result.data);
      
      setLists(lists.map(l => l.id === selectedList.id ? result.data : l));
      setShowItemModal(false);
      
      const estimateResult = await estimateTotalCost(selectedList.id);
      setTotalEstimate(estimateResult.data);
      
      setError(null);
    } catch (err) {
      setError(err.error || 'Hiba az elemhozzáadáskor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Biztosan törölni szeretné ezt a tételt?')) {
      try {
        const result = await removeItemFromList(selectedList.id, itemId);
        setSelectedList(result.data);
        setLists(lists.map(l => l.id === selectedList.id ? result.data : l));
        
        const estimateResult = await estimateTotalCost(selectedList.id);
        setTotalEstimate(estimateResult.data);
      } catch (err) {
        setError(err.error || 'Hiba a törléskor');
      }
    }
  };

  const handleDeleteList = async (id) => {
    if (window.confirm('Biztosan törölni szeretné ezt a bevásárlólistát?')) {
      try {
        await deleteShoppingList(id);
        setLists(lists.filter(l => l.id !== id));
        if (selectedList?.id === id) {
          setSelectedList(null);
          setTotalEstimate(null);
        }
      } catch (err) {
        setError(err.error || 'Hiba a törléskor');
      }
    }
  };

  const handleSelectList = async (list) => {
    setSelectedList(list);
    try {
      const estimateResult = await estimateTotalCost(list.id);
      setTotalEstimate(estimateResult.data);
    } catch (err) {
      console.error(err);
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
    <div className="shopping-list-page">
      <section className="shopping-hero">
        <div className="hero-content">
          <h1 className="hero-title">🛒 Bevásárlólista Kezelő</h1>
          <p className="hero-subtitle">Hozzon létre bevásárlólistákat és becsülje meg a költségeket</p>
        </div>
      </section>

      <Container className="shopping-content">
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

        {/* Statisztikák */}
        {stats && (
          <Row className="stats-grid mb-4">
            <Col xs={12} sm={6} md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <h6 className="stat-label">Összes lista</h6>
                  <h3 className="stat-value">{stats.totalLists}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <h6 className="stat-label">Összesen tételek</h6>
                  <h3 className="stat-value">{stats.totalItems}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <h6 className="stat-label">Összköltség</h6>
                  <h3 className="stat-value">{(stats.totalCost / 1000).toFixed(0)}k Ft</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <h6 className="stat-label">Átlag/Lista</h6>
                  <h3 className="stat-value">{stats.averageCostPerList / 1000 | 0}k Ft</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row className="mb-4">
          <Col>
            <Button 
              variant="primary" 
              onClick={() => handleOpenListModal()}
              className="btn-new-list"
            >
              + Új Bevásárlólista
            </Button>
          </Col>
        </Row>

        {!selectedList ? (
          // Lista nézet
          <Row>
            {lists.length === 0 ? (
              <Col xs={12}>
                <Alert variant="info">Nincsenek bevásárlólisták. Hozzon létre egy új listát!</Alert>
              </Col>
            ) : (
              lists.map(list => (
                <Col key={list.id} xs={12} md={6} lg={4} className="mb-4">
                  <Card className="list-card">
                    <Card.Body>
                      <h5 className="list-title">{list.Nev}</h5>
                      <div className="list-meta">
                        <small className="text-muted">
                          Létrehozva: {list.Letrehozas}
                        </small>
                      </div>
                      <div className="list-info mb-3">
                        <span className="info-badge">
                          <strong>{list.TeteiekSzama}</strong> tétel
                        </span>
                        <span className="info-badge total">
                          <strong>{(list.Osszesen / 1000).toFixed(1)}k Ft</strong>
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
                    {selectedList.VevesiLista.map(item => (
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
                      <td><strong>{(selectedList.Osszesen / 1000).toFixed(1)}k Ft</strong></td>
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
      </Container>

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
