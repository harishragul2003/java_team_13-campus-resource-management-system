import axios from 'axios';

const api = axios.create({
  baseURL: 'https://campus-backend-9q4l.onrender.com/api'
});

export default api;
