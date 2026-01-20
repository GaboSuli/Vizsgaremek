import { Navbar, Nav, Container, Badge } from 'react-bootstrap'
import './NavBar.css'

function Navigation({ onNavigate }) {
    return (
        <Navbar bg="white" expand="lg" sticky="top" className="navbar-custom">
            <Container>
                <Navbar.Brand href="#home" onClick={() => onNavigate && onNavigate('home')} className="navbar-brand">
                    💰 BudgetApp
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#home" onClick={() => onNavigate && onNavigate('home')} className="nav-link-custom">
                            Főoldal
                        </Nav.Link>
                        <Nav.Link href="#lista" onClick={() => onNavigate && onNavigate('lista')} className="nav-link-custom">
                            Bevásárlás
                        </Nav.Link>
                        <Nav.Link href="#stats" onClick={() => onNavigate && onNavigate('stats')} className="nav-link-custom">
                            Statisztika
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation
