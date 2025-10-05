import React, { useContext } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Welcome, {user?.name}! 👋</h2>

      <Row>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body className="text-center">
              <h1>0</h1>
              <p>Active Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body className="text-center">
              <h1>0</h1>
              <p>Completed Services</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body className="text-center">
              <h1>₹0</h1>
              <p>Total Spent</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Body>
          <h4>Your Profile</h4>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Phone:</strong> {user?.phone}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
          <p>
            <strong>Address:</strong> {user?.address?.village},{" "}
            {user?.address?.district}, {user?.address?.state}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
