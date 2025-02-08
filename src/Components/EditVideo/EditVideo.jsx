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
} from "react-bootstrap";
import { Link } from "react-router-dom";

const EditVideo = () => {
  //-------------------STATI-------------------
  const [sezioni, setSezioni] = useState([]);
  const [stagioni, setStagioni] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tagOptions, setTagOptions] = useState([]); // Lista dei tag presi dal backend
  const [showTagList, setShowTagList] = useState(false); // Controlla la visibilità della lista

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

    // Se stiamo ordinando per data, convertiamo in timestamp
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
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
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

  // Carica sezioni in tempo reale mentre scrivi nella barra di ricerca
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSezioni();
    }, 500); // Ritardo di 500ms per evitare chiamate API eccessive

    return () => clearTimeout(delayDebounceFn);
  }, [searchSezione]); // Si attiva solo quando cambia searchSezione

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
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
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
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
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
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
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
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
        },
      });
      if (!response.ok) throw new Error("Errore nel recupero dei tags");
      const tags = await response.json();
      setTagOptions(tags);
    } catch (error) {
      console.error("Errore nel caricamento dei tags:", error);
    }
  };
  return (
    <>
      <header className="d-flex justify-content-around mt-3">
        <h2 className="">⚙️ Admin Dashboard</h2>
        <div>
          <Button className="me-3" as={Link} to="/admin">
            Admin
          </Button>
          <Button as={Link} to="/home">
            Home
          </Button>
        </div>
      </header>

      <Container className="mt-4">
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
                <div className="dflex"></div>

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
                          <Button variant="warning" size="sm" disabled>
                            ✏️ Edit
                          </Button>{" "}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleDelete(sezione.id, "sezioni", fetchSezioni)
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
                      <th>Opzioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stagioni.map((stagione) => (
                      <tr key={stagione.id}>
                        <td>{stagione.id}</td>
                        <td>{stagione.titolo}</td>
                        <td>{stagione.anno}</td>
                        <td>{stagione.sezioneTitolo}</td>
                        <td>
                          <Button variant="warning" size="sm" disabled>
                            ✏️ Edit
                          </Button>{" "}
                          <Button
                            variant="danger"
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

              {/* Barra di ricerca */}
              <div className="d-flex mb-3">
                <input
                  type="text"
                  placeholder="Cerca per titolo..."
                  className="form-control me-2"
                  value={search.titolo}
                  onChange={(e) =>
                    setSearch({ ...search, titolo: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Cerca per sezione..."
                  className="form-control me-2"
                  value={search.sezione}
                  onChange={(e) =>
                    setSearch({ ...search, sezione: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Cerca per stagione..."
                  className="form-control me-2"
                  value={search.stagione}
                  onChange={(e) =>
                    setSearch({ ...search, stagione: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Cerca per bucket..."
                  className="form-control"
                  value={search.bucket}
                  onChange={(e) =>
                    setSearch({ ...search, bucket: e.target.value })
                  }
                />
                <Button
                  variant="primary"
                  onClick={fetchVideos}
                  className="ms-2"
                >
                  🔎 Cerca
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch({
                      titolo: "",
                      sezione: "",
                      stagione: "",
                      bucket: "",
                    });
                    fetchVideos();
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
                        <td>{video.titolo}</td>
                        <td>{video.durata}</td>
                        <td>{video.stagioneTitolo || "N/A"}</td>
                        <td>{video.sezioneTitolo}</td>
                        <td>
                          {video.fileLink.split(".")[0].replace("https://", "")}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              navigator.clipboard.writeText(video.fileLink)
                            }
                          >
                            📋 Copia
                          </Button>{" "}
                          <Button
                            variant="success"
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
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleDelete(video.id, "video", fetchVideos)
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
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
};

export default EditVideo;
