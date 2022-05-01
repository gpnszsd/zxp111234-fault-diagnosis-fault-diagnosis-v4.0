import axios from "axios";
import {transformUrl} from '../utils/request';


/**
 * 查询模型数据，用来作为大数据分析页面下拉选数据
 * @param param
 */
const getModelLevelData = param => {

}

/***
 * 查询指定工业模型的报警数据
 * 查询条件 工业模型  开始时间  结束时间
 * @param param
 */
const getFaultHistoryData = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/getEvents/v1/event/history/access',
    data: params,
  })
}

/**
 * 查询采集的历史数据
 * @param param
 */
const getHistoryRawData = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/query/aggquery/v2/query/v2/queryHistoryRawValueByUri',
    data: params,
  })
}
/**
 * 按汇聚方式查询采集的历史数据
 * @param param
 */
const getAggregateHistoryRawData = params => {
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/query/aggquery/v2/query/queryAggregateValueByUri',
    data: params,
  })
}
export {

  getFaultHistoryData,
  getHistoryRawData,
  getModelLevelData,
  getAggregateHistoryRawData
}
