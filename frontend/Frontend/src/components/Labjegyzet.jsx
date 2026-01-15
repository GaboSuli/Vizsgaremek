import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Labjegyzet.css';
    
function Labjegyzet() {
    return (
        <Container className="mt-4 labjegyzet">
            <Row>
                <Col>
                    <p>Készítette: Belizyk Gábor, Papp Ákos, Németh Zalán Bars © 2026 Minden jog fenntartva.</p>
                </Col>
            </Row>
        </Container>
    );
}
export default Labjegyzet;