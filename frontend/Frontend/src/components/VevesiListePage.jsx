import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { getAllVevesiListak, getVevesiListaById } from '../services/vevesiListaService';
import './VevesiListePage.css';

export default function VevesiListePage() {
  const [listaky, setListaky] = useState([]);
  const [selectedLista, setSelectedLista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadListaky();
  }, []);

  const loadListaky = async () => {
    try {
      setLoading(true);
      const result = await getAllVevesiListak();
      
      if (result.success) {
        setListaky(result.data);
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

  const handleSelectLista = async (id) => {
    try {
      const result = await getVevesiListaById(id);
      if (result.success) {
        setSelectedLista(result.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setSelectedLista(null);
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Betöltés...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <div className="vevesi-lista-page">
      <div className="lista-hero">
        <Container>
          <div className="hero-content">
            <h1 className="hero-title">Bevásárlólisták</h1>
            <p className="hero-subtitle">Kezeld és nyomon kövesd a bevásárlólistáidat</p>
          </div>
        </Container>
      </div>

      <Container className="lista-content">
        {error && (
          <Alert variant="danger" className="mt-4">
            <Alert.Heading>Hiba!</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        {selectedLista ? (
          <Row className="mt-4">
            <Col>
              <Card className="lista-detail-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">{selectedLista.nev}</h3>
                    <small className="text-muted">
                      {new Date(selectedLista.letrehozas).toLocaleDateString('hu-HU')} • {selectedLista.felhasznalo}
                    </small>
                  </div>
                  <Button variant="outline-secondary" onClick={handleClose}>Vissza</Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Termék</th>
                        <th className="text-center">Mennyiség</th>
                        <th className="text-end">Egységár</th>
                        <th className="text-end">Összesen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLista.tetelek.map((tetel, index) => (
                        <tr key={index}>
                          <td>{tetel.Nev}</td>
                          <td className="text-center">
                            {tetel.Mennyiseg} {tetel.Egyseg}
                          </td>
                          <td className="text-end">{tetel.Ar.toLocaleString()} Ft</td>
                          <td className="text-end font-weight-bold">
                            {(tetel.Ar * tetel.Mennyiseg).toLocaleString()} Ft
                          </td>
                        </tr>
                      ))}
                      <tr className="table-summary">
                        <td colSpan="3" className="text-end font-weight-bold">Összesen:</td>
                        <td className="text-end font-weight-bold text-primary" style={{ fontSize: '1.1rem' }}>
                          {selectedLista.osszesen.toLocaleString()} Ft
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row className="mt-4">
            {listaky.length > 0 ? (
              listaky.map((lista) => (
                <Col lg={4} md={6} sm={12} key={lista.id} className="mb-4">
                  <Card className="lista-card h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title">{lista.nev}</h5>
                        <Badge bg="info">{lista.darab} tétel</Badge>
                      </div>
                      
                      <small className="text-muted d-block mb-1">
                        {new Date(lista.letrehozas).toLocaleDateString('hu-HU')}
                      </small>
                      <small className="text-muted d-block mb-3">
                        👤 {lista.felhasznalo}
                      </small>

                      <div className="lista-footer">
                        <div className="lista-total">
                          <span className="total-label">Összesen:</span>
                          <span className="total-amount">{lista.osszesen.toLocaleString()} Ft</span>
                        </div>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="w-100 mt-2"
                          onClick={() => handleSelectLista(lista.id)}
                        >
                          Megtekintés
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <Alert variant="info">
                  <Alert.Heading>Nincs bevásárlólista</Alert.Heading>
                  <p>Jelenleg nincsenek bevásárlólistáid. Hozz létre egy újat!</p>
                </Alert>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
}
