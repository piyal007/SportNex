import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';

// Custom styles for map z-index fix
const mapStyles = `
  .leaflet-container {
    z-index: 1 !important;
  }
  .leaflet-control-container {
    z-index: 2 !important;
  }
`;

// Fix for default markers in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: `<div class="bg-emerald-600 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
    </svg>
  </div>`,
  className: 'custom-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationSection = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  
  // SportNex club coordinates (example location - you can change this)
  const clubPosition = [23.8103, 90.4125]; // Dhaka, Bangladesh coordinates
  const clubAddress = {
    name: "SportNex Sports Complex",
    street: "123 Sports Avenue, Gulshan-2",
    city: "Dhaka 1212",
    country: "Bangladesh",
    phone: "+880 1700-123456",
    email: "info@sportnex.com"
  };

  const openingHours = [
    { day: "Monday - Friday", hours: "6:00 AM - 10:00 PM" },
    { day: "Saturday - Sunday", hours: "7:00 AM - 11:00 PM" },
    { day: "Public Holidays", hours: "8:00 AM - 9:00 PM" }
  ];

  const handleGetDirections = () => {
    const [lat, lng] = clubPosition;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleCallPhone = () => {
    window.open(`tel:${clubAddress.phone}`, '_self');
  };

  return (
    <>
      {/* Inject custom styles */}
      <style>{mapStyles}</style>
      
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visit Our Location
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find us easily and plan your visit to SportNex. We're conveniently located in the heart of the city.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Address Details */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {clubAddress.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {clubAddress.street}<br />
                    {clubAddress.city}<br />
                    {clubAddress.country}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button 
                  onClick={handleGetDirections}
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 cursor-pointer flex-1"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCallPhone}
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer flex-1"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </Button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Phone className="h-5 w-5 text-emerald-600 mr-2" />
                Contact Information
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                  <p className="text-foreground">{clubAddress.phone}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <p className="text-foreground">{clubAddress.email}</p>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                Opening Hours
              </h4>
              <div className="space-y-3">
                {openingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{schedule.day}</span>
                    <span className="text-foreground font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="h-96 lg:h-[500px] relative z-0">
                {/* Map Control Instructions Overlay - Centered */}
                {showInstructions && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700 transition-opacity duration-300">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 justify-center">
                      <span className="text-emerald-600">⌨️</span>
                      Hold <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">Ctrl</kbd> + scroll to zoom
                    </p>
                  </div>
                )}
                
                <MapContainer
                  center={clubPosition}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="h-full w-full rounded-lg"
                  zoomControl={true}
                  whenReady={(mapInstance) => {
                    const map = mapInstance.target;
                    
                    // Disable default scroll wheel zoom
                    map.scrollWheelZoom.disable();
                    
                    // Add custom Ctrl+scroll zoom with better event handling
                    const handleZoom = (e) => {
                      if (e.ctrlKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Hide instructions on first use
                        setShowInstructions(false);
                        
                        const currentZoom = map.getZoom();
                        // Correct zoom direction: negative deltaY = scroll up = zoom in, positive deltaY = scroll down = zoom out
                        const zoomDelta = e.deltaY < 0 ? 1 : -1;
                        const newZoom = Math.max(1, Math.min(18, currentZoom + zoomDelta));
                        
                        // Use smooth zoom animation
                        map.setZoom(newZoom, {
                          animate: true,
                          duration: 0.25
                        });
                      }
                    };
                    
                    // Attach event to map container
                    const container = map.getContainer();
                    container.addEventListener('wheel', handleZoom, { passive: false });
                    
                    // Store reference for cleanup
                    map._customZoomHandler = handleZoom;
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={clubPosition}>
                    <Popup className="custom-popup">
                      <div className="p-2">
                        <h3 className="font-semibold text-lg mb-1">{clubAddress.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {clubAddress.street}<br />
                          {clubAddress.city}
                        </p>
                        <Button 
                          size="sm" 
                          onClick={handleGetDirections}
                          className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
            
            {/* Map Instructions */}
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                📍 Click the marker for more details • ⌨️ Ctrl + Scroll to zoom • ✋ Drag to explore
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
};

export default LocationSection;