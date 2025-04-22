'use client';

import { useState } from 'react';
import { useUserAuth } from '../_utils/auth-context';
import { useRouter } from 'next/navigation';

export default function RegisterModal({ onClose }) {
  const { register } = useUserAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      onClose(); // Close modal
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="text-gray-500 flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Register</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className=" text-gray-500 w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="text-gray-500 w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
