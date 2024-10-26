import axios from "axios";
import authHeader from "./jwt-token-access/auth-token-header"

// Define the API base URL
const API_URL = "http://127.0.0.1:6456/api/v1";

// Create an axios instance
const axiosApi = axios.create({
  baseURL: API_URL,
});

// Set the default Authorization header with the token if available
axiosApi.interceptors.request.use(
  (config) => {
    const tokenHeader = authHeader(); // Get the token using authHeader
    if (tokenHeader.Authorization) {
      config.headers['Authorization'] = tokenHeader.Authorization; // Set the Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Handle expired token or unauthorized responses
axiosApi.interceptors.response.use(
  (response) => {
    // Do something with response data
    console.log('API response:', response);
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Session expired or unauthorized. Please log in again.');
      localStorage.removeItem('authUser'); // Clear the token and user data
      window.location.href = '/auth/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// API functions
export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config })
  .then((response) => {
    console.log('API response:', response.data.message);
    return response.data; // You might want to return the response for further chaining.
  })
  .catch((error) => {
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error; // Re-throwing the error can help in further error handling.
  });
}

export async function post(url, data, config = {}) {
  return axiosApi.post(url, { ...data }, { ...config })
  .then((response) => {
    console.log('API response:', response.data.message);
    return response.data; // You might want to return the response for further chaining.
  })
  .catch((error) => {
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error; // Re-throwing the error can help in further error handling.
  });

}

export async function put(url, data, config = {}) {
  return axiosApi.put(url, { ...data }, { ...config }).then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi.delete(url, { ...config }).then((response) => response.data);
}
