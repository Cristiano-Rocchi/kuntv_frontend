import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SectionDetail.scss"; // Per lo stile personalizzato

const SectionDetail = () => {
  const { nomeSezione } = useParams(); // Prende il nome dalla URL
  const [sezione, setSezione] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSezione = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/sezioni/titolo/${nomeSezione}`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3MzkxOTg0MjQsImV4cCI6MTczOTgwMzIyNCwic3ViIjoiYWRtaW4ifQ.HcHlWxFluX-TZLn8g_CrFtP805jnWHynvLvZR1nV1f6bg-ahPs2gibdFHV1vWP2T0jVtkG-_vNx_qLarnf32DQ`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSezione(data);
        } else {
          setError("Errore nel recupero della sezione");
        }
      } catch (error) {
        setError("Errore nella richiesta API");
      } finally {
        setLoading(false);
      }
    };
    fetchSezione();
  }, [nomeSezione]);

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="section-detail">
      <h1>{sezione.titolo}</h1>
      <img src={sezione.file} alt={sezione.titolo} />
    </div>
  );
};

export default SectionDetail;
