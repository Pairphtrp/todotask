'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, deleteDoc,
    doc, } from 'firebase/firestore';
import { db } from '../_utils/firebase';
import { useUserAuth } from '../_utils/auth-context';

  

export default function TaskList() {
    const { user } = useUserAuth();
    const [tasks, setTasks] = useState([]);
  
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
        const confirmed = window.confirm("Are you sure you want to delete this task?");
        if (!confirmed) return;
      
        try {
          await deleteDoc(doc(db, 'tasks', taskId));
        } catch (err) {
          console.error('Error deleting task:', err);
        }
      };
      
  
    return (
      <div className="mt-8 space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks yet!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="border p-4 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                <p className="text-sm text-gray-500">Priority: {task.priority}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {task.completed ? (
                  <span className="text-green-500 font-bold">✔ Done</span>
                ) : (
                  <span className="text-yellow-500 font-semibold">⏳ Pending</span>
                )}
              <button
                 onClick={() => handleDelete(task.id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"> 
                 Delete
                </button>


              </div>
            </div>
          ))
        )}
      </div>
    );
  }