import axios from 'axios';
import {transformUrl} from '../utils/request';

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

const queryAggregateValueWithAlgByUri = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/query/aggquery/v2/query/queryAggregateValueWithAlgByUri',
    data: params,
  })
};

const getCurrentEfficiency = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/apis/getEfficiency',
    data: params,
  })
};
/**
 * 一键优化接口，返回三个主调参数，优化后效率
 * "供浆流量1"supplyFlow1
 "供浆流量2"supplyFlow2
 "鼓风风量"airVolume
 * @param params
 * @returns {AxiosPromise}
 */
const getOptimalEfficiency = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/apis/optimalEfficiency',
    data: params,
  })
};
const getOptimalCost = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/apis/optimalCost',
    data: params,
  })
};
const getOptimalEco = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/apis/optimalEco',
    data: params,
  })
};
/**
 * 根据用户输入的主要参数重新计算效率，
 * 输入: optMainParams: {
   supplyFlow1: '',"供浆流量1"
   supplyFlow2: '',"供浆流量2"
   airVolume: '' "鼓风风量"
 },
 返回：重新计算的效率
 * @param params
 * @returns {AxiosPromise}
 */
const getOwnOptimalEfficiency = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/apis/getOwnOptimalEfficiency',
    data: params,
  })
};
/**
 * 获取所有模型接口
 *返回值：
 prop="modelId" label="模型id"
 prop="projectName" label="项目名称"
 prop="boilerName" label="锅炉名称"
 prop="optNumber" label="优化量"
 prop="trainingState" label="训练状态"
 * @param params
 * @returns {AxiosPromise}
 */
const getOptModelsInfo = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'get',
    url: '/apis/getOptModelsInfo',
    data: params,
  })
};
/**
 * 获取实时效率接口，返回实时效率
 * 向后端传参数：
 *  efficiencyForm: {
 *         model_id:模型id
          gasBurnLoss:  气体不完全燃烧损失
          solidBurnLoss: 固体不完全燃烧损失
          heatLoss: 散热损失
          ashHeatLoss: 灰渣热损失
          airTheoryEnthalpy: 冷空气理论热焓
          lowCalorificValue: 低位发热量
        },

 * @param params
 * @returns {AxiosPromise}
 */
const getEfficiency = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/apis/getEfficiency',
    data: params,
  })
};
/**
 * 训练模型接口，向后端传模型id
 *
 * @param params
 * @returns {AxiosPromise}
 */
const train = params => {
    return axios({
      headers: {
        'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
      },
      method: 'post',
      url: '/apis/trainOptModel',
      data: params,
    })
  };

/**
 * 训练模型接口，向后端传模型id
 *
 * @param params
 * @returns {AxiosPromise}
 */
const getFilteredModelInfoByModelId = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/getFilteredModelInfoByModelId',
    data: params,
  })
};

/**
 * 注册模型，与故障预警接口类似
 * 向后端传param = {
              "node_uri": node.data.uri,
              "write_back": writeBack,
              "uris": uris,
              "window_size": 300000,
              "project_name": projectName,
              "boiler_name": boilerName,
              "para_name": paraName
            };
 * @param params
 * @returns {AxiosPromise}
 */
const registerOptModel = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/registerOptModel',
    data: params,
  })
};

const onlineEfficiency = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/onlineEfficiency',
    data: params,
  })
};

const deleteOptModel = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/deleteOptModel',
    data: params,
  })
};

const optimizeAnalysis = params => {
  return axios({
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: 'post',
    url: '/apis/optimizeAnalysis',
    data: params,
  })
};

export {
  queryCurrentRawValueByUri,
  queryAggregateValueWithAlgByUri,
  getCurrentEfficiency,
  getOptimalEfficiency,
  getOptModelsInfo,
  getEfficiency,
  train,
  getOwnOptimalEfficiency,
  registerOptModel,
  onlineEfficiency,
  getOptimalCost,
  getOptimalEco,
  getFilteredModelInfoByModelId,
  deleteOptModel,
  optimizeAnalysis
}
