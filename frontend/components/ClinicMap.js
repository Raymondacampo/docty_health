// components/ClinicMap.js
import React from 'react';

const ClinicMap = ({ clinicName, width = '600', height = '450' }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Replace with your Google API key
  const query = encodeURIComponent(`${clinicName}, Santo Domingo`);
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`;

  return (
    <iframe
      width={width}
      height={height}
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      src={src}
    />
  );
};

export default ClinicMap;