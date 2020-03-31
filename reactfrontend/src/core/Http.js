import axios from 'axios';
import ls from 'local-storage';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API}/api/`,
});

// Intercept the request to make sure the token is injected into the header.
instance.interceptors.request.use((config) => {
  config.headers.Authorization = `${ls('AUTH_TOKEN')}`;
  return config;
});

instance.interceptors.response.use(
  (response) => {
    // if (response.data.login === true) {
    //   router.push('/logout');
    // }

//     // app.$Progress.finish();

    response = response.data;
    return response;
    console.log('respose do http')
  },
  (error) => {
    console.log('reject do http')
//     // app.$Progress.finish();
    return Promise.reject(error);
  }
);


export default instance;