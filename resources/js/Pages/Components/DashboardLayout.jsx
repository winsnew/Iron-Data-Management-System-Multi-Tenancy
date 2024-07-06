import React from 'react';
import Homepage from './Homepage';

const DashboardLayout = ({ children }) => {

  return (
    <Homepage foo={children} />
  );
};

export default DashboardLayout;
