import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Agriculture Equipment",
    "Appliance Repair",
    "Pest Control",
    "Cleaning",
    "Painting",
    "Water Pump Service",
    "Solar Panel Maintenance",
  ];

  const categoryIcons = {
    Plumbing: "🔧",
    Electrical: "⚡",
    Carpentry: "🪚",
    "Agriculture Equipment": "🚜",
    "Appliance Repair": "🔨",
    "Pest Control": "🦟",
    Cleaning: "🧹",
    Painting: "🎨",
    "Water Pump Service": "💧",
    "Solar Panel Maintenance": "☀️",
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchQuery, selectedCategory, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await API.get("/services");
      setServices(response.data.services);
      setFilteredServices(response.data.services);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch services. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const handleBookNow = (serviceId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book a service");
      navigate("/login");
      return;
    }
    navigate(`/book-service/${serviceId}`);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading services...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Available Services</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
          />
        </Col>
      </Row>

      {/* Category Filter */}
      <div className="mb-4">
        <h5>Filter by Category:</h5>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                selectedCategory === category ? "success" : "outline-success"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Alert variant="info">
          No services found. Try adjusting your search or filters.
        </Alert>
      ) : (
        <Row>
          {filteredServices.map((service) => (
            <Col md={4} key={service._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="text-center mb-3">
                    <div style={{ fontSize: "3rem" }}>
                      {categoryIcons[service.category] || "📦"}
                    </div>
                  </div>
                  <Card.Title>{service.name}</Card.Title>
                  <Badge bg="secondary" className="mb-2 w-50">
                    {service.category}
                  </Badge>
                  <Card.Text className="flex-grow-1">
                    {service.description}
                  </Card.Text>
                  <div className="mb-3">
                    <strong>Base Price:</strong> ₹{service.basePrice}
                    <br />
                    <strong>Duration:</strong> {service.duration}
                  </div>
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={() => handleBookNow(service._id)}
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Services;
