import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function StepRegister({ identifier, type, onClose }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();
    // API call logic: fetch('/api/register', ...)
    login({ identifier, name });
    onClose();
  };

  return (
    <form onSubmit={handleRegister}>
      <h3>Create Account</h3>
      <p>Creating account for: <strong>{identifier}</strong> ({type})</p>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Set Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}