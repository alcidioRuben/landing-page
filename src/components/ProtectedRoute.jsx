import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requirePayment = false }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Carregando...</h2>
          <p className="text-gray-300">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requirePayment && !userProfile?.isPaid) {
    return <Navigate to="/payment" replace />;
  }

  return children;
};

export default ProtectedRoute;
