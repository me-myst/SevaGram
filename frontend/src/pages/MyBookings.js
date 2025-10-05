import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  Button,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await API.get("/bookings/my-bookings");
      setBookings(response.data.bookings);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Confirmed":
        return "info";
      case "In Progress":
        return "primary";
      case "Completed":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Paid":
        return "success";
      case "Refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading your bookings...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Bookings</h2>
        <Button variant="success" onClick={() => navigate("/services")}>
          Book New Service
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {bookings.length === 0 ? (
        <Alert variant="info">
          <h5>No bookings yet!</h5>
          <p>You haven't booked any services yet.</p>
          <Button variant="success" onClick={() => navigate("/services")}>
            Browse Services
          </Button>
        </Alert>
      ) : (
        <Row>
          {bookings.map((booking) => (
            <Col md={12} key={booking._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <h5>
                        {booking.serviceId?.name || "Service"}
                        <Badge
                          bg={getStatusVariant(booking.status)}
                          className="ms-3"
                        >
                          {booking.status}
                        </Badge>
                      </h5>
                      <p className="text-muted mb-2">
                        <strong>Category:</strong> {booking.serviceCategory}
                      </p>
                      <p className="mb-1">
                        <strong>📅 Scheduled:</strong>{" "}
                        {formatDate(booking.scheduledDate)} at{" "}
                        {booking.scheduledTime}
                      </p>
                      <p className="mb-1">
                        <strong>📍 Location:</strong> {booking.address.village},{" "}
                        {booking.address.district}, {booking.address.state} -{" "}
                        {booking.address.pincode}
                      </p>
                      {booking.address.landmark && (
                        <p className="mb-1">
                          <strong>Landmark:</strong> {booking.address.landmark}
                        </p>
                      )}
                      <p className="mb-1">
                        <strong>Problem:</strong> {booking.problemDescription}
                      </p>
                    </Col>
                    <Col md={4} className="text-end">
                      <h4 className="text-success">
                        ₹{booking.finalPrice || booking.estimatedPrice}
                      </h4>
                      <Badge
                        bg={getPaymentStatusVariant(booking.paymentStatus)}
                      >
                        {booking.paymentStatus}
                      </Badge>
                      <p className="mb-1 mt-2">
                        <small>
                          <strong>Payment:</strong> {booking.paymentMethod}
                        </small>
                      </p>
                      <p className="mb-1">
                        <small className="text-muted">
                          Booked on: {formatDate(booking.createdAt)}
                        </small>
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings;
