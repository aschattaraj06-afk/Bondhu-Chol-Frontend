import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { FaDownload, FaUpload, FaFilePdf, FaLink, FaGoogleDrive, FaTrash, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';

const Notes = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState('file');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    link: ''
  });
  const [file, setFile] = useState(null);

  const BACKEND_URL = 'https://bandhu-chol-backend.onrender.com';

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    fetchNotes();
  }, [token, user, navigate]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/notes`, {
        headers: { 'x-auth-token': token },
        params: { department: user.department, year: user.year }
      });
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (uploadType === 'link') {
        await axios.post(`${BACKEND_URL}/api/notes/link`, {
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          department: user.department,
          year: user.year,
          link: formData.link
        }, {
          headers: { 'x-auth-token': token }
        });
        alert('Link added successfully!');
      } else {
        if (!file) {
          alert('Please select a file');
          setLoading(false);
          return;
        }
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('subject', formData.subject);
        data.append('department', user.department);
        data.append('year', user.year);
        data.append('file', file);
        
        await axios.post(`${BACKEND_URL}/api/notes/upload`, data, {
          headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
        });
        alert('File uploaded successfully!');
      }
      
      setShowUpload(false);
      setFormData({ title: '', description: '', subject: '', link: '' });
      setFile(null);
      fetchNotes();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      try {
        await axios.delete(`${BACKEND_URL}/api/notes/${id}`, {
          headers: { 'x-auth-token': token }
        });
        alert('Deleted successfully!');
        fetchNotes();
      } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.msg || err.message));
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
            <FaArrowLeft />
          </button>
          <img src="/logo.jpeg" alt="Bondhu Chol" className="h-8 w-8 rounded-full object-cover mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Notes & Resources</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUpload(!showUpload)} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaUpload /> Share Resource
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 border-b p-3 flex gap-2 overflow-x-auto">
        <Link to="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Dashboard</Link>
        <Link to="/notes" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Notes</Link>
        <Link to="/syllabus" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Syllabus</Link>
        <Link to="/pyq" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">PYQs</Link>
        <Link to="/map" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Map</Link>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-white rounded-xl shadow-md p-6 m-4">
          <div className="flex gap-4 mb-4 border-b pb-2">
            <button onClick={() => setUploadType('file')} className={`px-4 py-2 rounded-lg ${uploadType === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>📄 Upload File</button>
            <button onClick={() => setUploadType('link')} className={`px-4 py-2 rounded-lg ${uploadType === 'link' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>🔗 Add Link</button>
          </div>
          <form onSubmit={handleUpload}>
            <input type="text" placeholder="Title" className="w-full p-3 border rounded-lg mb-3" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            <input type="text" placeholder="Subject" className="w-full p-3 border rounded-lg mb-3" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
            {uploadType === 'link' ? (
              <input type="url" placeholder="Link (YouTube, Google Drive, etc.)" className="w-full p-3 border rounded-lg mb-3" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} required />
            ) : (
              <input type="file" accept=".pdf,.doc,.docx,.txt" className="w-full p-3 border rounded-lg mb-3" onChange={(e) => setFile(e.target.files[0])} required />
            )}
            <textarea placeholder="Description (optional)" className="w-full p-3 border rounded-lg mb-3" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg" disabled={loading}>{loading ? 'Uploading...' : 'Share Resource'}</button>
          </form>
        </div>
      )}

      {/* Notes Grid with Delete Button */}
      <div className="p-4">
        {notes.length === 0 && <div className="text-center text-gray-500 mt-20">📭 No resources yet. Be the first to share!</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note._id || note.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition relative">
              {note.isLink ? <FaGoogleDrive className="text-blue-500 text-4xl mb-3" /> : <FaFilePdf className="text-red-500 text-4xl mb-3" />}
              <h3 className="font-bold text-lg text-gray-800 pr-8">{note.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{note.subject}</p>
              <p className="text-xs text-gray-400">Shared by {note.uploadedBy?.name || 'Student'}</p>
              
              <a href={note.isLink ? note.fileUrl : `${BACKEND_URL}${note.fileUrl}`} target={note.isLink ? "_blank" : "_self"} rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg">
                {note.isLink ? <FaLink /> : <FaDownload />} {note.isLink ? 'Open Link' : 'Download'}
              </a>
              
              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDelete(note._id || note.id, note.title)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                title="Delete"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;