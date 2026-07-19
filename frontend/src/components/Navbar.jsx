// frontend/src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/picrypt_logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Encrypt/Decrypt', path: '/crypt' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const u = localStorage.getItem('user');
    if (token) {
      setLoggedIn(true);
      try { setUser(JSON.parse(u)); } catch { setUser(null); }
    } else {
      setLoggedIn(false);
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser(null);
    setProfileOpen(false);
    navigate('/');
    // reload to ensure Navbar updates everywhere
    window.location.reload();
  };

  const getLinkClasses = ({ isActive }) =>
    `text-sm font-semibold p-2 rounded-md transition duration-200 
     ${isActive ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-300 hover:text-teal-400 hover:bg-gray-700'}
     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-400`;

  return (
    <nav className="bg-gray-800 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img className="h-14 w-auto object-contain" src={logo} alt="PICRYPT Logo" />
              <span className="ml-2 text-xl font-bold text-white tracking-wider">PICRYPT</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-grow justify-center">
            <div className="flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <NavLink key={link.name} to={link.path} className={getLinkClasses}>
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right side: profile / register */}
          <div className="hidden md:flex items-center space-x-4">
            {!loggedIn ? (
              <Link to="/register" className="ml-4 px-4 py-2 text-sm font-semibold rounded-lg bg-teal-700 text-white shadow-md hover:bg-teal-800 transition duration-200">
                Register / Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-700 focus:outline-none"
                >
                  {/* Profile icon (first char of username) */}
                  <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                    {user?.username ? user.username[0].toUpperCase() : "U"}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">{user?.username}</div>
                    <button onClick={() => { navigate('/dashboard'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Profile</button>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-teal-400'}`}
            >
              {link.name}
            </NavLink>
          ))}

          {/* In mobile menu we show either register/login or profile block */}
          {loggedIn ? (
            <div className="mt-2 px-3 py-2 bg-gray-800 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                  {user?.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <div className="text-white">
                  <div className="font-semibold">{user?.username}</div>
                  <div className="text-sm text-gray-300">Signed in</div>
                </div>
              </div>

              <div className="mt-3 flex space-x-2">
                <button onClick={() => { setIsOpen(false); navigate('/dashboard'); }} className="flex-1 py-2 text-sm rounded bg-teal-600 text-white">Profile</button>
                <button onClick={() => { setIsOpen(false); logout(); }} className="flex-1 py-2 text-sm rounded border border-red-500 text-red-500">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full mt-2 px-3 py-2 text-base font-semibold rounded-md bg-teal-700 text-white hover:bg-teal-800 text-center">
              Register / Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
















