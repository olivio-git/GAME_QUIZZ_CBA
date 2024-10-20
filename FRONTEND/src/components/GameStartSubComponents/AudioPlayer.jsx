import React, { useRef, useEffect } from "react";

const AudioPlayer = ({ source, isPlaying, onEnd }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reiniciar el audio cuando se detiene
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleEnded = () => {
      if (onEnd) onEnd();
    };

    const audioElement = audioRef.current;
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [onEnd]);

  return <audio ref={audioRef} src={source} preload="auto" />;
};

export default AudioPlayer;
