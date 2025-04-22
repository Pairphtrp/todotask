'use client';

import { useEffect, useState } from 'react';
import {
  collection, query, where, onSnapshot, orderBy, deleteDoc, doc, updateDoc
} from 'firebase/firestore';
import { db } from '../_utils/firebase';
import { useUserAuth } from '../_utils/auth-context';

export default function TaskList() {
  const { user } = useUserAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('normal');
  const [editDueDate, setEditDueDate] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { completed: !currentStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleEditClick = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate);
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('normal');
    setEditDueDate('');
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'tasks', editTaskId), {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        dueDate: editDueDate,
      });
      handleCancelEdit();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'all') return true;
      if (filter === 'pending') return !task.completed;
      if (filter === 'completed') return task.completed;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const priorityOrder = { high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'createdAt') return b.createdAt?.seconds - a.createdAt?.seconds;
      return 0;
    });

  const isOverdue = (dueDate, completed) => {
    if (!dueDate || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + 'T00:00:00');
    return due < today;
  };

  const isDueToday = (dueDate, completed) => {
    if (!dueDate || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + 'T00:00:00');
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>All</button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-1 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'}`}>Pending</button>
        <button onClick={() => setFilter('completed')} className={`px-4 py-1 rounded ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Completed</button>
      </div>

      <div className="flex justify-center mb-4">
        <label className="flex items-center gap-2 text-gray-500">
          <span className="text-sm">Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-1 rounded border text-sm">
            <option value="createdAt">Created Time</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </label>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks found for this filter.</p>
      ) : (
        filteredTasks.map((task) => (
          <div key={task.id} className="border p-4 rounded-md shadow flex justify-between items-center">
            <div className="w-full pr-4">
              {editTaskId === task.id ? (
                <form onSubmit={handleUpdateTask} className="space-y-2">
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="border rounded px-2 py-1 w-full" required />
                  <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="border rounded px-2 py-1 w-full" rows={3} />
                  <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="border rounded px-2 py-1 w-full" required />
                  <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className="border rounded px-2 py-1 w-full">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">Save</button>
                    <button type="button" onClick={handleCancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{task.description}</p>
                  <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                  <p className="text-sm text-gray-500">Priority: {task.priority}</p>
                  {isOverdue(task.dueDate, task.completed) && (
                    <div className="bg-red-100 text-red-700 px-3 py-1 mt-1 rounded text-xs font-semibold inline-flex items-center gap-1">
                      <span>⚠</span> <span>Overdue</span>
                    </div>
                  )}
                  {isDueToday(task.dueDate, task.completed) && (
                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1 mt-1 rounded text-xs font-semibold inline-flex items-center gap-1">
                      <span>📅</span> <span>Due Today</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={task.completed} onChange={() => handleToggleComplete(task.id, task.completed)} />
                {task.completed ? (
                  <span className="text-green-600 font-semibold">Done</span>
                ) : (
                  <span className="text-yellow-500 font-semibold">Pending</span>
                )}
              </label>

              <button onClick={() => handleEditClick(task)} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm">Edit</button>
              <button onClick={() => handleDelete(task.id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
