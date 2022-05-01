<template>
  <div>
    <el-col :span="24">
      <el-card style="height: 300px;">
        {{ chartTitle }}
        <div v-show="this.paramName.indexOf('盘管')===-1" :id="'predictChartLineBox'+id" style="height: 300px;"></div>
        <el-row v-show="this.paramName.indexOf('盘管')!==-1">
          <el-col :span="12">
            <div :id="'predictChartLineBox1'+id" style="height: 300px;"></div>
          </el-col>
          <el-col :span="12">
            <div :id="'predictChartLineBox2'+id" style="height: 300px;"></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import {getNodesByBrowsePath, queryCurrentRawValueByUri, queryHistoryRawValueByUri} from "../../api/faultWarning";

export default {
  name: "ChartByUri",
  data() {
    return {
      timeInterval: 300000,
      unit: '',
      min: 0,
      max: 100,
      realUris: [],
      predUris: []
    }
  },
  props: ['id', 'uri', 'chartTitle', 'token', 'paramName'],
  mounted() {
    this.start();
  },
  beforeDestroy() {
    // console.log("clearInterval");
    clearInterval(this.interval);
  },
  methods: {
    start() {
      this.firstFlag = true
      let param = {
        "depth": 2,
        "forward": true,
        "id": this.uri.split("/")[2]
      };
      getNodesByBrowsePath(this.token, param).then((res) => {
        if (res) {
          let nodes = res.data.result[0].children;
          let nodesDict = {};
          for (let item of nodes) {
            nodesDict[item.name] = item;
          }
          this.predUris = [];
          this.realUris = [];
          if (this.paramName.indexOf('盘管') !== -1) {
            this.predUris.push(nodesDict["预测值1"].uri);
            this.predUris.push(nodesDict["预测值2"].uri);
            this.predUris.push(nodesDict["预测值3"].uri);
            this.predUris.push(nodesDict["预测值4"].uri);
            this.predUris.push(nodesDict["预测值5"].uri);
            this.predUris.push(nodesDict["预测值6"].uri);
            this.predUris.push(nodesDict["预测值7"].uri);
            this.predUris.push(nodesDict["预测值8"].uri);
            this.predUris.push(nodesDict["预测值9"].uri);
            this.predUris.push(nodesDict["预测值10"].uri);
            let children = nodesDict["关键参数"].children;
            let childDict = {}
            for (let item of children) {
              childDict[item.name] = item;
            }

            this.realUris.push(childDict["盘管温度1"].uri);
            this.realUris.push(childDict["盘管温度2"].uri);
            this.realUris.push(childDict["盘管温度3"].uri);
            this.realUris.push(childDict["盘管温度4"].uri);
            this.realUris.push(childDict["盘管温度5"].uri);
            this.realUris.push(childDict["盘管温度6"].uri);
            this.realUris.push(childDict["盘管温度7"].uri);
            this.realUris.push(childDict["盘管温度8"].uri);
            this.realUris.push(childDict["盘管温度9"].uri);
            this.realUris.push(childDict["盘管温度10"].uri);
            // for (let i = 0; i < children.length; i++) {
            //   let child = children[i];
            //   if (child.uri.substring(0, 8) === '/Project' && child.name.indexOf('盘管温度') !== -1) {
            //     this.realUris.push(child.uri);
            //   }
            // }
          } else {
            this.predUri = nodesDict["预测值"].uri;
            let children = nodesDict["关键参数"].children;
            let realUri;
            for (let i = 0; i < children.length; i++) {
              let child = children[i];
              if (child.uri.substring(0, 8) === '/Project' && this.paramName.indexOf(child.name) !== -1) {
                this.realUri = child.uri;
                // console.log(child);
                break;
              }
            }
          }
          this.predict();
          this.interval = setInterval(this.predict, 5000);
        }
      });
    },
    queryHistory(realUri, predUri, timeInterval) {
      let now = new Date().getTime();
      // console.log('查询历史值', now, realUri);
      let param = {};
      if (this.paramName.indexOf('盘管') !== -1) {
        param = {
          "nodes": [
            {
              "browsePath": realUri[0]
            }, {
              "browsePath": realUri[1]
            }, {
              "browsePath": realUri[2]
            }, {
              "browsePath": realUri[3]
            }, {
              "browsePath": realUri[4]
            }, {
              "browsePath": realUri[5]
            }, {
              "browsePath": realUri[6]
            }, {
              "browsePath": realUri[7]
            }, {
              "browsePath": realUri[8]
            }, {
              "browsePath": realUri[9]
            },
            {
              "browsePath": predUri[0]
            }, {
              "browsePath": predUri[1]
            }, {
              "browsePath": predUri[2]
            }, {
              "browsePath": predUri[3]
            }, {
              "browsePath": predUri[4]
            }, {
              "browsePath": predUri[5]
            }, {
              "browsePath": predUri[6]
            }, {
              "browsePath": predUri[7]
            }, {
              "browsePath": predUri[8]
            }, {
              "browsePath": predUri[9]
            }
          ],
          "detail": {
            "maxSizePerNode": 100,
            "returnBounds": false,
            "startTime": now - timeInterval,
            "endTime": now + timeInterval
          }
        };
      } else {
        param = {
          "nodes": [
            {
              "browsePath": realUri
            },
            {
              "browsePath": predUri
            }
          ],
          "detail": {
            "maxSizePerNode": 100,
            "returnBounds": false,
            "startTime": now - timeInterval,
            "endTime": now + timeInterval
          }
        };
      }
      return queryHistoryRawValueByUri(param);
    },
    predict() {
      if (this.firstFlag) {
        this.firstFlag = false;
        // console.log('实时uri', this.realUri);
        if (this.paramName.indexOf('盘管') !== -1) {
          this.queryHistory(this.realUris, this.predUris, this.timeInterval).then(res => {
            let dataset;
            try {
              dataset = {
                data1: res.data.result[0].historyData,
                data2: res.data.result[1].historyData,
                data3: res.data.result[2].historyData,
                data4: res.data.result[3].historyData,
                data5: res.data.result[4].historyData,
                data6: res.data.result[5].historyData,
                data7: res.data.result[6].historyData,
                data8: res.data.result[7].historyData,
                data9: res.data.result[8].historyData,
                data10: res.data.result[9].historyData,
                prediction1: res.data.result[10].historyData,
                prediction2: res.data.result[11].historyData,
                prediction3: res.data.result[12].historyData,
                prediction4: res.data.result[13].historyData,
                prediction5: res.data.result[14].historyData,
                prediction6: res.data.result[15].historyData,
                prediction7: res.data.result[16].historyData,
                prediction8: res.data.result[17].historyData,
                prediction9: res.data.result[18].historyData,
                prediction10: res.data.result[19].historyData,
              }
            } catch (e) {
              // console.log(e)
              this.firstFlag = true;
              return;
            }
            this.drawMutiChart(dataset)
          })
        } else {
          this.queryHistory(this.realUri, this.predUri, this.timeInterval).then(res => {
            // console.log(res.data)
            let dataset;
            try {
              dataset = {
                data: res.data.result[0].historyData,
                prediction: res.data.result[1].historyData
              }
            } catch (e) {
              // console.log(e)
              this.firstFlag = true;
              return;
            }
            this.drawChart(dataset)
          })
        }
      } else {
        if (this.paramName.indexOf('盘管') !== -1) {
          let param = [
            this.realUris[0],
            this.realUris[1],
            this.realUris[2],
            this.realUris[3],
            this.realUris[4],
            this.realUris[5],
            this.realUris[6],
            this.realUris[7],
            this.realUris[8],
            this.realUris[9],
            this.predUris[0],
            this.predUris[1],
            this.predUris[2],
            this.predUris[3],
            this.predUris[4],
            this.predUris[5],
            this.predUris[6],
            this.predUris[7],
            this.predUris[8],
            this.predUris[9]
          ]
          queryCurrentRawValueByUri(param).then(res => {
            let dataset = {
              data1: res.data.result[0],
              data2: res.data.result[1],
              data3: res.data.result[2],
              data4: res.data.result[3],
              data5: res.data.result[4],
              data6: res.data.result[5],
              data7: res.data.result[6],
              data8: res.data.result[7],
              data9: res.data.result[8],
              data10: res.data.result[9],
              prediction1: res.data.result[10],
              prediction2: res.data.result[11],
              prediction3: res.data.result[12],
              prediction4: res.data.result[13],
              prediction5: res.data.result[14],
              prediction6: res.data.result[15],
              prediction7: res.data.result[16],
              prediction8: res.data.result[17],
              prediction9: res.data.result[18],
              prediction10: res.data.result[19]
            };
            // console.log("dataset", dataset);
            this.addMutiChartData(dataset)
          })
        } else {
          let param = [this.realUri, this.predUri]
          queryCurrentRawValueByUri(param).then(res => {
            let dataset = {
              data: res.data.result[0],
              prediction: res.data.result[1]
            };
            // console.log("dataset", dataset);
            this.addChartData(dataset)
          })
        }

      }
    },
    drawChart(dataset) {
      const chartDom = document.getElementById('predictChartLineBox' + this.id);
      this.myChart = this.$echarts.init(chartDom);
      this.realData = dataset.data.map(item => [item.t, item.v.toFixed(2)])
      this.predictData = dataset.prediction.map(item => [item.t, item.v.toFixed(2)])
      if (this.paramName == "导热油流量预警") {
        this.unit = '单位：m3/h';
        this.min = 1000;
        this.max = 1400;
      } else if (this.paramName == "导热油温度预警") {
        this.unit = '单位：℃';
        this.min = 270;
        this.max = 350;
      } else if (this.paramName == "炉膛温度预警") {
        this.unit = '单位：℃';
        this.min = 800;
        this.max = 1000;
      } else if (this.paramName == "排烟温度预警") {
        this.unit = '单位：℃';
        this.min = 100;
        this.max = 200;
      }
      this.option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['真实值', '预测值']
        },
        xAxis: {
          type: "time",
          axisLine: {
            symbol: ['none', 'arrow'],
            symbolOffset: 5,
            symbolSize: [10, 10]
          },
          axisTick: false
        },
        yAxis: [{
          scale: true,
          min: this.min,
          max: this.max
        }, {
          position: 'right',
          name: this.unit,
          axisLine: {
            show: false
          }
        }],
        series: [{
          name: '真实值',
          data: this.realData,
          type: 'line',
          symbolSize: 5,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#fe6431'
              }, {
                offset: 1,
                color: '#f9f560'
              }])
            }
          },
          lineStyle: {
            width: 2,
          }
        }, {
          name: '预测值',
          data: this.predictData,
          type: 'line',
          symbolSize: 5,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#25e558'
              }, {
                offset: 1,
                color: '#62c7f6'
              }])
            }
          },
          lineStyle: {
            width: 2,
          }
        }]
      };

      this.myChart.setOption(this.option);
    },
    //盘管预警预测图
    drawMutiChart(dataSet) {
      const chartDom = document.getElementById('predictChartLineBox1' + this.id);
      const chartDom2 = document.getElementById('predictChartLineBox2' + this.id);
      this.myChart2 = this.$echarts.init(chartDom2);
      this.myChart = this.$echarts.init(chartDom);
      this.realData1 = dataSet.data1.map(item => [item.t, item.v.toFixed(2)]);
      this.realData2 = dataSet.data2.map(item => [item.t, item.v.toFixed(2)]);
      this.realData3 = dataSet.data3.map(item => [item.t, item.v.toFixed(2)]);
      this.realData4 = dataSet.data4.map(item => [item.t, item.v.toFixed(2)]);
      this.realData5 = dataSet.data5.map(item => [item.t, item.v.toFixed(2)]);
      this.realData6 = dataSet.data6.map(item => [item.t, item.v.toFixed(2)]);
      this.realData7 = dataSet.data7.map(item => [item.t, item.v.toFixed(2)]);
      this.realData8 = dataSet.data8.map(item => [item.t, item.v.toFixed(2)]);
      this.realData9 = dataSet.data9.map(item => [item.t, item.v.toFixed(2)]);
      this.realData10 = dataSet.data10.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData1 = dataSet.prediction1.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData2 = dataSet.prediction2.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData3 = dataSet.prediction3.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData4 = dataSet.prediction4.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData5 = dataSet.prediction5.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData6 = dataSet.prediction6.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData7 = dataSet.prediction7.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData8 = dataSet.prediction8.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData9 = dataSet.prediction9.map(item => [item.t, item.v.toFixed(2)]);
      this.predictData10 = dataSet.prediction10.map(item => [item.t, item.v.toFixed(2)]);
      if (this.paramName.indexOf('盘管') !== -1) {
        this.min = parseInt(parseInt(this.realData1[0][1]) - 0.045 * parseInt(this.realData1[0][1]));
        this.max = parseInt(parseInt(this.predictData1[0][1]) + 0.03 * parseInt(this.predictData1[0][1]));
      }

      this.option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [
            '真实值1',
            '真实值2',
            '真实值3',
            '真实值4',
            '真实值5',
            '预测值1',
            '预测值2',
            '预测值3',
            '预测值4',
            '预测值5',

          ]
        },
        xAxis: {
          type: "time",
          axisLine: {
            symbol: ['none', 'arrow'],
            symbolOffset: 5,
            symbolSize: [10, 10]
          },
          axisTick: false
        },
        yAxis: [{
          scale: true,
          min: this.min,
          max: this.max
        }, {
          position: 'right',
          name: this.unit,
          axisLine: {
            show: false
          }
        }],
        series: [
          {
            name: '真实值1',
            data: this.realData1,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#fe6431'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },
          {
            name: '真实值2',
            data: this.realData2,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#FFFF00'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },
          {
            name: '真实值3',
            data: this.realData3,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#00FF00'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },
          {
            name: '真实值4',
            data: this.realData4,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#0099FF'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },
          {
            name: '真实值5',
            data: this.realData5,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#CC00FF'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },

          {
            name: '预测值1',
            data: this.predictData1,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#fe6431'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },
          {
            name: '预测值2',
            data: this.predictData2,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#FFFF00'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '预测值3',
            data: this.predictData3,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#00FF00'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '预测值4',
            data: this.predictData4,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#0099FF'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },
          {
            name: '预测值5',
            data: this.predictData5,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#CC00FF'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },

        ]
      };
      this.option2 = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [
            '真实值6',
            '真实值7',
            '真实值8',
            '真实值9',
            '真实值10',
            '预测值6',
            '预测值7',
            '预测值8',
            '预测值9',
            '预测值10',
          ]
        },
        xAxis: {
          type: "time",
          axisLine: {
            symbol: ['none', 'arrow'],
            symbolOffset: 5,
            symbolSize: [10, 10]
          },
          axisTick: false
        },
        yAxis: [{
          scale: true,
          min: this.min,
          max: this.max
        }, {
          position: 'right',
          name: this.unit,
          axisLine: {
            show: false
          }
        }],
        series: [
          {
            name: '真实值6',
            data: this.realData6,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#fe6431'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '真实值7',
            data: this.realData7,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#FFFF00'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '真实值8',
            data: this.realData8,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#00FF00'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '真实值9',
            data: this.realData9,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#0099FF'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '真实值10',
            data: this.realData10,
            type: 'line',
            symbolSize: 5,
            symbol: 'triangle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#CC00FF'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },
          {
            name: '预测值6',
            data: this.predictData6,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#fe6431'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '预测值7',
            data: this.predictData7,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#FFFF00'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '预测值8',
            data: this.predictData8,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#00FF00'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '预测值9',
            data: this.predictData9,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#0099FF'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          }, {
            name: '预测值10',
            data: this.predictData10,
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#CC00FF'
                }, {
                  offset: 1,
                  color: '#f9f560'
                }])
              }
            },
            lineStyle: {
              width: 2,
            }
          },
        ]
      };
      this.myChart.setOption(this.option);
      this.myChart2.setOption(this.option2)
    },
    addChartData(dataset) {
      let time = new Date().getTime() - this.timeInterval;
      let data = dataset.data;
      let predict = dataset.prediction;
      for (let i = 0; i < this.realData.length; i++) {
        if (this.realData[i][0] > time) {
          this.realData.splice(0, i);
          break;
        }
      }
      for (let i = 0; i < this.predictData.length; i++) {
        if (this.predictData[i][0] > time) {
          this.predictData.splice(0, i);
          break;
        }
      }
      if (this.realData[this.realData.length - 1][0] !== data.t) {
        this.realData.push([data.t, data.v.toFixed(2)])
      }
      if (this.predictData[this.predictData.length - 1][0] !== predict.t) {
        this.predictData.push([predict.t, predict.v.toFixed(2)])
      }

      this.myChart.setOption(this.option);
    },
    addMutiChartData(dataset) {
      let time = new Date().getTime() - this.timeInterval;
      let data1 = dataset.data1;
      let data2 = dataset.data2;
      let data3 = dataset.data3;
      let data4 = dataset.data4;
      let data5 = dataset.data5;
      let data6 = dataset.data6;
      let data7 = dataset.data7;
      let data8 = dataset.data8;
      let data9 = dataset.data9;
      let data10 = dataset.data10;
      let predict1 = dataset.prediction1;
      let predict2 = dataset.prediction2;
      let predict3 = dataset.prediction3;
      let predict4 = dataset.prediction4;
      let predict5 = dataset.prediction5;
      let predict6 = dataset.prediction6;
      let predict7 = dataset.prediction7;
      let predict8 = dataset.prediction8;
      let predict9 = dataset.prediction9;
      let predict10 = dataset.prediction10;

      for (let i = 0; i < this.realData1.length; i++) {
        if (this.realData1[i][0] > time) {
          this.realData1.splice(0, i);
          this.realData2.splice(0, i);
          this.realData3.splice(0, i);
          this.realData4.splice(0, i);
          this.realData5.splice(0, i);
          this.realData6.splice(0, i);
          this.realData7.splice(0, i);
          this.realData8.splice(0, i);
          this.realData9.splice(0, i);
          this.realData10.splice(0, i);
          break;
        }
      }
      for (let i = 0; i < this.predictData1.length; i++) {
        if (this.predictData1[i][0] > time) {
          this.predictData1.splice(0, i);
          this.predictData2.splice(0, i);
          this.predictData3.splice(0, i);
          this.predictData4.splice(0, i);
          this.predictData5.splice(0, i);
          this.predictData6.splice(0, i);
          this.predictData7.splice(0, i);
          this.predictData8.splice(0, i);
          this.predictData9.splice(0, i);
          this.predictData10.splice(0, i);
          break;
        }
      }
      if (this.realData1[this.realData1.length - 1][0] !== data1.t) {
        this.realData1.push([data1.t, data1.v.toFixed(2)]);
        this.realData2.push([data2.t, data2.v.toFixed(2)]);
        this.realData3.push([data3.t, data3.v.toFixed(2)]);
        this.realData4.push([data4.t, data4.v.toFixed(2)]);
        this.realData5.push([data5.t, data5.v.toFixed(2)]);
        this.realData6.push([data6.t, data6.v.toFixed(2)]);
        this.realData7.push([data7.t, data7.v.toFixed(2)]);
        this.realData8.push([data8.t, data8.v.toFixed(2)]);
        this.realData9.push([data9.t, data9.v.toFixed(2)]);
        this.realData10.push([data10.t, data10.v.toFixed(2)]);
      }
      if (this.predictData1[this.predictData1.length - 1][0] !== predict1.t) {
        this.predictData1.push([predict1.t, predict1.v.toFixed(2)]);
        this.predictData2.push([predict2.t, predict2.v.toFixed(2)]);
        this.predictData3.push([predict3.t, predict3.v.toFixed(2)]);
        this.predictData4.push([predict4.t, predict4.v.toFixed(2)]);
        this.predictData5.push([predict5.t, predict5.v.toFixed(2)]);
        this.predictData6.push([predict6.t, predict6.v.toFixed(2)]);
        this.predictData7.push([predict7.t, predict7.v.toFixed(2)]);
        this.predictData8.push([predict8.t, predict8.v.toFixed(2)]);
        this.predictData9.push([predict9.t, predict9.v.toFixed(2)]);
        this.predictData10.push([predict10.t, predict10.v.toFixed(2)]);
      }

      this.myChart.setOption(this.option);
    }
  }
}
</script>

<style scoped>

</style>
