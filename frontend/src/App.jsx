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

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('fixmate_role') || 'ROLE_CUSTOMER';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fixmate_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default initial session demo user
    return {
      name: 'Sumit Shelar',
      email: 'customer@fixmate.com',
      role: 'ROLE_CUSTOMER'
    };
  });

  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [trackedBooking, setTrackedBooking] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  // Sync state changes with localStorage
  const handleUserLogin = (userData) => {
    setUser(userData);
    setCurrentRole(userData.role);
    localStorage.setItem('fixmate_user', JSON.stringify(userData));
    localStorage.setItem('fixmate_role', userData.role);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fixmate_user');
    localStorage.removeItem('fixmate_role');
    setCurrentPage('login');
  };

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
        return <Login setCurrentPage={setCurrentPage} setCurrentRole={setCurrentRole} setUser={handleUserLogin} />;

      case 'register':
        return <Register setCurrentPage={setCurrentPage} setCurrentRole={setCurrentRole} setUser={handleUserLogin} />;

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
        return (
          <Booking 
            selectedService={selectedService} 
            selectedProvider={selectedProvider} 
            setCurrentPage={setCurrentPage}
            setTrackedBooking={setTrackedBooking}
          />
        );

      case 'tracking':
        return <BookingTracking trackedBooking={trackedBooking} setCurrentPage={setCurrentPage} />;

      case 'customer-dashboard':
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
        return <ProviderDashboard setCurrentPage={setCurrentPage} user={user} />;

      case 'manage-services':
        return <ManageServices setCurrentPage={setCurrentPage} />;

      case 'provider-bookings':
        return <ProviderBookingMgmt setCurrentPage={setCurrentPage} />;

      case 'admin-dashboard':
        return <AdminDashboard setCurrentPage={setCurrentPage} />;

      case 'provider-verification':
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
        setCurrentRole={setCurrentRole}
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
