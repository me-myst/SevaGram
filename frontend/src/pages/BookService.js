import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    village: user?.address?.village || "",
    district: user?.address?.district || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    landmark: "",
    problemDescription: "",
    paymentMethod: "Cash",
  });

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/services/${serviceId}`);
      setService(response.data.service);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch service details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    // Validation
    if (!formData.scheduledDate || !formData.scheduledTime) {
      setError("Please select date and time for service");
      setSubmitting(false);
      return;
    }

    if (!formData.problemDescription) {
      setError("Please describe your problem");
      setSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        serviceId: service._id,
        providerId: "000000000000000000000000", // Placeholder - will be assigned by admin
        serviceCategory: service.category,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        address: {
          village: formData.village,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
        problemDescription: formData.problemDescription,
        estimatedPrice: service.basePrice,
        paymentMethod: formData.paymentMethod,
      };

      const response = await API.post("/bookings", bookingData);

      setSuccess("Booking created successfully! Redirecting to dashboard...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading service details...</p>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Service not found</Alert>
        <Button variant="success" onClick={() => navigate("/services")}>
          Back to Services
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Book Service</h2>

      <Row>
        {/* Service Details */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-3">
                <div style={{ fontSize: "4rem" }}>{service.icon || "📦"}</div>
              </div>
              <h4>{service.name}</h4>
              <p className="text-muted">{service.category}</p>
              <hr />
              <p>{service.description}</p>
              <hr />
              <p>
                <strong>Base Price:</strong> ₹{service.basePrice}
              </p>
              <p>
                <strong>Duration:</strong> {service.duration}
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Booking Form */}
        <Col md={8}>
          <Card>
            <Card.Body>
              <h4 className="mb-4">Booking Details</h4>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Schedule Date & Time */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Scheduled Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Scheduled Time *</Form.Label>
                      <Form.Control
                        type="time"
                        name="scheduledTime"
                        value={formData.scheduledTime}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr />
                <h5 className="mb-3">Service Address</h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Village *</Form.Label>
                      <Form.Control
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>District *</Form.Label>
                      <Form.Control
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pincode *</Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength="6"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Landmark (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Near school, temple, etc."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Problem Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="problemDescription"
                    value={formData.problemDescription}
                    onChange={handleChange}
                    placeholder="Describe your problem in detail..."
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Method *</Form.Label>
                  <Form.Select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Wallet">Wallet</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={submitting}
                    className="flex-grow-1"
                  >
                    {submitting ? "Booking..." : "Confirm Booking"}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/services")}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookService;
