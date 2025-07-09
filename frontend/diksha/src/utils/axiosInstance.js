import  axios  from 'axios'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BACKEND_BASEURL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token')
        if(accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 400) {
        console.error('Bad Request:', error.response.data);
        alert('Please check your input and try again.');
      } else if (status === 500) {
        console.error('Server error:', error.response.data);
        alert('An unexpected error occurred. Please try again later.');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout', error.message);
      alert('Request timed out. Please check your network and try again.');
    }
    return Promise.reject(error.response || error.message || error);
  }
);