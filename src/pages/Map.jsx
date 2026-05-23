import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaArrowLeft, FaMapMarkerAlt, FaBuilding, FaUtensils, 
  FaBook, FaHospital, FaSignOutAlt, FaSearch, FaTimes,
  FaUniversity, FaCoffee, FaParking, FaBus, FaInfoCircle,
  FaExternalLinkAlt, FaLayerGroup, FaTrain, FaSubway,
  FaBed, FaFutbol, FaSchool, FaFlask, FaMicrochip
} from 'react-icons/fa';

const Map = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCampus, setActiveCampus] = useState('main');
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ========== MAIN CAMPUS (JADAVPUR) - 100+ LOCATIONS ==========
  const mainCampusLocations = [
    // Research Institutes
    { id: 1, name: 'CGCRI (Central Glass & Ceramic Research Institute)', category: 'research', mapUrl: 'https://www.google.com/maps/search/?api=1&query=CGCRI+Jadavpur+Kolkata', description: 'Central Glass & Ceramic Research Institute' },
    { id: 2, name: 'A.P.C. Roy Polytechnic', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=APC+Roy+Polytechnic+Jadavpur+Kolkata', description: 'Polytechnic College' },
    
    // Academic Buildings
    { id: 3, name: 'Darshan Bhavan', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Darshan+Bhavan+Jadavpur+University+Kolkata', description: 'Department of Philosophy' },
    { id: 4, name: 'Pharmacy Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Pharmacy+Building+Kolkata', description: 'Pharmaceutical Technology Department' },
    { id: 5, name: 'Research Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Research+Building+Kolkata', description: 'Research Facilities' },
    { id: 6, name: 'P.G. Science Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+PG+Science+Building+Kolkata', description: 'Postgraduate Science Departments' },
    { id: 7, name: 'P.G. Arts Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+PG+Arts+Building+Kolkata', description: 'Postgraduate Humanities Departments' },
    { id: 8, name: 'Pharmacy Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Pharmacy+Building+Kolkata', description: 'Pharmaceutical Technology Department' },
    { id: 9, name: 'UG Arts & UG Science Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+UG+Arts+Science+Building+Kolkata', description: 'Undergraduate classrooms and offices' },
    { id: 10, name: 'Gandhi Bhavan', category: 'cultural', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Gandhi+Bhavan+Jadavpur+University+Kolkata', description: 'Auditorium and cultural hall' },
    { id: 11, name: 'Jadavpur Vidyapith', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+Vidyapith+Kolkata', description: 'School Building' },
    { id: 12, name: 'Bio-Science Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Bio+Science+Building+Kolkata', description: 'Bioscience Departments' },
    { id: 13, name: 'Physics Department', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Physics+Department+Kolkata', description: 'Physics Department' },
    { id: 14, name: 'Metallurgy Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Metallurgy+Building+Kolkata', description: 'Metallurgical & Material Engineering' },
    { id: 15, name: 'Central Library', category: 'library', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Central+Library+Kolkata', description: 'Main library, 24x7 reading room' },
    { id: 16, name: 'Sansad Building', category: 'student', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Sansad+Building+Kolkata', description: 'Students\' Union Room' },
    { id: 17, name: 'Alumni Building', category: 'admin', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Alumni+Building+Kolkata', description: 'Alumni Association Office' },
    { id: 18, name: 'Blue Earth Workshop', category: 'workshop', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Blue+Earth+Workshop+Kolkata', description: 'Engineering Workshop' },
    { id: 19, name: 'Technology Bhaban', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Technology+Bhaban+Kolkata', description: 'Technology Department' },
    { id: 20, name: 'Computer Centre', category: 'facility', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Computer+Centre+Kolkata', description: 'Central Computing Facility' },
    { id: 21, name: 'Mechanical Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Mechanical+Building+Kolkata', description: 'Mechanical Engineering Department' },
    { id: 22, name: 'Heat Power House', category: 'facility', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Heat+Power+House+Kolkata', description: 'Energy and Power Facility' },
    { id: 23, name: 'Food Tech Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Food+Tech+Building+Kolkata', description: 'Food Technology & Biochemical Engineering' },
    { id: 24, name: 'Chemical Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Chemical+Building+Kolkata', description: 'Chemical Engineering Department' },
    { id: 25, name: 'Aurobindo Bhavan', category: 'admin', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aurobindo+Bhavan+Jadavpur+University+Kolkata', description: 'Main administrative building & Registrar\'s office' },
    { id: 26, name: 'Electrical Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Electrical+Building+Kolkata', description: 'Electrical Engineering Department' },
    { id: 27, name: 'High Voltage Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+High+Voltage+Building+Kolkata', description: 'High Voltage Engineering Lab' },
    { id: 28, name: 'Testing Lab', category: 'facility', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Testing+Lab+Kolkata', description: 'Materials and Equipment Testing' },
    
    // Newer Blocks
    { id: 29, name: 'Prayukti Bhavan', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Prayukti+Bhavan+Jadavpur+University+Kolkata', description: 'Department of Architecture, Civil, CSE, ETCE' },
    { id: 30, name: 'Subarna Jayanti Bhavan', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Subarna+Jayanti+Bhavan+Jadavpur+University+Kolkata', description: 'Interdisciplinary schools and research centers' },
    { id: 31, name: 'Jupiter Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jupiter+Building+Jadavpur+University+Kolkata' },
    { id: 32, name: 'Rabindra Bhavan', category: 'cultural', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rabindra+Bhavan+Jadavpur+University+Kolkata', description: 'Cultural and event center' },
    { id: 33, name: 'Nazrul Bhavan', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nazrul+Bhavan+Jadavpur+University+Kolkata', description: 'Department of Education' },
    { id: 34, name: 'Mathematical Sciences Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Mathematics+Building+Kolkata', description: 'Mathematics Department' },
    { id: 35, name: 'Geological Sciences Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Geological+Sciences+Kolkata', description: 'Geology Department' },
    
    // Student Facilities
    { id: 36, name: 'Teesta Bhavan / Amenities Centre', category: 'amenities', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Teesta+Bhavan+Jadavpur+University+Kolkata', description: 'Student utilities, retail counters, SBI bank branch' },
    { id: 37, name: 'Open Air Theatre (OAT)', category: 'cultural', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Open+Air+Theatre+Jadavpur+University+Kolkata', description: '3,000+ capacity grand amphitheatre' },
    { id: 38, name: 'University Guest House', category: 'facility', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Guest+House+Kolkata', description: 'Accommodation for visitors' },
    { id: 39, name: 'Teachers\' Quarters', category: 'residential', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Teachers+Quarters+Kolkata', description: 'Faculty housing' },
    { id: 40, name: 'Officers\' Quarters', category: 'residential', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Officers+Quarters+Kolkata', description: 'Staff housing' },
    { id: 41, name: 'Main Campus Canteens', category: 'food', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Canteen+Kolkata', description: 'Including AC Canteen and Milan Da\'s Canteen' },
    { id: 42, name: 'AC Canteen', category: 'food', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+AC+Canteen+Kolkata', description: 'Good Quality Food' },
    { id: 43, name: 'Milan Das Canteen', category: 'food', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Milan+Da+Canteen+Jadavpur+Kolkata', description: 'Popular student canteen' },
    { id: 44, name: 'Sports Centre & Gymnasium Complex', category: 'sports', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Sports+Complex+Kolkata', description: 'Gym and indoor sports facilities' },
    { id: 45, name: 'Health Centre', category: 'health', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Health+Centre+Kolkata', description: 'Medical facilities for students and staff' },
    
    // Hostels (Main Campus)
    { id: 46, name: 'A-1 Block Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+A1+Block+Hostel+Kolkata', description: 'Boys Hostel' },
    { id: 47, name: 'A-2 Block Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+A2+Block+Hostel+Kolkata', description: 'Boys Hostel' },
    { id: 48, name: 'B Block Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+B+Block+Hostel+Kolkata', description: 'Boys Hostel' },
    { id: 49, name: 'C Block Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+C+Block+Hostel+Kolkata', description: 'Boys Hostel' },
    { id: 50, name: 'D Block Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+D+Block+Hostel+Kolkata', description: 'Boys Hostel' },
    { id: 51, name: 'Old PG Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Old+PG+Hostel+Kolkata', description: 'Postgraduate Hostel' },
    { id: 52, name: 'New Block Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+New+Block+Hostel+Kolkata', description: 'Boys Hostel' },
    { id: 53, name: 'New Boys Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+New+Boys+Hostel+Kolkata', description: 'Modern Boys Hostel' },
    { id: 54, name: 'G.C. Sen Memorial Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=GC+Sen+Hostel+Jadavpur+University+Kolkata', description: 'Boys Hostel' },
    { id: 55, name: 'Women\'s Hostel I', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Womens+Hostel+1+Kolkata', description: 'Girls Hostel' },
    { id: 56, name: 'Women\'s Hostel II', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Womens+Hostel+2+Kolkata', description: 'Girls Hostel' },
    { id: 57, name: 'Women\'s Hostel III', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Womens+Hostel+3+Kolkata', description: 'Girls Hostel' },
    
    // Gates
    { id: 58, name: 'Gate No. 1', category: 'gate', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Main+Gate+Kolkata'},
    { id: 59, name: 'Gate No. 2 ', category: 'gate', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Gate+2+Kolkata'}, 
    { id: 60, name: 'Gate No. 3 ', category: 'gate', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Gate+3+Kolkata'}, 
    { id: 61, name: 'Gate No. 4 ', category: 'gate', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Gate+4+Kolkata'}, 
    { id: 62, name: 'Gate No. 5 ', category: 'gate', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Gate+5+Kolkata'}, 
    
    // Metro & Railway
    { id: 63, name: 'Mahanayak Uttam Kumar Metro Station', category: 'metro', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mahanayak+Uttam+Kumar+Metro+Station+Kolkata', description: 'Kolkata Metro Line 1', details: 'Auto: 10-15 minutes; Take auto from 8B. price: ₹15 each person' },
    { id: 64, name: 'Rabindra Sarobar Metro Station', category: 'metro', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rabindra+Sarobar+Metro+Station+Kolkata', description: 'Kolkata Metro Line 1', details: 'Auto: 10-15 minutes; Take auto from Police Station. price: ₹20 each person' },
    { id: 65, name: 'Jadavpur Railway Station', category: 'railway', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+Railway+Station+Kolkata', description: 'Local train station', details: 'Sealdah-Budge Budge line' }
  ];

  // ========== SALT LAKE CAMPUS LOCATIONS ==========
  const saltLakeLocations = [
    // Academic Blocks
    { id: 201, name: 'Information Technology Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+IT+Building+Kolkata', description: 'Information Technology Department' },
    { id: 202, name: 'Instrumentation & Electronics Engineering Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+IE+Building+Kolkata', description: 'Instrumentation & Electronics Engineering' },
    { id: 203, name: 'Power Engineering Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Power+Engineering+Kolkata', description: 'Power Engineering Department' },
    { id: 204, name: 'Construction Engineering Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Construction+Engineering+Kolkata', description: 'Construction Engineering Department' },
    { id: 205, name: 'Printing Engineering Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Printing+Engineering+Kolkata', description: 'Printing Engineering Department' },
    { id: 206, name: 'UGC Academic Staff College / HRDC Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+HRDC+Kolkata', description: 'Human Resource Development Centre' },
    
    // Administrative & Support
    { id: 207, name: 'Administration Section Block', category: 'admin', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Administration+Kolkata', description: 'Campus administrative office' },
    { id: 208, name: 'Salt Lake Media & Computer Centre (SMCC)', category: 'facility', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+SMCC+Kolkata', description: 'Media and computer resources' },
    { id: 209, name: 'Salt Lake Campus Library & Learning Resource Centre', category: 'library', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Library+Kolkata', description: 'Library and study center' },
    { id: 210, name: 'HRDC Guest House', category: 'facility', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+HRDC+Guest+House+Kolkata', description: 'Accommodation for guests' },
    
    // Community & Sports
    { id: 211, name: 'Salt Lake Campus Main Auditorium', category: 'cultural', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Auditorium+Kolkata', description: 'Events and seminars' },
    { id: 212, name: 'Salt Lake Campus Canteen', category: 'food', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Canteen+Kolkata', description: 'Student canteen' },
    { id: 213, name: 'CAB Cricket Ground', category: 'sports', mapUrl: 'https://www.google.com/maps/search/?api=1&query=CAB+Cricket+Ground+Salt+Lake+Kolkata', description: 'JU Campus Ground' },
    { id: 214, name: 'Cricket Pavilion', category: 'sports', mapUrl: 'https://www.google.com/maps/search/?api=1&query=JU+Cricket+Pavilion+Salt+Lake+Kolkata', description: 'Cricket facilities' },
    { id: 215, name: 'Artificial Rock Climbing Wall', category: 'sports', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rock+Climbing+Wall+Salt+Lake+Kolkata', description: 'Adventure sports facility' },
    
    // Hostels
    { id: 216, name: 'Salt Lake Campus Boys\' Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Boys+Hostel+Kolkata', description: 'Boys accommodation' },
    { id: 217, name: 'Salt Lake Campus Women\'s Hostel', category: 'hostel', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Girls+Hostel+Kolkata', description: 'Girls accommodation' },
    
    // Management & Law (from earlier)
    { id: 218, name: 'Management Studies Building', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Management+Studies+Salt+Lake+Kolkata', description: 'Business Management Department' },
    { id: 219, name: 'Law Department', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Law+Department+Salt+Lake+Kolkata', description: 'Faculty of Law' },
    { id: 220, name: 'Biotechnology Department', category: 'academic', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Biotechnology+Salt+Lake+Kolkata', description: 'Department of Biotechnology' },
    
    // Transport
    { id: 221, name: 'Salt Lake Campus Main Gate', category: 'gate', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sector+V+Gate+Salt+Lake+Kolkata', description: 'Main entrance' },
    { id: 222, name: 'Sector V Metro Station', category: 'metro', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sector+V+Metro+Station+Kolkata', description: 'Nearest metro station', details: 'Walking: 5-10 minutes' },
    { id: 223, name: 'Salt Lake Stadium Metro Station', category: 'metro', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Salt+Lake+Stadium+Metro+Station+Kolkata', description: 'Alternate metro station', details: 'Walking: 10-15 minutes' },
    { id: 224, name: 'Bidhannagar Road Railway Station', category: 'railway', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bidhannagar+Road+Railway+Station+Kolkata', description: 'Local train station' },
    { id: 225, name: 'Sealdah Railway Station', category: 'railway', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sealdah+Railway+Station+Kolkata', description: 'Major railway station', details: '15-20 minutes by cab' }
  ];

  const categories = [
    { id: 'all', label: 'All', color: 'bg-gray-500', icon: FaMapMarkerAlt },
    { id: 'academic', label: 'Academic', color: 'bg-blue-500', icon: FaUniversity },
    { id: 'library', label: 'Libraries', color: 'bg-green-500', icon: FaBook },
    { id: 'food', label: 'Food', color: 'bg-orange-500', icon: FaUtensils },
    { id: 'health', label: 'Health', color: 'bg-red-500', icon: FaHospital },
    { id: 'sports', label: 'Sports', color: 'bg-purple-500', icon: FaFutbol },
    { id: 'hostel', label: 'Hostels', color: 'bg-pink-500', icon: FaBed },
    { id: 'cultural', label: 'Cultural', color: 'bg-yellow-500', icon: FaBuilding },
    { id: 'admin', label: 'Admin', color: 'bg-indigo-500', icon: FaBuilding },
    { id: 'gate', label: 'Gates', color: 'bg-teal-500', icon: FaParking },
    { id: 'metro', label: 'Metro', color: 'bg-indigo-500', icon: FaSubway },
    { id: 'railway', label: 'Railway', color: 'bg-rose-500', icon: FaTrain },
    { id: 'research', label: 'Research', color: 'bg-cyan-500', icon: FaFlask },
    { id: 'workshop', label: 'Workshop', color: 'bg-stone-500', icon: FaBuilding },
    { id: 'facility', label: 'Facilities', color: 'bg-lime-500', icon: FaBuilding },
    { id: 'amenities', label: 'Amenities', color: 'bg-emerald-500', icon: FaCoffee },
    { id: 'residential', label: 'Residential', color: 'bg-violet-500', icon: FaBed }
  ];

  const currentLocations = activeCampus === 'main' ? mainCampusLocations : saltLakeLocations;

  const filteredLocations = currentLocations.filter(loc => {
    const matchCategory = activeCategory === 'all' || loc.category === activeCategory;
    const matchSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        loc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-500', library: 'bg-green-500', food: 'bg-orange-500',
      health: 'bg-red-500', sports: 'bg-purple-500', hostel: 'bg-pink-500',
      cultural: 'bg-yellow-500', admin: 'bg-indigo-500', gate: 'bg-teal-500',
      metro: 'bg-indigo-500', railway: 'bg-rose-500', research: 'bg-cyan-500',
      workshop: 'bg-stone-500', facility: 'bg-lime-500', amenities: 'bg-emerald-500',
      residential: 'bg-violet-500', student: 'bg-sky-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      academic: <FaUniversity className="text-blue-500" />,
      library: <FaBook className="text-green-500" />,
      food: <FaUtensils className="text-orange-500" />,
      health: <FaHospital className="text-red-500" />,
      sports: <FaFutbol className="text-purple-500" />,
      hostel: <FaBed className="text-pink-500" />,
      cultural: <FaBuilding className="text-yellow-500" />,
      gate: <FaParking className="text-teal-500" />,
      metro: <FaSubway className="text-indigo-500" />,
      railway: <FaTrain className="text-rose-500" />,
      research: <FaFlask className="text-cyan-500" />,
      default: <FaMapMarkerAlt className="text-gray-500" />
    };
    return icons[category] || icons.default;
  };

  const openGoogleMaps = (url) => {
    window.open(url, '_blank');
  };

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
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
              <FaArrowLeft className="text-gray-600" />
            </button>
            <img src="/logo.jpeg" alt="Bondhu Chol" className="w-8 h-8 rounded-lg object-cover" />
            <h1 className="text-lg font-bold text-gray-800">JU Campus Map</h1>
          </div>
          <button onClick={handleLogout} className="text-red-500 text-sm px-3 py-1 rounded-lg hover:bg-red-50">
            <FaSignOutAlt className="inline mr-1" size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 border-b p-2 flex gap-2 overflow-x-auto sticky top-[57px] z-10">
        <Link to="/dashboard" className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm whitespace-nowrap">Dashboard</Link>
        <Link to="/notes" className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm whitespace-nowrap">Notes</Link>
        <Link to="/syllabus" className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm whitespace-nowrap">Syllabus</Link>
        <Link to="/pyq" className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm whitespace-nowrap">PYQs</Link>
        <Link to="/map" className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm whitespace-nowrap">Map</Link>
      </div>

      {/* Campus Toggle */}
      <div className="bg-white p-3 shadow-sm sticky top-[101px] z-10">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveCampus('main')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              activeCampus === 'main' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaBuilding /> Main Campus (Jadavpur)
          </button>
          <button
            onClick={() => setActiveCampus('saltlake')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              activeCampus === 'saltlake' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaLayerGroup /> Salt Lake Campus
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 shadow-sm sticky top-[157px] z-10">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search buildings, hostels, canteens, gates, metro stations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <FaTimes className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-gray-50 p-2 flex gap-2 overflow-x-auto border-b sticky top-[201px] z-10">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition flex items-center gap-1 ${
              activeCategory === cat.id ? `${cat.color} text-white` : 'bg-white text-gray-700'
            }`}
          >
            <cat.icon size={12} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Campus Info Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center gap-2">
                <FaMapMarkerAlt /> 
                {activeCampus === 'main' ? 'Main Campus (Jadavpur)' : 'Salt Lake Campus'}
              </h3>
              <p className="text-xs opacity-80 mt-1">
                {activeCampus === 'main' 
                  ? '📍 Jadavpur, Kolkata - 700032 | 65+ Locations | 5 Gates' 
                  : '📍 Sector V, Salt Lake City, Kolkata - 700091 | 25+ Locations'}
              </p>
            </div>
            <a 
              href={activeCampus === 'main' 
                ? 'https://www.google.com/maps/place/Jadavpur+University/@22.4997,88.3637,15z/'
                : 'https://www.google.com/maps/place/Jadavpur+University+Salt+Lake+Campus/@22.5719,88.4322,15z/'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-white/30 transition"
            >
              <FaExternalLinkAlt size={12} /> View on Maps
            </a>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 mb-2">
        <div className="bg-white rounded-lg p-2 shadow-sm flex justify-between items-center">
          <span className="text-xs text-gray-500">
            📍 {filteredLocations.length} of {currentLocations.length} locations found
          </span>
          <span className="text-xs text-gray-500">
            🗺️ Click any location for Google Maps
          </span>
        </div>
      </div>

      {/* Locations List */}
      <div className="px-4 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLocations.map(loc => (
            <div
              key={loc.id}
              onClick={() => openGoogleMaps(loc.mapUrl)}
              className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 group"
            >
              <div className="flex items-start gap-3">
                <div className={`${getCategoryColor(loc.category)} w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0`}>
                  {getCategoryIcon(loc.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{loc.description}</p>
                  {loc.details && (
                    <p className="text-[10px] text-gray-400 mt-1">{loc.details}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                      {loc.category}
                    </span>
                    <span className="text-[10px] text-blue-500 flex items-center gap-1">
                      <FaExternalLinkAlt size={8} /> Directions
                    </span>
                  </div>
                </div>
                {(loc.category === 'metro' || loc.category === 'railway') ? (
                  loc.category === 'metro' ? <FaSubway className="text-indigo-500 mt-1 shrink-0" /> : <FaTrain className="text-rose-500 mt-1 shrink-0" />
                ) : loc.category === 'hostel' ? (
                  <FaBed className="text-pink-500 mt-1 shrink-0" />
                ) : loc.category === 'sports' ? (
                  <FaFutbol className="text-purple-500 mt-1 shrink-0" />
                ) : (
                  <FaMapMarkerAlt className="text-red-400 mt-1 shrink-0 group-hover:text-red-600 transition" />
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No locations found</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="mt-2 text-blue-500 text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t p-2 text-center text-xs text-gray-500 sticky bottom-0">
        <p>📍 {activeCampus === 'main' ? 'Jadavpur University Main Campus' : 'JU Salt Lake Campus'} • {currentLocations.length}+ locations • Click for directions</p>
      </div>
    </div>
  );
};

export default Map;