import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./SectionDetail.scss";
import { Button, Col, Container, Row } from "react-bootstrap";
import { CalendarDays, ChevronRight, Home } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const SectionDetail = () => {
  //-------------------FUNZIONI-------------------
  const ordinaPerNumero = (array, key) => {
    return [...array].sort((a, b) => {
      const numeroA = parseInt(a[key].match(/\d+/)?.[0]) || 0;
      const numeroB = parseInt(b[key].match(/\d+/)?.[0]) || 0;
      return numeroA - numeroB;
    });
  };

  // -------------------STATI-------------------
  const { nomeSezione } = useParams();
  const [sezione, setSezione] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [stagioneSelezionata, setStagioneSelezionata] = useState(null);
  const [videoStagione, setVideoStagione] = useState([]);
  const [tuttiIVideo, setTuttiIVideo] = useState([]);

  // -------------------USE EFFECT-------------------
  const handleSelezionaStagione = (idStagione) => {
    console.log("Stagione selezionata:", idStagione);
    // Filtra i video per la stagione selezionata
    const videoFiltrati = tuttiIVideo.filter((video) => {
      return video.stagioneId === idStagione;
    });

    setVideoStagione([...videoFiltrati]);
    setStagioneSelezionata(idStagione);
  };

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/video", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("📌 Tutti i video ricevuti:", data);
          setTuttiIVideo(data);
        } else {
          console.error("Errore nel recupero di tutti i video");
        }
      } catch (error) {
        console.error("Errore nella richiesta API", error);
      }
    };

    fetchAllVideos();
  }, []);

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

  // -----VARIABILI PER IL SORT-----
  const stagioniOrdinate = ordinaPerNumero(sezione.stagioni, "titolo");
  const videoStagioneOrdinati = ordinaPerNumero(videoStagione, "titolo");

  return (
    <div className="body section-detail">
      <div className="header-sect-detail">
        <img src={sezione.fotoUrl} alt={sezione.titolo} />
      </div>
      <Container className="body-sect-detail d-flex">
        <Row className="gap-5">
          <Col xs={12} md={3} className="side-bar-sect-detail">
            <div className=" card-detail">
              <img src={sezione.fotoUrl} alt={sezione.titolo} />
            </div>
          </Col>
          <Col xs={12} md={6} className="main-sect-detail">
            <div className="d-flex nav-trail gap-2">
              <Link to={"/home"}>
                <Home size={20} strokeWidth={2} />
              </Link>

              <ChevronRight className="arrow" size={18} strokeWidth={2} />
              <Link to={"/home"}>
                <p>Serie</p>
              </Link>
              <ChevronRight className="arrow" size={18} strokeWidth={2} />
              <p>{sezione.titolo}</p>
            </div>
            <div>
              <h1>{sezione.titolo}</h1>
              <div className="d-flex gap-2 mt-3">
                <CalendarDays /> <p>{sezione.anno}</p>
              </div>
              <div className="d-flex gap-2">
                {sezione.tag.map((tag) => (
                  <Button className="button-tag" variant="outline" key={tag}>
                    {tag}
                  </Button>
                ))}
              </div>
              <div className="stagioni-sect-detail mt-5">
                <h5>
                  {sezione.titolo} <span>Tutte Le Stagioni</span>
                </h5>
                <div className="d-flex">
                  {stagioniOrdinate.length > 5 ? (
                    <Swiper
                      slidesPerView={5}
                      spaceBetween={0}
                      navigation={true}
                      rewind={true}
                      modules={[Navigation]}
                    >
                      {stagioniOrdinate.map((stagione) => (
                        <SwiperSlide
                          key={stagione.id}
                          onClick={() => handleSelezionaStagione(stagione.id)}
                        >
                          <div
                            className="slide-card-sect-detail"
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={stagione.immagineUrl}
                              alt={stagione.titolo}
                            />
                            <p className="mt-1 text-center">
                              {stagione.titolo}
                            </p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="stagioni-statiche">
                      {stagioniOrdinate.map((stagione) => (
                        <div
                          key={stagione.id}
                          onClick={() => handleSelezionaStagione(stagione.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={stagione.immagineUrl}
                            alt={stagione.titolo}
                          />
                          <p className="mt-1 text-center">{stagione.titolo}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {stagioneSelezionata && videoStagioneOrdinati.length > 0 && (
                  <div className="episodi-container mt-3">
                    <h5>
                      {
                        sezione.stagioni.find(
                          (s) => s.id === stagioneSelezionata
                        ).titolo
                      }
                      <span className="">
                        {" "}
                        {videoStagioneOrdinati.length} Episodi
                      </span>
                    </h5>
                    <div className="episodi-list">
                      {videoStagioneOrdinati.map((video) => (
                        <button
                          key={video.id}
                          className="btn m-2"
                          onClick={() => navigate(`/video/${video.id}`)}
                        >
                          {video.titolo}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SectionDetail;
