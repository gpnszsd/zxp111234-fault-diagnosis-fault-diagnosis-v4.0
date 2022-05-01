
import axios from 'axios';

const getPredictData = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/apis/predict',
    data: params
  })
};

export {
  getPredictData
}
