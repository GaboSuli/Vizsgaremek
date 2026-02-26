import React, { useState, useEffect } from 'react';
import useAuth from '../context/useAuth.js';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { getAllKupons, createKupon, updateKupon, deleteKupon, getActiveKupons, getExpiredKupons } from '../services/kuponService';
import './KuponPage.css';

export default function KuponPage() {
  const [kupons, setKupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, expired
  const [formData, setFormData] = useState({
    Kod: '',
    HasznalatiHely: '',
    KezdesiDatum: new Date().toISOString().split('T')[0],
    LejarasiDatum: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    Megjegyzes: ''
  });

  const auth = useAuth();

  useEffect(() => {
    if (auth.user) loadKupons();
  }, [auth.user]);

  const loadKupons = async () => {
    try {
      setLoading(true);
      const userId = auth.user?.id;
      const result = await getAllKupons(userId);
      setKupons(result.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Hiba a kuponok betöltésekor');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredKupons = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (filter) {
      case 'active':
        return kupons.filter(k => k.KezdesiDatum <= today && k.LejarasiDatum >= today);
      case 'expired':
        return kupons.filter(k => k.LejarasiDatum < today);
      default:
        return kupons;
    }
  };

  const handleOpenModal = (kupon = null) => {
    if (kupon) {
      setEditingId(kupon.id);
      setFormData({
        Kod: kupon.Kod,
        HasznalatiHely: kupon.HasznalatiHely,
        KezdesiDatum: kupon.KezdesiDatum,
        LejarasiDatum: kupon.LejarasiDatum,
        Megjegyzes: kupon.Megjegyzes
      });
    } else {
      setEditingId(null);
      setFormData({
        Kod: '',
        HasznalatiHely: '',
        KezdesiDatum: new Date().toISOString().split('T')[0],
        LejarasiDatum: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        Megjegyzes: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.Kod.trim()) {
      alert('Kérjük adjon meg egy kupon kódot!');
      return;
    }

    try {
      setLoading(true);
      let result;
      
      if (editingId) {
        result = await updateKupon(editingId, formData);
        const updatedKupons = kupons.map(k => k.id === editingId ? result.data : k);
        setKupons(updatedKupons);
      } else {
        result = await createKupon(formData);
        setKupons([...kupons, result.data]);
      }
      
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError(err.error || 'Hiba a mentéskor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Biztosan törölni szeretné ezt a kupont?')) {
      try {
        await deleteKupon(id);
        setKupons(kupons.filter(k => k.id !== id));
        setError(null);
      } catch (err) {
        setError(err.error || 'Hiba a törléskor');
      }
    }
  };

  const isKuponExpired = (lejarasiDatum) => {
    return new Date(lejarasiDatum) < new Date();
  };

  const isKuponActive = (kezdesiDatum, lejarasiDatum) => {
    const today = new Date().toISOString().split('T')[0];
    return kezdesiDatum <= today && lejarasiDatum >= today;
  };

  const filteredKupons = getFilteredKupons();

  return (
    <div className="kupon-page">
      <section className="kupon-hero">
        <div className="hero-content">
          <h1 className="hero-title">🎟️ Kuponok Kezelése</h1>
          <p className="hero-subtitle">Hozzon létre, szerkesszen és kezeljen kuponokat</p>
        </div>
      </section>

      <Container className="kupon-content">
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

        <Row className="mb-4 filter-section">
          <Col xs={12} md={6}>
            <div className="btn-group-filter">
              <Button 
                variant={filter === 'all' ? 'primary' : 'outline-primary'}
                onClick={() => setFilter('all')}
                className="filter-btn"
              >
                Összes ({kupons.length})
              </Button>
              <Button 
                variant={filter === 'active' ? 'success' : 'outline-success'}
                onClick={() => setFilter('active')}
                className="filter-btn"
              >
                Aktív ({getFilteredKupons().length})
              </Button>
              <Button 
                variant={filter === 'expired' ? 'danger' : 'outline-danger'}
                onClick={() => setFilter('expired')}
                className="filter-btn"
              >
                Lejárt
              </Button>
            </div>
          </Col>
          <Col xs={12} md={6} className="text-end">
            <Button 
              variant="primary" 
              onClick={() => handleOpenModal()}
              className="btn-add-kupon"
            >
              + Új Kupon
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Kuponok betöltése...</p>
          </div>
        ) : filteredKupons.length === 0 ? (
          <Alert variant="info">
            Nincsenek {filter === 'active' ? 'aktív' : filter === 'expired' ? 'lejárt' : ''} kuponok.
          </Alert>
        ) : (
          <Row>
            {filteredKupons.map(kupon => (
              <Col key={kupon.id} xs={12} md={6} lg={4} className="mb-4">
                <Card className={`kupon-card ${isKuponExpired(kupon.LejarasiDatum) ? 'expired' : ''}`}>
                  <Card.Body>
                    <div className="kupon-header">
                      <h5 className="kupon-kod">{kupon.Kod}</h5>
                      <div>
                        {isKuponActive(kupon.KezdesiDatum, kupon.LejarasiDatum) ? (
                          <Badge bg="success">Aktív</Badge>
                        ) : isKuponExpired(kupon.LejarasiDatum) ? (
                          <Badge bg="danger">Lejárt</Badge>
                        ) : (
                          <Badge bg="warning">Hamarosan</Badge>
                        )}
                      </div>
                    </div>

                    <div className="kupon-details">
                      <div className="detail-item">
                        <span className="label">Felhasználási hely:</span>
                        <span className="value">{kupon.HasznalatiHely}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Kezdési dátum:</span>
                        <span className="value">{kupon.KezdesiDatum}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Lejárási dátum:</span>
                        <span className="value">{kupon.LejarasiDatum}</span>
                      </div>
                      {kupon.Megjegyzes && (
                        <div className="detail-item">
                          <span className="label">Megjegyzés:</span>
                          <span className="value">{kupon.Megjegyzes}</span>
                        </div>
                      )}
                    </div>

                    <div className="kupon-actions">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleOpenModal(kupon)}
                        className="btn-action"
                      >
                        Szerkesztés
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(kupon.id)}
                        className="btn-action"
                      >
                        Törlés
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Kupon szerkesztése' : 'Új kupon létrehozása'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Kupon kód *</Form.Label>
              <Form.Control
                type="text"
                name="Kod"
                value={formData.Kod}
                onChange={handleFormChange}
                placeholder="pl. TAVASZ2025"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Felhasználási hely</Form.Label>
              <Form.Control
                type="text"
                name="HasznalatiHely"
                value={formData.HasznalatiHely}
                onChange={handleFormChange}
                placeholder="pl. Online és offline"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kezdési dátum</Form.Label>
                  <Form.Control
                    type="date"
                    name="KezdesiDatum"
                    value={formData.KezdesiDatum}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lejárási dátum</Form.Label>
                  <Form.Control
                    type="date"
                    name="LejarasiDatum"
                    value={formData.LejarasiDatum}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Megjegyzés</Form.Label>
              <Form.Control
                as="textarea"
                name="Megjegyzes"
                value={formData.Megjegyzes}
                onChange={handleFormChange}
                placeholder="pl. 20% kedvezmény"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Mégse
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {editingId ? 'Mentés' : 'Létrehozás'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
