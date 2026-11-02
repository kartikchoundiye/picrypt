// frontend/src/components/Navbar.jsx

import { useState, useEffect } from 'react';
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

  /* eslint-disable react-hooks/set-state-in-effect */
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
  /* eslint-enable react-hooks/set-state-in-effect */

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
     ${isActive ? 'text-cyan-400 border-b-2 border-cyan-400 drop-shadow-[0_0_8px_rgba(0,217,245,0.5)]' : 'text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/40'}
     focus:outline-none focus:ring-2 focus:ring-cyan-400`;

  return (
    <nav className="bg-[#070D1A]/95 border-b border-cyan-500/20 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center">
              <img className="h-9 sm:h-12 w-auto object-contain" src={logo} alt="PICRYPT Logo" />
              <span className="ml-2 text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 tracking-wider">
                PICRYPT
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex grow justify-center">
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
              <Link
                to="/register"
                className="ml-4 px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-[0_0_15px_rgba(0,217,245,0.35)] hover:shadow-[0_0_25px_rgba(0,217,245,0.55)] transition duration-200"
              >
                Register / Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-cyan-950/50 border border-cyan-500/20 focus:outline-none cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(0,217,245,0.4)]">
                    {user?.username ? user.username[0].toUpperCase() : "U"}
                  </div>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 min-w-[15rem] w-max max-w-[calc(100vw-2rem)] sm:max-w-md bg-[#0c1629] border border-cyan-500/30 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] py-2 z-50 backdrop-blur-xl">
                      <div className="px-4 py-2 border-b border-cyan-500/20 bg-cyan-950/25">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 mb-0.5">
                          Authenticated User
                        </div>
                        <div
                          className="text-xs font-mono font-medium text-cyan-300 whitespace-nowrap overflow-hidden text-ellipsis select-all"
                          title={user?.username}
                        >
                          {user?.username}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-cyan-950/60 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <span>Profile & Security</span>
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2 text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-cyan-400 hover:text-white hover:bg-cyan-950/60 border border-cyan-500/25 transition cursor-pointer"
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
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-cyan-500/20 bg-[#070D1A]/98 backdrop-blur-xl shadow-2xl`}>
        <div className="px-4 pt-3 pb-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition duration-200 ${isActive ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,217,245,0.25)]' : 'text-slate-300 hover:bg-cyan-950/40 hover:text-cyan-300'}`}
            >
              {link.name}
            </NavLink>
          ))}

          {/* In mobile menu we show either register/login or profile block */}
          {loggedIn ? (
            <div className="mt-3 p-3 bg-[#0c1629] border border-cyan-500/25 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(0,217,245,0.4)]">
                  {user?.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white text-sm truncate" title={user?.username}>{user?.username}</div>
                  <div className="text-xs text-cyan-400 font-mono">Authenticated</div>
                </div>
              </div>

              <div className="mt-3 flex space-x-2">
                <button onClick={() => { setIsOpen(false); navigate('/profile'); }} className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition">Profile</button>
                <button onClick={() => { setIsOpen(false); logout(); }} className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-red-500/40 text-red-400 hover:bg-red-950/40 transition">Logout</button>
              </div>
            </div>
          ) : (
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block w-full mt-3 px-4 py-2.5 text-center text-sm font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(0,217,245,0.35)]"
            >
              Register / Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;