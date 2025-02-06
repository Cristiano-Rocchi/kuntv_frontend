import "../../App.scss";
import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert, Container, Button } from "react-bootstrap";

const EditVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/video", {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      } else {
        throw new Error("Errore nel recupero dei video");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per copiare il link negli appunti
  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    alert("🔗 Link copiato negli appunti!");
  };

  // Funzione per eliminare un video
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this video?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/video/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzg1ODk3NzUsImV4cCI6MTczOTE5NDU3NSwic3ViIjoiYWRtaW4ifQ.H9ApFFFE5CirNPk1F4TSPHqxAxsRP9S1iNB53PUKfoxBmAO7-WtE8koiTQOHgfYIE3VZ3EBlJzKCqvetAEKAgQ`,
        },
      });

      if (response.ok) {
        alert("✅ Video deleted successfully!");
        setVideos(videos.filter((video) => video.id !== id));
      } else {
        alert("❌ Error deleting video!");
      }
    } catch (error) {
      alert("❌ Error deleting video: " + error.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">🎬 Lista Video</h2>
      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">❌ {error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>UUID</th>
              <th>Titolo</th>
              <th>Durata</th>
              <th>Stagione</th>
              <th>Sezione</th>
              <th>Bucket</th>
              <th>Link</th>
              <th>Opzioni</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id}>
                <td>{video.id}</td>
                <td>{video.titolo}</td>
                <td>{video.durata}</td>
                <td>{video.stagioneTitolo || "N/A"}</td>
                <td>{video.sezioneTitolo}</td>
                <td>{video.fileLink.split(".")[0].replace("https://", "")}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => copyToClipboard(video.fileLink)}
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
                  <Button variant="warning" size="sm" disabled>
                    ✏️ Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                  >
                    🗑️ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default EditVideo;
