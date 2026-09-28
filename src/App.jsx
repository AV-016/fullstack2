import React, { useState } from 'react';
import './index.css';

const users = [
  { email: 'admin@fsd.edu', password: 'password123', name: 'Administrator', role: 'admin' },
  { email: 'rohan@fsd.edu', password: 'password123', name: 'Rohan Sharma', role: 'student' },
  { email: 'faculty@fsd.edu', password: 'password123', name: 'Dr. Neha Verma', role: 'faculty' }
];

function encode(obj) {
  return btoa(JSON.stringify(obj)).replace(/=/g, '');
}

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setToken(null);

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) { setError('Invalid email or password'); return; }

    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { name: user.name, email: user.email, role: user.role, iat: Math.floor(Date.now() / 1000) };
    const signature = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    setToken({
      raw: encode(header) + '.' + encode(payload) + '.' + signature,
      header,
      payload,
      signature
    });
  };

  return (
    <div className="page">
      <div className="box">
        <h2>Login</h2>
        {error && <p className="err">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      </div>

      {token && (
        <div className="box">
          <h2>JWT Token</h2>

          <h4>Raw Token</h4>
          <pre className="raw">{token.raw}</pre>

          <h4>Header</h4>
          <pre>{JSON.stringify(token.header, null, 2)}</pre>

          <h4>Payload</h4>
          <pre>{JSON.stringify(token.payload, null, 2)}</pre>

          <h4>Signature</h4>
          <pre>{token.signature}</pre>
        </div>
      )}
    </div>
  );
}
