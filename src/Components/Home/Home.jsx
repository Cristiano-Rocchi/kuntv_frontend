import React, { useState, useEffect } from "react";
import "./Home.scss";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";
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
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3MzkxOTg0MjQsImV4cCI6MTczOTgwMzIyNCwic3ViIjoiYWRtaW4ifQ.HcHlWxFluX-TZLn8g_CrFtP805jnWHynvLvZR1nV1f6bg-ahPs2gibdFHV1vWP2T0jVtkG-_vNx_qLarnf32DQ`,
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
    <div className="body">
      <h1>ciao</h1>
      <div className="home-container">
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
            <SwiperSlide key={sezione.id} className="swiper-slide">
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
      </div>
    </div>
  );
};

export default Home;
