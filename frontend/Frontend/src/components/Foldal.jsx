import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Navigation from './NavBar.jsx';
import './Foldal.css';
import Labjegyzet from './Labjegyzet.jsx';

function Foldal() {
    return (
        <>

            <Container className="mt-4 landing-container">
                <Row className="align-items-center">
                    <Col md={8}>
                        <h1 className="display-5">Üdvözöljük az alkalmazásban</h1>
                        <p className="lead">Egyszerű eszköz bevásárlólisták, csoportos vásárlás, kuponkezelés és árstatisztikák kezelésére — banki tranzakciók nélkül.</p>
                        <p>Ez a felület bemutatja az alkalmazás célját és fő funkcióit, valamint irányít a rendszer fő részeihez.</p>
                        <div className="d-flex flex-wrap gap-2">
                            <Button href="#felhasznalok" variant="primary">Felhasználók</Button>
                            <Button href="#csoportok" variant="outline-primary">Csoportok</Button>
                            <Button href="#bevasarlo-listak" variant="outline-success">Bevásárlólisták</Button>
                        </div>
                    </Col>

                    <Col md={4} className="mt-3 mt-md-0">
                        <Card>
                            <Card.Body>
                                <Card.Title>Gyors áttekintés</Card.Title>
                                <Card.Text>
                                    Az alkalmazás segít a közösségi bevásárlás és árkövetés megszervezésében anélkül, hogy pénzügyi tranzakciókat kezelne.
                                </Card.Text>
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button href="#kuponok" variant="outline-secondary" size="sm">Kuponok</Button>
                                    <Button href="#statisztikak" variant="outline-secondary" size="sm">Statisztikák</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col md={6}>
                        <h2>Rólunk</h2>
                        <p>
                            Ez az alkalmazás bevásárlólisták, csoportos vásárlás, kuponkezelés és árstatisztikák kezelésére szolgál. A rendszer nem végez banki vagy pénzügyi tranzakciókat — kizárólag tájékoztató és szervező funkciókat biztosít.
                        </p>
                    </Col>

                    <Col md={6}>
                        <h2>Fő funkciók</h2>
                        <ul>
                            <li>Felhasználókezelés — profilok, jogosultságok és szerepek (információs jellegű).</li>
                            <li>Csoportkezelés — csoportok létrehozása, tagságok, megosztás.</li>
                            <li>Bevásárlólisták — listák készítése, megosztása és közös szerkesztése.</li>
                            <li>Kuponok — kuponok rögzítése és nyilvántartása (nem pénzügyi feldolgozás).</li>
                            <li>Statisztikák — ár- és vásárlási összefoglalók, trendek és átlagárak.</li>
                        </ul>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col>
                        <h3>Hova tovább?</h3>
                        <div className="d-flex flex-wrap gap-2">
                            <Button href="#felhasznalok" variant="secondary">Felhasználók</Button>
                            <Button href="#csoportok" variant="secondary">Csoportok</Button>
                            <Button href="#bevasarlo-listak" variant="secondary">Bevásárlólisták</Button>
                            <Button href="#kuponok" variant="secondary">Kuponok</Button>
                            <Button href="#statisztikak" variant="secondary">Statisztikák</Button>
                        </div>
                    </Col>
                </Row>

                <Row className="mt-4 mb-4">
                    <Col>
                        <small className="text-muted">Megjegyzés: ez a főoldal kizárólag tájékoztató és navigációs célokat szolgál; nem kezel érzékeny vagy felhasználóspecifikus adatokat.</small>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Labjegyzet />
            </Container>
        </>
    );
}

export default Foldal;