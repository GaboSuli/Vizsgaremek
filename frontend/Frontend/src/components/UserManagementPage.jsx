import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService.js';
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
    if (auth.user) {
      setUserData(auth.user);
      setUpdateForm({
        nev: auth.user.nev || auth.user.nev || '',
        becenev: auth.user.becenev || '',
        email: auth.user.email || '',
        profilkep_url: auth.user.profilkep_url || ''
      });
    }
  }, [auth.user]);

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

      const response = await authService.updateUser(userId, updateForm);
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
    if (!window.confirm('Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem vonható vissza.')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = auth.user?.id;
      if (!userId) {
        setError('Felhasználó azonosító nem található');
        return;
      }

      const response = await authService.deleteUser(userId);
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
      const response = await authService.getUserById(queryId.trim());
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
        <button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>📋 Profilom</button>
        <button className={`tab-button ${activeTab === 'update' ? 'active' : ''}`} onClick={() => setActiveTab('update')}>✏️ Módosítás</button>
        <button className={`tab-button ${activeTab === 'query' ? 'active' : ''}`} onClick={() => setActiveTab('query')}>🔍 Lekérdezés</button>
        <button className={`tab-button ${activeTab === 'delete' ? 'active' : ''}`} onClick={() => setActiveTab('delete')}>🗑️ Törlés</button>
      </div>

      <div className="user-management-content">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>Saját Profil Adatok</h2>
            {loading ? <div className="loading">Betöltés...</div> : (
              userData ? (
                <div className="profile-data">
                  <div className="data-card">
                    <div className="data-item"><strong>Név:</strong> {userData.nev || 'Nincs megadva'}</div>
                    <div className="data-item"><strong>Becenév:</strong> {userData.becenev || 'Nincs megadva'}</div>
                    <div className="data-item"><strong>Profilkép URL:</strong> {userData.profilkep_url || 'user.png'}</div>
                    <div className="data-item"><strong>Email:</strong> {userData.email || 'Nincs megadva'}</div>
                  </div>
                </div>
              ) : <p>Nincs elérhető adat</p>
            )}
          </div>
        )}

        {activeTab === 'update' && (
          <div className="tab-content">
            <h2>Adatok Módosítása</h2>
            <form onSubmit={handleUpdate}>
              {['nev','becenev','email','profilkep_url'].map((field) => (
                <div className="form-group" key={field}>
                  <label>{field === 'nev' ? 'Név' : field === 'becenev' ? 'Becenév' : field === 'email' ? 'Email' : 'Profilkép URL'}</label>
                  <input type={field==='email' ? 'email':'text'} name={field} value={updateForm[field]} onChange={handleUpdateFormChange} disabled={loading} required={field==='nev'||field==='email'} />
                </div>
              ))}
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Módosítás...' : 'Módosítás'}</button>
            </form>
          </div>
        )}

        {activeTab === 'query' && (
          <div className="tab-content">
            <h2>Más Felhasználó Adatainak Lekérdezése</h2>
            <div className="query-section">
              <div className="form-group">
                <label>Felhasználó ID</label>
                <input type="text" value={queryId} onChange={(e) => setQueryId(e.target.value)} placeholder="Add meg a felhasználó azonosítóját" disabled={loading} />
              </div>
              <button onClick={handleQuery} className="btn-primary" disabled={loading}>{loading ? 'Lekérdezés...' : 'Lekérdezés'}</button>
            </div>
            {queryResult && (
              <div className="query-result">
                <h3>Lekérdezett Adatok</h3>
                <div className="data-card">
                  <div className="data-item"><strong>Név:</strong> {queryResult.Nev}</div>
                  <div className="data-item"><strong>Becenév:</strong> {queryResult.Becenev}</div>
                  <div className="data-item"><strong>Profilkép URL:</strong> {queryResult.ProfilKepURL}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'delete' && (
          <div className="tab-content">
            <h2>Fiók Törlése</h2>
            <div className="delete-warning">
              <div className="warning-icon">⚠️</div>
              <p>A fiók törlése végleges művelet. Az összes adatod elveszik, és nem lehet visszaállítani.</p>
              <button onClick={handleDelete} className="btn-danger" disabled={loading}>{loading ? 'Törlés...' : 'Fiók Törlése'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}