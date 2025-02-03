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
    tag: [],
    anno: "",
    file: null,
  });
  // Stato per gestire i dati del form di aggiunta STAGIONE
  const [stagioneData, setStagioneData] = useState({
    titolo: "",
    anno: "",
    sezioneId: "",
  });

  const [videoData, setVideoData] = useState({
    titolo: "",
    durata: "",
    file: null,
    stagioneId: "",
  });

  // Stati per la gestione della visualizzazione dei form
  const [showFilmForm, setShowFilmForm] = useState(false); // Form per aggiungere un film
  const [showSerieTvOptions, setShowSerieTvOptions] = useState(false); // Opzioni per le Serie TV
  const [showSezioneForm, setShowSezioneForm] = useState(false); // Form per aggiungere una sezione
  const [showStagioneForm, setShowStagioneForm] = useState(false); // Form per aggiungere una stagione
  const [showVideoForm, setShowVideoForm] = useState(false); // Form per aggiungere un video
  const [sezioni, setSezioni] = useState([]); // Stato per memorizzare le sezioni
  const [selectedSezioneId, setSelectedSezioneId] = useState(""); // Stato per memorizzare l'id della sezione selezionata
  const [stagioni, setStagioni] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

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
  const handleSezioneTagChange = (e) => {
    const { value, checked } = e.target;
    setSezioneData((prevData) => ({
      ...prevData,
      tag: checked
        ? [...prevData.tag, value] // Aggiunge il tag se selezionato
        : prevData.tag.filter((tag) => tag !== value), // Rimuove il tag se deselezionato
    }));
  };

  const handleStagioneFileChange = (e) => {
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
  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData({
      ...videoData,
      [name]: value,
    });
  };

  const handleVideoFileChange = (e) => {
    setVideoData({
      ...videoData,
      file: e.target.files[0],
    });
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
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
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
      sezioneData.tag.length === 0 ||
      !sezioneData.anno ||
      !sezioneData.file
    ) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }

    const formData = new FormData();
    formData.append("titolo", sezioneData.titolo);
    formData.append("tag", sezioneData.tag.join(","));

    formData.append("anno", sezioneData.anno);
    formData.append("file", sezioneData.file);

    // 🔥 Aggiungi log per vedere cosa viene effettivamente inviato
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch("http://localhost:3001/api/sezioni", {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Sezione creata con successo!");
        setSezioneData({ titolo: "", tag: [], anno: "", file: null }); // Reset form
      } else {
        console.error("Errore durante la creazione:", await response.text());
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
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
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
  const handleVideoSubmit = async (e) => {
    e.preventDefault();

    if (
      !videoData.titolo ||
      !videoData.durata ||
      !videoData.file ||
      !videoData.stagioneId
    ) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }

    const formData = new FormData();
    formData.append("titolo", videoData.titolo);
    formData.append("durata", videoData.durata);
    formData.append("file", videoData.file);
    formData.append("stagioneId", videoData.stagioneId);

    try {
      const response = await fetch("http://localhost:3001/api/video/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
        },
        body: formData,
      });

      if (response.ok) {
        const createdVideo = await response.json();
        console.log("Video creato con successo:", createdVideo);

        // Resetta i dati del form video
        setVideoData({ titolo: "", durata: "", file: null, stagioneId: "" });
      } else {
        console.error(
          "Errore durante la creazione del video:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error.message);
    }
  };

  // Effettua una richiesta per ottenere le SEZIONI
  useEffect(() => {
    const fetchSezioni = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/sezioni", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
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

  const fetchStagioni = async (sezioneId) => {
    console.log("Fetching stagioni for sezioneId:", sezioneId); // Debug
    try {
      const response = await fetch(
        `http://localhost:3001/api/stagioni/sezione/${sezioneId}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Stagioni ricevute:", data); // Debug
        setStagioni(data); // Aggiorna lo stato con le stagioni
      } else {
        console.error(
          "Errore durante il recupero delle stagioni:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error.message);
    }
  };
  // Effettua una richiesta per gli ENUM TAG in SEZIONE
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/sezioni/tags", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTagOptions(data);
        } else {
          console.error("Errore nel recupero dei tag:", await response.text());
        }
      } catch (error) {
        console.error("Errore nella richiesta API per i tag:", error.message);
      }
    };

    fetchTags();
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
                    handleSezioneFileChange,
                    tagOptions,
                    handleSezioneTagChange
                  )}
                {/* Form per aggiungere una stagione */}
                {showStagioneForm &&
                  renderStagioneForm(
                    handleStagioneSubmit,
                    stagioneData,
                    handleStagioneInputChange,
                    sezioni,
                    selectedSezioneId,
                    setSelectedSezioneId,
                    handleStagioneFileChange
                  )}
                {/* Form per aggiungere un video */}
                {showVideoForm &&
                  renderVideoForm(
                    sezioni,
                    selectedSezioneId,
                    setSelectedSezioneId,
                    stagioni,
                    fetchStagioni,
                    setStagioni,
                    videoData,
                    setVideoData,
                    handleVideoInputChange,
                    handleVideoFileChange,
                    handleVideoSubmit
                  )}
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
  handleSezioneFileChange,
  tagOptions,
  handleSezioneTagChange
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
        <div>
          {tagOptions.map((tag) => (
            <Form.Check
              key={tag}
              type="checkbox"
              label={tag}
              value={tag}
              checked={sezioneData.tag.includes(tag)}
              onChange={handleSezioneTagChange}
            />
          ))}
        </div>
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
  setSelectedSezioneId,
  handleStagioneFileChange
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

      <Form.Group controlId="formFileStagione" className="mb-3">
        <Form.Label>Copertina</Form.Label>
        <Form.Control
          type="file"
          name="file"
          onChange={handleStagioneFileChange}
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
const renderVideoForm = (
  sezioni,
  selectedSezioneId,
  setSelectedSezioneId,
  stagioni,
  fetchStagioni,
  setStagioni,
  videoData,
  setVideoData,
  handleVideoInputChange,
  handleVideoFileChange,
  handleVideoSubmit
) => (
  <div className="form-container mt-3">
    {/* Dropdown per le sezioni */}
    <Form.Group controlId="formSezioneVideo">
      <Form.Label>Sezione</Form.Label>
      <Form.Control
        as="select"
        value={selectedSezioneId}
        onChange={(e) => {
          const sezioneId = e.target.value;
          setSelectedSezioneId(sezioneId);
          if (sezioneId) {
            fetchStagioni(sezioneId); // Carica le stagioni
          } else {
            setStagioni([]); // Resetta le stagioni
          }
        }}
      >
        <option value="">Seleziona una sezione</option>
        {sezioni.map((sezione) => (
          <option key={sezione.id} value={sezione.id}>
            {sezione.titolo}
          </option>
        ))}
      </Form.Control>
    </Form.Group>

    {/* Dropdown per le stagioni */}
    {stagioni.length > 0 && (
      <Form.Group controlId="formStagioneVideo" className="mt-3">
        <Form.Label>Stagione</Form.Label>
        <Form.Control
          as="select"
          value={videoData.stagioneId}
          onChange={(e) =>
            setVideoData({ ...videoData, stagioneId: e.target.value })
          }
        >
          <option value="">Seleziona una stagione</option>
          {stagioni.map((stagione) => (
            <option key={stagione.id} value={stagione.id}>
              {stagione.titolo}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    )}

    {/* Form per aggiungere il video */}
    {videoData.stagioneId && (
      <div className="mt-3">
        <Form onSubmit={handleVideoSubmit}>
          <Form.Group controlId="formTitoloVideo" className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il titolo"
              name="titolo"
              value={videoData.titolo}
              onChange={handleVideoInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formDurataVideo" className="mb-3">
            <Form.Label>Durata</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci la durata"
              name="durata"
              value={videoData.durata}
              onChange={handleVideoInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formFileVideo" className="mb-3">
            <Form.Label>File</Form.Label>
            <Form.Control type="file" onChange={handleVideoFileChange} />
          </Form.Group>

          <Button type="submit" className="button-admin">
            Invia Video
          </Button>
        </Form>
      </div>
    )}
  </div>
);

export default Admin;
