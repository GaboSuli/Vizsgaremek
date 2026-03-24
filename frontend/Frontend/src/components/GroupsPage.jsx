import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form } from 'react-bootstrap';
import { apiCall } from '../services/api';
import './GroupsPage.css';

export default function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await apiCall('/felhasznalo/csoportjai');
      setGroups(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (e) {
      setError(e.message || 'Hiba a csoportok betöltésekor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGroups(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      setCreating(true);
      await apiCall('/csoport/create', 'POST', { megnevezes: newGroupName.trim() });
      setNewGroupName('');
      setShowModal(false);
      loadGroups();
    } catch (e) {
      setError(e.message || 'Hiba a csoport létrehozásakor');
    } finally {
      setCreating(false);
    }
  };

  const roleLabel = (level) => {
    if (level >= 3) return 'Admin';
    if (level === 2) return 'Moderátor';
    return 'Tag';
  };

  const roleBadge = (level) => {
    if (level >= 3) return 'badge-danger';
    if (level === 2) return 'badge-warning';
    return 'badge-primary';
  };

  return (
    <div className="groups-page">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Csoportok</h1>
            <p className="page-subtitle">Bevásárlócsoportjaid kezelése és áttekintése</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Új csoport
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
            <button className="alert-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Csoportok betöltése...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>Még nincsenek csoportjaid</h3>
            <p>Hozz létre egy új csoportot, és hívj meg barátokat!</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Új csoport létrehozása</button>
          </div>
        ) : (
          <div className="gp-grid">
            {groups.map(group => (
              <div
                key={group.id}
                className="gp-card"
                onClick={() => navigate(`/csoport/${group.id}`)}
              >
                <div className="gp-card-avatar">
                  {(group.megnevezes || group.Megnevezes || 'G').charAt(0).toUpperCase()}
                </div>
                <div className="gp-card-body">
                  <div className="gp-card-name">
                    {group.megnevezes || group.Megnevezes || 'Névtelen csoport'}
                  </div>
                  {group.jogosultsag_szint !== undefined && (
                    <span className={`badge ${roleBadge(group.jogosultsag_szint)}`}>
                      {roleLabel(group.jogosultsag_szint)}
                    </span>
                  )}
                  {group.tagsagok_count !== undefined && (
                    <div className="gp-card-meta">{group.tagsagok_count} tag</div>
                  )}
                </div>
                <div className="gp-card-arrow">›</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Új csoport létrehozása</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group>
              <Form.Label>Csoport neve *</Form.Label>
              <Form.Control
                type="text"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                placeholder="pl. Családi vásárlás"
                autoFocus
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Mégse</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>
            {creating ? 'Létrehozás...' : 'Létrehozás'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
