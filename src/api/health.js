import axios from 'axios';

const getBoilerInfo = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'get',
    url: '/apis/boilerInfo',
    data: params,
  })
};

const getBoilerScore = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/apis/getBoilerScore',
    data: params,
  })
};

export {
  getBoilerInfo,
  getBoilerScore
}
