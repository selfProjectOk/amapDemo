import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.31.58:3031/api';
axios.defaults.timeout = 20000;
axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});


axios.mogoGet = function (url, params, cancelToken, isLoading = true) {
  if (isLoading !== false) {
  }
  return axios.get(url, {
    params: params,
    cancelToken: cancelToken
  });
}

axios.mogoPost = function (url, params, cancelToken, isLoading = true) {
  if (isLoading !== false) {
  }
  return axios.post(url, params, {
    cancelToken: cancelToken
  });
}

export default axios
