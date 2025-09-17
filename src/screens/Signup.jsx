import React from 'react';

const Signup = () => (
  <div className="signup">
    <h2>Signup</h2>
    <form>
      <input type="text" placeholder="Username" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Signup</button>
    </form>
  </div>
);

export default Signup;
