import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import "./Admin.scss";

const Admin = () => {
  const [showFilmForm, setShowFilmForm] = useState(false);

  const toggleFilmForm = () => {
    setShowFilmForm(!showFilmForm);
  };

  return (
    <div className="body">
      <Container className="d-flex align-items-center m-auto pt-5">
        <Row className="w-100">
          <Col md={5} className="section-admin">
            <div className="button-group">
              <Button className="button-admin" onClick={toggleFilmForm}>
                Aggiungi Film
              </Button>
              <Button className="button-admin">Aggiungi Serie TV</Button>
            </div>

            {/* Form per aggiungere film */}
            {showFilmForm && (
              <div className="form-container">
                <Form.Group controlId="formTitolo" className="mb-3">
                  <Form.Label className="text-gold">Titolo</Form.Label>
                  <Form.Control type="text" placeholder="Inserisci il titolo" />
                </Form.Group>

                <Form.Group controlId="formGenere" className="mb-3">
                  <Form.Label className="text-gold">Genere</Form.Label>
                  <Form.Control type="text" placeholder="Inserisci il genere" />
                </Form.Group>

                <Form.Group controlId="formDurata" className="mb-3">
                  <Form.Label className="text-gold">Durata</Form.Label>
                  <Form.Control type="text" placeholder="Inserisci la durata" />
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label className="text-gold">File</Form.Label>
                  <Form.Control
                    type="file"
                    placeholder="Carica un file"
                    onDragOver={(e) => e.preventDefault()} // Abilita il drag-and-drop
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                    }}
                  />
                </Form.Group>
              </div>
            )}
          </Col>

          <Col md={5} className="section-admin">
            <Button className="button-admin">Aggiungi traccia Audio</Button>
          </Col>
          <Col md={5} className="section-admin">
            <div className="button-group">
              <Button className="button-admin">Edit Film</Button>
              <Button className="button-admin">Edit Serie TV</Button>
            </div>
          </Col>
          <Col md={5} className="section-admin">
            <Button className="button-admin">Edit Radio</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Admin;
