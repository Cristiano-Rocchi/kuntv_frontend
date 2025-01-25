import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import "./Admin.scss";

const Admin = () => {
  // -------------------STATI-------------------
  // Stato per gestire i dati del form di aggiunta film
  const [filmData, setFilmData] = useState({
    titolo: "",
    genere: "",
    durata: "",
    file: null,
  });

  // Stati per la gestione della visualizzazione dei form
  const [showFilmForm, setShowFilmForm] = useState(false); // Form per aggiungere un film
  const [showSerieTvOptions, setShowSerieTvOptions] = useState(false); // Opzioni per le Serie TV
  const [showSezioneForm, setShowSezioneForm] = useState(false); // Form per aggiungere una sezione
  const [showStagioneForm, setShowStagioneForm] = useState(false); // Form per aggiungere una stagione
  const [showVideoForm, setShowVideoForm] = useState(false); // Form per aggiungere un video

  // -------------------FUNZIONI DI VISUALIZZAZIONE-------------------
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

  // Funzione per mostrare/nascondere il form per aggiungere un VIDEO
  const toggleVideoForm = () => {
    setShowVideoForm(!showVideoForm);
    setShowSezioneForm(false);
    setShowStagioneForm(false);
  };

  // -------------------GESTIONE DEI DATI DEL FORM-------------------
  // Funzione per gestire i cambiamenti degli input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilmData({
      ...filmData,
      [name]: value,
    });
  };

  // Funzione per gestire il caricamento del file
  const handleFileChange = (e) => {
    setFilmData({
      ...filmData,
      file: e.target.files[0],
    });
  };

  // -------------------INVIO DEL FORM-------------------
  // Funzione per gestire l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validazione dei campi
    if (
      !filmData.titolo ||
      !filmData.genere ||
      !filmData.durata ||
      !filmData.file
    ) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }

    // Creo un oggetto FormData per inviare i dati
    const formData = new FormData();
    formData.append("titolo", filmData.titolo);
    formData.append("genere", filmData.genere);
    formData.append("durata", filmData.durata);
    formData.append("file", filmData.file);

    // -----------FETCH-----------
    try {
      const response = await fetch("http://localhost:3001/api/film/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzc4MjczNzEsImV4cCI6MTczODQzMjE3MSwic3ViIjoiYWRtaW4ifQ.6VY92sbGGql4txpwfp5IVFnnCmlyOki1YQiunuKazmr2pTVL5s5HLYq9Or2gHzYeg-iCz3D_8bUWTWViOmSFMw`,
        },
        body: formData,
      });

      if (response.ok) {
        const createdFilm = await response.json();
        console.log("Film creato con successo:", createdFilm);
      } else {
        console.error(
          "Errore durante la creazione del film:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error.message);
    }
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
            {showFilmForm &&
              renderFilmForm(
                filmData,
                handleInputChange,
                handleFileChange,
                handleSubmit
              )}
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
const renderFilmForm = (
  filmData,
  handleInputChange,
  handleFileChange,
  handleSubmit
) => (
  <div className="form-container">
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formTitolo" className="mb-3">
        <Form.Label className="text-gold">Titolo</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci il titolo"
          name="titolo"
          value={filmData.titolo}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formGenere" className="mb-3">
        <Form.Label className="text-gold">Genere</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci il genere"
          name="genere"
          value={filmData.genere}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formDurata" className="mb-3">
        <Form.Label className="text-gold">Durata</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci la durata"
          name="durata"
          value={filmData.durata}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label className="text-gold">File</Form.Label>
        <Form.Control
          type="file"
          name="file"
          onChange={handleFileChange}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
          }}
        />
      </Form.Group>
      <Button type="submit" className="button-admin">
        Aggiungi Film
      </Button>
    </Form>
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
