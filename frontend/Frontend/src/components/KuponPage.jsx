import React, { useState, useEffect, useCallback } from 'react';
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
  const [filter, setFilter] = useState('all'); 
  const [allKupons, setAllKupons] = useState([]); 
  const [formData, setFormData] = useState({
    Kod: '',
    HasznalatiHely: '',
    KezdesiDatum: new Date().toISOString().split('T')[0],
    LejarasiDatum: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    Megjegyzes: ''
  });

  const auth = useAuth();

  const loadAllKupons = useCallback(async () => {
    try {
      setLoading(true);
      const userId = auth.user?.id;
      const result = await getAllKupons(userId);
      const list = (result && Array.isArray(result.data)) ? result.data : [];
      setAllKupons(list.filter(Boolean));
      // if current filter is 'all' show full list, otherwise we'll fetch filtered in another effect
      if (filter === 'all') setKupons(list.filter(Boolean));
      setError(null);
    } catch (err) {
      setError(err?.message || 'Hiba a kuponok betöltésekor');
      setKupons([]);
      setAllKupons([]);
    } finally {
      setLoading(false);
    }
  }, [auth.user, filter]);

  const loadFilteredKupons = useCallback(async () => {
    if (!auth.user) return;
    try {
      setLoading(true);
      const userId = auth.user?.id;
      if (filter === 'active') {
        const resp = await getActiveKupons(userId);
        setKupons((resp && Array.isArray(resp.data)) ? resp.data : []);
      } else if (filter === 'expired') {
        const resp = await getExpiredKupons(userId);
        setKupons((resp && Array.isArray(resp.data)) ? resp.data : []);
      } else {
        // all
        setKupons(allKupons);
      }
      setError(null);
    } catch (err) {
      setError(err?.message || 'Hiba a kuponok betöltésekor');
      setKupons([]);
    } finally {
      setLoading(false);
    }
  }, [auth.user, filter, allKupons]);

  useEffect(() => {
    if (auth.user) loadAllKupons();
    else {
      setAllKupons([]);
      setKupons([]);
      setLoading(false);
    }
  }, [auth.user, loadAllKupons]);

  useEffect(() => {
    // when filter changes, fetch accordingly
    if (auth.user) loadFilteredKupons();
  }, [filter, auth.user, loadFilteredKupons]);

  const getFilteredKupons = () => {
    // kupons is already filtered by backend when filter !== 'all'
    return kupons.filter(Boolean);
  };

  const todayForCounts = new Date().toISOString().split('T')[0];
  const activeCount = allKupons.filter(k => k && k.KezdesiDatum && k.LejarasiDatum && k.KezdesiDatum <= todayForCounts && k.LejarasiDatum >= todayForCounts).length;
  const expiredCount = allKupons.filter(k => k && k.LejarasiDatum && k.LejarasiDatum < todayForCounts).length;

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
    <div className="kp-page">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Kuponok</h1>
            <p className="page-subtitle">Kezelje és kövesse nyomon kedvezményes kuponjait</p>
          </div>
          {auth.user && auth.user.jogosultsag_szint > 2 && (
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              + Új Kupon
            </button>
          )}
        </div>

        {error && <div className="alert alert-danger">{error} <button className="alert-close" onClick={() => setError(null)}>×</button></div>}

        {/* Filter tabs */}
        <div className="tabs" style={{marginBottom:'1.5rem'}}>
          <button className={`tab-item${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
            Összes <span className="badge badge-primary" style={{marginLeft:6}}>{allKupons.length}</span>
          </button>
          <button className={`tab-item${filter === 'active' ? ' active' : ''}`} onClick={() => setFilter('active')}>
            Aktív <span className="badge badge-success" style={{marginLeft:6}}>{activeCount}</span>
          </button>
          <button className={`tab-item${filter === 'expired' ? ' active' : ''}`} onClick={() => setFilter('expired')}>
            Lejárt <span className="badge badge-danger" style={{marginLeft:6}}>{expiredCount}</span>
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Kuponok betöltése...</p>
          </div>
        ) : filteredKupons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎟️</div>
            <h3>Nincsenek {filter === 'active' ? 'aktív' : filter === 'expired' ? 'lejárt' : ''} kuponok</h3>
            <p>Hozzon létre egy új kupont a jobb felső gombbal.</p>
          </div>
        ) : (
          <div className="kp-grid">
            {filteredKupons
              .filter(k => filter !== 'expired' ? !isKuponExpired(k.LejarasiDatum) : true)
              .map(kupon => (
              <div key={kupon.id} className={`kp-card${isKuponExpired(kupon.LejarasiDatum) ? ' expired' : ''}`}>
                <div className="kp-card-header">
                  <span className="kp-kod">{kupon.Kod}</span>
                  {isKuponActive(kupon.KezdesiDatum, kupon.LejarasiDatum) ? (
                    <span className="badge badge-success">Aktív</span>
                  ) : isKuponExpired(kupon.LejarasiDatum) ? (
                    <span className="badge badge-danger">Lejárt</span>
                  ) : (
                    <span className="badge badge-warning">Hamarosan</span>
                  )}
                </div>

                <div className="kp-details">
                  {kupon.HasznalatiHely && (
                    <div className="kp-detail-row">
                      <span className="kp-detail-label">Felhasználási hely</span>
                      <span className="kp-detail-value">{kupon.HasznalatiHely}</span>
                    </div>
                  )}
                  <div className="kp-detail-row">
                    <span className="kp-detail-label">Kezdési dátum</span>
                    <span className="kp-detail-value">{kupon.KezdesiDatum}</span>
                  </div>
                  <div className="kp-detail-row">
                    <span className="kp-detail-label">Lejárat</span>
                    <span className={`kp-detail-value${isKuponExpired(kupon.LejarasiDatum) ? ' expired-text' : ''}`}>{kupon.LejarasiDatum}</span>
                  </div>
                  {kupon.Megjegyzes && (
                    <div className="kp-detail-row">
                      <span className="kp-detail-label">Megjegyzés</span>
                      <span className="kp-detail-value">{kupon.Megjegyzes}</span>
                    </div>
                  )}
                </div>

                <div className="kp-card-actions">
                  {auth.user && auth.user.jogosultsag_szint > 2 && (
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(kupon)}>Szerkesztés</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(kupon.id)}>Törlés</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
          <button className="btn btn-secondary" onClick={handleCloseModal}>Mégse</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? <span className="spinner" style={{width:16,height:16,borderWidth:2,display:'inline-block',marginRight:6}}></span> : null}
            {editingId ? 'Mentés' : 'Létrehozás'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
