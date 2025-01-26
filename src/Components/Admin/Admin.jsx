import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import "./Admin.scss";

const Admin = () => {
  // -------------------STATI-------------------
  // Stato per gestire i dati del form di aggiunta FILM
  const [filmData, setFilmData] = useState({
    titolo: "",
    genere: "",
    durata: "",
    file: null,
  });

  // stato per gestire i dati del form di aggiunta SEZIONE
  const [sezioneData, setSezioneData] = useState({
    titolo: "",
    tag: "",
    anno: "",
    file: null,
  });
  // Stato per gestire i dati del form di aggiunta STAGIONE
  const [stagioneData, setStagioneData] = useState({
    titolo: "",
    anno: "",
    sezioneId: "",
  });

  // Stati per la gestione della visualizzazione dei form
  const [showFilmForm, setShowFilmForm] = useState(false); // Form per aggiungere un film
  const [showSerieTvOptions, setShowSerieTvOptions] = useState(false); // Opzioni per le Serie TV
  const [showSezioneForm, setShowSezioneForm] = useState(false); // Form per aggiungere una sezione
  const [showStagioneForm, setShowStagioneForm] = useState(false); // Form per aggiungere una stagione
  const [showVideoForm, setShowVideoForm] = useState(false); // Form per aggiungere un video
  const [sezioni, setSezioni] = useState([]); // Stato per memorizzare le sezioni
  const [selectedSezioneId, setSelectedSezioneId] = useState(""); // Stato per memorizzare l'id della sezione selezionata
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
  const handleFilmInputChange = (e) => {
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
  // Funzione per gestire i cambiamenti degli input in SEZIONE
  const handleSezioneInputChange = (e) => {
    const { name, value } = e.target;
    setSezioneData({
      ...sezioneData,
      [name]: value,
    });
  };
  // Funzione per gestire il caricamento del file in SEZIONE
  const handleSezioneFileChange = (e) => {
    setSezioneData({
      ...sezioneData,
      file: e.target.files[0],
    });
  };
  // Funzione per gestire i cambiamenti degli input in STAGIONE
  const handleStagioneInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "sezioneId") {
      setSelectedSezioneId(value);
    } else {
      setStagioneData({
        ...stagioneData,
        [name]: value,
      });
    }
  };

  // -------------------FETCH-------------------
  // Funzione per gestire l'invio del form
  const handleFilmSubmit = async (e) => {
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
        setFilmData({ titolo: "", genere: "", durata: "", file: null }); // Reset dello stato
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
  const handleSezioneSubmit = async (e) => {
    e.preventDefault();

    // Validazione dei campi
    if (
      !sezioneData.titolo ||
      !sezioneData.tag ||
      !sezioneData.anno ||
      !sezioneData.file
    ) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }

    // Creazione del FormData
    const formData = new FormData();
    formData.append("titolo", sezioneData.titolo);
    formData.append("tag", sezioneData.tag);
    formData.append("anno", sezioneData.anno);
    formData.append("file", sezioneData.file);

    // Invio della richiesta
    try {
      const response = await fetch("http://localhost:3001/api/sezioni", {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzc4MjczNzEsImV4cCI6MTczODQzMjE3MSwic3ViIjoiYWRtaW4ifQ.6VY92sbGGql4txpwfp5IVFnnCmlyOki1YQiunuKazmr2pTVL5s5HLYq9Or2gHzYeg-iCz3D_8bUWTWViOmSFMw`,
        },
        body: formData,
      });

      if (response.ok) {
        const createdSezione = await response.json();
        console.log("Sezione creata con successo:", createdSezione);
        setSezioneData({ titolo: "", tag: "", anno: "", file: null }); // Reset dello stato
      } else {
        console.error(
          "Errore durante la creazione della sezione:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error.message);
    }
  };
  const handleStagioneSubmit = async (e) => {
    e.preventDefault();

    // Validazione dei campi obbligatori
    if (!stagioneData.titolo || !stagioneData.anno || !selectedSezioneId) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }

    // Preparazione del payload da inviare
    const dataToSubmit = {
      ...stagioneData,
      sezioneId: selectedSezioneId, // Aggiunge l'ID della sezione selezionata
    };

    console.log("Payload inviato:", dataToSubmit); // Debugging del payload

    try {
      const response = await fetch("http://localhost:3001/api/stagioni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzc4MjczNzEsImV4cCI6MTczODQzMjE3MSwic3ViIjoiYWRtaW4ifQ.6VY92sbGGql4txpwfp5IVFnnCmlyOki1YQiunuKazmr2pTVL5s5HLYq9Or2gHzYeg-iCz3D_8bUWTWViOmSFMw`,
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        const createdStagione = await response.json();
        console.log("Stagione creata con successo:", createdStagione);

        // Reset dello stato
        setStagioneData({ titolo: "", anno: "", sezioneId: "" });
        setSelectedSezioneId(""); // Reset della selezione
      } else {
        const errorMessage = await response.text();
        console.error(
          "Errore durante la creazione della stagione:",
          errorMessage
        );
        alert("Errore durante la creazione della stagione: " + errorMessage); // Notifica utente
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error.message);
      alert("Si è verificato un errore nella richiesta: " + error.message); // Notifica utente
    }
  };

  // Effettua una richiesta per ottenere le sezioni
  useEffect(() => {
    const fetchSezioni = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/sezioni", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzc4MjczNzEsImV4cCI6MTczODQzMjE3MSwic3ViIjoiYWRtaW4ifQ.6VY92sbGGql4txpwfp5IVFnnCmlyOki1YQiunuKazmr2pTVL5s5HLYq9Or2gHzYeg-iCz3D_8bUWTWViOmSFMw`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSezioni(data); // Popola lo stato con le sezioni
        } else {
          console.error(
            "Errore durante il recupero delle sezioni:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Errore nella richiesta:", error.message);
      }
    };

    fetchSezioni();
  }, []);

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
                handleFilmInputChange,
                handleFileChange,
                handleFilmSubmit
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
                {showSezioneForm &&
                  renderSezioneForm(
                    handleSezioneSubmit,
                    sezioneData,
                    handleSezioneInputChange,
                    handleSezioneFileChange
                  )}
                {/* Form per aggiungere una stagione */}
                {showStagioneForm &&
                  renderStagioneForm(
                    handleStagioneSubmit,
                    stagioneData,
                    handleStagioneInputChange,
                    sezioni,
                    selectedSezioneId,
                    setSelectedSezioneId
                  )}
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
  handleFilmInputChange,
  handleFileChange,
  handleFilmSubmit
) => (
  <div className="form-container">
    <Form onSubmit={handleFilmSubmit}>
      <Form.Group controlId="formTitolo" className="mb-3">
        <Form.Label className="text-gold">Titolo</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci il titolo"
          name="titolo"
          value={filmData.titolo}
          onChange={handleFilmInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formGenere" className="mb-3">
        <Form.Label className="text-gold">Genere</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci il genere"
          name="genere"
          value={filmData.genere}
          onChange={handleFilmInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formDurata" className="mb-3">
        <Form.Label className="text-gold">Durata</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci la durata"
          name="durata"
          value={filmData.durata}
          onChange={handleFilmInputChange}
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
const renderSezioneForm = (
  handleSezioneSubmit,
  sezioneData,
  handleSezioneInputChange,
  handleSezioneFileChange
) => (
  <div className="form-container mt-3">
    <Form onSubmit={handleSezioneSubmit}>
      <Form.Group controlId="formTitoloSezione" className="mb-3">
        <Form.Label>Titolo</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci il titolo"
          name="titolo"
          value={sezioneData.titolo}
          onChange={handleSezioneInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formTagSezione" className="mb-3">
        <Form.Label>Tag</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci il tag"
          name="tag"
          value={sezioneData.tag}
          onChange={handleSezioneInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formAnnoSezione" className="mb-3">
        <Form.Label>Anno</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci l'anno"
          name="anno"
          value={sezioneData.anno}
          onChange={handleSezioneInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formFileSezione" className="mb-3">
        <Form.Label>Copertina</Form.Label>
        <Form.Control
          type="file"
          name="file"
          onChange={handleSezioneFileChange}
        />
      </Form.Group>

      <Button type="submit" className="button-admin">
        Aggiungi Sezione
      </Button>
    </Form>
  </div>
);

//form per aggiungere una stagione
const renderStagioneForm = (
  handleStagioneSubmit,
  stagioneData,
  handleStagioneInputChange,
  sezioni,
  selectedSezioneId,
  setSelectedSezioneId
) => (
  <div className="form-container mt-3">
    <Form onSubmit={handleStagioneSubmit}>
      <Form.Group controlId="formTitolo">
        <Form.Label>Titolo</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci il titolo"
          name="titolo"
          value={stagioneData.titolo}
          onChange={handleStagioneInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formAnno">
        <Form.Label>Anno</Form.Label>
        <Form.Control
          type="text"
          placeholder="Inserisci l'anno"
          name="anno"
          value={stagioneData.anno}
          onChange={handleStagioneInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formSezione">
        <Form.Label>Sezione</Form.Label>
        <Form.Control
          as="select"
          name="sezioneId"
          value={selectedSezioneId} // Valore corretto
          onChange={(e) => setSelectedSezioneId(e.target.value)} // Gestisci il cambiamento
        >
          <option value="">Seleziona una sezione</option>
          {sezioni.map((sezione) => (
            <option key={sezione.id} value={sezione.id}>
              {sezione.titolo}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Button type="submit">Crea Stagione</Button>
    </Form>
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
