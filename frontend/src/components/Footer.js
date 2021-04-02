import React from "react";
import { Container, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container className="text-center py-3 text-light">
          CopyRight &copy; Sharp Nine
        </Container>
      </Navbar>
    </footer>
  );
};

export default Footer;
