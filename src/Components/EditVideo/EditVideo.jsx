import "../../App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import {
  Tab,
  Nav,
  Table,
  Spinner,
  Alert,
  Container,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { Info } from "lucide-react";
import "react-tooltip/dist/react-tooltip.css";

const EditVideo = () => {
  //-------------------STATI-------------------
  const [sezioni, setSezioni] = useState([]);
  const [stagioni, setStagioni] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [showTagList, setShowTagList] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID del video in modifica
  const [isLoading, setIsLoading] = useState(false); // Stato per gestire lo spinner di caricamento
  const [editingStagioneId, setEditingStagioneId] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [editedStagione, setEditedStagione] = useState({
    titolo: "",
    anno: "",
  });

  const [newVideoFile, setNewVideoFile] = useState(null); // File video nuovo
  const [editedVideo, setEditedVideo] = useState({
    titolo: "",
    durata: "",
  });

  const [loading, setLoading] = useState({
    sezioni: true,
    stagioni: true,
    videos: true,
  });
  const [error, setError] = useState({
    sezioni: null,
    stagioni: null,
    videos: null,
  });

  // filtro ricerche VIDEO
  const [search, setSearch] = useState({
    titolo: "",
    sezione: "",
    stagione: "",
    bucket: "",
  });
  // filtro ricerca SEZIONI
  const [searchSezione, setSearchSezione] = useState({
    titolo: "",
    tag: [],
    anno: "",
  });

  // sorted video
  const [sortConfig, setSortConfig] = useState({
    key: "dataCaricamento",
    direction: "desc",
  });

  const sortedVideos = [...videos].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valueA = a[sortConfig.key];
    let valueB = b[sortConfig.key];

    // ordinando per data convertiamo in timestamp
    if (sortConfig.key === "dataCaricamento") {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }

    // Ordinamento alfabetico per sezione e stagione
    if (
      sortConfig.key === "sezioneTitolo" ||
      sortConfig.key === "stagioneTitolo"
    ) {
      valueA = valueA ? valueA.toLowerCase() : "";
      valueB = valueB ? valueB.toLowerCase() : "";
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleEdit = (video) => {
    setEditingId(video.id);
    setEditedVideo({
      titolo: video.titolo,
      durata: video.durata,
      stagioneId: video.stagioneId || video.stagione?.id || "",
    });
  };

  const handleEditStagione = (stagione) => {
    setEditingStagioneId(stagione.id);
    setEditedStagione({
      titolo: stagione.titolo,
      anno: stagione.anno,
    });
    setNewImageFile(null);
  };

  //---------------------FUNZIONI-------------------

  // Funzione per eliminare un elemento (Sezione, Stagione, Video)
  const handleDelete = async (id, type, fetchFunction) => {
    const confirmDelete = window.confirm(
      `⚠️ Are you sure you want to delete this ${type}?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/${type}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`,
        },
      });

      if (response.ok) {
        alert(`✅ ${type} deleted successfully!`);
        fetchFunction(); // Ricarica i dati dopo la cancellazione
      } else {
        alert(`❌ Error deleting ${type}!`);
      }
    } catch (error) {
      alert(`❌ Error deleting ${type}: ` + error.message);
    }
  };
  const handleSaveStagione = async (stagioneId) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Aggiungi solo i campi modificati per evitare di inviare dati vuoti
      if (editedStagione.titolo) {
        formData.append("titolo", editedStagione.titolo);
      }
      if (editedStagione.anno) {
        formData.append("anno", editedStagione.anno);
      }
      if (newImageFile) {
        formData.append("immagine", newImageFile);
      }

      const response = await fetch(
        `http://localhost:3001/api/stagioni/${stagioneId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`, // 🔹 Inserire il token corretto
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento della stagione");
      }

      alert("✅ Modifica effettuata con successo!");
      fetchStagioni(); // 🔄 Ricarica la lista aggiornata

      setEditingStagioneId(null);
      setEditedStagione({ titolo: "", anno: "" });
      setNewImageFile(null);
    } catch (error) {
      alert(`❌ Errore nel salvataggio: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per aggiornare l'ordinamento quando si clicca su un'intestazione
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // funzione per gestire la selezione multipla dei tag
  const toggleTagSelection = (tag) => {
    setSearchSezione((prevSearch) => {
      const isSelected = prevSearch.tag.includes(tag);
      const updatedTags = isSelected
        ? prevSearch.tag.filter((t) => t !== tag) // Rimuove il tag se già selezionato
        : [...prevSearch.tag, tag]; // Aggiunge il tag se non selezionato
      return { ...prevSearch, tag: updatedTags };
    });
  };

  //-----------USEEFFECT-------------

  // Carica Sezioni,Video in tempo reale mentre scrivi nella barra di ricerca
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSezioni();
      fetchVideos();
    }, 500); // Ritardo di 5sec

    return () => clearTimeout(delayDebounceFn);
  }, [searchSezione, search]);

  // Carica stagioni, video e tag SOLO una volta al primo caricamento
  useEffect(() => {
    fetchStagioni();
    fetchVideos();
    fetchTags();
  }, []);

  //-------------FETCH-----------------
  // Fetch Sezioni
  const fetchSezioni = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchSezione.titolo)
        queryParams.append("titolo", searchSezione.titolo);
      if (searchSezione.anno) queryParams.append("anno", searchSezione.anno);

      // Invia i tag come parametri multipli
      searchSezione.tag.forEach((tag) => queryParams.append("tag", tag));

      const response = await fetch(
        `http://localhost:3001/api/sezioni?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`,
          },
        }
      );

      if (!response.ok) throw new Error("Errore nel recupero delle sezioni");

      setSezioni(await response.json());
    } catch (error) {
      setError((prev) => ({ ...prev, sezioni: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, sezioni: false }));
    }
  };

  // Fetch Stagioni
  const fetchStagioni = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/stagioni", {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`,
        },
      });

      if (!response.ok) throw new Error("Errore nel recupero delle stagioni");

      setStagioni(await response.json());
    } catch (error) {
      setError((prev) => ({ ...prev, stagioni: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, stagioni: false }));
    }
  };

  // Fetch Video
  const fetchVideos = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (search.titolo) queryParams.append("titolo", search.titolo);
      if (search.sezione) queryParams.append("sezione", search.sezione);
      if (search.stagione) queryParams.append("stagione", search.stagione);
      if (search.bucket) queryParams.append("bucket", search.bucket);

      const response = await fetch(
        `http://localhost:3001/api/video?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`,
          },
        }
      );

      if (!response.ok) throw new Error("Errore nel recupero dei video");

      setVideos(await response.json());
    } catch (error) {
      setError((prev) => ({ ...prev, videos: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, videos: false }));
    }
  };

  // Fetch Tags
  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/sezioni/tags", {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`,
        },
      });
      if (!response.ok) throw new Error("Errore nel recupero dei tags");
      const tags = await response.json();
      setTagOptions(tags);
    } catch (error) {
      console.error("Errore nel caricamento dei tags:", error);
    }
  };

  const handleSave = async (videoId) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Aggiungi solo i campi modificati per evitare di inviare valori vuoti
      if (editedVideo.titolo) {
        formData.append("titolo", editedVideo.titolo);
      }
      if (editedVideo.durata) {
        formData.append("durata", editedVideo.durata);
      }
      if (editedVideo.stagioneId) {
        formData.append("stagioneId", editedVideo.stagioneId);
      }
      if (newVideoFile) {
        formData.append("file", newVideoFile);
      }

      const response = await fetch(
        `http://localhost:3001/api/video/${videoId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`,
          },
          body: formData, // Inviamo solo i dati aggiornati
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Errore durante il salvataggio");
      }

      alert("✅ Modifica effettuata con successo!");

      // Ricarichiamo i dati per aggiornare la tabella
      fetchVideos();

      // Uscire dalla modalità edit
      setEditingId(null);
      setEditedVideo({ titolo: "", durata: "", stagioneId: "" });
      setNewVideoFile(null);
    } catch (error) {
      alert(`❌ Errore nel salvataggio: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="d-flex justify-content-around mt-3">
        <h2 className="">Admin Dashboard</h2>
        <div>
          <Button className="me-3 button-admin" as={Link} to="/admin">
            Admin
          </Button>
          <Button as={Link} className="button-admin" to="/home">
            Home
          </Button>
        </div>
      </header>
      <Container fluid className="mt-4">
        <Row>
          <Col xs={12} md={11}>
            <Tab.Container defaultActiveKey="sezioni">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="sezioni">📂 Sezioni</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="stagioni">📺 Stagioni</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="videos">🎬 Video</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                {/*-------------- Sezioni-------------- */}
                <Tab.Pane eventKey="sezioni">
                  {loading.sezioni && <Spinner animation="border" />}
                  {error.sezioni && (
                    <Alert variant="danger">❌ {error.sezioni}</Alert>
                  )}

                  {/* Barra di ricerca per le sezioni */}
                  <div className="d-flex mb-3">
                    <div className="d-flex">
                      <div className="me-2">
                        {" "}
                        <input
                          type="text"
                          placeholder="Cerca per titolo..."
                          className=" form-control"
                          value={searchSezione.titolo}
                          onChange={(e) =>
                            setSearchSezione({
                              ...searchSezione,
                              titolo: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") fetchSezioni();
                          }}
                        />
                      </div>
                      <div>
                        <Form.Group controlId="searchTagSezione">
                          <Button onClick={() => setShowTagList(!showTagList)}>
                            {searchSezione.tag.length > 0
                              ? searchSezione.tag.join(", ")
                              : "Seleziona i tag"}
                          </Button>

                          {showTagList && (
                            <div className="border p-2 d-flex">
                              {tagOptions.map((tag) => (
                                <Form.Check
                                  key={tag}
                                  type="checkbox"
                                  label={tag}
                                  value={tag}
                                  checked={searchSezione.tag.includes(tag)}
                                  onChange={() => toggleTagSelection(tag)}
                                />
                              ))}
                            </div>
                          )}
                        </Form.Group>
                      </div>
                      <div className="me-2">
                        <input
                          type="text"
                          placeholder="Cerca per anno..."
                          className="form-control"
                          value={searchSezione.anno}
                          onChange={(e) =>
                            setSearchSezione({
                              ...searchSezione,
                              anno: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") fetchSezioni();
                          }}
                        />
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      onClick={fetchSezioni}
                      className="ms-2"
                    >
                      🔎 Cerca
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearchSezione({ titolo: "", tag: [], anno: "" });
                        fetchSezioni();
                      }}
                      className="ms-2"
                    >
                      ❌ Reset
                    </Button>
                  </div>

                  {!loading.sezioni && !error.sezioni && (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>UUID</th>
                          <th>Titolo</th>
                          <th>Tag</th>
                          <th>Anno</th>
                          <th>Immagine</th>
                          <th>Opzioni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sezioni.map((sezione) => (
                          <tr key={sezione.id}>
                            <td>{sezione.id}</td>
                            <td>{sezione.titolo}</td>
                            <td>{sezione.tag.join(", ")}</td>
                            <td>{sezione.anno}</td>
                            <td>
                              <Button
                                variant="link"
                                size="sm"
                                href={sezione.foto}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                🔗 Apri
                              </Button>
                            </td>

                            <td>
                              <Button variant="warning" size="sm" disabled>
                                ✏️ Edit
                              </Button>{" "}
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleDelete(
                                    sezione.id,
                                    "sezioni",
                                    fetchSezioni
                                  )
                                }
                              >
                                🗑️ Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab.Pane>

                {/* Stagioni */}
                <Tab.Pane eventKey="stagioni">
                  {loading.stagioni && <Spinner animation="border" />}
                  {error.stagioni && (
                    <Alert variant="danger">❌ {error.stagioni}</Alert>
                  )}
                  {!loading.stagioni && !error.stagioni && (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>UUID</th>
                          <th>Titolo</th>
                          <th>Anno</th>
                          <th>Sezione</th>
                          <th>immagine</th>
                          <th>Opzioni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stagioni.map((stagione) => (
                          <tr key={stagione.id}>
                            <td>{stagione.id}</td>

                            {/* 🔹 Titolo: diventa un form quando si edita */}
                            <td>
                              {editingStagioneId === stagione.id ? (
                                <Form.Control
                                  type="text"
                                  value={editedStagione.titolo}
                                  onChange={(e) =>
                                    setEditedStagione({
                                      ...editedStagione,
                                      titolo: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                stagione.titolo
                              )}
                            </td>

                            {/* 🔹 Anno: diventa un form quando si edita */}
                            <td>
                              {editingStagioneId === stagione.id ? (
                                <Form.Control
                                  type="text"
                                  value={editedStagione.anno}
                                  onChange={(e) =>
                                    setEditedStagione({
                                      ...editedStagione,
                                      anno: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                stagione.anno
                              )}
                            </td>

                            {/* 🔹 Sezione: campo non modificabile */}
                            <td>{stagione.sezioneTitolo}</td>

                            {/* 🔹 Immagine: pulsante Apri + Nuova immagine */}
                            <td>
                              <Button
                                variant="link"
                                size="sm"
                                href={stagione.immagineUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                🔗 Apri
                              </Button>

                              {/* Mostra il pulsante solo quando si sta modificando */}
                              {editingStagioneId === stagione.id && (
                                <>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `image-upload-${stagione.id}`
                                        )
                                        .click()
                                    }
                                  >
                                    📸 Nuova Immagine
                                  </Button>
                                  <input
                                    type="file"
                                    id={`image-upload-${stagione.id}`}
                                    style={{ display: "none" }}
                                    onChange={(e) =>
                                      setNewImageFile(e.target.files[0])
                                    }
                                  />
                                  {newImageFile && (
                                    <p className="mt-1 text-success">
                                      {newImageFile.name}
                                    </p>
                                  )}
                                </>
                              )}
                            </td>

                            {/* 🔹 Opzioni: Edit → Salva */}
                            <td>
                              {editingStagioneId === stagione.id ? (
                                <>
                                  {isLoading ? (
                                    <Spinner
                                      animation="border"
                                      size="sm"
                                      role="status"
                                    >
                                      <span className="visually-hidden">
                                        Caricamento...
                                      </span>
                                    </Spinner>
                                  ) : (
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={() =>
                                        handleSaveStagione(stagione.id)
                                      }
                                    >
                                      💾 Salva
                                    </Button>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => handleEditStagione(stagione)}
                                  >
                                    ✏️ Edit
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDelete(
                                        stagione.id,
                                        "stagioni",
                                        fetchStagioni
                                      )
                                    }
                                  >
                                    🗑️ Delete
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab.Pane>

                {/* Video */}
                <Tab.Pane eventKey="videos">
                  {loading.videos && <Spinner animation="border" />}
                  {error.videos && (
                    <Alert variant="danger">❌ {error.videos}</Alert>
                  )}

                  {/* Barra di ricerca Video */}
                  <div className="d-flex mb-3">
                    <input
                      type="text"
                      placeholder="Cerca per sezione..."
                      className="form-control me-2"
                      value={search.sezione}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          sezione: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Cerca per stagione..."
                      className="form-control me-2"
                      value={search.stagione}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          stagione: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Cerca per titolo..."
                      className="form-control me-2"
                      value={search.titolo}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          titolo: e.target.value,
                        }))
                      }
                    />

                    <div>
                      <Info
                        size={18}
                        data-tooltip-id="my-tooltip"
                        style={{ cursor: "pointer" }}
                      />

                      <Tooltip id="my-tooltip" place="top" effect="solid">
                        Inserire nome bucket completo es. "kun-tv2"
                      </Tooltip>
                    </div>
                    <input
                      type="text"
                      placeholder="Cerca per bucket..."
                      className="form-control"
                      value={search.bucket}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          bucket: e.target.value,
                        }))
                      }
                    />

                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearch({
                          titolo: "",
                          sezione: "",
                          stagione: "",
                          bucket: "",
                        });
                      }}
                      className="ms-2"
                    >
                      ❌ Reset
                    </Button>
                  </div>

                  {!loading.videos && !error.videos && (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>UUID</th>
                          <th>Titolo</th>
                          <th>Durata</th>
                          <th
                            onClick={() => requestSort("stagioneTitolo")}
                            style={{ cursor: "pointer" }}
                          >
                            Stagione ⬍
                          </th>
                          <th
                            onClick={() => requestSort("sezioneTitolo")}
                            style={{ cursor: "pointer" }}
                          >
                            Sezione ⬍
                          </th>
                          <th>Bucket</th>
                          <th>Link</th>
                          <th
                            onClick={() => requestSort("dataCaricamento")}
                            style={{ cursor: "pointer" }}
                          >
                            Data Caricamento ⬍
                          </th>
                          <th>Opzioni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedVideos.map((video) => (
                          <tr key={video.id}>
                            <td>{video.id}</td>
                            <td>
                              {editingId === video.id ? (
                                <Form.Control
                                  type="text"
                                  name="titolo"
                                  value={editedVideo.titolo}
                                  onChange={(e) =>
                                    setEditedVideo({
                                      ...editedVideo,
                                      titolo: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                video.titolo
                              )}
                            </td>

                            <td>
                              {editingId === video.id ? (
                                <>
                                  {console.log(
                                    "Sezione del video:",
                                    video.sezioneId
                                  )}
                                  {console.log(
                                    "Stagioni disponibili:",
                                    stagioni
                                  )}

                                  <Form.Control
                                    type="text"
                                    name="durata"
                                    value={editedVideo.durata}
                                    onChange={(e) =>
                                      setEditedVideo({
                                        ...editedVideo,
                                        durata: e.target.value,
                                      })
                                    }
                                  />
                                </>
                              ) : (
                                video.durata
                              )}
                            </td>

                            <td>
                              {editingId === video.id ? (
                                <Form.Select
                                  value={editedVideo.stagioneId}
                                  onChange={(e) =>
                                    setEditedVideo({
                                      ...editedVideo,
                                      stagioneId: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">
                                    {video.stagioneTitolo}
                                  </option>
                                  {stagioni
                                    .filter(
                                      (stagione) =>
                                        stagione.sezioneId === video.sezioneId
                                    )
                                    .map((stagione) => (
                                      <option
                                        key={stagione.id}
                                        value={stagione.id}
                                      >
                                        {stagione.titolo}
                                      </option>
                                    ))}
                                </Form.Select>
                              ) : (
                                video.stagioneTitolo || "N/A"
                              )}
                            </td>

                            <td>{video.sezioneTitolo}</td>
                            <td>
                              {video.fileLink
                                .split(".")[0]
                                .replace("https://", "")}
                            </td>
                            <td className="d-flex">
                              <td>
                                {editingId === video.id ? (
                                  <>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        document
                                          .getElementById(
                                            `file-upload-${video.id}`
                                          )
                                          .click()
                                      }
                                    >
                                      📂 Nuovo Video
                                    </Button>
                                    <input
                                      type="file"
                                      id={`file-upload-${video.id}`}
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        setNewVideoFile(e.target.files[0])
                                      }
                                    />
                                    {newVideoFile && (
                                      <p className="mt-1 text-success">
                                        {newVideoFile.name}
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          video.fileLink
                                        )
                                      }
                                    >
                                      📋 Copia
                                    </Button>
                                  </>
                                )}
                              </td>{" "}
                              <Button
                                variant="link"
                                size="sm"
                                href={video.fileLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                🔗 Apri
                              </Button>
                            </td>
                            <td>
                              {new Date(video.dataCaricamento).toLocaleString()}
                            </td>
                            <td>
                              {editingId === video.id ? (
                                <>
                                  {isLoading ? (
                                    <Spinner
                                      animation="border"
                                      size="sm"
                                      role="status"
                                    >
                                      <span className="visually-hidden">
                                        Caricamento...
                                      </span>
                                    </Spinner>
                                  ) : (
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={() => handleSave(video.id)}
                                    >
                                      💾 Salva
                                    </Button>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => handleEdit(video)}
                                  >
                                    ✏️ Edit
                                  </Button>

                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDelete(
                                        video.id,
                                        "video",
                                        fetchVideos
                                      )
                                    }
                                  >
                                    🗑️ Delete
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
          <Col xs={12} md={1}>
            <div
              className="card mt-5 text-center"
              style={{ backgroundColor: "#f2f2f2" }}
            >
              <h6 className="mt-3 fw-bold">TOTALE</h6>
              <div className="card-body">
                <p className="card-title">
                  Sezioni:{" "}
                  <span className="text-success fw-bold">{sezioni.length}</span>
                </p>
                <p className="card-title">
                  Stagioni:{" "}
                  <span className="text-success fw-bold">
                    {stagioni.length}
                  </span>
                </p>
                <p className="card-title">
                  Video:{" "}
                  <span className="text-success fw-bold ">
                    {" "}
                    {videos.length}
                  </span>{" "}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditVideo;
