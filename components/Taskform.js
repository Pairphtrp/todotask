'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../_utils/firebase';
import { useUserAuth } from '../_utils/auth-context';

export default function TaskForm() {
  const { user } = useUserAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        uid: user.uid,
        title,
        description,
        priority,
        dueDate,
        createdAt: serverTimestamp(),
        completed: false,
      });
      setTitle('');
      setDescription('');
      setPriority('normal');
      setDueDate('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Add your Task</h2>

      <input
        type="text"
        placeholder="Task title"
        className="w-full text-gray-500 px-4 py-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description (optional)"
        className="w-full text-gray-500 px-4 py-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <input
        type="date"
        className="w-full text-gray-500 px-4 py-2 border rounded"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      <select
        className="w-full px-4 text-gray-500 py-2 border rounded"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
}
