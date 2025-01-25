import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import "./Admin.scss";
import { render } from "sass";

// ------STATI------
const Admin = () => {
  const [showFilmForm, setShowFilmForm] = useState(false); // stato per il form per aggiungere un film
  const [showSerieTvOptions, setShowSerieTvOptions] = useState(false); // stato per le opzioni per le Serie TV
  const [showSezioneForm, setShowSezioneForm] = useState(false); // stato per il form per aggiungere una sezione
  const [showStagioneForm, setShowStagioneForm] = useState(false); // stato per il form per aggiungere una stagione
  const [showVideoForm, setShowVideoForm] = useState(false); // stato per il form per aggiungere un video

  // ---FUNZIONI----
  // Funzione per mostrare/nascondere il form per aggiungere un FILM
  const toggleFilmForm = () => {
    setShowFilmForm(!showFilmForm);
    setShowSerieTvOptions(false);
    setShowSezioneForm(false);
  };
  // Funzione per mostrare/nascondere le opzioni per le SERIE TV
  const toggleSerieTvOptions = () => {
    setShowSerieTvOptions(!showSerieTvOptions);
    setShowFilmForm(false);
    setShowSezioneForm(false);
    setShowStagioneForm(false);
    setShowVideoForm(false);
  };
  // Funzione per mostrare/nascondere il form per aggiungere una SEZIONE
  const toggleSezioneForm = () => {
    setShowSezioneForm(!showSezioneForm);
    setShowStagioneForm(false);
    setShowVideoForm(false);
  };

  // Funzione per mostrare/nascondere il form per aggiungere una STAGIONE
  const toggleStagioneForm = () => {
    setShowStagioneForm(!showStagioneForm);
    setShowSezioneForm(false);
    setShowVideoForm(false);
  };

  const toggleVideoForm = () => {
    setShowVideoForm(!showVideoForm);
    setShowSezioneForm(false);
    setShowStagioneForm(false);
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
              <Button className="button-admin" onClick={toggleSerieTvOptions}>
                Aggiungi Serie TV
              </Button>
            </div>

            {/* Form per aggiungere film */}
            {showFilmForm && renderFilmForm()}
            {/* Bottoni per aggiungere Serie TV */}
            {showSerieTvOptions && (
              <div className="form-container">
                <div className="button-group">
                  <Button
                    className="button-tvseries"
                    onClick={toggleSezioneForm}
                  >
                    Aggiungi Sezione
                  </Button>
                  <Button
                    className="button-tvseries"
                    onClick={toggleStagioneForm}
                  >
                    Aggiungi Stagione
                  </Button>
                  <Button className="button-tvseries" onClick={toggleVideoForm}>
                    Aggiungi Video
                  </Button>
                </div>
                {/* Form per aggiungere una sezione */}
                {showSezioneForm && renderSezioneForm()}
                {/* Form per aggiungere una stagione */}
                {showStagioneForm && renderStagioneForm()}
                {/* Form per aggiungere un video */}
                {showVideoForm && renderVideoForm()}
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

// ---FUNZIONI FORM----

// Form per aggiungere un film
const renderFilmForm = () => (
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
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
        }}
      />
    </Form.Group>
  </div>
);
// Form per aggiungere una sezione
const renderSezioneForm = () => (
  <div className="form-container mt-3">
    <Form.Group controlId="formTitoloSezione" className="mb-3">
      <Form.Label>Titolo</Form.Label>
      <Form.Control type="text" placeholder="Inserisci il titolo" />
    </Form.Group>

    <Form.Group controlId="formTagSezione" className="mb-3">
      <Form.Label>Tag</Form.Label>
      <Form.Control type="text" placeholder="Inserisci il tag" />
    </Form.Group>

    <Form.Group controlId="formAnnoSezione" className="mb-3">
      <Form.Label>Anno</Form.Label>
      <Form.Control type="text" placeholder="Inserisci l'anno" />
    </Form.Group>

    <Form.Group controlId="formCopertinaSezione" className="mb-3">
      <Form.Label>Copertina</Form.Label>
      <Form.Control
        type="file"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
        }}
      />
    </Form.Group>
  </div>
);

//form per aggiungere una stagione
const renderStagioneForm = () => (
  <div className="form-container mt-3">
    <Form.Group controlId="formSezione" className="mb-3">
      <Form.Label>Sezione</Form.Label>
      <Form.Control type="text" placeholder="Inserisci la sezione" />
    </Form.Group>

    <Form.Group controlId="formAnnoStagione" className="mb-3">
      <Form.Label>Anno</Form.Label>
      <Form.Control type="text" placeholder="Inserisci il titolo" />
    </Form.Group>
    <Form.Group controlId="formTitoloStagione" className="mb-3">
      <Form.Label>Titolo</Form.Label>
      <Form.Control type="text" placeholder="Inserisci il titolo" />
    </Form.Group>
  </div>
);

//form per aggiungere un video
const renderVideoForm = () => (
  <div className="form-container">
    <Form.Group controlId="formStagioneVideo" className="mb-3">
      <Form.Label className="text-gold">Stagione</Form.Label>
      <Form.Control type="text" placeholder="Inserisci il titolo" />
    </Form.Group>

    <Form.Group controlId="formTitoloVideo" className="mb-3">
      <Form.Label className="text-gold">Titolo</Form.Label>
      <Form.Control type="text" placeholder="Inserisci il titolo" />
    </Form.Group>

    <Form.Group controlId="formDurataVideo" className="mb-3">
      <Form.Label className="text-gold">Durata</Form.Label>
      <Form.Control type="text" placeholder="Inserisci la durata" />
    </Form.Group>

    <Form.Group controlId="formFileVideo" className="mb-3">
      <Form.Label className="text-gold">File</Form.Label>
      <Form.Control
        type="file"
        placeholder="Carica un file"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
        }}
      />
    </Form.Group>
  </div>
);

export default Admin;
