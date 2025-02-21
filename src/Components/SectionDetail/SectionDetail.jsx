import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./SectionDetail.scss";
import { Button, Col, Container, Row } from "react-bootstrap";
import { CalendarDays, ChevronRight, Home } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

const SectionDetail = () => {
  const { nomeSezione } = useParams();
  const [sezione, setSezione] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stagioneSelezionata, setStagioneSelezionata] = useState(null);

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
                <h5>{sezione.titolo} Tutte Le Stagioni</h5>
                <div className="d-flex">
                  {sezione.stagioni.length > 5 ? (
                    <Swiper
                      slidesPerView={5}
                      spaceBetween={0}
                      pagination={{ clickable: true }}
                      modules={[Pagination]}
                      className="mySwiper"
                    >
                      {sezione.stagioni.map((stagione) => (
                        <SwiperSlide key={stagione.id}>
                          <div className="slide-card-sect-detail">
                            <img
                              src={stagione.immagineUrl}
                              alt={stagione.titolo}
                            />
                            <h3>{stagione.titolo}</h3>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div>
                      <div className="stagioni-statiche">
                        {sezione.stagioni.map((stagione) => (
                          <div
                            key={stagione.id}
                            onClick={() => setStagioneSelezionata(stagione.id)}
                          >
                            <img
                              src={stagione.immagineUrl}
                              alt={stagione.titolo}
                              style={{ cursor: "pointer" }} // Per indicare che è cliccabile
                            />
                            <p className="mt-1 text-center">
                              {stagione.titolo}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Episodi visibili solo se è stata selezionata una stagione */}
                      {stagioneSelezionata && (
                        <div className=" mt-3">
                          <button className="btn btn-primary"></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SectionDetail;
