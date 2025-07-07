import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Search, AlertTriangle, Loader, Crosshair, Satellite } from 'lucide-react';

// Leaflet map component
declare global {
  interface Window {
    L: any;
  }
}

interface EmergencyService {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'fire_station' | 'pharmacy';
  coordinates: [number, number];
  phone?: string;
  address: string;
  distance?: number;
  isOpen?: boolean;
  rating?: number;
}

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [currentTileLayer, setCurrentTileLayer] = useState<any>(null);

  const serviceTypes = [
    { value: 'all', label: 'All Services', icon: '🏥' },
    { value: 'police', label: 'Police Stations', icon: '👮' },
    { value: 'hospital', label: 'Hospitals', icon: '🏥' },
    { value: 'fire_station', label: 'Fire Stations', icon: '🚒' },
    { value: 'pharmacy', label: 'Pharmacies', icon: '💊' }
  ];

  // Calculate distance between two coordinates (Haversine formula)
  const getDistance = (coord1: [number, number], coord2: [number, number]) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Center map on user's live location
  const centerOnUserLocation = () => {
    if (userLocation && map) {
      map.setView(userLocation, 16);
      
      // Add a temporary highlight effect
      const highlightCircle = window.L.circle(userLocation, {
        color: '#ec4899',
        fillColor: '#ec4899',
        fillOpacity: 0.2,
        radius: 100
      }).addTo(map);
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        map.removeLayer(highlightCircle);
      }, 2000);
    } else if (!userLocation) {
      alert('Location not available. Please enable location services and try again.');
    }
  };

  // Toggle between standard and satellite view
  const toggleMapView = () => {
    if (map && window.L) {
      // Remove current tile layer
      if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
      }

      let newTileLayer;
      
      if (!isSatelliteView) {
        // Switch to satellite view using Esri World Imagery
        newTileLayer = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          maxZoom: 19
        });
      } else {
        // Switch back to standard OpenStreetMap view
        newTileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        });
      }
      
      newTileLayer.addTo(map);
      setCurrentTileLayer(newTileLayer);
      setIsSatelliteView(!isSatelliteView);
    }
  };

  // Fetch nearby emergency services using Overpass API (OpenStreetMap)
  const fetchNearbyServices = async (lat: number, lng: number) => {
    setIsLoadingServices(true);
    try {
      const radius = 5000; // 5km radius
      
      // Overpass API query for emergency services
      const queries = [
        `[out:json][timeout:25];
        (
          node["amenity"="police"](around:${radius},${lat},${lng});
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          node["amenity"="fire_station"](around:${radius},${lat},${lng});
          node["amenity"="pharmacy"](around:${radius},${lat},${lng});
          way["amenity"="police"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="fire_station"](around:${radius},${lat},${lng});
          way["amenity"="pharmacy"](around:${radius},${lat},${lng});
        );
        out center;`
      ];

      const services: EmergencyService[] = [];

      for (const query of queries) {
        try {
          const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            headers: {
              'Content-Type': 'text/plain',
            },
          });

          if (response.ok) {
            const data = await response.json();
            
            data.elements.forEach((element: any) => {
              const coords: [number, number] = element.center 
                ? [element.center.lat, element.center.lon]
                : [element.lat, element.lon];
              
              if (coords[0] && coords[1]) {
                const distance = getDistance([lat, lng], coords);
                
                services.push({
                  id: element.id.toString(),
                  name: element.tags?.name || `${element.tags?.amenity?.replace('_', ' ').toUpperCase()} Service`,
                  type: element.tags?.amenity as EmergencyService['type'],
                  coordinates: coords,
                  phone: element.tags?.phone,
                  address: element.tags?.['addr:full'] || 
                          `${element.tags?.['addr:street'] || ''} ${element.tags?.['addr:housenumber'] || ''}`.trim() ||
                          'Address not available',
                  distance: distance,
                  isOpen: element.tags?.opening_hours ? undefined : true, // Assume open if no hours specified
                  rating: element.tags?.rating ? parseFloat(element.tags.rating) : undefined
                });
              }
            });
          }
        } catch (error) {
          console.error('Error fetching from Overpass API:', error);
        }
      }

      // Remove duplicates and sort by distance
      const uniqueServices = services.filter((service, index, self) => 
        index === self.findIndex(s => s.name === service.name && s.type === service.type)
      ).sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setEmergencyServices(uniqueServices);
    } catch (error) {
      console.error('Error fetching emergency services:', error);
      // Fallback to some basic services if API fails
      setEmergencyServices([
        {
          id: 'emergency-1',
          name: 'Emergency Services',
          type: 'police',
          coordinates: [lat, lng],
          phone: '100',
          address: 'Emergency Hotline',
          distance: 0
        }
      ]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Filter services based on search and type
  const filteredServices = emergencyServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedServiceType === 'all' || service.type === selectedServiceType;
    return matchesSearch && matchesType;
  });

  useEffect(() => {
    // Get high-accuracy user location
    const getHighAccuracyLocation = () => {
      if ('geolocation' in navigator) {
        setIsLoadingLocation(true);
        setLocationError(null);
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
            setUserLocation(userCoords);
            setIsLoadingLocation(false);
            console.log('High accuracy location obtained:', userCoords);
            
            // Fetch nearby services once we have location
            fetchNearbyServices(userCoords[0], userCoords[1]);
          },
          (error) => {
            console.error('High accuracy location error:', error);
            setLocationError(getLocationErrorMessage(error));
            setIsLoadingLocation(false);
            
            // Fallback to lower accuracy
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
                setUserLocation(userCoords);
                console.log('Fallback location obtained:', userCoords);
                fetchNearbyServices(userCoords[0], userCoords[1]);
              },
              (fallbackError) => {
                console.error('Fallback location error:', fallbackError);
                setLocationError('Unable to get your location. Please enable location services.');
              },
              { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
            );
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
          }
        );
      } else {
        setLocationError('Geolocation is not supported by this browser.');
        setIsLoadingLocation(false);
      }
    };

    getHighAccuracyLocation();
  }, []);

  const getLocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location services.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred while getting location.';
    }
  };

  useEffect(() => {
    // Load Leaflet dynamically and initialize map
    const loadLeaflet = async () => {
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.crossOrigin = 'anonymous';
        script.onload = initializeMap;
        script.onerror = (error) => {
          console.error('Failed to load Leaflet library:', error);
          setLocationError('Failed to load map library. Please refresh the page.');
        };
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapRef.current && window.L && !map) {
        // Initialize map only if it doesn't exist
        const initialCenter: [number, number] = userLocation || [28.6139, 77.2090]; // Default to Delhi
        const leafletMap = window.L.map(mapRef.current).setView(initialCenter, userLocation ? 15 : 11);
        
        // Add initial tile layer (standard view)
        const initialTileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(leafletMap);

        setMap(leafletMap);
        setCurrentTileLayer(initialTileLayer);

        // Add user location marker if available
        if (userLocation) {
          const userIcon = window.L.divIcon({
            html: '<div style="background: #ec4899; width: 24px; height: 24px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative; animation: pulse 2s infinite;"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div><style>@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(236, 72, 153, 0); } 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); } }</style>',
            iconSize: [24, 24],
            className: 'user-location-marker'
          });
          
          window.L.marker(userLocation, { icon: userIcon })
            .addTo(leafletMap)
            .bindPopup('<div style="text-align: center;"><strong>📍 Your Current Location</strong><br><small>Live location updated</small></div>')
            .openPopup();
          
          leafletMap.setView(userLocation, 15);
        }
      }
    };

    loadLeaflet();

    return () => {
      // Clean up map on unmount
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [userLocation]); // Remove map from dependencies to prevent re-initialization

  useEffect(() => {
    if (map && window.L && emergencyServices.length > 0) {
      // Clear existing service markers
      map.eachLayer((layer: any) => {
        if (layer.options && layer.options.isEmergencyService) {
          map.removeLayer(layer);
        }
      });

      // Add emergency service markers
      filteredServices.forEach((service, index) => {
        const isSelected = selectedService === service.id;
        
        const getServiceIcon = (type: string) => {
          switch (type) {
            case 'police': return '👮';
            case 'hospital': return '🏥';
            case 'fire_station': return '🚒';
            case 'pharmacy': return '💊';
            default: return '🏢';
          }
        };

        const getServiceColor = (type: string) => {
          switch (type) {
            case 'police': return '#ef4444';
            case 'hospital': return '#10b981';
            case 'fire_station': return '#f97316';
            case 'pharmacy': return '#8b5cf6';
            default: return '#6b7280';
          }
        };

        const serviceIcon = window.L.divIcon({
          html: `<div style="background: ${isSelected ? '#1f2937' : getServiceColor(service.type)}; color: white; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px; position: relative;">
            ${getServiceIcon(service.type)}
            ${service.distance && service.distance < 1 ? '<div style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">!</div>' : ''}
          </div>`,
          iconSize: [36, 36],
          className: 'emergency-service-marker'
        });

        const marker = window.L.marker(service.coordinates, { 
          icon: serviceIcon,
          isEmergencyService: true 
        })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 220px; max-width: 300px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 20px; margin-right: 8px;">${getServiceIcon(service.type)}</span>
                <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">${service.name}</h3>
              </div>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: capitalize;">${service.type.replace('_', ' ')}</p>
              <p style="margin: 0 0 8px 0; color: #374151; font-size: 13px;">${service.address}</p>
              ${service.distance ? `<p style="margin: 0 0 8px 0; color: #059669; font-weight: bold; font-size: 12px;">📍 ${service.distance.toFixed(2)} km away</p>` : ''}
              ${service.phone ? `
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="margin-right: 8px;">📞</span>
                  <a href="tel:${service.phone}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${service.phone}</a>
                </div>
              ` : ''}
              ${service.isOpen !== undefined ? `
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <span style="margin-right: 8px;">${service.isOpen ? '🟢' : '🔴'}</span>
                  <span style="color: ${service.isOpen ? '#10b981' : '#ef4444'}; font-weight: bold; font-size: 12px;">
                    ${service.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              ` : ''}
              <div style="margin-top: 12px; display: flex; gap: 8px;">
                ${service.phone ? `<button onclick="window.location.href='tel:${service.phone}'" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">Call</button>` : ''}
                <button onclick="window.open('https://www.google.com/maps/dir/${userLocation ? userLocation[0] + ',' + userLocation[1] : ''}/${service.coordinates[0]},${service.coordinates[1]}', '_blank')" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">Directions</button>
              </div>
            </div>
          `);

        marker.on('click', () => {
          setSelectedService(service.id);
        });
      });
    }
  }, [map, filteredServices, selectedService, userLocation]);

  const centerOnService = (service: EmergencyService) => {
    if (map) {
      map.setView(service.coordinates, 17);
      setSelectedService(service.id);
    }
  };

  const callService = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getDirections = (service: EmergencyService) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${service.coordinates[0]},${service.coordinates[1]}`;
      window.open(url, '_blank');
    } else {
      alert('Location not available. Please enable location services.');
    }
  };

  const retryLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userCoords);
          setIsLoadingLocation(false);
          fetchNearbyServices(userCoords[0], userCoords[1]);
          
          if (map) {
            const userIcon = window.L.divIcon({
              html: '<div style="background: #ec4899; width: 24px; height: 24px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative; animation: pulse 2s infinite;"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>',
              iconSize: [24, 24],
              className: 'user-location-marker'
            });
            
            window.L.marker(userCoords, { icon: userIcon })
              .addTo(map)
              .bindPopup('📍 Your Current Location')
              .openPopup();
            
            map.setView(userCoords, 15);
          }
        },
        (error) => {
          setLocationError(getLocationErrorMessage(error));
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency Services Near You</h1>
          <p className="text-lg text-gray-600">Find nearby police stations, hospitals, and emergency services based on your live location</p>
        </div>

        {/* Location Status */}
        {(isLoadingLocation || locationError) && (
          <div className="mb-6">
            {isLoadingLocation ? (
              <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg flex items-center">
                <Loader className="animate-spin h-4 w-4 mr-3" />
                <span>Getting your precise location...</span>
              </div>
            ) : locationError ? (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>{locationError}</span>
                </div>
                <button
                  onClick={retryLocation}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                >
                  Retry
                </button>
              </div>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search emergency services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {serviceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Map Control Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={centerOnUserLocation}
                    disabled={!userLocation}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      userLocation 
                        ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-md hover:shadow-lg transform hover:scale-105' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Crosshair className="h-4 w-4" />
                    <span>Center on My Location</span>
                  </button>
                  
                  <button
                    onClick={toggleMapView}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                      isSatelliteView 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    <Satellite className="h-4 w-4" />
                    <span>{isSatelliteView ? 'Street View' : 'Satellite View'}</span>
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div 
                  ref={mapRef} 
                  className="h-96 lg:h-[600px] w-full"
                  style={{ background: '#f3f4f6' }}
                />
                {isLoadingServices && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <Loader className="animate-spin h-6 w-6 text-pink-600" />
                      <span className="text-gray-700">Loading emergency services...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Nearby Services ({filteredServices.length})
              </h3>
              {isLoadingServices && <Loader className="animate-spin h-5 w-5 text-pink-600" />}
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredServices.map((service, index) => {
                const serviceTypeInfo = serviceTypes.find(t => t.value === service.type);
                return (
                  <div
                    key={service.id}
                    className={`bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
                      selectedService === service.id ? 'border-pink-500' : 'border-transparent'
                    }`}
                    onClick={() => centerOnService(service)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{serviceTypeInfo?.icon || '🏢'}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          {service.distance && (
                            <p className="text-sm text-green-600 font-medium">{service.distance.toFixed(2)} km away</p>
                          )}
                        </div>
                      </div>
                      {service.distance && service.distance < 1 && (
                        <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                          NEARBY
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 capitalize">{service.type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500 mb-3">{service.address}</p>
                    
                    <div className="flex items-center space-x-2">
                      {service.phone && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            callService(service.phone!);
                          }}
                          className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                          <Phone className="h-3 w-3" />
                          <span>Call</span>
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          getDirections(service);
                        }}
                        className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                        disabled={!userLocation}
                      >
                        <Navigation className="h-3 w-3" />
                        <span>Directions</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredServices.length === 0 && !isLoadingServices && (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your search or check your location</p>
              </div>
            )}

            {/* Emergency Numbers */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-xl">
              <h4 className="font-bold mb-3 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Hotlines
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Police Emergency</span>
                  <a href="tel:100" className="font-bold">100</a>
                </div>
                <div className="flex justify-between">
                  <span>Women Helpline</span>
                  <a href="tel:1091" className="font-bold">1091</a>
                </div>
                <div className="flex justify-between">
                  <span>Medical Emergency</span>
                  <a href="tel:108" className="font-bold">108</a>
                </div>
                <div className="flex justify-between">
                  <span>Fire Emergency</span>
                  <a href="tel:101" className="font-bold">101</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}