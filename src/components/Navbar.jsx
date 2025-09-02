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
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="LacasaDigital" 
                className="h-12 w-auto"
              />
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
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/sobre"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Sobre
            </Link>
            <Link
              to="/contato"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
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
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {currentUser.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        Meu Perfil
                      </Link>
                      {!userProfile?.isPaid && (
                        <Link
                          to="/payment"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                        >
                          Completar Pagamento
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  Entrar
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Começar Agora
                </Link>
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
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
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/sobre"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                to="/contato"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              
              {currentUser ? (
                <>
                  {userProfile?.isPaid && (
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  {!userProfile?.isPaid && (
                    <Link
                      to="/payment"
                      className="block px-3 py-2 text-base font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
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
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium bg-white text-blue-600 border-2 border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Começar Agora
                  </Link>
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
