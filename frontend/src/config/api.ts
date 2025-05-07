export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
    expenses: `${API_BASE_URL}/expenses`,
    bookings: `${API_BASE_URL}/bookings`,
    properties: `${API_BASE_URL}/properties`,
    metabaseDashboard: `${API_BASE_URL}/metabase-dashboard`,
} as const; 