import axios from 'axios';
import {transformUrl} from "../utils/request";

const getPredictDataByID = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'get',
    url: transformUrl('/apis/getPrediction', params),
  })
};

export {
  getPredictDataByID
}
