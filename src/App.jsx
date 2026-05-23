import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Notes from './pages/Notes';
import Syllabus from './pages/Syllabus';
import PYQ from './pages/PYQ';
import Map from './pages/Map';
import { AuthProvider } from './context/AuthContext';

function App() {
  const audioRef = useRef(null);
  const [showSkip, setShowSkip] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  // Function to start audio on user interaction
  const startAudio = () => {
    if (!hasStarted && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => {
          console.log('🎵 Song playing!');
          setHasStarted(true);
          
          // Auto stop after 10 seconds
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            setShowSkip(false);
          }, 10000);
        })
        .catch(err => {
          console.log('Play error:', err);
        });
    }
  };

  const skipSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowSkip(false);
  };

  return (
    <AuthProvider>
      <div onClick={startAudio} style={{ minHeight: '100vh' }}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat/:room" element={<Chat />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/pyq" element={<PYQ />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </Router>
        
        {/* Audio Element */}
        <audio ref={audioRef} src="/bondhu-chol-song.mp3" />
        
        {/* Skip Button */}
        {showSkip && hasStarted && (
          <button
            onClick={skipSong}
            className="fixed bottom-5 right-5 z-50 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-sm hover:bg-black/80 transition shadow-lg flex items-center gap-2"
          >
            <span>⏭️</span> Skip Song
          </button>
        )}
        
        {/* Initial play prompt */}
        {!hasStarted && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm animate-pulse">
            🎵 Click anywhere to play Bondhu Chol song
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;