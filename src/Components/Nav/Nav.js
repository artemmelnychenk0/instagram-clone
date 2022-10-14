import { Link } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { auth } from "../Data/firebase-config";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

const Navigation = () => {

    const [userSigned, setUserSigned] = useState(true)

    useEffect(() => {
        onAuthStateChange()
    }, [])

    const singOutUser = () => {
        signOut(auth)
            .then(() => {
                setUserSigned(true)
            })
    }

    const onAuthStateChange = () => {
        return auth.onAuthStateChanged(user => {
            if (user) {

                setUserSigned(false)

            } else {

                setUserSigned(true)
            }
        })
    }

    return (
        <Navbar sticky="top" bg="dark" variant="dark" >
            <Container>
                <Navbar.Brand bsPrefix="logo">StarLight</Navbar.Brand>
                <Nav className="justify-content-center">
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <Link to="/home" className="nav-link">Home</Link>
                    {userSigned &&
                        <Link to="/signUp" className="nav-link">SignUp</Link>
                    }
                    {!userSigned &&
                        <Link to="/home" className="nav-link" onClick={singOutUser}>SignOut</Link>
                    }
                </Nav>
            </Container>
        </Navbar>
    )
}
export default Navigation

