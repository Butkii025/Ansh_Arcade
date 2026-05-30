import React from 'react';
import HomeArcade from '../components/Home';
import SmoothFollower from '@/components/SmoothFollower';
import FooterPanel from '../components/FooterPanel';

export default function RootPage(): React.JSX.Element {
  return (
    <>
      <HomeArcade />
      <SmoothFollower /> 
      
      <FooterPanel />
    </>
  );
}