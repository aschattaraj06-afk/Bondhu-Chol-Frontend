import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { 
  FaArrowLeft, FaBookOpen, FaYoutube, FaLink, FaPlus, 
  FaTimes, FaTrash, FaSignOutAlt, FaExternalLinkAlt 
} from 'react-icons/fa';

const Syllabus = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [syllabusItems, setSyllabusItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    semester: '',
    type: 'resource',
    title: '',
    description: '',
    link: ''
  });

  const BACKEND_URL = 'https://bandhu-chol-backend.onrender.com';

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    fetchSyllabusItems();
  }, [token, user, navigate]);

  const fetchSyllabusItems = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/syllabus`, {
        headers: { 'x-auth-token': token },
        params: { department: user.department, year: user.year }
      });
      console.log('Fetched syllabus:', res.data);
      setSyllabusItems(res.data);
    } catch (err) {
      console.error('Failed to fetch syllabus:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${BACKEND_URL}/api/syllabus/add`, {
        ...formData,
        semester: parseInt(formData.semester),
        department: user.department,
        year: parseInt(user.year)
      }, {
        headers: { 'x-auth-token': token }
      });
      
      alert('Resource added successfully!');
      
      setShowAddModal(false);
      setFormData({ subject: '', semester: '', type: 'resource', title: '', description: '', link: '' });
      fetchSyllabusItems();
    } catch (err) {
      console.error('Failed to add:', err);
      alert('Failed to add: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      try {
        await axios.delete(`${BACKEND_URL}/api/syllabus/${id}`, {
          headers: { 'x-auth-token': token }
        });
        alert('Deleted successfully!');
        fetchSyllabusItems();
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('Delete failed: ' + (err.response?.data?.msg || err.message));
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const resourceTypes = [
    { id: 'syllabus', label: '📋 Syllabus', color: 'bg-green-500', icon: FaBookOpen },
    { id: 'video', label: '🎥 Video', color: 'bg-red-500', icon: FaYoutube },
    { id: 'resource', label: '🔗 Resource', color: 'bg-blue-500', icon: FaLink }
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'syllabus': return <FaBookOpen className="text-green-500 text-xl" />;
      case 'video': return <FaYoutube className="text-red-500 text-xl" />;
      default: return <FaLink className="text-blue-500 text-xl" />;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'syllabus': return 'Syllabus';
      case 'video': return 'Video Playlist';
      default: return 'Resource Link';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Group items by semester
  const groupedItems = {};
  syllabusItems.forEach(item => {
    const sem = item.semester;
    if (!groupedItems[sem]) groupedItems[sem] = [];
    groupedItems[sem].push(item);
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
            <FaArrowLeft />
          </button>
          <img src="/logo.jpeg" alt="Bondhu Chol" className="h-8 w-8 rounded-full object-cover mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Syllabus & Resources</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddModal(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600">
            <FaPlus /> Add Resource
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 border-b p-3 flex gap-2 overflow-x-auto">
        <Link to="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Dashboard</Link>
        <Link to="/notes" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Notes</Link>
        <Link to="/syllabus" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Syllabus</Link>
        <Link to="/pyq" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">PYQs</Link>
        <Link to="/map" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Map</Link>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {syllabusItems.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">📭 No resources added yet</p>
            <p className="text-sm mt-2">Be the first to contribute!</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Study Resource
            </button>
          </div>
        )}

        {/* Display by Semester */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
          const semItems = groupedItems[sem];
          if (!semItems || semItems.length === 0) return null;
          
          return (
            <div key={sem} className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white">
                <h2 className="text-lg font-bold">Semester {sem}</h2>
              </div>
              
              <div className="p-4 space-y-4">
                {semItems.map(item => (
                  <div key={item._id || item.id} className="border rounded-lg p-4 hover:shadow-md transition relative">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <span className="text-xs font-medium text-gray-500">{item.subject}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                        
                        {item.link && (
                          <a 
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm mt-2 inline-flex items-center gap-1 hover:underline"
                          >
                            <FaExternalLinkAlt size={12} /> {item.link.length > 50 ? item.link.substring(0, 50) + '...' : item.link}
                          </a>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-2">
                          Added by {item.uploadedBy?.name || 'Student'} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(item._id || item.id, item.title)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add Resource</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Resource Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {resourceTypes.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({...formData, type: type.id})}
                      className={`p-2 rounded-lg text-sm transition ${
                        formData.type === type.id ? `${type.color} text-white` : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g., Data Structures, Mathematics"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Complete Notes, Best YouTube Playlist"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Link (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  placeholder="What's covered? Any special notes?"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Resource ✨'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Syllabus;