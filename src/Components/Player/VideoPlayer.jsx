import "./VideoPlayer.scss";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-playlist";

const VideoPlayer = () => {
  //-------------------STATI-------------------
  const { id } = useParams();
  const navigate = useNavigate();
  const [tuttiIVideo, setTuttiIVideo] = useState([]);
  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);

  //-------------------USE EFFECT-------------------

  // Carica tutti i video
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/video", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NDA0MDkyMDAsImV4cCI6MTc0MTAxNDAwMCwic3ViIjoiYWRtaW4ifQ.h3JHNYoC5cOEWM6WVxM9rY03sw9cRiG91gyI-VVkghO6fJOOcVkUtNgKbkKtkr_b0dl9Qzjq6vIDdhBFmEp4nw`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTuttiIVideo(data);
        }
      } catch (error) {
        console.error("Errore nel caricamento dei video", error);
      }
    };

    fetchVideos();
  }, []);
  // Inizializza il player
  useEffect(() => {
    if (tuttiIVideo.length > 0 && videoContainerRef.current) {
      if (playerRef.current) {
        playerRef.current.dispose();
      }

      const videoElement = document.createElement("video");
      videoElement.className = "video-js vjs-default-skin";
      videoElement.setAttribute("controls", "true");
      videoContainerRef.current.innerHTML = "";
      videoContainerRef.current.appendChild(videoElement);

      const player = videojs(videoElement, {
        controls: true,
        autoplay: true,
        preload: "auto",
        fluid: true,
      });

      playerRef.current = player;

      player.playlist(
        tuttiIVideo.map((video) => ({
          sources: [{ src: video.fileLink, type: "video/mp4" }],
          name: video.titolo,
        }))
      );

      const indiceCorrente = tuttiIVideo.findIndex(
        (v) => v.id.toString() === id
      );
      player.playlist.currentItem(indiceCorrente);

      // -----BOTTONI NEXT, PREV-----

      const prevButton = videojs.dom.createEl("button", {
        className: "vjs-control vjs-button",
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
      });

      const nextButton = videojs.dom.createEl("button", {
        className: "vjs-control vjs-button",
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
      });

      prevButton.onclick = () => {
        if (indiceCorrente > 0) {
          const prevVideo = tuttiIVideo[indiceCorrente - 1];
          navigate(`/video/${prevVideo.id}`);
        }
      };

      nextButton.onclick = () => {
        if (indiceCorrente < tuttiIVideo.length - 1) {
          const nextVideo = tuttiIVideo[indiceCorrente + 1];
          navigate(`/video/${nextVideo.id}`);
        }
      };

      // Aggiungiamo i pulsanti alla control bar
      player.controlBar.el().appendChild(prevButton);
      player.controlBar.el().appendChild(nextButton);

      player.on("ended", () => {
        if (indiceCorrente < tuttiIVideo.length - 1) {
          const nextVideo = tuttiIVideo[indiceCorrente + 1];
          navigate(`/video/${nextVideo.id}`);
        }
      });
    }
  }, [id, tuttiIVideo, navigate]);

  return (
    <Container className="text-center mt-4">
      <div ref={videoContainerRef}></div>
      <div className="ciao">ciao</div>
    </Container>
  );
};

export default VideoPlayer;
