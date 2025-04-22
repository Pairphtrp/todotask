'use client';

import { useUserAuth } from '../_utils/auth-context';
import { useState } from 'react';
import Link from 'next/link';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

export default function Home() {
  const { user, gitHubSignIn, logOut } = useUserAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6 p-6">
      {/* Modals */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}

      {!user ? (
        <>
          <h1 className="text-3xl font-bold">Welcome to To Do Task App</h1>
          <p className="text-gray-600">Choose a login method:</p>

          <button
            onClick={gitHubSignIn}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Sign in with GitHub
          </button>

          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Login with Email
          </button>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="text-green-600 underline hover:text-green-800"
          >
            Or Register →
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">
            Welcome, {user.displayName || user.email}!
          </h1>

          <button
            onClick={logOut}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Log Out
          </button>

          <Link
            href="/dashboard"
            className="mt-4 text-blue-600 underline hover:text-blue-800"
          >
            Go to Dashboard →
          </Link>

        </>
      )}
    </div>
  );
}
