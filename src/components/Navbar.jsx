import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-[#121212]/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shadow-md border-2 border-gray-200 p-1">
                <img 
                  src="/logo.png" 
                  alt="AMSync Ads" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-bold text-lg">AMSync Ads</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex items-center space-x-8"
          >
            <Link
              to="/"
              className="text-gray-200 hover:text-blue-400 font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/sobre"
              className="text-gray-200 hover:text-blue-400 font-medium transition-colors duration-300"
            >
              Sobre
            </Link>
            <Link
              to="/contato"
              className="text-gray-200 hover:text-blue-400 font-medium transition-colors duration-300"
            >
              Contato
            </Link>
          </motion.div>

          {/* Desktop Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden md:flex items-center space-x-4"
          >
            {currentUser ? (
              <>
                {userProfile?.isPaid && (
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-200 hover:text-blue-400 transition-colors duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-300">
                        {currentUser.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/5 hover:text-blue-400 transition-colors duration-200"
                      >
                        Meu Perfil
                      </Link>
                      {!userProfile?.isPaid && (
                        <Link
                          to="/payment"
                          className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/5 hover:text-green-400 transition-colors duration-200"
                        >
                          Completar Pagamento
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/5 hover:text-red-400 transition-colors duration-200"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <a
                  href="https://assistente.amsync.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-blue-400 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  Entrar
                </a>
                <a
                  href="https://assistente.amsync.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent text-blue-400 border-2 border-blue-500 px-6 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Começar Grátis
                </a>
              </>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:hidden"
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-blue-400 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#1e1e1e] border-t border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-blue-400 hover:bg-white/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/sobre"
                className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-blue-400 hover:bg-white/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                to="/contato"
                className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-blue-400 hover:bg-white/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              
              {currentUser ? (
                <>
                  {userProfile?.isPaid && (
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-blue-400 hover:bg-white/5 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-blue-400 hover:bg-white/5 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  {!userProfile?.isPaid && (
                    <Link
                      to="/payment"
                      className="block px-3 py-2 text-base font-medium text-green-400 hover:bg-white/5 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Completar Pagamento
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:bg-white/5 rounded-md transition-colors duration-200"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="https://assistente.amsync.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-blue-400 hover:bg-white/5 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </a>
                  <a
                    href="https://assistente.amsync.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-base font-medium bg-transparent text-blue-400 border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Começar Grátis
                  </a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
