import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';

const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://tasktrackerbe-production.up.railway.app/api/tasks/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTasks(data);
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // Create task
  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch(`http://tasktrackerbe-production.up.railway.app/api/tasks/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTasks((prev) => [...prev, data]);
      showNotification('Task created successfully', 'success');
      setIsModalOpen(false);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Update task
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await fetch(`http://tasktrackerbe-production.up.railway.app/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? data : task))
      );
      showNotification('Task updated successfully', 'success');
      setIsModalOpen(false);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`http://tasktrackerbe-production.up.railway.app/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      showNotification('Task deleted successfully', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskData = {
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
      };
      await handleUpdateTask(taskId, taskData);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle modal open/close
  const handleModalOpen = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = (formData) => {
    if (selectedTask) {
      handleUpdateTask(selectedTask._id, formData);
    } else {
      handleCreateTask(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tasks
        </h2>
        <button
          onClick={() => handleModalOpen()}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={() => handleModalOpen(task)}
              onDelete={handleDeleteTask}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        task={selectedTask}
      />

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default TaskList;