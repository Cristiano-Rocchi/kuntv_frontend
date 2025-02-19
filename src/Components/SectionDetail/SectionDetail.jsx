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
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`,
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
