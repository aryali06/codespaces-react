import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const DEFAULT_CAT_GIF = 'https://i.pinimg.com/originals/88/14/9b/88149b0400750578f4d07d9bc3fb0fee.gif';
  const audioRef = useRef(null);
  const objectUrlsRef = useRef([]);
  const coverUrlRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const [useCatGif, setUseCatGif] = useState(false);

  const currentTrack = tracks[currentIndex];
  const currentCover = useCatGif ? DEFAULT_CAT_GIF : coverUrl;

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
      if (coverUrlRef.current) {
        URL.revokeObjectURL(coverUrlRef.current);
      }
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
        title: file.webkitRelativePath || file.name,
        url,
      };
    });

    setTracks((prevTracks) => {
      const mergedTracks = [...prevTracks, ...newTracks];
      if (prevTracks.length === 0) {
        setCurrentIndex(0);
        setIsPlaying(true);
      }
      return mergedTracks;
    });
  };

  const handleCoverFile = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    if (coverUrlRef.current) {
      URL.revokeObjectURL(coverUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    coverUrlRef.current = url;
    setCoverUrl(url);
    setUseCatGif(false);
  };

  const removeTrack = (index) => {
    setTracks((currentTracks) => {
      const newTracks = currentTracks.filter((_, i) => i !== index);
      setCurrentIndex((existingIndex) => {
        if (newTracks.length === 0) {
          return 0;
        }
        if (index === existingIndex) {
          return existingIndex >= newTracks.length ? 0 : existingIndex;
        }
        if (index < existingIndex) {
          return existingIndex - 1;
        }
        return existingIndex;
      });
      setIsPlaying((playing) => (newTracks.length === 0 ? false : playing));
      return newTracks;
    });
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
            <p>Upload audio files or folders, then play and remove tracks.</p>
          </div>
          <div className="inputs-grid">
            <label className="file-input file-input-button">
              Choose audio files / folder
              <input
                type="file"
                accept="audio/*"
                multiple
                webkitdirectory=""
                directory=""
                onChange={handleFiles}
              />
            </label>
            <label className="file-input file-input-button">
              Upload cover image
              <input type="file" accept="image/*" onChange={handleCoverFile} />
            </label>
          </div>
        </div>

        <div className="cover-actions">
          <button
            type="button"
            onClick={() => setUseCatGif((value) => !value)}
            className="secondary-button"
          >
            {useCatGif ? 'Hide dancing cat' : 'Show dancing cat'}
          </button>
          {coverUrl && !useCatGif && <p className="cover-note">Custom cover image loaded.</p>}
        </div>

        <div className="player-main">
          <div className="player-body">
            <div className="playlist-section">
              <div className="playlist">
                <h3>Playlist</h3>
                {tracks.length === 0 ? (
                  <p className="empty-list">Select audio files or folders to start the player.</p>
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
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => removeTrack(index)}
                          aria-label={`Remove ${track.title}`}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="player-panel">
              {currentCover && (
                <div className="player-cover">
                  <img src={currentCover} alt="Cover artwork" />
                </div>
              )}

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
            </div>
          </div>

          <audio ref={audioRef} src={currentTrack?.url} preload="metadata" />
        </div>
      </div>
    </div>
  );
}

export default App;
