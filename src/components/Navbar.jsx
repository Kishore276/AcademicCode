import React from 'react';

const Navbar = () => (
  <nav className="navbar">
    <div className="logo">Academic Code</div>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/challenges">Challenges</a></li>
      <li><a href="/profile">Profile</a></li>
      <li><a href="/login">Login</a></li>
      <li><a href="/signup">Signup</a></li>
    </ul>
  </nav>
);

export default Navbar;
