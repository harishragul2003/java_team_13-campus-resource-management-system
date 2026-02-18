import axios from 'axios';

const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
  //  baseURL: 'http://localhost:5000/api'
  baseURL: 'https://campus-backend-9q4l.onrender.com/api'

});

export default api;
