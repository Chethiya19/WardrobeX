import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import ScrollToTopButton from '../components/ScrollToTopButton';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '0px' }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
