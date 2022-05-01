import axios from 'axios';
import {transformUrl} from '../utils/request';

const getNodesByBrowsePath = (token, params) => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'post',
    url: '/getTreeNode',
    data: params
  })
};

const register = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/register',
    data: params,
  })
};

const getProjects = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'get',
    url: transformUrl('/apis/getProjects', params),
  })
}

const getBoilers = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'get',
    url: transformUrl('/apis/getBoilers', params),
  })
}

const getParas = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'get',
    url: transformUrl('/apis/getParas', params),
  })
}

const getTotalInfoNum = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/totalInfoNum',
    data: params,
  })
};

const getModelStatusInfos = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/modelStatusInfos',
    data: params,
  })
};

const registerModel = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/register',
    data: params,
  })
};

const train = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/train',
    data: params,
  })
};

const modelOnline = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/online',
    data: params,
  })
};

const getPrediction = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'get',
    url: transformUrl('/apis/getPrediction', params),
  })
};
const createSubscription = params => {
  return axios({
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    method: 'post',
    url: '/webSocket/san/subscription/create',
    data: params,
  })
};
const createMonitoreditem = (subscriptionId, params) => {
  return axios({
    headers: {
      'Content-Type': "application/json;charset=UTF-8",
      // 'SubscriptionId' : subscriptionId,
    },
    method: 'post',
    url: transformUrl('/webSocket/san/monitoreditem/createByUri', subscriptionId),
    data: params,
  })
};
/**
 * 实时报警状态查询
 */
const getLiveAlarmStatus = params => {
  return axios({
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    method: 'post',
    url: '/getEvents/v1/event/subscription/alarm',
    data: params,
  })
};
/**
 * 确认报警
 */
const requestAcknowledgeAlarm = query => {
  return axios({
    headers: {
      'Content-Type': "application/json;charset=UTF-8",
      'Accept': 'application/json'
    },
    method: 'post',
    url: transformUrl('/getAcknowledge/alarmoperation/alarmoperation/acknowledge', query),

  })
};
/**
 * 查询后端诊断知识库
 */
const getHistoryAlarmKnowledge = params => {
  return axios({
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/alarm',
    data: params,
  })
};
/**
 * 查询所有事件
 */
const getAlarmEvents = params => {
  return axios({
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    method: 'post',
    url: '/getEvents/v1/event/history/access',
    data: params,
  })
};

const queryCurrentRawValueByUri = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/query/aggquery/v2/query/v2/queryCurrentRawValueByUri',
    data: params,
  })
};

const queryHistoryRawValueByUri = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/query/aggquery/v2/query/v2/queryHistoryRawValueByUri',
    data: params,
  })
};


// 获取token
const getToken = params =>{
  return axios({
    method: 'post',
    //url: transformUrl('/oauth', params),
    url: transformUrl('/oauth/token', params),
  })
}
//获取authorizeCode
const getAuthorizeCode = params =>{
  return axios({
    method: 'get',
    url: transformUrl('/oauth/authorize', params),
  })
}
// 获取用户信息

const getUser = data =>{
  return axios({
    headers : {
      Authorization : data,
    },
    method : 'get',
    // url:"http://xianchuang123-holli-iam-iam-xianchuang123-default.xcgfcloud.com.cn/user/user/currentUserInfo",
    url : '/currentUserInfo'
  })
}


// 退出

const logout = data =>{
  return axios({
    headers : {
      Authorization : data,
    },
    method : 'delete',
    url : '/logout'
  })
}

const deleteFaultWaringModel = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/delete',
    data: params,
  })
};

export {
  getNodesByBrowsePath,
  register,
  getProjects,
  getBoilers,
  getParas,
  getTotalInfoNum,
  getModelStatusInfos,
  registerModel,
  train,
  modelOnline,
  getPrediction,
  createSubscription,
  queryCurrentRawValueByUri,
  queryHistoryRawValueByUri,
  createMonitoreditem,
  getLiveAlarmStatus,
  getHistoryAlarmKnowledge,
  requestAcknowledgeAlarm,
  getAlarmEvents,
  getToken,
  getUser,
  logout,
  deleteFaultWaringModel
}
