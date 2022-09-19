import { Link } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navigation = () => {
    return (
        <Navbar sticky="top" bg="dark" variant="dark" >
            <Container>
                <Navbar.Brand bsPrefix="logo">StarLight</Navbar.Brand>
                <Nav className="justify-content-center">
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <Link to="/home" className="nav-link">Home</Link>
                    <Link to="/signUp" className="nav-link">SignUp</Link>
                </Nav>
            </Container>
        </Navbar>
    )
}
export default Navigation

