import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyNavbar.scss";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

const MyNavbar = () => {
  return (
    <div className="">
      {" "}
      <Navbar expand="lg" className="nav-body" variant="dark">
        <Navbar.Brand href="#" className="me-3"></Navbar.Brand>
        <span></span>
        <Container className="d-flex justify-content-center">
          <Nav className=" nav-elements">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Link</Nav.Link>
            <Nav.Link href="#">Link</Nav.Link>
            <Nav.Link href="#">Link</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default MyNavbar;
