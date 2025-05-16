const API_BASE_URL = 'http://tasktrackerbe-production.up.railway.app/api';

export const API_ENDPOINTS = {
    USERS: {
        ME: `${API_BASE_URL}/users/me`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
    },
    PROJECTS: {
        BASE: `${API_BASE_URL}/projects`,
    },
    TASKS: {
        BASE: `${API_BASE_URL}/tasks`,
    },
};

export default API_BASE_URL;