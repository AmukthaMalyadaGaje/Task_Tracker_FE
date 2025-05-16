import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://tasktrackerbe-production.up.railway.app/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setProjects(data);
    //   calculateStats(data);
    let tasksData = [];
    for (const project of data) {
      const response = await fetch(`http://tasktrackerbe-production.up.railway.app/api/tasks/${project._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const tasks = await response.json();
      console.log("tasks", tasks);
      tasksData.push(tasks);
    }
    calculateStats(data,tasksData);
} catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = async (projectsData,tasksData) => {
    const stats = {
      totalProjects: projectsData.length,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
    };

    projectsData.forEach((project) => {
      project.tasks.forEach((task) => {
        switch (task.status) {
          case 'completed':
            stats.completedTasks++;
            break;
          case 'pending':
            stats.pendingTasks++;
            break;
          case 'in-progress':
            stats.inProgressTasks++;
            break;
        }
      });
    });

tasksData.forEach((tasks)=>{
    tasks.forEach((task) => {
      switch (task.status) {
        case 'completed':
          stats.completedTasks++;
          break;
        case 'pending':
          stats.pendingTasks++;
          break;
        case 'in-progress':
          stats.inProgressTasks++;
          break;
      }
    });
  });

    setStats(stats);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateProject = async (projectId, data) => {
    try {
      const response = await fetch(`http://tasktrackerbe-production.up.railway.app/api/projects/${projectId}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      const updatedProject = await response.json();
      if (!response.ok) throw new Error(updatedProject.message || 'Failed to update project');
      setProjects((prev) => prev.map((p) => (p._id === projectId ? { ...p, ...updatedProject } : p)));
      showNotification('Project updated successfully', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-red-400 p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome Back
            </h1>
            <p className="text-sm font-medium text-gray-400 mt-1">
              Manage your projects and track your progress
            </p>
          </div>
          <Link
            to="/projects/new"
            className="btn btn-primary flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Project</span>
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Total Projects */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Projects</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.totalProjects}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-indigo-500/10">
                <ChartBarIcon className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completed Tasks</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.completedTasks}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending Tasks</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.pendingTasks}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-yellow-500/10">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* In Progress Tasks */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">In Progress</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stats.inProgressTasks}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <ClockIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Your Projects</h2>
            <Link
              to="/projects"
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.slice(0, 6).map((project) => (
                <div key={project._id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400">Status:</span>
                    <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : project.status === 'in-progress'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {(project.status || 'not-started').replace('-', ' ')}
                    </span>
                  </div>
                  <ProjectCard
                    project={project}
                    onDelete={() => {
                      // Handle project deletion
                      fetchProjects();
                    }}
                    onUpdate={handleUpdateProject}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

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

export default Dashboard;