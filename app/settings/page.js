'use client';

import { useUserAuth } from '../../_utils/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user, logOut, changePassword } = useUserAuth();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await changePassword(newPassword);
      setMessage('✅ Password updated successfully!');
      setNewPassword('');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return user ? (
    <div className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white border rounded shadow p-6 space-y-4 text-black">
        <p><strong>Email:</strong> {user.email}</p>

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="text-black space-y-2 mt-4">
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter new password"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Change Password
          </button>
        </form>

        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>

      <div className="mt-6">
        <a href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</a>
      </div>
    </div>
  ) : null;
}
