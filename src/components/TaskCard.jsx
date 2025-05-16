import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5" />;
    }
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'completed') {
      if (window.confirm('Are you sure you want to mark this task as completed?')) {
        onStatusChange(task._id, newStatus);
      }
    } else {
      onStatusChange(task._id, newStatus);
    }
    setIsStatusDropdownOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card relative overflow-hidden"
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {getStatusIcon(task.status)}
            <span className="capitalize">{task.status}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {/* Status Dropdown */}
          {isStatusDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
            >
              <div className="py-1">
                <button
                  onClick={() => handleStatusChange('pending')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusChange('in-progress')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Completed
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="mb-4">
        <p
          className={`text-gray-600 dark:text-gray-300 ${
            isExpanded ? '' : 'line-clamp-2'
          }`}
        >
          {task.description}
        </p>
        {task.description && task.description.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
          >
            {isExpanded ? 'Show less' : 'See more'}
          </button>
        )}
      </div>

      {/* Completion Date */}
      {task.completedAt && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Completed: {new Date(task.completedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Task Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute top-4 right-4 flex space-x-2"
      >
        <button
          onClick={() => onEdit(task)}
          className="p-1 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <PencilSquareIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-1 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <TrashIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TaskCard;