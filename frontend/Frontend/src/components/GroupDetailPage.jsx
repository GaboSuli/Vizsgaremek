import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiCall } from "../services/api";
import GroupMembersList from "./GroupMembersList";
import AddMemberForm from "./AddMemberForm";
import ShoppingList from "./ShoppingList";
import './GroupDetailPage.css';

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await apiCall(`/csoport/${id}/felhasznalok`);
      if (res.success) setMembers(res.data);
      else setError(res.message);
    } catch (e) {
      setError(e.message || "Hiba történt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Betöltés...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/groups')}>← Vissza a csoportokhoz</button>
      </div>
    );
  }

  return (
    <div className="gd-page">
      <div className="page-container">
        <div className="page-header">
          <div>
            <button className="btn btn-ghost gd-back" onClick={() => navigate('/groups')}>← Csoportok</button>
            <h1 className="page-title">Csoport részletei</h1>
          </div>
        </div>

        <div className="gd-grid">
          {/* Members panel */}
          <div className="card gd-panel">
            <div className="gd-panel-header">
              <span>👥</span>
              <h2>Tagok ({members.length})</h2>
            </div>
            <div className="gd-panel-body">
              <AddMemberForm csoportId={id} onSuccess={fetchMembers} />
              <GroupMembersList members={members} csoportId={id} onChange={fetchMembers} />
            </div>
          </div>

          {/* Shopping lists panel */}
          <div className="card gd-panel">
            <div className="gd-panel-header">
              <span>🛒</span>
              <h2>Bevásárlólisták</h2>
            </div>
            <div className="gd-panel-body">
              <ShoppingList csoportId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

