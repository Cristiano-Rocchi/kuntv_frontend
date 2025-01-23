import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./TvSeries.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const TvSeries = () => {
  const images = Array(12).fill("https://picsum.photos/200/300"); // Immagine random

  return (
    <div className="body">
      {/* Primo Carosello */}
      <div className="carousel-section">
        <h2>I Simpson</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={6}
          spaceBetween={10}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Stagione ${index + 1}`}
                className="carousel-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Secondo Carosello */}
      <div className="carousel-section">
        <h2>Detective Conan</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={6}
          spaceBetween={10}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Stagione ${index + 1}`}
                className="carousel-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TvSeries;
