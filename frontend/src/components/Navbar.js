import React, { useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavigationBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🌾 SevaGram
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/services">
              Services
            </Nav.Link>
            {user ? (
              <>
                {/* ADD THIS SECTION - Provider Dashboard Link */}
                {user?.role === "provider" && (
                  <Nav.Link as={Link} to="/provider-dashboard">
                    Provider Dashboard
                  </Nav.Link>
                )}
                {user?.role === "admin" && (
                  <Nav.Link as={Link} to="/admin">
                    Admin Panel
                  </Nav.Link>
                )}
                {/* END OF ADDED SECTION */}

                {/* Customer-specific links */}
                {user?.role === "customer" && (
                  <Nav.Link as={Link} to="/my-bookings">
                    My Bookings
                  </Nav.Link>
                )}

                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
