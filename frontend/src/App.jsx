import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyModal from './components/EmergencyModal';

// Pages Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Providers from './pages/Providers';
import ProviderProfile from './pages/ProviderProfile';
import Booking from './pages/Booking';
import BookingTracking from './pages/BookingTracking';
import CustomerDashboard from './pages/CustomerDashboard';
import MaintenanceReminder from './pages/MaintenanceReminder';
import CommunityBooking from './pages/CommunityBooking';
import ProviderDashboard from './pages/ProviderDashboard';
import ManageServices from './pages/ManageServices';
import ProviderBookingMgmt from './pages/ProviderBookingMgmt';
import AdminDashboard from './pages/AdminDashboard';
import ProviderVerification from './pages/ProviderVerification';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fixmate_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null; // Unauthenticated by default - requires login or register
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = localStorage.getItem('fixmate_user');
    return savedUser ? 'home' : 'login'; // Default to login if not authenticated
  });

  const currentRole = user ? user.role : 'ROLE_CUSTOMER';

  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [trackedBooking, setTrackedBooking] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  // Handle User Login
  const handleUserLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('fixmate_user', JSON.stringify(userData));
    localStorage.setItem('fixmate_role', userData.role);
    if (userData.accessToken) {
      localStorage.setItem('fixmate_token', userData.accessToken);
    }
  };

  // Immediate Logout Handler (clears state & storage, redirects to login page without refresh)
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fixmate_user');
    localStorage.removeItem('fixmate_role');
    localStorage.removeItem('fixmate_token');
    setCurrentPage('login');
  };

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Access Denied / Protected Route Banner
  const renderAccessDenied = (requiredRole) => (
    <div className="container py-5 text-center my-5">
      <div className="card shadow border-0 p-5 mx-auto" style={{ maxWidth: '500px' }}>
        <ShieldAlert size={60} className="text-danger mx-auto mb-3" />
        <h3 className="fw-bold text-dark mb-2">Access Denied</h3>
        <p className="text-muted mb-4">
          You do not have permission to view this page. Required Role: <strong>{requiredRole}</strong>.
        </p>
        <button className="btn btn-fixmate-primary fw-bold px-4 rounded-pill" onClick={() => setCurrentPage(user ? 'home' : 'login')}>
          {user ? 'Return to Home' : 'Sign In Now'}
        </button>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            setCurrentPage={setCurrentPage} 
            setSelectedService={setSelectedService}
            setSelectedProvider={setSelectedProvider}
            onOpenEmergency={() => setEmergencyModalOpen(true)}
          />
        );

      case 'login':
        return <Login setCurrentPage={setCurrentPage} setUser={handleUserLogin} />;

      case 'register':
        return <Register setCurrentPage={setCurrentPage} setUser={handleUserLogin} />;

      case 'services':
        return <Services setCurrentPage={setCurrentPage} setSelectedService={setSelectedService} />;

      case 'providers':
        return <Providers setCurrentPage={setCurrentPage} setSelectedProvider={setSelectedProvider} />;

      case 'provider-profile':
        return (
          <ProviderProfile 
            provider={selectedProvider} 
            setCurrentPage={setCurrentPage} 
            setSelectedProvider={setSelectedProvider} 
          />
        );

      case 'booking':
        if (!user) return <Login setCurrentPage={setCurrentPage} setUser={handleUserLogin} />;
        return (
          <Booking 
            selectedService={selectedService} 
            selectedProvider={selectedProvider} 
            setCurrentPage={setCurrentPage}
            setTrackedBooking={setTrackedBooking}
          />
        );

      case 'tracking':
        if (!user) return <Login setCurrentPage={setCurrentPage} setUser={handleUserLogin} />;
        return <BookingTracking trackedBooking={trackedBooking} setCurrentPage={setCurrentPage} />;

      case 'customer-dashboard':
        if (!user) return <Login setCurrentPage={setCurrentPage} setUser={handleUserLogin} />;
        return (
          <CustomerDashboard 
            setCurrentPage={setCurrentPage} 
            setTrackedBooking={setTrackedBooking}
            onOpenEmergency={() => setEmergencyModalOpen(true)}
            user={user}
          />
        );

      case 'reminders':
        return <MaintenanceReminder setCurrentPage={setCurrentPage} setSelectedService={setSelectedService} />;

      case 'society':
        return <CommunityBooking setCurrentPage={setCurrentPage} />;

      case 'provider-dashboard':
        if (!user || (user.role !== 'ROLE_PROVIDER' && user.role !== 'PROVIDER' && user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN')) {
          return renderAccessDenied('ROLE_PROVIDER');
        }
        return <ProviderDashboard setCurrentPage={setCurrentPage} user={user} />;

      case 'manage-services':
        if (!user || (user.role !== 'ROLE_PROVIDER' && user.role !== 'PROVIDER' && user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN')) {
          return renderAccessDenied('ROLE_PROVIDER');
        }
        return <ManageServices setCurrentPage={setCurrentPage} />;

      case 'provider-bookings':
        if (!user || (user.role !== 'ROLE_PROVIDER' && user.role !== 'PROVIDER' && user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN')) {
          return renderAccessDenied('ROLE_PROVIDER');
        }
        return <ProviderBookingMgmt setCurrentPage={setCurrentPage} />;

      case 'admin-dashboard':
        if (!user || (user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN')) {
          return renderAccessDenied('ROLE_ADMIN');
        }
        return <AdminDashboard setCurrentPage={setCurrentPage} user={user} />;

      case 'provider-verification':
        if (!user || (user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN')) {
          return renderAccessDenied('ROLE_ADMIN');
        }
        return <ProviderVerification setCurrentPage={setCurrentPage} />;

      default:
        return <Home setCurrentPage={setCurrentPage} setSelectedService={setSelectedService} setSelectedProvider={setSelectedProvider} onOpenEmergency={() => setEmergencyModalOpen(true)} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentRole={currentRole}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-grow-1">
        {renderPage()}
      </main>

      <Footer setCurrentPage={setCurrentPage} />

      <EmergencyModal 
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onBookingSuccess={(booking) => {
          setTrackedBooking(booking);
          setCurrentPage('tracking');
        }}
      />
    </div>
  );
}
