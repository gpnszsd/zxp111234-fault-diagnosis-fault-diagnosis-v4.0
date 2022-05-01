
import axios from 'axios';

const getNowData = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/query/v2/query/v2/queryCurrentRawValueByUri',
    data: params,
  })
};

export {
  getNowData,
}
