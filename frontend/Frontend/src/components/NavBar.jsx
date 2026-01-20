import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navigation({ onNavigate }) {
    return(
        <Navbar bg="info" variant="dark" id="navbar" sticky="top">
            <Container>
                <Navbar.Brand href="#home" onClick={() => onNavigate && onNavigate('home')}>VevesBazar</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#home" onClick={() => onNavigate && onNavigate('home')}>Főoldal</Nav.Link>
                    <Nav.Link href="#statisztika" onClick={() => onNavigate && onNavigate('stats')}>Statisztika</Nav.Link>
                    <Nav.Link href="#koltsegvetes">Költségvetés</Nav.Link>
                    <Nav.Link href="#atterkovetes">Átlagos termék árkövetés</Nav.Link>
                    <Nav.Link href="#piac-kovetes">Piac követés</Nav.Link>
                    <Nav.Link href="#csoportletrehozasa">Csoport létrehozás</Nav.Link>
                    <Nav.Link href="#beallitasok">Beállítások</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}
export default Navigation;
