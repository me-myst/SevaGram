import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Table,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/bookings/my-bookings");
      const userBookings = response.data.bookings;
      setBookings(userBookings.slice(0, 5)); // Show only recent 5

      // Calculate statistics
      const activeBookings = userBookings.filter(
        (b) =>
          b.status === "Pending" ||
          b.status === "Confirmed" ||
          b.status === "In Progress"
      ).length;

      const completedBookings = userBookings.filter(
        (b) => b.status === "Completed"
      ).length;

      const totalSpent = userBookings
        .filter((b) => b.paymentStatus === "Paid")
        .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice), 0);

      setStats({
        activeBookings,
        completedBookings,
        totalSpent,
      });

      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch dashboard data. Please try again."
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
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Welcome, {user?.name}! 👋</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h1 className="text-warning">{stats.activeBookings}</h1>
              <p className="mb-0">Active Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h1 className="text-success">{stats.completedBookings}</h1>
              <p className="mb-0">Completed Services</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h1 className="text-primary">₹{stats.totalSpent}</h1>
              <p className="mb-0">Total Spent</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Quick Actions</h5>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="success" onClick={() => navigate("/services")}>
              📋 Book New Service
            </Button>
            <Button variant="info" onClick={() => navigate("/my-bookings")}>
              📖 View All Bookings
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Bookings */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Recent Bookings</h5>
            {bookings.length > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/my-bookings")}
              >
                View All
              </Button>
            )}
          </div>

          {bookings.length === 0 ? (
            <Alert variant="info">
              <p className="mb-0">
                No bookings yet. Start by booking a service!
              </p>
            </Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <strong>{booking.serviceId?.name || "Service"}</strong>
                      <br />
                      <small className="text-muted">
                        {booking.serviceCategory}
                      </small>
                    </td>
                    <td>{formatDate(booking.scheduledDate)}</td>
                    <td>
                      <Badge bg={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td>₹{booking.finalPrice || booking.estimatedPrice}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* User Profile */}
      <Card>
        <Card.Body>
          <h5 className="mb-3">Your Profile</h5>
          <Row>
            <Col md={6}>
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Role:</strong>{" "}
                <Badge bg="secondary">{user?.role}</Badge>
              </p>
              <p>
                <strong>Address:</strong> {user?.address?.village},{" "}
                {user?.address?.district}, {user?.address?.state} -{" "}
                {user?.address?.pincode}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
