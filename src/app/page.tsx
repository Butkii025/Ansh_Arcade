import React from 'react';
import HomeArcade from '@/components/Home';
import SmoothFollower from '@/components/SmoothFollower';

export default function RootPage(): React.JSX.Element {
  return (
    <>
      <HomeArcade />
      <SmoothFollower /> 
    </>
  );
}