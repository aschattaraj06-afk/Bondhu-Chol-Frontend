import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaComments, FaBook, FaUsers, FaSignOutAlt, 
  FaChalkboardTeacher, FaFileAlt, FaMapMarkedAlt, 
  FaCalendarAlt, FaArrowRight, FaHashtag, FaRocket
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const chatRooms = [
    { 
      name: `${user.department}_${user.year}_${user.section}`, 
      label: 'My Section', 
      icon: FaUsers, 
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Chat with your classmates',
      members: '40+ members'
    },
    { 
      name: `${user.department}_${user.year}_common`, 
      label: `${user.year} Year Block`, 
      icon: FaHashtag, 
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: `All ${user.year} year students`,
      members: '120+ members'
    },
    { 
      name: `${user.department}_common`, 
      label: 'Department Block', 
      icon: FaChalkboardTeacher, 
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: `Entire ${user.department} department`,
      members: '500+ members'
    },
    { 
      name: 'ju_common', 
      label: 'JU Common Room', 
      icon: FaComments, 
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      description: 'All JU students together',
      members: '2000+ members'
    }
  ];

  const quickActions = [
    { path: '/notes', label: 'Notes', icon: FaBook, color: 'bg-green-500', desc: 'Study materials' },
    { path: '/syllabus', label: 'Syllabus', icon: FaCalendarAlt, color: 'bg-blue-500', desc: 'Course outline' },
    { path: '/pyq', label: 'PYQs', icon: FaFileAlt, color: 'bg-purple-500', desc: 'Past papers' },
    { path: '/map', label: 'Campus Map', icon: FaMapMarkedAlt, color: 'bg-orange-500', desc: 'Find your way' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="Bondhu Chol" 
              className="w-10 h-10 rounded-xl object-cover shadow-md border border-yellow-400"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Bondhu Chol</h1>
              <p className="text-xs text-gray-500">{user.department} • Year {user.year} Section {user.section}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition"
              >
                <FaSignOutAlt size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Welcome back,</p>
              <h2 className="text-3xl font-bold mb-2">{user.name}! 👋</h2>
              <p className="opacity-90 mb-4">Ready to study today? Your academic journey continues here.</p>
              <div className="flex gap-3">
                <Link to="/chat/ju_common" className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition flex items-center gap-2">
                  Join Discussion <FaArrowRight size={12} />
                </Link>
                <Link to="/notes" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-300 transition flex items-center gap-2">
                  Share Notes <FaRocket size={12} />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block text-right">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                <img 
                  src="/logo.jpeg" 
                  alt="Bondhu Chol" 
                  className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-white"
                />
                <p className="text-2xl font-bold">Study</p>
                <p className="text-xs opacity-80">Together</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="group bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-200 border border-gray-100"
                >
                  <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-md group-hover:scale-110 transition`}>
                    <Icon size={22} />
                  </div>
                  <h4 className="font-semibold text-gray-800">{action.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Chat Rooms */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Study Spaces</h3>
            <Link to="/chat/ju_common" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
              View All <FaArrowRight size={12} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {chatRooms.map(room => {
              const Icon = room.icon;
              return (
                <Link
                  key={room.name}
                  to={`/chat/${room.name}`}
                  className="group bg-white rounded-xl p-5 hover:shadow-lg transition-all duration-200 border border-gray-100"
                >
                  <div className={`${room.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition`}>
                    <Icon className={`${room.textColor} text-2xl`} />
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">{room.label}</h4>
                  <p className="text-sm text-gray-500 mt-1">{room.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">{room.members}</span>
                    <span className="text-blue-500 text-sm font-medium group-hover:translate-x-1 transition">Join →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;