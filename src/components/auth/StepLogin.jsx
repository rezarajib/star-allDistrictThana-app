import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function StepLogin({ identifier, onClose }) {
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // API call logic: fetch('/api/login', ...)
    login({ identifier, name: 'User Name' });
    onClose();
  };

  return (
    <form onSubmit={handleLogin}>
      <h3>Enter Password</h3>
      <p>Logging in as: <strong>{identifier}</strong></p>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}