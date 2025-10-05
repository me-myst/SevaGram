import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <div className="text-center">
          <p className="mb-0">
            © 2025 SevaGram - Connecting Rural Communities with Essential
            Services
          </p>
          <p className="mb-0 mt-2">
            Built with ❤️ for Rural India | Contact: support@sevagram.com
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
