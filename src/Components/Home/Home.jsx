import React, { useState, useEffect } from "react";
import "./Home.scss";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // -------------------STATI-------------------
  const [sezioni, setSezioni] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSezioni = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/sezioni", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzk4MDM4ODQsImV4cCI6MTc0MDQwODY4NCwic3ViIjoiYWRtaW4ifQ.2ePglJcyk_oItqw1CeBlOVFM_rh-mmGEPIU2DYjKaR8BxXCgPkddoYoPh95bjTrBlw3n2VjgFrPyojEhM9kkvA`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSezioni(data);
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

  return (
    <div className="body home-header">
      <div className="text-center pt-5 pb-2">
        <h3>TV Dal Vivo</h3>
      </div>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="3"
        loop={true}
        navigation={false}
        allowTouchMove={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 5,
          slideShadows: false,
        }}
        modules={[EffectCoverflow, Navigation]}
        className="mySwiper"
      >
        {sezioni.map((sezione) => (
          <SwiperSlide key={sezione.id} className="swiper-slide-header">
            <div
              className={`slide-card-home ${
                sezione.id === sezioni[Math.floor(sezioni.length / 2)].id
                  ? "clickable"
                  : ""
              }`}
              onClick={(e) => {
                if (
                  document
                    .querySelector(".swiper-slide-active")
                    ?.contains(e.target)
                ) {
                  navigate(`/home/${sezione.titolo}`);
                }
              }}
            >
              <img src={sezione.foto} alt={sezione.titolo} />
              <h2>{sezione.titolo}</h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="home-container mt-5">
        <section id="AnimeSection">
          {/* ----ANIME---- */}
          <h4>Anime</h4>
          <Swiper
            slidesPerView={5}
            spaceBetween={100}
            loop={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper mt-3"
          >
            {sezioni
              .filter((sezione) => sezione.tag.includes("ANIME"))
              .map((sezione) => (
                <SwiperSlide
                  key={sezione.id}
                  className="swiper-slide-container"
                >
                  <img
                    style={{ width: "300px", height: "200px" }}
                    src={sezione.foto}
                    alt={sezione.titolo}
                  />
                  <h3>{sezione.titolo}</h3>
                </SwiperSlide>
              ))}
          </Swiper>
        </section>
      </div>
    </div>
  );
};

export default Home;
