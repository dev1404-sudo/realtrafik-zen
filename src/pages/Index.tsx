import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import FleetOverview from '@/components/FleetOverview';
import TrafficMap from '@/components/TrafficMap';
import VehicleManagement from '@/components/VehicleManagement';
import heroImage from '@/assets/hero-traffic.jpg';

const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <FleetOverview />;
      case 'map':
        return <TrafficMap />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'violations':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Violations Management</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 'routes':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Route Management</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 'drivers':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Driver Management</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">System Settings</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      default:
        return <FleetOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Hero Background */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay */}
      <div className="fixed inset-0 z-10 bg-background/90 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-20 flex w-full">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
