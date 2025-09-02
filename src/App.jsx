import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PageLoadingSpinner } from './components/LoadingSpinner';
import Home from './pages/Home';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Recursos from './pages/Recursos';
import Profile from './pages/Profile';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import ProtectedRoute from './components/ProtectedRoute';

// Componente interno para gerenciar loading
const AppContent = () => {
  const { loading } = useAuth()

  if (loading) {
    return <PageLoadingSpinner text="Inicializando aplicação..." />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requirePayment={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recursos" 
            element={
              <ProtectedRoute requirePayment={true}>
                <Recursos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
