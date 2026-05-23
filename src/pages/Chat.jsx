import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import { FaPaperPlane, FaArrowLeft, FaSignOutAlt, FaImage } from 'react-icons/fa';

const Chat = () => {
  const { room } = useParams();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    // ✅ Load messages with AUTH TOKEN
    axios.get(`${BACKEND_URL}/api/chat/messages/${room}`, {
      headers: { 'x-auth-token': token }
    })
    .then(res => {
      setMessages(res.data);
    })
    .catch(err => {
      console.error('Failed to load messages:', err);
    });

    // Connect to socket
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      newSocket.emit('join-room', room);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.log('Socket error:', error);
    });

    newSocket.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, [room, token, user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !isConnected) return;
    
    socket.emit('send-message', {
      senderId: user.id,
      text: newMessage,
      room: room
    });
    setNewMessage('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatRoomName = (roomName) => {
    if (roomName === 'ju_common') return 'JU Common Room';
    if (roomName.includes('_common')) {
      const parts = roomName.split('_');
      if (parts.length === 3 && parts[2] === 'common') {
        return `${parts[0]} ${parts[1]} Year`;
      }
      return `${parts[0]} Department`;
    }
    const parts = roomName.split('_');
    if (parts.length === 3) {
      return `${parts[0]} ${parts[1]}${parts[2]}`;
    }
    return roomName;
  };

  const formatTime = (date) => {
    const msgDate = new Date(date);
    const now = new Date();
    const diff = now - msgDate;
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return msgDate.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Chat Header */}
      <div className="bg-white shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-10 border-b">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600 text-lg" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {formatRoomName(room).charAt(0).toUpperCase()}
            </div>
            {isConnected && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h1 className="font-bold text-gray-800">{formatRoomName(room)}</h1>
            <p className="text-xs text-gray-500">
              {isConnected ? 'Online' : 'Connecting...'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
        >
          <FaSignOutAlt size={14} /> Exit
        </button>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to start the conversation!</p>
          </div>
        )}
        
        {messages.map((msg, idx) => {
          const isOwn = msg.sender?._id === user.id;
          const showAvatar = !isOwn && (idx === 0 || messages[idx-1]?.sender?._id !== msg.sender?._id);
          
          return (
            <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              {!isOwn && showAvatar && (
                <div className="flex-shrink-0 mr-2 self-end">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {msg.sender?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              {!isOwn && !showAvatar && <div className="w-10 mr-2"></div>}
              
              <div className={`max-w-[75%] ${!isOwn && !showAvatar ? 'ml-10' : ''}`}>
                {!isOwn && showAvatar && (
                  <p className="text-xs text-gray-500 ml-1 mb-1">{msg.sender?.name}</p>
                )}
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl ${
                    isOwn 
                      ? 'bg-blue-500 text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                  }`}>
                    <p className="text-sm break-words leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[10px] ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                        {formatTime(msg.createdAt)}
                      </span>
                      {isOwn && (
                        <span className="text-blue-100 text-[10px]">
                          ✓✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {isOwn && (
                <div className="flex-shrink-0 ml-2 self-end">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="bg-white border-t px-4 py-3">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border-0 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
          
          {newMessage.trim() ? (
            <button 
              type="submit" 
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
            >
              <FaPaperPlane size={16} />
            </button>
          ) : (
            <button 
              type="button"
              className="p-3 text-gray-400 bg-gray-100 rounded-full cursor-not-allowed"
            >
              <FaPaperPlane size={16} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chat;