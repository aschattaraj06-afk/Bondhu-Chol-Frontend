import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import { 
  FaPaperPlane, FaArrowLeft, FaSignOutAlt, FaCheck,
  FaImage, FaFilePdf, FaTimes, FaDownload, FaEye
} from 'react-icons/fa';

const Chat = () => {
  const { room } = useParams();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const BACKEND_URL = 'https://bandhu-chol-backend.onrender.com';

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

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
    
    axios.get(`${BACKEND_URL}/api/chat/messages/${room}`, {
      headers: { 'x-auth-token': token }
    }).then(res => {
      setMessages(res.data);
    }).catch(err => {
      console.error('Failed to load messages:', err);
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

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (selectedFile) {
      await uploadFile();
      return;
    }
    
    if (!newMessage.trim() || !socket) return;
    
    socket.emit('send-message', {
      senderId: user.id,
      text: newMessage,
      room: room,
      messageType: 'text'
    });
    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Only images and PDFs are allowed');
      return;
    }
    
    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('room', room);
    formData.append('text', newMessage);
    
    try {
      const res = await axios.post(`${BACKEND_URL}/api/chat/upload`, formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Emit socket message for the file
      socket.emit('send-message', {
        senderId: user.id,
        text: newMessage,
        room: room,
        messageType: res.data.messageType,
        fileUrl: res.data.fileUrl,
        fileName: res.data.fileName
      });
      
      setNewMessage('');
      setSelectedFile(null);
      setPreviewUrl(null);
      inputRef.current?.focus();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogout = () => {
    if (socket) socket.close();
    logout();
    navigate('/login');
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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="font-bold text-gray-800">{formatRoomName(room)}</h1>
            <p className="text-xs text-green-500 font-medium">Online</p>
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
                    
                    {/* Image Message */}
                    {msg.messageType === 'image' && msg.fileUrl && (
                      <div className="mb-2">
                        <img 
                          src={`${BACKEND_URL}${msg.fileUrl}`}
                          alt="Shared image"
                          className="max-w-[200px] max-h-[200px] rounded-lg cursor-pointer"
                          onClick={() => window.open(`${BACKEND_URL}${msg.fileUrl}`, '_blank')}
                        />
                      </div>
                    )}
                    
                    {/* PDF Message */}
                    {msg.messageType === 'pdf' && msg.fileUrl && (
                      <div className="mb-2">
                        <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg">
                          <FaFilePdf className="text-red-500 text-2xl" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{msg.fileName}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(msg.fileSize)}</p>
                          </div>
                          <a 
                            href={`${BACKEND_URL}${msg.fileUrl}`}
                            download
                            className="p-2 hover:bg-gray-200 rounded-full transition"
                          >
                            <FaDownload className="text-gray-600" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Text Message */}
                    {msg.text && <p className="text-sm break-words leading-relaxed">{msg.text}</p>}
                    
                    <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[10px] ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                        {formatTime(msg.createdAt)}
                      </span>
                      {isOwn && (
                        <span className="text-blue-100 text-[10px]">
                          <FaCheck />
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
      
      {/* File Preview */}
      {selectedFile && (
        <div className="bg-white border-t p-3">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded object-cover" />
            ) : (
              <FaFilePdf className="text-red-500 text-3xl" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button onClick={cancelUpload} className="p-2 hover:bg-gray-200 rounded-full">
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>
      )}
      
      {/* Message Input */}
      <div className="bg-white border-t px-4 py-3">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition"
            disabled={uploading}
          >
            <FaImage size={20} />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={uploading ? "Uploading..." : "Type a message or share a file..."}
            className="flex-1 p-3 border-0 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            disabled={uploading}
          />
          
          {newMessage.trim() || selectedFile ? (
            <button 
              type="submit" 
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
              disabled={uploading}
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaPaperPlane size={16} />
              )}
            </button>
          ) : (
            <button 
              type="button"
              className="p-3 text-gray-400 bg-gray-100 rounded-full cursor-not-allowed"
              disabled
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