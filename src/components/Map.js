import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { point, distance } from '@turf/turf';

// Ensure the path to vehicle icon is correct or use a public URL
const vehicleIcon = new L.Icon({
  iconUrl: require('../assets/vehicle.jpg'), // Replace with a URL if necessary
  iconSize: [25, 25],
  iconAnchor: [12, 25], // Anchor the icon at the bottom center
});

const Map = () => {
  const [positions, setPositions] = useState([]);
  const [distanceBetween, setDistance] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vehicle/location');
        if (response.ok) {
          const data = await response.json();
          setPositions(data);

          if (data.length >= 2) {
            const startPoint = [data[0].longitude, data[0].latitude];
            const endPoint = [data[data.length - 1].longitude, data[data.length - 1].latitude];
            const start = point(startPoint);
            const end = point(endPoint);
            const distanceInMeters = distance(start, end, { units: 'meters' });
            setDistance(distanceInMeters.toFixed(2)); // Set distance with up to 2 decimal points
          }
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (map && positions.length > 1) {
      const polyline = L.polyline(
        positions.map(pos => [pos.latitude, pos.longitude]),
        { color: 'darkred', weight: 5 }
      ).addTo(map);

      map.fitBounds(polyline.getBounds());
    }
  }, [map, positions]);

  return (
    <MapContainer
      center={positions.length > 0 ? [positions[0].latitude, positions[0].longitude] : [17.385044, 78.486671]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
      whenCreated={setMap}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {positions.length > 0 && (
        <>
          <Marker
            position={[positions[0].latitude, positions[0].longitude]}
            icon={vehicleIcon}
          />
          <Marker
            position={[positions[positions.length - 1].latitude, positions[positions.length - 1].longitude]}
            icon={vehicleIcon}
          />
          <Polyline
            positions={positions.map(pos => [pos.latitude, pos.longitude])}
            color="darkred"
            weight={5}
          />
          {distanceBetween && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              backgroundColor: 'white',
              padding: '5px',
              borderRadius: '3px'
            }}>
              Distance: {distanceBetween} meters
            </div>
          )}
        </>
      )}
    </MapContainer>
  );
};

export default Map;
