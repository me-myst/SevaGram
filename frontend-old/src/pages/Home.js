import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  const services = [
    { icon: "🔧", name: "Plumbing", desc: "Fix leaks & install pipes" },
    { icon: "⚡", name: "Electrical", desc: "Wiring & repairs" },
    { icon: "🪚", name: "Carpentry", desc: "Furniture & woodwork" },
    { icon: "🚜", name: "Agriculture", desc: "Equipment repair" },
    { icon: "🧹", name: "Cleaning", desc: "Home cleaning services" },
    { icon: "🎨", name: "Painting", desc: "Interior & exterior" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-success text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-4">Welcome to SevaGram</h1>
              <p className="lead mb-4">
                Connecting rural communities with trusted home service
                providers. Quality services at your doorstep!
              </p>
              <Link to="/services">
                <Button variant="light" size="lg" className="me-3">
                  Browse Services
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline-light" size="lg">
                  Join as Provider
                </Button>
              </Link>
            </Col>
            <Col md={6}>
              <img
                src="https://via.placeholder.com/500x400?text=Rural+Services"
                alt="Rural Services"
                className="img-fluid rounded"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Services Section */}
      <Container className="my-5">
        <h2 className="text-center mb-5">Our Services</h2>
        <Row>
          {services.map((service, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="h-100 text-center shadow-sm">
                <Card.Body>
                  <div style={{ fontSize: "3rem" }}>{service.icon}</div>
                  <Card.Title className="mt-3">{service.name}</Card.Title>
                  <Card.Text>{service.desc}</Card.Text>
                  <Button variant="success" size="sm">
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Features Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">Why Choose SevaGram?</h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div style={{ fontSize: "3rem" }}>✅</div>
              <h4 className="mt-3">Verified Providers</h4>
              <p>All service providers are background checked</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div style={{ fontSize: "3rem" }}>💰</div>
              <h4 className="mt-3">Affordable Pricing</h4>
              <p>Transparent pricing with no hidden charges</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div style={{ fontSize: "3rem" }}>⭐</div>
              <h4 className="mt-3">Quality Service</h4>
              <p>Rated and reviewed by customers like you</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
