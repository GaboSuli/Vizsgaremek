import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Form, Button } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getAllAlkategoriasStats, searchAlkategorias } from '../services/statisticsService';
import './AllAlkategoriasStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const AllAlkategoriasStats = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartType, setChartType] = useState('bar'); // 'bar' vagy 'pie'

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await getAllAlkategoriasStats();

        if (result.success) {
          setAllData(result.data);
          setFilteredData(result.data);
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

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredData(allData);
    } else {
      const results = await searchAlkategorias(term);
      setFilteredData(results);
    }
  };

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
    <Container className="all-alkategorias-stats mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Összes Alkategória Átlagára</h2>
        </Col>
      </Row>

      {statistics && (
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <small className="text-muted">Alkategóriák száma</small>
                <h5>{statistics.totalCategories}</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <small className="text-muted">Legalacsonyabb ár</small>
                <h5>{statistics.minPrice.toLocaleString()} Ft</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <small className="text-muted">Legmagasabb ár</small>
                <h5>{statistics.maxPrice.toLocaleString()} Ft</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <small className="text-muted">Átlagár (Összes)</small>
                <h5>{statistics.averagePrice.toLocaleString()} Ft</h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Keresés</Form.Label>
            <Form.Control
              type="text"
              placeholder="Alkategória neve vagy ID-ja..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Diagram típusa</Form.Label>
            <div>
              <Button
                variant={chartType === 'bar' ? 'primary' : 'outline-primary'}
                size="sm"
                className="me-2"
                onClick={() => setChartType('bar')}
              >
                Oszlop
              </Button>
              <Button
                variant={chartType === 'pie' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setChartType('pie')}
              >
                Kördiagram
              </Button>
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="chart-card">
            <Card.Body>
              {chartData && (
                chartType === 'bar' ? (
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      indexAxis: 'y',
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top'
                        },
                        title: {
                          display: true,
                          text: 'Alkategóriák Átlagára'
                        }
                      },
                      scales: {
                        x: {
                          ticks: {
                            callback: function(value) {
                              return value.toLocaleString() + ' Ft';
                            }
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <Pie
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'right'
                        },
                        title: {
                          display: true,
                          text: 'Alkategóriák Átlagára'
                        }
                      }
                    }}
                  />
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Alkategóriák Listája ({filteredData.length})</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Megnevezés</th>
                      <th>Átlagár (Ft)</th>
                      <th>Mérték egység</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr key={item.id}>
                          <td><code>{item.id}</code></td>
                          <td>{item.megnevezes}</td>
                          <td className="text-end">{item.atlagAr.toLocaleString()}</td>
                          <td>{item.mertekegyseg}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          Nincs találat
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AllAlkategoriasStats;
