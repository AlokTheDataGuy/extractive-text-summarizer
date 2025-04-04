import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <img src="/logo.svg" alt="Logo" className="navbar-logo" />
          <span className="navbar-title">BERTSummarizer</span>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item"><a href="#" className="navbar-link active">Home</a></li>
          <li className="navbar-item"><a href="#" className="navbar-link">About</a></li>
          <li className="navbar-item"><a href="#" className="navbar-link">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;