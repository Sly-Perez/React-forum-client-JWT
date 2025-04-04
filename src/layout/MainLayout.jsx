import React from 'react';
import MainNavbar from '../components/MainNavbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
        <MainNavbar />
        <Outlet />
    </>
  )
}

export default MainLayout;