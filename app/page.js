'use client';
import { useUserAuth } from '../_utils/auth-context';
import Link from 'next/link';

export default function Home() {
  const { user, gitHubSignIn, logOut } = useUserAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6 p-6">
      {!user ? (
        <>
          <h1 className="text-3xl font-bold">Welcome to To Do Task App</h1>
          <p className="text-gray-600">Please log in to get started</p>
          <button
            onClick={gitHubSignIn}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Sign in with GitHub
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
