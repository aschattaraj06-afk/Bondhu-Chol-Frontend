import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { FaPaperPlane, FaArrowLeft, FaSignOutAlt, FaImage, FaSmile } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

const Chat = () => {
  const { room } = useParams();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isConnected, setIsConnected] = useState(true); // Always connected
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Load messages
  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    fetchMessages();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [room, token, user, navigate]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chat/messages/${room}`, {
        headers: { 'x-auth-token': token }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (selectedFile) {
      await uploadImage();
      return;
    }
    
    if (!newMessage.trim()) return;
    
    try {
      await axios.post(`${BACKEND_URL}/api/chat/send`, {
        senderId: user.id,
        text: newMessage,
        room: room
      }, {
        headers: { 'x-auth-token': token }
      });
      
      setNewMessage('');
      inputRef.current?.focus();
      fetchMessages(); // Refresh messages
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message');
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload image
  const uploadImage = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('room', room);
    
    try {
      await axios.post(`${BACKEND_URL}/api/chat/upload`, formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchMessages(); // Refresh to show new image
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
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
      
      {/* Image Preview */}
      {selectedFile && previewUrl && (
        <div className="bg-white border-b p-3">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
            <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={cancelUpload} className="p-2 hover:bg-gray-200 rounded-full">
              ✕
            </button>
            <button 
              onClick={uploadImage}
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
            >
              {uploading ? 'Sending...' : 'Send Image'}
            </button>
          </div>
        </div>
      )}
      
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
                          alt="Shared"
                          className="max-w-[200px] max-h-[200px] rounded-lg cursor-pointer"
                          onClick={() => window.open(`${BACKEND_URL}${msg.fileUrl}`, '_blank')}
                        />
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
      
      {/* Message Input with Emoji & Image Support */}
      <div className="bg-white border-t px-4 py-3">
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 z-50">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          {/* Image Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
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
          
          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-3 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition"
          >
            <FaSmile size={20} />
          </button>
          
          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={uploading ? "Uploading image..." : "Type a message or share an image..."}
            className="flex-1 p-3 border-0 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            disabled={uploading || !!selectedFile}
          />
          
          {/* Send Button */}
          {(newMessage.trim() || selectedFile) ? (
            <button 
              type="submit" 
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
              disabled={uploading}
            >
              <FaPaperPlane size={16} />
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