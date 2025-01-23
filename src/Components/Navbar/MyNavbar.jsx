import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyNavbar.scss";
import { Container, Nav, Navbar } from "react-bootstrap";

const MyNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`navbar-wrapper d-flex justify-content-around ${
        isScrolled ? "scrolled" : ""
      }`}
    >
      <h1 className="logo ms-5 mt-3">Kun</h1>
      <Navbar expand="lg" className="nav-body">
        <Container>
          <span></span>
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
