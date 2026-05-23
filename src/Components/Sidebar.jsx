import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { 
  FaHome, FaComments, FaBook, FaCalendarAlt, 
  FaFileAlt, FaMapMarkedAlt, FaUsers, FaSignOutAlt,
  FaBars, FaTimes
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: `/chat/${user?.department}_${user?.year}_${user?.section}`, icon: FaComments, label: 'My Section' },
    { path: `/chat/${user?.department}_${user?.year}_common`, icon: FaUsers, label: 'Year Block' },
    { path: `/chat/${user?.department}_common`, icon: FaComments, label: 'Department Block' },
    { path: '/chat/ju_common', icon: FaComments, label: 'JU Common Room' },
    { path: '/notes', icon: FaBook, label: 'Notes' },
    { path: '/syllabus', icon: FaCalendarAlt, label: 'Syllabus' },
    { path: '/pyq', icon: FaFileAlt, label: 'PYQs' },
    { path: '/map', icon: FaMapMarkedAlt, label: 'Campus Map' },
    { path: '/union', icon: FaUsers, label: 'Unions' }
  ];

  if (!user) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-900 text-white p-2 rounded-lg"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b border-gray-700 mt-12 md:mt-0">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpeg" alt="Bondhu Chol" className="h-10 w-10 rounded-full object-cover border border-yellow-400" />
            <div>
              <span className="text-lg font-bold">Bondhu Chol</span>
              <p className="text-xs text-yellow-400">Study Forum</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {user?.department} • Year {user?.year}{user?.section}
          </p>
        </div>
        
        <nav className="p-4 overflow-y-auto h-[calc(100%-120px)]">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg mb-1 transition ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
          
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg mt-4 hover:bg-red-600 transition text-left">
            <FaSignOutAlt size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;