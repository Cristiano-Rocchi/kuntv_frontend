import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Assicurati di avere axios installato
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  ProgressBar,
} from "react-bootstrap";
import "./Admin.scss";
import { Link } from "react-router-dom";

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
    file: null, // Aggiunto per la copertina della stagione
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
  const [stagioni, setStagioni] = useState([]); // Stato per memorizzare le stagioni
  const [tagOptions, setTagOptions] = useState([]); // Stato per memorizzare le opzioni di tag(generi video)
  const [showTagList, setShowTagList] = useState(false); // Stato per mostrare/nascondere la lista dei tag
  const [isUploading, setIsUploading] = useState(false); // Stato per indicare l'upload in corso
  const [progress, setProgress] = useState(0); // Stato per il progresso dell'upload
  const [uploadPhase, setUploadPhase] = useState(""); // Stato per la fase dell'upload
  const [uploadComplete, setUploadComplete] = useState(false); // Stato per il messaggio di successo
  const [uploadError, setUploadError] = useState(null); // Stato per il messaggio di errore
  const cancelTokenSource = useRef(null); // Token per annullare l'upload
  const [showVideoOptions, setShowVideoOptions] = useState(false); // Stato per mostrare/nascondere bottoni per le opzioni di video
  const [showMultiVideoModal, setShowMultiVideoModal] = useState(false);
  // Stato per tenere traccia dei video in attesa di essere caricati (coda)
  const [uploadQueue, setUploadQueue] = useState([]);

  // Stato per tenere traccia di quale video è attualmente in upload
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const [multiVideoData, setMultiVideoData] = useState(
    Array(10)
      .fill()
      .map(() => ({
        titolo: "",
        durata: "",
        file: null,
        stagioneId: "",
        isUploading: false, // Nuovo stato di caricamento per ogni form
        progress: 0, // Stato del progresso di upload per ogni form
        uploadPhase: "", // Fase di upload per ogni form
        uploadComplete: false, // Stato di completamento per ogni form
      }))
  );

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
    setShowVideoOptions(!showVideoOptions); // Mostra/Nasconde le opzioni
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
  // Funzione per gestire i cambiamenti degli input in SEZIONE
  const handleSezioneTagChange = (e) => {
    const { value, checked } = e.target;
    setSezioneData((prevData) => ({
      ...prevData,
      tag: checked
        ? [...prevData.tag, value] // Aggiunge il tag se selezionato
        : prevData.tag.filter((tag) => tag !== value), // Rimuove il tag se deselezionato
    }));
  };
  // Funzione per gestire i cambiamenti degli input in STAGIONE
  const handleStagioneFileChange = (e) => {
    const file = e.target.files[0];

    console.log("📂 File selezionato:", file ? file.name : "Nessun file");

    setStagioneData((prevState) => ({
      ...prevState,
      file: file,
    }));
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
  const handleVideoInputChange = (e, index) => {
    const { name, value } = e.target;
    setMultiVideoData((prevState) => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], [name]: value };
      return newState;
    });
  };

  // Funzione per gestire il caricamento del file VIDEO

  const handleVideoFileChange = (e, index) => {
    const file = e.target.files[0];
    setMultiVideoData((prevState) => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], file };
      return newState;
    });
  };

  // -------------------FETCH-------------------
  // Funzione per gestire l'invio del form
  const handleFilmSubmit = async (e) => {
    e.preventDefault();

    if (
      !filmData.titolo ||
      !filmData.genere ||
      !filmData.durata ||
      !filmData.file
    ) {
      alert("⚠️ Compila tutti i campi obbligatori.");
      return;
    }

    setProgress(0);
    setIsUploading(true);
    setUploadPhase("Compressione in corso...");
    setUploadComplete(false);

    // Simula la compressione (0% -> 50%)
    for (let i = 0; i <= 50; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(i);
    }

    const formData = new FormData();
    formData.append("titolo", filmData.titolo);
    formData.append("genere", filmData.genere);
    formData.append("durata", filmData.durata);
    formData.append("file", filmData.file);

    try {
      setUploadPhase("Caricamento in corso...");
      cancelTokenSource.current = axios.CancelToken.source();

      const response = await axios.post(
        "http://localhost:3001/api/film/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 50) / progressEvent.total + 50
            );
            setProgress(percentCompleted);
          },
          cancelToken: cancelTokenSource.current.token,
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Film caricato con successo:", response.data);
        setUploadPhase("✅ Caricamento completato con successo!");
        setUploadComplete(true);

        // 🔥 Mostra alert di successo
        alert("✅ Film caricato con successo!");

        // ✅ Svuota tutti i campi del form
        setFilmData({ titolo: "", genere: "", durata: "", file: null });

        // ✅ Svuota il file input manualmente
        document.getElementById("formFileFilm").value = "";

        setTimeout(() => {
          setIsUploading(false);
          setProgress(0);
        }, 2000);
      } else {
        console.error("Errore durante la creazione del film:", response.data);
        setUploadPhase("❌ Errore nel caricamento!");
        setIsUploading(false);
        alert("❌ Errore durante il caricamento del film!");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        setUploadPhase("⛔ Upload annullato!");
        alert("⛔ Upload annullato!");
      } else {
        console.error("Errore nella richiesta:", error.message);
        setUploadPhase("❌ Errore nella richiesta!");
        alert(`❌ Errore: ${error.message}`);
      }
      setIsUploading(false);
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
      alert("⚠️ Compila tutti i campi obbligatori.");
      return;
    }

    // Reset dello stato di upload
    setIsUploading(true);
    setProgress(0);
    setUploadComplete(false);
    setUploadError(null);

    const formData = new FormData();
    formData.append("titolo", sezioneData.titolo);
    formData.append("tag", sezioneData.tag.join(","));
    formData.append("anno", sezioneData.anno);
    formData.append("file", sezioneData.file);

    // Debugging: Log del FormData
    console.log("📦 Payload inviato:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/sezioni",
        formData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setUploadComplete(true);
        setIsUploading(false);
        alert("✅ Sezione creata con successo!");
        setSezioneData({ titolo: "", tag: [], anno: "", file: null });
      } else {
        throw new Error("Errore nella creazione della sezione");
      }
    } catch (error) {
      setUploadError(error.message);
      setIsUploading(false);
    }
  };

  const handleStagioneSubmit = async (e) => {
    e.preventDefault();

    // Validazione dei campi obbligatori
    if (!stagioneData.titolo || !stagioneData.anno || !selectedSezioneId) {
      alert("⚠️ Compila tutti i campi obbligatori.");
      return;
    }

    // Reset dello stato di upload
    setIsUploading(true);
    setProgress(0);
    setUploadComplete(false);
    setUploadError(null);

    const formData = new FormData();
    formData.append("titolo", stagioneData.titolo);
    formData.append("anno", stagioneData.anno);
    formData.append("sezioneId", selectedSezioneId);

    if (stagioneData.file) {
      formData.append("immagine", stagioneData.file);
    }

    // Debugging: Log del FormData
    console.log("📦 Payload inviato:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(
          `   🖼️ ${pair[0]}:`,
          pair[1].name,
          "| Tipo:",
          pair[1].type,
          "| Dimensione:",
          pair[1].size
        );
      } else {
        console.log(`   📝 ${pair[0]}:`, pair[1]);
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/stagioni",
        formData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setUploadComplete(true);
        setIsUploading(false);
        alert("✅ Stagione creata con successo!");
        setStagioneData({ titolo: "", anno: "", sezioneId: "", file: null });
        setSelectedSezioneId("");
      } else {
        throw new Error("Errore nella creazione della stagione");
      }
    } catch (error) {
      setUploadError(error.message);
      setIsUploading(false);
    }
  };

  // Funzione per la creazione di un nuovo VIDEO

  const handleVideoSubmit = async (e, index) => {
    e.preventDefault();

    const video = multiVideoData[index];

    if (!video.titolo || !video.durata || !video.file || !video.stagioneId) {
      alert("⚠️ Compila tutti i campi obbligatori.");
      return;
    }

    // Se c'è già un upload in corso, mettiamo il video in coda
    if (uploadingIndex !== null) {
      setUploadQueue((prevQueue) => [...prevQueue, index]);
      return;
    }

    // Se nessun upload è in corso, avvia direttamente l'upload
    startVideoUpload(index);
  };

  const processNextUpload = () => {
    setUploadingIndex(null); // Reset dell'upload attivo

    setUploadQueue((prevQueue) => {
      if (prevQueue.length > 0) {
        const [nextIndex, ...remainingQueue] = prevQueue; // Prende solo il primo in coda
        startVideoUpload(nextIndex); // Avvia solo UN video
        return remainingQueue; // Rimuove SOLO il video appena partito dalla coda
      }
      return []; // Se non ci sono più video in coda, la lista resta vuota
    });
  };
  const startVideoUpload = async (index) => {
    setUploadingIndex(index); // Indichiamo quale video è in upload
    const video = multiVideoData[index];
    const cancelToken = axios.CancelToken.source();

    setMultiVideoData((prevState) => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        isUploading: true,
        progress: 0,
        uploadPhase: "Compressione in corso...",
        uploadComplete: false,
        cancelToken,
      };
      return newState;
    });

    const formData = new FormData();
    formData.append("titolo", video.titolo);
    formData.append("durata", video.durata);
    formData.append("file", video.file);
    formData.append("stagioneId", video.stagioneId);

    try {
      setMultiVideoData((prevState) => {
        const newState = [...prevState];
        newState[index].uploadPhase = "Caricamento in corso...";
        return newState;
      });

      const response = await axios.post(
        "http://localhost:3001/api/video/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setMultiVideoData((prevState) => {
              const newState = [...prevState];
              newState[index].progress = percentCompleted;
              return newState;
            });
          },
          cancelToken: cancelToken.token,
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Video caricato con successo:", response.data);

        setMultiVideoData((prevState) => {
          const newState = [...prevState];
          newState[index] = {
            ...newState[index],
            isUploading: false,
            progress: 100,
            uploadPhase: "✅ Caricamento completato!",
            uploadComplete: true,
            cancelToken: null,
          };
          return newState;
        });
      } else {
        throw new Error("Errore durante il caricamento!");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("⛔ Upload annullato!");
      } else {
        console.error("❌ Errore nella richiesta:", error.message);
      }
    } finally {
      setUploadingIndex(null);
      processNextUpload();
    }
  };

  const handleRemoveFromQueue = (index) => {
    setUploadQueue((prevQueue) => prevQueue.filter((i) => i !== index));
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

  // effettua una richiesta per ottenere le STAGIONI
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
                handleFilmSubmit,
                isUploading,
                progress,
                uploadPhase,
                uploadComplete,
                cancelTokenSource
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
                  {showVideoOptions && (
                    <div className="mt-3">
                      <Button
                        className="button-tvseries"
                        onClick={() => setShowVideoForm(true)}
                      >
                        Video Singolo
                      </Button>
                      <Button
                        className="button-tvseries"
                        onClick={() => setShowMultiVideoModal(true)}
                      >
                        Fino a 10
                      </Button>
                    </div>
                  )}
                </div>
                {/* Form per aggiungere una sezione */}
                {showSezioneForm &&
                  renderSezioneForm(
                    handleSezioneSubmit,
                    sezioneData,
                    handleSezioneInputChange,
                    handleSezioneFileChange,
                    tagOptions,
                    handleSezioneTagChange,
                    showTagList,
                    setShowTagList,
                    isUploading,
                    progress,
                    uploadComplete,
                    uploadError
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
                    handleStagioneFileChange,
                    isUploading,
                    progress,
                    uploadComplete,
                    uploadError
                  )}
                {/* Form per aggiungere un video */}
                {showVideoForm &&
                  showVideoOptions &&
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
                    handleVideoSubmit,
                    isUploading,
                    progress,
                    uploadPhase,
                    uploadComplete,
                    cancelTokenSource
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
              <Button className="button-admin" as={Link} to={"/editvideo"}>
                Edit Serie TV
              </Button>
            </div>
          </Col>
          <Col md={5} className="section-admin">
            <Button className="button-admin">Edit Radio</Button>
          </Col>
        </Row>
      </Container>
      {showMultiVideoModal && (
        <div
          className="multi-video-overlay"
          onClick={() => setShowMultiVideoModal(false)}
        >
          <div
            className="multi-video-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-btn"
              onClick={() => setShowMultiVideoModal(false)}
            >
              ✖
            </button>

            <div className="multi-video-grid">
              {multiVideoData.map((video, index) => (
                <div key={index} className="video-modal">
                  <h3>Video {index + 1}</h3>
                  {renderVideoForm(
                    sezioni,
                    selectedSezioneId,
                    setSelectedSezioneId,
                    stagioni,
                    fetchStagioni,
                    setStagioni,
                    video,
                    (newVideo) => {
                      const newMultiVideoData = [...multiVideoData];
                      newMultiVideoData[index] = newVideo;
                      setMultiVideoData(newMultiVideoData);
                    },
                    (e) => handleVideoInputChange(e, index), // Passiamo l'index giusto!
                    (e) => handleVideoFileChange(e, index), // Anche per il file!
                    (e) => handleVideoSubmit(e, index), // Anche per il submit!
                    video.isUploading,
                    video.progress,
                    video.uploadPhase,
                    video.uploadComplete,
                    cancelTokenSource,
                    uploadQueue,
                    uploadingIndex,
                    index,
                    handleRemoveFromQueue
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---FUNZIONI FORM----
// Form per aggiungere un film
const renderFilmForm = (
  filmData,
  handleFilmInputChange,
  handleFileChange,
  handleFilmSubmit,
  isUploading,
  progress,
  uploadPhase,
  uploadComplete,
  cancelTokenSource
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

      <Form.Group controlId="formFileFilm" className="mb-3">
        <Form.Label className="text-gold">File</Form.Label>
        <Form.Control type="file" name="file" onChange={handleFileChange} />
      </Form.Group>

      {/* Pulsante di invio disabilitato durante l'upload */}
      <Button type="submit" className="button-admin" disabled={isUploading}>
        {isUploading ? "Caricamento..." : "Aggiungi Film"}
      </Button>

      {/* Bottone "Stop" per annullare l'upload */}
      {isUploading && (
        <Button
          variant="danger"
          className="ml-2"
          onClick={() => {
            if (cancelTokenSource.current) cancelTokenSource.current.cancel();
          }}
        >
          Stop
        </Button>
      )}

      {/* Barra di caricamento */}
      {isUploading && (
        <div className="mt-3">
          <p>{uploadPhase}</p>
          <ProgressBar now={progress} label={`${progress}%`} />
        </div>
      )}

      {/* Messaggio di successo dopo il caricamento */}
      {uploadComplete && (
        <div className="mt-3 text-success">✅ Film caricato con successo!</div>
      )}
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
  handleSezioneTagChange,
  showTagList,
  setShowTagList,
  isUploading,
  progress,
  uploadComplete,
  uploadError
) => (
  <div className="mt-3">
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
        <Button onClick={() => setShowTagList(!showTagList)} className="w-100">
          {sezioneData.tag.length > 0
            ? sezioneData.tag.join(", ")
            : "Seleziona i tag"}
        </Button>

        {showTagList && (
          <div>
            <div className="d-flex flex-wrap">
              {tagOptions.map((tag) => (
                <div key={tag} className="p-2" style={{ width: "33%" }}>
                  <Form.Check
                    type="checkbox"
                    label={tag}
                    value={tag}
                    checked={sezioneData.tag.includes(tag)}
                    onChange={handleSezioneTagChange}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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

      <Button type="submit" className="button-admin" disabled={isUploading}>
        {isUploading ? "Caricamento..." : "Aggiungi Sezione"}
      </Button>

      {/* Barra di avanzamento durante il caricamento */}
      {isUploading && (
        <div className="mt-3">
          <ProgressBar now={progress} label={`${progress}%`} />
        </div>
      )}

      {/* Messaggi di successo o errore */}
      {uploadComplete && (
        <div className="mt-3 text-success">✅ Sezione creata con successo!</div>
      )}
      {uploadError && (
        <div className="mt-3 text-danger">
          ❌ Errore nella creazione della sezione: {uploadError}
        </div>
      )}
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
  handleStagioneFileChange,
  isUploading,
  progress,
  uploadComplete,
  uploadError
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
          value={selectedSezioneId}
          onChange={(e) => setSelectedSezioneId(e.target.value)}
        >
          <option value="">Seleziona una sezione</option>
          {sezioni.map((sezione) => (
            <option key={sezione.id} value={sezione.id}>
              {sezione.titolo}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Pulsante di invio bloccato durante l'upload */}
      <Button type="submit" className="mt-3" disabled={isUploading}>
        {isUploading ? "Caricamento..." : "Crea Stagione"}
      </Button>

      {/* Barra di avanzamento durante il caricamento */}
      {isUploading && (
        <div className="mt-3">
          <ProgressBar now={progress} label={`${progress}%`} />
        </div>
      )}

      {/* Messaggi di successo o errore */}
      {uploadComplete && (
        <div className="mt-3 text-success">
          ✅ Stagione creata con successo!
        </div>
      )}
      {uploadError && (
        <div className="mt-3 text-danger">
          ❌ Errore nella creazione della stagione: {uploadError}
        </div>
      )}
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
  handleVideoSubmit,
  isUploading,
  progress,
  uploadPhase,
  uploadComplete,
  cancelTokenSource,
  uploadQueue,
  uploadingIndex,
  index,
  handleRemoveFromQueue
) => (
  <div className="form-container mt-3">
    {uploadQueue.includes(index) && (
      <div className="alert alert-warning text-center">🕐 In coda...</div>
    )}

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
            fetchStagioni(sezioneId);
          } else {
            setStagioni([]);
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
              onChange={(e) =>
                setVideoData({ ...videoData, titolo: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formDurataVideo" className="mb-3">
            <Form.Label>Durata</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci la durata"
              name="durata"
              value={videoData.durata}
              onChange={(e) =>
                setVideoData({ ...videoData, durata: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formFileVideo" className="mb-3">
            <Form.Label>File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) =>
                setVideoData({ ...videoData, file: e.target.files[0] })
              }
            />
          </Form.Group>

          {/* Pulsante di invio bloccato durante l'upload */}
          {!uploadQueue.includes(index) && !isUploading && (
            <Button type="submit" className="button-admin">
              Invia Video
            </Button>
          )}

          {/* Pulsante Stop per annullare l'upload */}
          {isUploading && (
            <Button
              variant="danger"
              className="ml-2"
              onClick={() => {
                if (cancelTokenSource.current)
                  cancelTokenSource.current.cancel();
              }}
            >
              Stop
            </Button>
          )}

          {/* Pulsante per rimuovere il video dalla coda */}
          {uploadQueue.includes(index) && !isUploading && (
            <Button
              variant="warning"
              className="ml-2"
              onClick={() => handleRemoveFromQueue(index)}
            >
              Rimuovi dalla coda
            </Button>
          )}

          {/* Barra di avanzamento durante il caricamento */}
          {isUploading && (
            <div className="mt-3">
              <p>{uploadPhase}</p>
              <ProgressBar now={progress} label={`${progress}%`} />
            </div>
          )}

          {/* Messaggio di successo dopo il caricamento */}
          {uploadComplete && (
            <div className="mt-3 text-success">
              ✅ Caricamento completato con successo!
            </div>
          )}
        </Form>
      </div>
    )}
  </div>
);

export default Admin;
