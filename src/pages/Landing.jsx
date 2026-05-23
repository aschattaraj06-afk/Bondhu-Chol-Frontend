import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaBook, FaMapMarkedAlt, FaPlay, FaPause, FaRedoAlt } from 'react-icons/fa';

const Landing = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    // Try to auto-play when page loads
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            // Auto stop after 10 seconds
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                setIsPlaying(false);
                setShowPlayButton(true);
              }
            }, 10000);
          })
          .catch(() => {
            // Autoplay blocked - show play button
            setShowPlayButton(true);
          });
      }
    }
  }, []);

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowPlayButton(false);
          
          // Stop after 10 seconds
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              setIsPlaying(false);
              setShowPlayButton(true);
            }
          }, 10000);
        })
        .catch(err => console.log('Play error:', err));
    }
  };

  const replaySong = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowPlayButton(false);
          
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              setIsPlaying(false);
              setShowPlayButton(true);
            }
          }, 10000);
        })
        .catch(err => console.log('Replay error:', err));
    }
  };

  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setShowPlayButton(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/bondhu-chol-song.mp3" preload="auto" />
      
      {/* Music Control Button */}
      <div className="fixed bottom-5 right-5 z-50">
        {isPlaying ? (
          <button
            onClick={stopSong}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition flex items-center gap-2"
          >
            <FaPause /> Stop
          </button>
        ) : showPlayButton && (
          <button
            onClick={playSong}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition flex items-center gap-2 animate-pulse"
          >
            <FaPlay /> Play "Bondhu Chol"
          </button>
        )}
        {!isPlaying && !showPlayButton && (
          <button
            onClick={replaySong}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition flex items-center gap-2"
          >
            <FaRedoAlt /> Replay Song
          </button>
        )}
      </div>

      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.jpeg" 
              alt="Bondhu Chol" 
              className="h-12 w-12 rounded-full object-cover border-2 border-yellow-400"
            />
            <div>
              <span className="text-white text-xl font-bold">Bondhu Chol</span>
              <p className="text-yellow-400 text-xs">বন্ধু চল</p>
            </div>
          </div>
          <Link 
            to="/login" 
            className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
          Study Forum<br />
          of <span className="text-yellow-400">Jadavpur University</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Connect with brightest minds, share notes, clear doubts, and grow together.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/login" 
            className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-400 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
            <FaComments className="text-yellow-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Department-wise Chat</h3>
            <p className="text-gray-200">Dedicated spaces for each department, year, and section.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
            <FaBook className="text-yellow-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Notes & Resources</h3>
            <p className="text-gray-200">Verified notes, PYQs, syllabus videos and study materials.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
            <FaMapMarkedAlt className="text-yellow-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">JU Campus Map</h3>
            <p className="text-gray-200">Never get lost! Interactive map of JU campus.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-black/30 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How Bondhu Chol Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h4 className="text-white font-bold">Join with JU ID</h4>
              <p className="text-gray-300 text-sm">Verify your JU email and roll number</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h4 className="text-white font-bold">Get Verified</h4>
              <p className="text-gray-300 text-sm">Batch coordinator approves your entry</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h4 className="text-white font-bold">Join Your Block</h4>
              <p className="text-gray-300 text-sm">Access department, year & section chats</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h4 className="text-white font-bold">Study & Grow</h4>
              <p className="text-gray-300 text-sm">Share resources, clear doubts, excel</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Don't Miss Out!</h2>
        <p className="text-gray-200 mb-8">Join the brightest students of JU. Be part of something revolutionary.</p>
        <Link 
          to="/login" 
          className="bg-yellow-500 text-gray-900 px-12 py-3 rounded-lg font-bold text-lg inline-block hover:bg-yellow-400 transition"
        >
          Join Bondhu Chol Now → Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-8">
        <div className="container mx-auto px-6 text-center text-gray-300">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <img src="/logo.jpeg" alt="Bondhu Chol" className="h-8 w-8 rounded-full object-cover" />
            <p>© 2024 Bondhu Chol. Study Forum of Jadavpur University</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;