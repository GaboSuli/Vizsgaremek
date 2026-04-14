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

const DEFAULT_STATS = {
  min: null,
  max: null,
  average: null,
  current: null
};

const EMPTY_CHART = {
  labels: [],
  datasets: []
};

export const AlkategoriaMonthlyStats = () => {
  const [chartData, setChartData] = useState(EMPTY_CHART);
  const [statistics, setStatistics] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await getAlkategoriaMonthlyStats();
        if (result.success) {
          setChartData(result.chartData ?? EMPTY_CHART);
          setStatistics(result.statistics ?? DEFAULT_STATS);
          setError(null);
        } else {
          setError(result.error || 'Hiba az adatok betöltésekor');
          setChartData(EMPTY_CHART);
          setStatistics(DEFAULT_STATS);
        }
      } catch {
        setError('Ismeretlen hiba');
        setChartData(EMPTY_CHART);
        setStatistics(DEFAULT_STATS);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Betöltés...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="alkategoria-monthly-stats mt-4">
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">
              <Alert.Heading>Hiba!</Alert.Heading>
              <p>{error}</p>
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col>
          <h2>Alkategória Havi Átlagár-Változás</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        {['min', 'max', 'average', 'current'].map((key) => (
          <Col key={key} md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <small className="text-muted">
                  {key === 'min'
                    ? 'Minimális ár'
                    : key === 'max'
                    ? 'Maximális ár'
                    : key === 'average'
                    ? 'Átlagár'
                    : 'Jelenlegi ár'}
                </small>
                <h5>
                  {statistics?.[key] != null
                    ? statistics[key].toLocaleString()
                    : '–'}{' '}
                  Ft
                </h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col>
          <Card className="chart-card">
            <Card.Body>
              <Line
                data={chartData ?? EMPTY_CHART}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: true, text: 'Havi Átlagár-Változás' }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: (value) =>
                          value != null ? value.toLocaleString() + ' Ft' : ''
                      }
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AlkategoriaMonthlyStats;