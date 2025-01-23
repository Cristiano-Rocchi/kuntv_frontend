import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyNavbar.scss";
import { Container, Nav, Navbar } from "react-bootstrap";

const MyNavbar = () => {
  return (
    <div className="navbar-wrapper d-flex justify-content-between ">
      <h1 className="logo ms-5 mt-3">Kun</h1>
      <Navbar expand="lg" className="nav-body" variant="dark">
        <Container className="d-flex justify-content-center">
          <Nav className="nav-elements">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Serie TV</Nav.Link>
            <Nav.Link href="#">Film</Nav.Link>
            <Nav.Link href="#">Radio</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <h1 className="logo me-5 mt-3">Tv</h1>
    </div>
  );
};

export default MyNavbar;
