import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { 
  FaArrowLeft, FaDownload, FaPlus, FaTimes, FaTrash, 
  FaSignOutAlt, FaFilePdf, FaSearch, FaCalendarAlt 
} from 'react-icons/fa';

const PYQ = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [pyqs, setPyqs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterSem, setFilterSem] = useState('all');
  const [formData, setFormData] = useState({
    subject: '',
    semester: '',
    year: '',
    file: null
  });

  const BACKEND_URL = 'https://bandhu-chol-backend.onrender.com';

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    fetchPYQs();
  }, [token, user, navigate]);

  const fetchPYQs = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/pyq`, {
        headers: { 'x-auth-token': token },
        params: { department: user.department }
      });
      console.log('Fetched PYQs:', res.data);
      setPyqs(res.data);
    } catch (err) {
      console.error('Failed to fetch PYQs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert('Please select a PDF file');
      return;
    }
    
    setLoading(true);
    const data = new FormData();
    data.append('subject', formData.subject);
    data.append('semester', formData.semester);
    data.append('year', formData.year);
    data.append('department', user.department);
    data.append('file', formData.file);
    
    try {
      await axios.post(`${BACKEND_URL}/api/pyq/upload`, data, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      
      alert('PYQ uploaded successfully!');
      setShowAddModal(false);
      setFormData({ subject: '', semester: '', year: '', file: null });
      fetchPYQs();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      try {
        await axios.delete(`${BACKEND_URL}/api/pyq/${id}`, {
          headers: { 'x-auth-token': token }
        });
        alert('Deleted successfully!');
        fetchPYQs();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Delete failed: ' + (err.response?.data?.msg || err.message));
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get unique years for filter
  const years = ['all', ...new Set(pyqs.map(p => p.year))].sort((a,b) => b - a);
  const semesters = ['all', 1, 2, 3, 4, 5, 6, 7, 8];

  // Filter PYQs
  const filteredPYQs = pyqs.filter(pyq => {
    const matchYear = filterYear === 'all' || pyq.year == filterYear;
    const matchSem = filterSem === 'all' || pyq.semester == filterSem;
    const matchSearch = pyq.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pyq.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchYear && matchSem && matchSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-gray-800">Previous Year Questions</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddModal(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600">
            <FaPlus /> Upload PYQ
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
        <Link to="/syllabus" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Syllabus</Link>
        <Link to="/pyq" className="px-4 py-2 bg-blue-500 text-white rounded-lg">PYQs</Link>
        <Link to="/map" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Map</Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 shadow-sm sticky top-[101px] z-10">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year === 'all' ? 'All Years' : year}</option>
            ))}
          </select>
          
          {/* Semester Filter */}
          <select
            value={filterSem}
            onChange={(e) => setFilterSem(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem === 'all' ? 'All Semesters' : `Semester ${sem}`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 pt-4">
        <div className="bg-blue-50 rounded-lg p-3 flex justify-between items-center">
          <span className="text-sm text-blue-700">
            📚 Total PYQs: {filteredPYQs.length}
          </span>
          <span className="text-xs text-blue-500">
            {filterYear !== 'all' && `Year: ${filterYear} | `}
            {filterSem !== 'all' && `Semester: ${filterSem}`}
          </span>
        </div>
      </div>

      {/* PYQ Grid */}
      <div className="p-4">
        {filteredPYQs.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <FaFilePdf className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-lg">No PYQs found</p>
            <p className="text-sm mt-2">Upload previous year papers to help fellow students!</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Upload PYQ
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPYQs.map((pyq) => (
            <div key={pyq._id || pyq.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition relative">
              {/* PDF Icon */}
              <div className="flex items-center gap-3 mb-3">
                <FaFilePdf className="text-red-500 text-4xl" />
                <div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Semester {pyq.semester}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full ml-2">
                    {pyq.year}
                  </span>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 pr-8">{pyq.subject}</h3>
              <p className="text-xs text-gray-400 mt-2">
                Uploaded by {pyq.uploadedBy?.name || 'Student'} • {new Date(pyq.createdAt).toLocaleDateString()}
              </p>
              
              {/* Download Button */}
              <a 
                href={`${BACKEND_URL}${pyq.fileUrl}`}
                download
                className="mt-3 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <FaDownload /> Download PDF
              </a>
              
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(pyq._id || pyq.id, pyq.subject)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                title="Delete"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add PYQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Upload PYQ</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Year</option>
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
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
                  placeholder="e.g., Data Structures, Algorithms"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Only PDF files, max 10MB</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Uploading...' : <><FaDownload /> Upload PYQ</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PYQ;