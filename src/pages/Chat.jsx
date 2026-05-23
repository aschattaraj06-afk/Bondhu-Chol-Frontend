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

  // ✅ IMPORTANT: Use environment variable
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    // ✅ Connect to the SAME backend URL
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5
    });
    
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('✅ Socket connected to:', BACKEND_URL);
      setIsConnected(true);
      newSocket.emit('join-room', room);
    });
    
    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });
    
    newSocket.on('connect_error', (error) => {
      console.log('❌ Socket error:', error.message);
      setIsConnected(false);
    });
    
    // Load messages
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

  // ... rest of your component
};