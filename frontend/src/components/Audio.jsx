import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import UserAvatar from './UserAvatar';

const AudioPlayer = ({ user , source }) => {
  const audioRef = useRef(new window.Audio(source)); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const progressBar = e.target;
    const newTime = (e.nativeEvent.offsetX / progressBar.offsetWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <StyledWrapper>
      <div className="audio-player ">
        <div className="mr-2">

          <UserAvatar currentUser={user} />
        </div>
        <div className="player-controls">
          <div className="song-info">
            <div className="song-title">Voice</div>
            <p className="artist">{user.name}</p>
          </div>
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress" style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="buttons">
            <button className="play-btn" onClick={togglePlayPause}>
              {isPlaying ? (
                <svg viewBox="0 0 16 16" className="bi bi-pause-fill" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
                  <path fill="white" d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
                  <path fill="white" d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .audio-player {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width:250px;
    height: 80px;
    background-color: #282828;
    border-radius: 8px;
    padding: 8px;
    box-sizing: border-box;
  }

  .album-cover {
    width: 64px;
    height: 64px;
    background-color: #fff;
    border-radius: 50%;
    margin-right: 12px;
  }

  .player-controls {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .song-info {
    margin-bottom: 4px;
  }

  .song-title {
    font-size: 16px;
    color: #fff;
    margin: 0;
  }

  .artist {
    font-size: 12px;
    color: #b3b3b3;
    margin: 0;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background-color: #4f4f4f;
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
  }

  .progress {
    height: 100%;
    background-color: #1db954;
    transform-origin: left;
    transition: width 0.1s ease;
  }

  .buttons {
    display: flex;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }

  .play-btn {
    font-size: 16px;
    color: #fff;
    transition: transform 0.2s ease-in-out;
  }

  .play-btn:hover {
    transform: scale(1.2);
  }
`;

export default AudioPlayer;
