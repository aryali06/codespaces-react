import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const audioRef = useRef(null);
  const objectUrlsRef = useRef([]);
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentIndex, tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleEnded = () => {
      if (tracks.length > 0) {
        setCurrentIndex((index) => (index + 1) % tracks.length);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [tracks.length]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  const handleFiles = (event) => {
    const chosenFiles = Array.from(event.target.files).filter((file) =>
      file.type.startsWith('audio/'),
    );

    if (chosenFiles.length === 0) {
      return;
    }

    const newTracks = chosenFiles.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      return {
        title: file.name,
        url,
      };
    });

    setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    if (tracks.length === 0) {
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  };

  const selectTrack = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (tracks.length === 0) {
      return;
    }

    setCurrentIndex((index) => (index + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (tracks.length === 0) {
      return;
    }

    setCurrentIndex((index) => (index - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  return (
    <div className="App">
      <div className="player-card">
        <div className="player-header">
          <div>
            <h1>React Music Player</h1>
            <p>Upload audio files and control playback from the browser.</p>
          </div>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFiles}
            className="file-input"
          />
        </div>

        <div className="player-main">
          <div className="now-playing">
            <h2>Now Playing</h2>
            <p>{currentTrack ? currentTrack.title : 'No audio selected'}</p>
          </div>

          <div className="controls">
            <button onClick={prevTrack} disabled={tracks.length === 0}>
              ◀︎ Prev
            </button>
            <button
              onClick={() => setIsPlaying((playing) => !playing)}
              disabled={tracks.length === 0}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={nextTrack} disabled={tracks.length === 0}>
              Next ▶︎
            </button>
          </div>

          <audio ref={audioRef} src={currentTrack?.url} preload="metadata" />

          <div className="playlist">
            <h3>Playlist</h3>
            {tracks.length === 0 ? (
              <p className="empty-list">Select audio files to start the player.</p>
            ) : (
              <ul>
                {tracks.map((track, index) => (
                  <li key={track.url}>
                    <button
                      type="button"
                      className={index === currentIndex ? 'track active' : 'track'}
                      onClick={() => selectTrack(index)}
                    >
                      <span>{track.title}</span>
                      {index === currentIndex && <span>Playing</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
