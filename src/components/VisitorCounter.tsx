"use client";

import React, { useState, useEffect } from 'react';

export default function VisitorCounter(): React.JSX.Element {
  const [visitCount, setVisitCount] = useState<number>(0);

  useEffect(() => {
    // Safely execute disk reads only when running in the browser
    const storedVisits = localStorage.getItem('x𝖾𝗅𝖺_a𝗋𝖼𝖺𝖽𝖾_vistis');
    const currentVisits = storedVisits ? parseInt(storedVisits, 10) : 0;
    const updatedVisits = currentVisits + 1;
    
    localStorage.setItem('x𝖾𝗅𝖺_a𝗋𝖼𝖺𝖽𝖾_vistis', updatedVisits.toString());
    setVisitCount(updatedVisits);
  }, []);

  return (
    <span className="text-emerald-400 font-bold ml-1">
      {visitCount}
    </span>
  );
}