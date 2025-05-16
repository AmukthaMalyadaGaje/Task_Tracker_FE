import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PencilSquareIcon,
  TrashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import ProjectDetailsModal from './ProjectDetailsModal';

const ProjectCard = ({ project, onEdit, onDelete, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateProgress = () => {
    // if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(
      (task) => task.status === 'completed'
    ).length;
    // console.log("Project Progress", project);
    // return Math.round((completedTasks / project.tasks.length) * 100);
    return project.progress;
  };

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

  const handleUpdate = async (projectId, data) => {
    try {
      await onUpdate(projectId, data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="glass-card group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-gray-300 text-sm line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="flex space-x-2"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <PencilSquareIcon className="h-5 w-5 text-gray-300" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project._id);
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <TrashIcon className="h-5 w-5 text-gray-300" />
              </button>
            </motion.div>
          </div>

          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Progress</span>
                <span>{calculateProgress()}%</span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress()}%` }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                />
              </div>
            </div>

            {/* Project Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <ChartBarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    {project.tasks?.length || 0} Tasks
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {(project.status || 'not-started').replace('-', ' ')}
                </span>
              </div>
              <Link
                to={`/projects/${project._id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <ProjectDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default ProjectCard;