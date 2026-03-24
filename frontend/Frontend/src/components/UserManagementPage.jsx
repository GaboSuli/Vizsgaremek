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
    <div className="um-page">
      <div className="page-container" style={{maxWidth: 720}}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Fiók beállítások</h1>
            <p className="page-subtitle">Profilod kezelése és adatok lekérdezése</p>
          </div>
        </div>

        <div className="tabs" style={{marginBottom:'1.5rem'}}>
          <button className={`tab-item${activeTab === 'profile' ? ' active' : ''}`} onClick={() => setActiveTab('profile')}>Profilom</button>
          <button className={`tab-item${activeTab === 'update' ? ' active' : ''}`} onClick={() => setActiveTab('update')}>Módosítás</button>
          <button className={`tab-item${activeTab === 'query' ? ' active' : ''}`} onClick={() => setActiveTab('query')}>Lekérdezés</button>
          <button className={`tab-item${activeTab === 'delete' ? ' active' : ''}`} onClick={() => setActiveTab('delete')}>Fiók törlése</button>
        </div>

        {error && <div className="alert alert-danger" style={{marginBottom:'1rem'}}>{error}</div>}
        {success && <div className="alert alert-success" style={{marginBottom:'1rem'}}>{success}</div>}

        {activeTab === 'profile' && (
          <div className="card" style={{padding:'1.75rem'}}>
            <h2 style={{fontSize:'1.1rem', fontWeight:700, marginBottom:'1.25rem', color:'var(--clr-text)'}}>Saját profil adatok</h2>
            {loading ? (
              <div className="loading-state"><div className="spinner"></div><p>Betöltés...</p></div>
            ) : userData ? (
              <div style={{display:'flex', flexDirection:'column', gap:'0.9rem'}}>
                {[
                  {label:'Név', value: userData.nev},
                  {label:'Becenév', value: userData.becenev},
                  {label:'Email', value: userData.email},
                  {label:'Profilkép URL', value: userData.profilkep_url || 'user.png'},
                ].map(({label, value}) => (
                  <div key={label} className="um-profile-row">
                    <span className="um-label">{label}</span>
                    <span className="um-value">{value || <span style={{color:'var(--clr-text-muted)'}}>Nincs megadva</span>}</span>
                  </div>
                ))}
              </div>
            ) : <p style={{color:'var(--clr-text-muted)'}}>Nincs elérhető adat</p>}
          </div>
        )}

        {activeTab === 'update' && (
          <div className="card" style={{padding:'1.75rem'}}>
            <h2 style={{fontSize:'1.1rem', fontWeight:700, marginBottom:'1.25rem', color:'var(--clr-text)'}}>Adatok módosítása</h2>
            <form onSubmit={handleUpdate} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
              {[
                {field:'nev', label:'Név', type:'text', required:true},
                {field:'becenev', label:'Becenév', type:'text'},
                {field:'email', label:'Email', type:'email', required:true},
                {field:'profilkep_url', label:'Profilkép URL', type:'text'},
              ].map(({field, label, type, required}) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label} {required && '*'}</label>
                  <input
                    className="form-control"
                    type={type}
                    name={field}
                    value={updateForm[field]}
                    onChange={handleUpdateFormChange}
                    disabled={loading}
                    required={required}
                  />
                </div>
              ))}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{alignSelf:'flex-start'}}>
                {loading ? 'Módosítás...' : 'Mentés'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'query' && (
          <div className="card" style={{padding:'1.75rem'}}>
            <h2 style={{fontSize:'1.1rem', fontWeight:700, marginBottom:'1.25rem', color:'var(--clr-text)'}}>Felhasználó lekérdezése</h2>
            <div style={{display:'flex', gap:'0.75rem', alignItems:'flex-end', marginBottom:'1.25rem'}}>
              <div className="form-group" style={{flex:1}}>
                <label className="form-label">Felhasználó azonosítója</label>
                <input
                  className="form-control"
                  type="text"
                  value={queryId}
                  onChange={e => setQueryId(e.target.value)}
                  placeholder="pl. 42"
                  disabled={loading}
                />
              </div>
              <button className="btn btn-primary" onClick={handleQuery} disabled={loading}>
                {loading ? 'Keresés...' : 'Lekérdezés'}
              </button>
            </div>
            {queryResult && (
              <div style={{display:'flex', flexDirection:'column', gap:'0.9rem'}}>
                {[
                  {label:'Név', value: queryResult.Nev},
                  {label:'Becenév', value: queryResult.Becenev},
                  {label:'Profilkép URL', value: queryResult.ProfilKepURL},
                ].map(({label, value}) => (
                  <div key={label} className="um-profile-row">
                    <span className="um-label">{label}</span>
                    <span className="um-value">{value || <span style={{color:'var(--clr-text-muted)'}}>Nincs megadva</span>}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'delete' && (
          <div className="card" style={{padding:'1.75rem', borderColor:'var(--clr-danger)'}}>
            <h2 style={{fontSize:'1.1rem', fontWeight:700, marginBottom:'1rem', color:'var(--clr-danger)'}}>Fiók törlése</h2>
            <div className="alert alert-danger" style={{marginBottom:'1.25rem'}}>
              ⚠️ A fiók törlése végleges. Az összes adatod elveszik, és nem lehet visszaállítani.
            </div>
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? 'Törlés...' : 'Fiók törlése'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}