import { useEffect } from 'react';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = divIcon({
  className: 'thana-map-marker',
  html: '<span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function FitMapToMarkers({ thanas }) {
  const map = useMap();

  useEffect(() => {
    if (thanas.length === 0) return;

    if (thanas.length === 1) {
      map.setView([thanas[0].Latitude, thanas[0].Longitude], 12);
      return;
    }

    map.fitBounds(
      thanas.map((thana) => [thana.Latitude, thana.Longitude]),
      { padding: [32, 32], maxZoom: 11 },
    );
  }, [map, thanas]);

  return null;
}

function ThanaMap({ thanas }) {
  return (
    <MapContainer className="thana-map" center={[23.8, 90.2]} zoom={8} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitMapToMarkers thanas={thanas} />
      {thanas.map((thana) => (
        <Marker
          key={thana.Thana_ID}
          position={[thana.Latitude, thana.Longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div className="map-popup">
              <strong lang={thana.Thana_Name_Bn ? 'bn' : 'en'}>
                {thana.Thana_Name_Bn || thana.Thana_Name_En}
              </strong>
              {thana.Thana_Name_Bn && thana.Thana_Name_Bn !== thana.Thana_Name_En && (
                <span>{thana.Thana_Name_En}</span>
              )}
              <small>{thana.district.District_Name_En} · {thana.Thana_ID}</small>
              <div className="map-popup-coordinates">
                <span>
                  <small>Latitude</small>
                  <strong>{thana.Latitude.toFixed(4)}</strong>
                </span>
                <span>
                  <small>Longitude</small>
                  <strong>{thana.Longitude.toFixed(4)}</strong>
                </span>
              </div>
              <a href={`https://www.google.com/maps?q=${thana.Latitude},${thana.Longitude}`} target="_blank" rel="noreferrer">
                Open in Google Maps
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default ThanaMap;
