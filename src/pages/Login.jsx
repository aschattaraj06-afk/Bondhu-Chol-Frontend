import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    department: '',
    year: '',
    section: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const BACKEND_URL = 'https://bandhu-chol-backend.onrender.com';

  const departments = [
    'Computer Science and Engineering', 
    'Information Technology', 
    'Electronics and Telecommunication Engineering', 
    'Electrical Engineering', 
    'Mechanical Engineering', 
    'Civil Engineering', 
    'Chemical Engineering',
    'Instrumentation and Electronics Engineering', 
    'Power Engineering', 
    'Production Engineering', 
    'Metallurgical and Materials Engineering', 
    'Construction Engineering', 
    'Architecture', 
    'Food Technology and Biochemical Engineering',
    'Printing Technology', 
    'Pharmaceutical Technology'
  ];
  
  const sections = ['A', 'B', 'C', 'D'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      } else {
        const res = await axios.post(`${BACKEND_URL}/api/auth/register`, formData);
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img 
            src="/logo.jpeg" 
            alt="Bondhu Chol" 
            className="h-20 w-20 rounded-full object-cover mx-auto mb-4 border-2 border-yellow-400"
          />
          <h2 className="text-3xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back!' : 'Join Bondhu Chol'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Login to continue' : 'Study Forum of JU'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:border-blue-500" 
                required 
              />
              <input 
                type="text" 
                name="rollNo" 
                placeholder="Roll Number" 
                value={formData.rollNo} 
                onChange={handleChange} 
                className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:border-blue-500" 
                required 
              />
              <select 
                name="department" 
                value={formData.department} 
                onChange={handleChange} 
                className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:border-blue-500" 
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className="flex gap-3 mb-3">
                <select 
                  name="year" 
                  value={formData.year} 
                  onChange={handleChange} 
                  className="w-1/2 p-3 border rounded-lg focus:outline-none focus:border-blue-500" 
                  required
                >
                  <option value="">Year</option>
                  {[1,2,3,4].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <select 
                  name="section" 
                  value={formData.section} 
                  onChange={handleChange} 
                  className="w-1/2 p-3 border rounded-lg focus:outline-none focus:border-blue-500" 
                  required
                >
                  <option value="">Section</option>
                  {sections.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          <input 
            type="email" 
            name="email" 
            placeholder="JU Email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:border-blue-500" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-blue-500" 
            required 
          />
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-bold hover:opacity-90 transition"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <p className="text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;