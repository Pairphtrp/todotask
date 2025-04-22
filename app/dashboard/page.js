'use client';

import { useUserAuth } from '../../_utils/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TaskForm from '../../components/Taskform';
import TaskList from '../../components/TaskList';

export default function DashboardPage() {
  const { user, logOut } = useUserAuth();
  const router = useRouter();

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

  return user ? (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>

      <TaskForm />
      <TaskList />
    </div>
  ) : null;
}
