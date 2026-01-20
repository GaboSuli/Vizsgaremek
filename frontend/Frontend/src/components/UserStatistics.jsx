import React, { useState, useEffect } from 'react';
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
  const [userData, setUserData] = useState({
    name: 'Kovács János',
    email: 'kovacs.janos@example.com',
    joinDate: '2024-06-15',
    totalBudget: 850000,
    spentBudget: 542000,
    shoppingLists: 24,
    activeGroups: 5,
    couponsUsed: 12,
    couponsAvailable: 8,
    productTracked: 47,
    savedAmount: 125000
  });

  const [loading, setLoading] = useState(false);

  const budgetPercentage = (userData.spentBudget / userData.totalBudget * 100).toFixed(1);
  const remainingBudget = userData.totalBudget - userData.spentBudget;
  const savingsPercentage = (userData.savedAmount / userData.spentBudget * 100).toFixed(1);

  // Budget Chart Data
  const budgetChartData = {
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
  };

  // Activity Chart Data
  const activityChartData = {
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
  };

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
                    Csatlakozás: {new Date(userData.joinDate).toLocaleDateString('hu-HU')}
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
