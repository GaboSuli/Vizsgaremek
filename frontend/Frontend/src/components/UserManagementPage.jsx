import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser, deleteUser, getUserById } from '../services/authService.js';
import useAuth from '../context/useAuth.js';
import './UserManagementPage.css';

export default function UserManagementPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);
  const [queryId, setQueryId] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    nev: '',
    becenev: '',
    email: '',
    profilkep_url: ''
  });

  useEffect(() => {
    // initialize from context or fetch if needed
    if (auth.user) {
      setUserData(auth.user);
      setUpdateForm({
        nev: auth.user.nev || auth.user.name || '',
        becenev: auth.user.becenev || '',
        email: auth.user.email || '',
        profilkep_url: auth.user.profilkep_url || ''
      });
    }
  }, [auth.user]);

  // kept for backward compatibility but we now rely on auth.user
  const loadUserData = async () => {
    setLoading(true);
    setError('');
    try {
      if (auth.user) {
        setUserData(auth.user);
        setUpdateForm({
          nev: auth.user.nev || auth.user.name || '',
          becenev: auth.user.becenev || '',
          email: auth.user.email || '',
          profilkep_url: auth.user.profilkep_url || ''
        });
      }
    } catch {
      setError('Hiba történt az adatok betöltésekor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = auth.user?.id;
      if (!userId) {
        setError('Felhasználó azonosító nem található');
        return;
      }

      const response = await updateUser(userId, updateForm);
      if (response.success) {
        setSuccess('Felhasználó adatok sikeresen módosítva');
        setUserData(response.data);
        auth.refreshUser();
      } else {
        setError(response.message);
      }
    } catch {
      setError('Hiba történt a módosítás során');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem vonható vissza.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = auth.user?.id;
      if (!userId) {
        setError('Felhasználó azonosító nem található');
        return;
      }

      const response = await deleteUser(userId);
      if (response.success) {
        auth.logout();
        navigate('/', { replace: true });
      } else {
        setError(response.message);
      }
    } catch {
      setError('Hiba történt a törlés során');
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!queryId.trim()) {
      setError('Kérlek add meg a felhasználó azonosítóját');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setQueryResult(null);

    try {
      const response = await getUserById(queryId.trim());
      if (response.success) {
        setQueryResult(response.data);
        setSuccess('Felhasználó adatok sikeresen lekérdezve');
      } else {
        setError(response.message);
      }
    } catch {
      setError('Hiba történt a lekérdezés során');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="user-management-container">
      <div className="user-management-hero">
        <h1>👤 Felhasználó Kezelés</h1>
        <p>Fiókod kezelése és más felhasználók adatainak lekérdezése</p>
      </div>

      <div className="user-management-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          📋 Profilom
        </button>
        <button
          className={`tab-button ${activeTab === 'update' ? 'active' : ''}`}
          onClick={() => setActiveTab('update')}
        >
          ✏️ Módosítás
        </button>
        <button
          className={`tab-button ${activeTab === 'query' ? 'active' : ''}`}
          onClick={() => setActiveTab('query')}
        >
          🔍 Lekérdezés
        </button>
        <button
          className={`tab-button ${activeTab === 'delete' ? 'active' : ''}`}
          onClick={() => setActiveTab('delete')}
        >
          🗑️ Törlés
        </button>
      </div>

      <div className="user-management-content">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>Saját Profil Adatok</h2>
            {loading ? (
              <div className="loading">Betöltés...</div>
            ) : userData ? (
              <div className="profile-data">
                <div className="data-card">
                  <h3>Nyilvános Adatok</h3>
                  <div className="data-item">
                    <strong>Név:</strong> {userData.nev || 'Nincs megadva'}
                  </div>
                  <div className="data-item">
                    <strong>Becenév:</strong> {userData.becenev || 'Nincs megadva'}
                  </div>
                  <div className="data-item">
                    <strong>Profilkép URL:</strong> {userData.profilkep_url || 'user.png'}
                  </div>
                  <div className="data-item">
                    <strong>Email:</strong> {userData.email || 'Nincs megadva'}
                  </div>
                </div>
              </div>
            ) : (
              <p>Nincs elérhető adat</p>
            )}
          </div>
        )}

        {/* Update Tab */}
        {activeTab === 'update' && (
          <div className="tab-content">
            <h2>Adatok Módosítása</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Név</label>
                <input
                  type="text"
                  name="nev"
                  value={updateForm.nev}
                  onChange={handleUpdateFormChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Becenév</label>
                <input
                  type="text"
                  name="becenev"
                  value={updateForm.becenev}
                  onChange={handleUpdateFormChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={updateForm.email}
                  onChange={handleUpdateFormChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Profilkép URL</label>
                <input
                  type="text"
                  name="profilkep_url"
                  value={updateForm.profilkep_url}
                  onChange={handleUpdateFormChange}
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Módosítás...' : 'Módosítás'}
              </button>
            </form>
          </div>
        )}

        {/* Query Tab */}
        {activeTab === 'query' && (
          <div className="tab-content">
            <h2>Más Felhasználó Adatainak Lekérdezése</h2>
            <div className="query-section">
              <div className="form-group">
                <label>Felhasználó ID</label>
                <input
                  type="text"
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  placeholder="Add meg a felhasználó azonosítóját"
                  disabled={loading}
                />
              </div>
              <button onClick={handleQuery} className="btn-primary" disabled={loading}>
                {loading ? 'Lekérdezés...' : 'Lekérdezés'}
              </button>
            </div>
            {queryResult && (
              <div className="query-result">
                <h3>Lekérdezett Adatok</h3>
                <div className="data-card">
                  <div className="data-item">
                    <strong>Név:</strong> {queryResult.Nev}
                  </div>
                  <div className="data-item">
                    <strong>Becenév:</strong> {queryResult.Becenev}
                  </div>
                  <div className="data-item">
                    <strong>Profilkép URL:</strong> {queryResult.ProfilKepURL}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Tab */}
        {activeTab === 'delete' && (
          <div className="tab-content">
            <h2>Fiók Törlése</h2>
            <div className="delete-warning">
              <div className="warning-icon">⚠️</div>
              <h3>Vigyázat!</h3>
              <p>A fiók törlése végleges művelet. Az összes adatod elveszik, és nem lehet visszaállítani.</p>
              <p>Ez magában foglalja:</p>
              <ul>
                <li>Az összes személyes adatod</li>
                <li>Bevásárlólistáid</li>
                <li>Csoporttagságaid</li>
                <li>Kuponjaid</li>
              </ul>
              <button onClick={handleDelete} className="btn-danger" disabled={loading}>
                {loading ? 'Törlés...' : 'Fiók Törlése'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
