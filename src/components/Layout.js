import React from 'react';
import Header from './Header';
import NavbarHorizontal from './NavbarHorizontal';
import NavbarVertical from './NavbarVertical';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import './CSS/layout.css';

const Layout = () => {
  return (
    <div id="main-layout">
      <div id="header-container">
        <Header />
      </div>
      <div id="horizontal-navbar">
        <NavbarHorizontal />
      </div>
      <div id="content-wrapper">
        <div id="vertical-navbar">
          <NavbarVertical />
        </div>
        <div id="main-content-section">
          <Outlet /> {/* Contenu dynamique basé sur les routes */}
        </div>
      </div>
      <div id="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
