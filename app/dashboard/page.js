'use client';
import { useUserAuth } from '../../_utils/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TaskForm from '../../components/Taskform';
import TaskList from '../../components/TaskList';






export default function DashboardPage() {
  const { user } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user]);

  return user ? (
    <div className="p-6 max-w-2xl mx-auto">
  <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
  <TaskForm />
  <TaskList />  {/* 👈 show the tasks */}
</div>

  ) : null;
}
