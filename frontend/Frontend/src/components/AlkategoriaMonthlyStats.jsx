import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { getAlkategoriaMonthlyStats } from '../services/statisticsService';
import './AlkategoriaMonthlyStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AlkategoriaMonthlyStats = () => {
  const [chartData, setChartData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await getAlkategoriaMonthlyStats();
        
        if (result.success) {
          setChartData(result.chartData);
          setStatistics(result.statistics);
          setError(null);
        } else {
          setError(result.error || 'Hiba az adatok betöltésekor');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Betöltés...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Hiba!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="alkategoria-monthly-stats mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Alkategória Havi Átlagár-Változás</h2>
        </Col>
      </Row>

      {statistics && (
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <small className="text-muted">Minimális ár</small>
                <h5>{statistics.min.toLocaleString()} Ft</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <small className="text-muted">Maximális ár</small>
                <h5>{statistics.max.toLocaleString()} Ft</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <small className="text-muted">Átlagár</small>
                <h5>{statistics.average.toLocaleString()} Ft</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <small className="text-muted">Jelenlegi ár</small>
                <h5>{statistics.current.toLocaleString()} Ft</h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card className="chart-card">
            <Card.Body>
              {chartData && (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top'
                      },
                      title: {
                        display: true,
                        text: 'Havi Átlagár-Változás'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        ticks: {
                          callback: function(value) {
                            return value.toLocaleString() + ' Ft';
                          }
                        }
                      }
                    }
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AlkategoriaMonthlyStats;
