import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.css';

const Footer = props => (
  <div className="footer">
    <div>
      <ul className="footer-links">
        <li><Link to="/help">Help Center</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/joining">Joining Forces</Link></li>
        <li><Link to="/privacy">Privacy Policy</Link></li>
        <li><Link to="/tos">Terms of Service</Link></li>
      </ul>
    </div>
  </div>
);

export default Footer;
