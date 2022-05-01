import axios from "axios";
import { transformUrl } from '../utils/request';

import fault_trend_data from '../mockjson/fault_trend_data';  //曲线
import fault_summary_data from '../mockjson/fault_summary_data';  // 摘要数据
import fault_summary_grid_data from '../mockjson/fault_summary_grid_data'
import fault_hot_data from '../mockjson/fault_hot_data'


import energy_trend_data from '../mockjson/energy_trend_data'
import energy_summary_data from '../mockjson/energy_summary_data'
import energy_summary_grid_data from '../mockjson/energy_summary_grid_data'
import energy_hot_data from '../mockjson/energy_hot_data'
import analysis_options_data  from '../mockjson/analysis_options_data'
import diagnose_summary from '../mockjson/diagnose_summary' 
import diagnose_chart  from '../mockjson/diagnose_chart'


////报警摘要查询
const getFaultTrendQuotaData=params =>{
  return new Promise((res , rej)=>{
    res({
      data : fault_summary_data
    })
  })
  
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/faultsummary', params),
  })
}



// 报警 设备故障摘要

const getFaultEquipmentSummary  = params => {

  return new Promise((res , rej)=>{
    res({
      data : fault_summary_grid_data
    })
  })

  return axios({
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'get',
      url: transformUrl('/apis/analysis/faultsummary', params),
  })

}

///报警趋势分析
const getFaultTrendChartData = params => {

  return new Promise((res , rej)=>{
    res({
      data : fault_trend_data
    })
  })
  return axios({
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'get',
      url: transformUrl('/apis/analysis/faulttrend', params),
  })
}

// 报警 热点分析
const getFaultHotPoint =  params => {

  return new Promise((res , rej)=>{
    res({
      data : fault_hot_data
    })
  })

  return axios({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/faulthot', params),
})
}



//能效分析摘要
const getEnergyQuotaData=params=>{


  return new Promise((res , rej)=>{
    res({
      data : energy_summary_data
    })
  })
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/energyquota', params),
  })
}


//能效趋势分析
const getEnergyTendData = params => {

  return new Promise((res , rej)=>{
    res({
      data : energy_trend_data
    })
  })
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/energytrend', params),
  })
}

// 能效分析摘要

const getEnergySummary = param =>{
  return new Promise((res , rej)=>{
    res({
      data : energy_summary_grid_data
    })
  })

  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/energsummary', params),
  })
}

// 能效分析热点


const getEnergyHotPoint = param =>{
  return new Promise((res , rej)=>{
    res({
      data : energy_hot_data
    })
  })

  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/energhot', params),
  })
}

// 诊断故障分析

const getDiagnose = param =>{
  return new Promise((res , rej)=>{
    res({
      data : diagnose_grid_data
    })
  })
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/diagnosesummary', params),
  })
}

// 下拉数据获取

const getAnalsisOptions = param => {
  return new Promise((res , rej)=>{
    res({
      data : analysis_options_data
    })
  })
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/options', params),
  })
}

// 故障分析摘要
const getDiagnoseSummary = param =>{
  return new Promise((res , rej)=>{
    res({
      data : diagnose_summary 
    })
  })
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/diagnosesummary', params),
  })
}
// 故障分析图表
const getDiagnoseChart = param =>{
  return new Promise((res , rej)=>{
    res({
      data : diagnose_chart
    })
  })
  return axios({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    url: transformUrl('/apis/analysis/diagnosechart', params),
  })
}
export { 

    getFaultTrendChartData,
    getFaultTrendQuotaData,
    getFaultEquipmentSummary ,
    getFaultHotPoint,

    getEnergySummary,
    getEnergyTendData,
    getEnergyQuotaData,
    getEnergyHotPoint,


    getDiagnose,
    getAnalsisOptions,

    getDiagnoseSummary,
    getDiagnoseChart
}
