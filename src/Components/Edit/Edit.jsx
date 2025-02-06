import "../../App.scss";
import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert, Container } from "react-bootstrap";

const Edit = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchVideos();
  }, []);

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
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Edit;
