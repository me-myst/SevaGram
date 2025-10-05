import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    revenue: 0,
  });

  // Data
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modal states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    category: "Plumbing",
    description: "",
    basePrice: "",
    duration: "",
    icon: "🔧",
  });

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== "admin") {
      alert("Access denied. Admin only.");
      navigate("/");
      return;
    }

    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching admin data...");

      // Fetch all data with error handling for each
      let usersData = [];
      let servicesData = [];
      let bookingsData = [];

      try {
        const usersRes = await API.get("/admin/users");
        usersData = usersRes.data.users || [];
        console.log("Users fetched:", usersData.length);
      } catch (err) {
        console.error(
          "Error fetching users:",
          err.response?.data || err.message
        );
      }

      try {
        const servicesRes = await API.get("/services");
        servicesData = servicesRes.data.services || [];
        console.log("Services fetched:", servicesData.length);
      } catch (err) {
        console.error(
          "Error fetching services:",
          err.response?.data || err.message
        );
      }

      try {
        const bookingsRes = await API.get("/admin/bookings");
        bookingsData = bookingsRes.data.bookings || [];
        console.log("Bookings fetched:", bookingsData.length);
      } catch (err) {
        console.error(
          "Error fetching bookings:",
          err.response?.data || err.message
        );
      }

      setUsers(usersData);
      setServices(servicesData);
      setBookings(bookingsData);

      // Calculate statistics
      const totalUsers = usersData.length;
      const totalProviders = usersData.filter(
        (u) => u.role === "provider"
      ).length;
      const totalServices = servicesData.length;
      const totalBookings = bookingsData.length;
      const pendingBookings = bookingsData.filter(
        (b) => b.status === "Pending"
      ).length;
      const revenue = bookingsData
        .filter((b) => b.paymentStatus === "Paid")
        .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice), 0);

      setStats({
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        pendingBookings,
        revenue,
      });

      console.log("Stats calculated:", {
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        pendingBookings,
        revenue,
      });
    } catch (err) {
      console.error("Error in fetchAllData:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await API.post("/services", {
        ...serviceFormData,
        isActive: true,
      });
      alert("Service created successfully!");
      setShowServiceModal(false);
      fetchAllData();
      setServiceFormData({
        name: "",
        category: "Plumbing",
        description: "",
        basePrice: "",
        duration: "",
        icon: "🔧",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create service");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await API.delete(`/services/${serviceId}`);
        alert("Service deleted successfully!");
        fetchAllData();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete service");
      }
    }
  };

  const handleAssignProvider = async (providerId) => {
    try {
      await API.put(`/bookings/${selectedBooking._id}/assign`, {
        providerId,
      });
      alert("Provider assigned successfully!");
      setShowAssignModal(false);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign provider");
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      Pending: "warning",
      Confirmed: "info",
      "In Progress": "primary",
      Completed: "success",
      Cancelled: "danger",
    };
    return variants[status] || "secondary";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading admin dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🔐 Admin Dashboard</h2>
        <Button variant="outline-secondary" onClick={fetchAllData}>
          🔄 Refresh Data
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* OVERVIEW TAB */}
        <Tab eventKey="overview" title="📊 Overview">
          <Row className="mb-4">
            <Col md={4} lg={2} className="mb-3">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h3 className="text-primary">{stats.totalUsers}</h3>
                  <small className="text-muted">Total Users</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} lg={2} className="mb-3">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h3 className="text-info">{stats.totalProviders}</h3>
                  <small className="text-muted">Providers</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} lg={2} className="mb-3">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h3 className="text-success">{stats.totalServices}</h3>
                  <small className="text-muted">Services</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} lg={2} className="mb-3">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h3>{stats.totalBookings}</h3>
                  <small className="text-muted">Bookings</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} lg={2} className="mb-3">
              <Card className="text-center h-100 shadow-sm border-warning">
                <Card.Body>
                  <h3 className="text-warning">{stats.pendingBookings}</h3>
                  <small className="text-muted">Pending</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} lg={2} className="mb-3">
              <Card className="text-center h-100 shadow-sm border-success">
                <Card.Body>
                  <h3 className="text-success">₹{stats.revenue}</h3>
                  <small className="text-muted">Revenue</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Info */}
          <Alert variant="info">
            <h5>Welcome, Admin! 👋</h5>
            <p className="mb-0">
              You have {stats.pendingBookings} pending bookings that need
              attention.
            </p>
          </Alert>
        </Tab>

        {/* USERS TAB */}
        <Tab eventKey="users" title={`👥 Users (${users.length})`}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">All Registered Users</h5>
              {users.length === 0 ? (
                <Alert variant="info">No users found in the database.</Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Location</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <strong>{user.name}</strong>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <Badge
                            bg={
                              user.role === "admin"
                                ? "danger"
                                : user.role === "provider"
                                ? "info"
                                : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          {user.address?.village}, {user.address?.district}
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* SERVICES TAB */}
        <Tab eventKey="services" title={`🛠️ Services (${services.length})`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>All Services</h5>
            <Button variant="success" onClick={() => setShowServiceModal(true)}>
              ➕ Add New Service
            </Button>
          </div>
          <Card>
            <Card.Body>
              {services.length === 0 ? (
                <Alert variant="info">
                  No services found. Click "Add New Service" to create one.
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Icon</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service._id}>
                        <td style={{ fontSize: "2rem" }}>
                          {service.icon || "📦"}
                        </td>
                        <td>
                          <strong>{service.name}</strong>
                        </td>
                        <td>{service.category}</td>
                        <td>{service.description?.substring(0, 50)}...</td>
                        <td>₹{service.basePrice}</td>
                        <td>{service.duration}</td>
                        <td>
                          <Badge
                            bg={service.isActive ? "success" : "secondary"}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteService(service._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* BOOKINGS TAB */}
        <Tab eventKey="bookings" title={`📋 Bookings (${bookings.length})`}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">All Bookings</h5>
              {bookings.length === 0 ? (
                <Alert variant="info">No bookings yet.</Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Date</th>
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
                          <small>{booking._id.substring(0, 8)}...</small>
                        </td>
                        <td>{booking.customerId?.name || "N/A"}</td>
                        <td>
                          {booking.serviceId?.name || booking.serviceCategory}
                        </td>
                        <td>{formatDate(booking.scheduledDate)}</td>
                        <td>
                          {booking.address?.village},{" "}
                          {booking.address?.district}
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td>₹{booking.finalPrice || booking.estimatedPrice}</td>
                        <td>
                          {booking.status === "Pending" && (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowAssignModal(true);
                              }}
                            >
                              Assign Provider
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Create Service Modal */}
      <Modal
        show={showServiceModal}
        onHide={() => setShowServiceModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateService}>
            <Form.Group className="mb-3">
              <Form.Label>Service Name *</Form.Label>
              <Form.Control
                type="text"
                value={serviceFormData.name}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                value={serviceFormData.category}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    category: e.target.value,
                  })
                }
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Agriculture Equipment">
                  Agriculture Equipment
                </option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Painting">Painting</option>
                <option value="Water Pump Service">Water Pump Service</option>
                <option value="Solar Panel Maintenance">
                  Solar Panel Maintenance
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={serviceFormData.description}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={serviceFormData.basePrice}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        basePrice: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 1-2 hours"
                    value={serviceFormData.duration}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        duration: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Icon (Emoji)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 🔧"
                value={serviceFormData.icon}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    icon: e.target.value,
                  })
                }
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="success" type="submit">
                Create Service
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowServiceModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Assign Provider Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Service Provider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <p>
                <strong>Service:</strong> {selectedBooking.serviceCategory}
              </p>
              <p>
                <strong>Location:</strong> {selectedBooking.address?.village}
              </p>
              <hr />
              <p className="mb-3">Select a provider:</p>

              {users.filter((u) => u.role === "provider").length === 0 ? (
                <Alert variant="warning">
                  No service providers registered yet.
                </Alert>
              ) : (
                users
                  .filter((u) => u.role === "provider")
                  .map((provider) => (
                    <Button
                      key={provider._id}
                      variant="outline-primary"
                      className="w-100 mb-2"
                      onClick={() => handleAssignProvider(provider._id)}
                    >
                      {provider.name} - {provider.phone}
                      <br />
                      <small className="text-muted">
                        {provider.address?.village},{" "}
                        {provider.address?.district}
                      </small>
                    </Button>
                  ))
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
