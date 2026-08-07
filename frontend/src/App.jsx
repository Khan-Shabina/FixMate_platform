import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyModal from './components/EmergencyModal';

// 15 Pages Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
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
  const [currentRole, setCurrentRole] = useState('ROLE_CUSTOMER'); // ROLE_CUSTOMER, ROLE_PROVIDER, ROLE_ADMIN
  const [user, setUser] = useState({
    name: 'Sumit Shelar',
    email: 'customer@fixmate.com',
    role: 'ROLE_CUSTOMER'
  });

  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [trackedBooking, setTrackedBooking] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

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
        return <Login setCurrentPage={setCurrentPage} setCurrentRole={setCurrentRole} setUser={setUser} />;

      case 'register':
        return <Register setCurrentPage={setCurrentPage} setCurrentRole={setCurrentRole} setUser={setUser} />;

      case 'services':
        return <Services setCurrentPage={setCurrentPage} setSelectedService={setSelectedService} />;

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
          />
        );

      case 'reminders':
        return <MaintenanceReminder setCurrentPage={setCurrentPage} setSelectedService={setSelectedService} />;

      case 'society':
        return <CommunityBooking setCurrentPage={setCurrentPage} />;

      case 'provider-dashboard':
        return <ProviderDashboard setCurrentPage={setCurrentPage} />;

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
