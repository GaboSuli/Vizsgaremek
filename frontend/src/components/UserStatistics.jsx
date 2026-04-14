import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api.js';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import './UserStatistics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export default function UserStatistics() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const budgetPercentage = userData && userData.totalBudget ? (userData.spentBudget / userData.totalBudget * 100).toFixed(1) : 0;
  const remainingBudget = userData && userData.totalBudget ? userData.totalBudget - userData.spentBudget : 0;
  const savingsPercentage = userData && userData.spentBudget ? (userData.savedAmount / userData.spentBudget * 100).toFixed(1) : 0;

  // Budget Chart Data
  const budgetChartData = userData ? {
    labels: ['Felhasznált', 'Maradék'],
    datasets: [
      {
        label: 'Költségvetés (Ft)',
        data: [userData.spentBudget, remainingBudget],
        backgroundColor: ['rgb(220, 53, 69)', 'rgb(40, 167, 69)'],
        borderColor: ['rgba(220, 53, 69, 0.8)', 'rgba(40, 167, 69, 0.8)'],
        borderWidth: 2
      }
    ]
  } : { labels: [], datasets: [] };

  // Activity Chart Data
  const activityChartData = userData ? {
    labels: ['Bevásárlólista', 'Csoportok', 'Felhasznált kuponok', 'Elérhető kuponok', 'Követett termékek'],
    datasets: [
      {
        label: 'Aktivitás',
        data: [
          userData.shoppingLists,
          userData.activeGroups,
          userData.couponsUsed,
          userData.couponsAvailable,
          userData.productTracked
        ],
        backgroundColor: [
          'rgb(13, 110, 253)',
          'rgb(111, 66, 193)',
          'rgb(255, 193, 7)',
          'rgb(23, 162, 184)',
          'rgb(255, 107, 107)'
        ],
        borderColor: [
          'rgba(13, 110, 253, 0.8)',
          'rgba(111, 66, 193, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(23, 162, 184, 0.8)',
          'rgba(255, 107, 107, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  } : { labels: [], datasets: [] };
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      const resp = await apiCall('/felhasznalo');
      if (resp.success && resp.data) {
        // Map backend fields to expected frontend fields if needed
        setUserData({
          name: resp.data.Nev || resp.data.name || '',
          email: resp.data.Email || resp.data.email || '',
          joinDate: resp.data.created_at || resp.data.joinDate || '',
          totalBudget: resp.data.totalBudget || 0,
          spentBudget: resp.data.spentBudget || 0,
          shoppingLists: resp.data.shoppingLists || 0,
          activeGroups: resp.data.activeGroups || 0,
          couponsUsed: resp.data.couponsUsed || 0,
          couponsAvailable: resp.data.couponsAvailable || 0,
          productTracked: resp.data.productTracked || 0,
          savedAmount: resp.data.savedAmount || 0
        });
      } else {
        setError('Nem sikerült betölteni a felhasználói adatokat.');
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="user-statistics-loading">Betöltés...</div>;
  }
  if (error) {
    return <div className="user-statistics-error">{error}</div>;
  }
  if (!userData) {
    return null;
  }
  return (
    <Container className="user-statistics mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">Felhasználó Statisztikái</h1>
        </Col>
      </Row>
      {/* User Info Card */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="user-info-card">
            <Card.Body>
              <Row>
                <Col lg={6}>
                  <h3 className="user-name">{userData.name}</h3>
                  <p className="user-email">{userData.email}</p>
                  <small className="text-muted">
                    Csatlakozás: {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString('hu-HU') : ''}
                  </small>
                </Col>
                <Col lg={6} className="text-lg-end text-start mt-3 mt-lg-0">
                  <div className="user-stats-quick">
                    <div className="quick-stat">
                      <span className="quick-value">{userData.shoppingLists}</span>
                      <span className="quick-label">Bevásárlólista</span>
                    </div>
                    <div className="quick-stat">
                      <span className="quick-value">{userData.activeGroups}</span>
                      <span className="quick-label">Aktív csoport</span>
                    </div>
                    <div className="quick-stat">
                      <span className="quick-value">{userData.couponsUsed}</span>
                      <span className="quick-label">Felhasznált kupon</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Budget Overview */}
      <Row className="mb-4">
        <Col lg={6}>
          <Card className="stat-card">
            <Card.Body>
              <h5 className="card-subtitle mb-3">Költségvetés</h5>
              <div className="budget-overview">
                <div className="budget-item">
                  <span className="budget-label">Összes költségvetés</span>
                  <span className="budget-amount text-primary">
                    {userData.totalBudget.toLocaleString()} Ft
                  </span>
                </div>
                <div className="budget-item">
                  <span className="budget-label">Felhasznált</span>
                  <span className="budget-amount text-danger">
                    {userData.spentBudget.toLocaleString()} Ft ({budgetPercentage}%)
                  </span>
                </div>
                <div className="budget-item">
                  <span className="budget-label">Maradék</span>
                  <span className="budget-amount text-success">
                    {remainingBudget.toLocaleString()} Ft
                  </span>
                </div>
              </div>
              <div className="progress mt-3">
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: `${budgetPercentage}%` }}
                  aria-valuenow={budgetPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="stat-card">
            <Card.Body>
              <h5 className="card-subtitle mb-3">Megtakarítások</h5>
              <div className="savings-overview">
                <div className="savings-item">
                  <span className="savings-label">Megtakarított összeg</span>
                  <span className="savings-amount text-success">
                    {userData.savedAmount.toLocaleString()} Ft
                  </span>
                </div>
                <div className="savings-item">
                  <span className="savings-label">Megtakarítási arány</span>
                  <span className="savings-percentage">
                    {savingsPercentage}%
                  </span>
                </div>
                <div className="savings-item">
                  <span className="savings-label">Kuponok felhasználva</span>
                  <span className="savings-coupons">
                    {userData.couponsUsed} / {userData.couponsUsed + userData.couponsAvailable}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Charts */}
      <Row className="mb-4">
        <Col lg={6}>
          <Card className="chart-card">
            <Card.Header>
              <h5 className="mb-0">Költségvetés megoszlása</h5>
            </Card.Header>
            <Card.Body>
              <Pie
                data={budgetChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="chart-card">
            <Card.Header>
              <h5 className="mb-0">Aktivitás áttekintés</h5>
            </Card.Header>
            <Card.Body>
              <Bar
                data={activityChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Statistics Grid */}
      <Row>
        <Col lg={3} sm={6} className="mb-3">
          <Card className="stat-box">
            <Card.Body className="text-center">
              <div className="stat-icon">📋</div>
              <h6 className="stat-title">Bevásárlólista</h6>
              <h3 className="stat-value">{userData.shoppingLists}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} sm={6} className="mb-3">
          <Card className="stat-box">
            <Card.Body className="text-center">
              <div className="stat-icon">👥</div>
              <h6 className="stat-title">Csoportok</h6>
              <h3 className="stat-value">{userData.activeGroups}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} sm={6} className="mb-3">
          <Card className="stat-box">
            <Card.Body className="text-center">
              <div className="stat-icon">🎟️</div>
              <h6 className="stat-title">Kuponok</h6>
              <h3 className="stat-value">{userData.couponsUsed + userData.couponsAvailable}</h3>
              <small className="text-muted">{userData.couponsAvailable} elérhető</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} sm={6} className="mb-3">
          <Card className="stat-box">
            <Card.Body className="text-center">
              <div className="stat-icon">📊</div>
              <h6 className="stat-title">Követett termék</h6>
              <h3 className="stat-value">{userData.productTracked}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
