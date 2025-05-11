/**
 * API service module for making HTTP requests
 */

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
const fetchApi = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Send a contact form message
 * @param {Object} data - Contact form data
 * @returns {Promise<Object>} Response from the API
 */
export const sendContactForm = async (data) => {
  return fetchApi('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Fetch portfolio projects
 * @returns {Promise<Array>} List of projects
 */
export const getProjects = async () => {
  return fetchApi('/projects');
};

export default {
  sendContactForm,
  getProjects,
};