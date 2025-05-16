import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MailIcon,
  UserIcon,
  GlobeIcon,
  CalendarIcon,
  EditIcon,
  LogOutIcon,
  BarChart2Icon,
  ListIcon,
  ActivityIcon,
  BookOpenIcon,
} from 'lucide-react'; // Swap for Heroicons if you prefer
import { API_ENDPOINTS } from '../config/api';

const TABS = [
  { name: 'Overview', icon: BookOpenIcon },
  { name: 'Projects', icon: BarChart2Icon },
  { name: 'Tasks Summary', icon: ListIcon },
  { name: 'Activity Log', icon: ActivityIcon },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.USERS.ME, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const openEdit = () => {
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      country: user.country || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    });
    setEditError(null);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);

    try {
      const res = await fetch(API_ENDPOINTS.USERS.ME, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updated = await res.json();
      setUser(updated);
      setEditOpen(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <span className="text-xl text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-center">
          <span className="text-xl text-red-500 block mb-4">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <span className="text-xl text-red-500">User not found</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 font-sans">
      {/* Profile Header */}
      <div className="max-w-3xl mx-auto pt-10 px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start">
            <motion.img
              src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}
              alt={user.name}
              className="w-28 h-28 rounded-full shadow-lg border-4 border-white/30 object-cover bg-white"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <h1 className="mt-4 font-serif text-3xl font-bold text-gray-900">{user.name}</h1>
            <div className="text-gray-500 font-medium text-base">{user.role}</div>
            <div className="text-gray-400 text-sm flex items-center gap-2">
              <MailIcon className="w-4 h-4" /> {user.email}
            </div>
          </div>
          <button
            className="mt-4 sm:mt-0 px-4 py-2 border border-blue-500 text-blue-600 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-50 transition-all duration-300"
            onClick={openEdit}
          >
            <EditIcon className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Details Card */}
      <motion.div
        className="max-w-3xl mx-auto mt-8 bg-white/60 backdrop-blur border border-white/20 p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400">Full Name</div>
            <div className="font-semibold text-gray-800">{user.name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Email</div>
            <div className="font-semibold text-gray-800">{user.email}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Country</div>
            <div className="font-semibold text-gray-800">{user.country}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Account Created</div>
            <div className="font-semibold text-gray-800">
              {new Date(user.joined).toLocaleDateString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="flex gap-2 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-t-lg transition-all duration-300
                ${activeTab === tab.name
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto mt-4 px-4">
        <div className="rounded-xl bg-white/70 shadow-md p-6 min-h-[200px]">
          <AnimatePresence mode="wait">
            {activeTab === 'Overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-serif text-xl font-bold mb-2">About</h2>
                <p className="text-gray-700 mb-4">{user.bio || 'No bio provided.'}</p>
                {user.socials && user.socials.length > 0 && (
                  <div className="flex gap-4 items-center mb-2">
                    {user.socials.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                      >
                        <GlobeIcon className="w-4 h-4" />
                        <span className="font-medium">{social.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {(user.projects || []).slice(0, 4).map((project) => (
                  <div
                    key={project._id}
                    className="bg-white/80 rounded-xl p-4 shadow flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">{project.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        project.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-600'
                          : project.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{project.description}</p>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.completionPercentage || 0}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full"
                        style={{ width: `${project.completionPercentage || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {project.completionPercentage || 0}% complete
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'Tasks Summary' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {/* You can add a donut/bar chart here if you want */}
                <h3 className="font-serif text-lg font-bold mb-2">Task Stats</h3>
                <div className="flex gap-6 mb-4">
                  <div>
                    <div className="text-xs text-gray-400">Total Tasks</div>
                    <div className="font-bold text-gray-800">{user.tasks?.length || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Completed</div>
                    <div className="font-bold text-emerald-600">
                      {user.tasks?.filter((t) => t.status === 'completed').length || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Pending</div>
                    <div className="font-bold text-yellow-600">
                      {user.tasks?.filter((t) => t.status !== 'completed').length || 0}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recent Tasks</h4>
                  <ul className="space-y-2">
                    {(user.tasks || []).slice(0, 5).map((task) => (
                      <li key={task._id} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          task.status === 'completed'
                            ? 'bg-emerald-500'
                            : task.status === 'in-progress'
                            ? 'bg-blue-500'
                            : 'bg-gray-400'
                        }`} />
                        <span className="font-medium">{task.title}</span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {task.status} {task.completedAt ? `on ${new Date(task.completedAt).toLocaleDateString()}` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'Activity Log' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-serif text-lg font-bold mb-2">Recent Activity</h3>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-200 rounded-full" />
                  <ul className="space-y-6">
                    {(user.activity || []).map((item, idx) => (
                      <li key={idx} className="relative flex items-start gap-3">
                        <span className="absolute left-[-30px] top-1.5">
                          <ActivityIcon className="w-4 h-4 text-blue-500" />
                        </span>
                        <div>
                          <span className="block text-sm text-gray-400 mb-1">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                          <span className="text-gray-800 font-medium">{item.action}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleEditSubmit}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative"
            >
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                onClick={() => setEditOpen(false)}
                tabIndex={-1}
              >
                ×
              </button>
              <h2 className="font-serif text-2xl font-bold mb-4 text-gray-900">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={editForm.country}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Avatar URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={editForm.avatar}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              {editError && <div className="text-red-500 text-sm mt-2">{editError}</div>}
              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 disabled:opacity-60"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer/Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 border-t border-slate-200 py-2 px-4 flex justify-between items-center z-10 shadow-t">
        <span className="text-xs text-gray-500">© {new Date().getFullYear()} Task Tracker</span>
        <button className="flex items-center gap-1 text-red-500 hover:text-red-700 transition">
          <LogOutIcon className="w-4 h-4" /> Logout
        </button>
      </footer>
    </div>
  );
}