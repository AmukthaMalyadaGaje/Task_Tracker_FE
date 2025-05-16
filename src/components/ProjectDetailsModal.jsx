import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const ProjectDetailsModal = ({ isOpen, onClose, project, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    totalTasks: project.tasks?.length || 0,
    completionPercentage: project.completionPercentage || 0,
    status: project.status || 'not-started',
  });

  const getStatusColor = (status = 'not-started') => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusIcon = (status = 'not-started') => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5" />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(project._id, formData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 max-w-2xl w-full bg-white/90 dark:bg-gray-900/95 shadow-2xl rounded-xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Project Details
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Project Progress
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-secondary flex items-center space-x-2"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                      <span>Edit Progress</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Total Tasks */}
                    <div>
                      <label
                        htmlFor="totalTasks"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Total Tasks
                      </label>
                      <input
                        type="number"
                        id="totalTasks"
                        name="totalTasks"
                        value={formData.totalTasks}
                        onChange={handleChange}
                        min="0"
                        className="input"
                      />
                    </div>

                    {/* Completion Percentage */}
                    <div>
                      <label
                        htmlFor="completionPercentage"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Completion Percentage
                      </label>
                      <input
                        type="range"
                        id="completionPercentage"
                        name="completionPercentage"
                        value={formData.completionPercentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="5"
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>0%</span>
                        <span>{formData.completionPercentage}%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status:
                      </span>
                      <span
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusIcon(project.status)}
                        <span className="capitalize">
                          {(project.status || 'not-started').replace('-', ' ')}
                        </span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                        <span>Progress</span>
                        <span>{project.completionPercentage || 0}%</span>
                      </div>
                      <div className="relative h-2 bg-white/30 dark:bg-gray-700/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${project.completionPercentage || 0}%`,
                          }}
                          transition={{ duration: 0.5 }}
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                        />
                      </div>
                    </div>

                    {/* Task Count */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total Tasks:
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {project.tasks?.length || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailsModal;