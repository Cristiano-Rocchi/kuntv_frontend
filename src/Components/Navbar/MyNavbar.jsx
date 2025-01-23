import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyNavbar.scss";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

const MyNavbar = () => {
  return (
    <Navbar expand="lg" className="bg-dark" variant="dark">
      <Container className="d-flex justify-content-between">
        <Navbar.Brand href="#" className="me-3">
          Logo
        </Navbar.Brand>
        <Nav className="">
          <Nav.Link href="#">Home</Nav.Link>
          <Nav.Link href="#">Link</Nav.Link>
          <Nav.Link href="#">Link</Nav.Link>
          <Nav.Link href="#">Link</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
