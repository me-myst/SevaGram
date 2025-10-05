import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Table,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchProviderBookings();
  }, []);

  const fetchProviderBookings = async () => {
    try {
      setLoading(true);
      // This endpoint needs to be created in backend
      const response = await API.get("/bookings/provider-bookings");
      const providerBookings = response.data.bookings;
      setBookings(providerBookings);

      // Calculate statistics
      const stats = {
        pending: providerBookings.filter((b) => b.status === "Pending").length,
        confirmed: providerBookings.filter((b) => b.status === "Confirmed")
          .length,
        inProgress: providerBookings.filter((b) => b.status === "In Progress")
          .length,
        completed: providerBookings.filter((b) => b.status === "Completed")
          .length,
        totalEarnings: providerBookings
          .filter((b) => b.status === "Completed" && b.paymentStatus === "Paid")
          .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice), 0),
      };
      setStats(stats);
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

  const handleUpdateStatus = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setShowModal(true);
  };

  const submitStatusUpdate = async () => {
    try {
      await API.put(`/bookings/${selectedBooking._id}/status`, {
        status: newStatus,
      });

      setShowModal(false);
      fetchProviderBookings(); // Refresh data
      alert("Booking status updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
      <h2 className="mb-4">Provider Dashboard - {user?.name} 👨‍🔧</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 shadow-sm border-warning">
            <Card.Body className="text-center">
              <h1 className="text-warning">{stats.pending}</h1>
              <p className="mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 shadow-sm border-info">
            <Card.Body className="text-center">
              <h1 className="text-info">{stats.confirmed}</h1>
              <p className="mb-0">Confirmed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 shadow-sm border-primary">
            <Card.Body className="text-center">
              <h1 className="text-primary">{stats.inProgress}</h1>
              <p className="mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 shadow-sm border-success">
            <Card.Body className="text-center">
              <h1 className="text-success">{stats.completed}</h1>
              <p className="mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Earnings Card */}
      <Card className="mb-4 bg-success text-white">
        <Card.Body className="text-center">
          <h3>Total Earnings</h3>
          <h1>₹{stats.totalEarnings}</h1>
        </Card.Body>
      </Card>

      {/* Bookings List */}
      <Card>
        <Card.Body>
          <h5 className="mb-4">My Assigned Bookings</h5>

          {bookings.length === 0 ? (
            <Alert variant="info">
              No bookings assigned yet. Wait for customers to book your
              services!
            </Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <strong>{booking.customerId?.name || "Customer"}</strong>
                      <br />
                      <small className="text-muted">
                        {booking.customerId?.phone}
                      </small>
                    </td>
                    <td>
                      <strong>{booking.serviceId?.name}</strong>
                      <br />
                      <small className="text-muted">
                        {booking.serviceCategory}
                      </small>
                    </td>
                    <td>
                      {formatDate(booking.scheduledDate)}
                      <br />
                      <small>{booking.scheduledTime}</small>
                    </td>
                    <td>
                      {booking.address.village}, {booking.address.district}
                      <br />
                      <small className="text-muted">
                        {booking.address.landmark}
                      </small>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td>₹{booking.finalPrice || booking.estimatedPrice}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleUpdateStatus(booking)}
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Update Status Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Booking Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select New Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={submitStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProviderDashboard;
