<template>
  <div>
    <el-col :span="24">
      <el-card style="height: 350px;">
        <div :id="'History'+id" style="height: 300px;"></div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
  import {getNodesByBrowsePath,  queryHistoryRawValueByUri} from "../../api/faultWarning";
  /*import {setEchartsHeight} from "../../utils/chartStyle";*/
    export default {
      name: "HistoryChart",
      data() {
        return {
        }
      },
      props: ['id', 'uri', 'token','paramName','startTimeSelect','endTimeSelect'],
      mounted() {
        this.start();
        console.log("this.uri",this.uri)
        /*window.addEventListener("resize", () => {
          if (this.myChart) {
            // 计算echarts高度
            setEchartsHeight('History-outer', 'HistoryChart' + this.id, 50)
            this.myChart.resize();
          }
        });
        setEchartsHeight('History-outer', 'HistoryChart' + this.id, 50)
        this.myChart.resize();*/
      },
      beforeDestroy() {
        console.log("clearInterval");
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
              this.realUri = [];
              if (this.paramName.indexOf('盘管') !== -1){
                this.realUri.push(nodesDict["预测值1"].uri);
                this.realUri.push(nodesDict["预测值2"].uri);
                this.realUri.push(nodesDict["预测值3"].uri);
                this.realUri.push(nodesDict["预测值4"].uri);
                this.realUri.push(nodesDict["预测值5"].uri);
                this.realUri.push(nodesDict["预测值6"].uri);
                this.realUri.push(nodesDict["预测值7"].uri);
                this.realUri.push(nodesDict["预测值8"].uri);
                this.realUri.push(nodesDict["预测值9"].uri);
                this.realUri.push(nodesDict["预测值10"].uri);

              }else{
                this.realUri =  nodesDict["预测值"].uri;
              }
              this.predict();

              }
          });
        },
        queryHistory(realUri) {
          let param = {};
          if (this.paramName.indexOf('盘管') !== -1) {
            param = {
              "nodes": [
                {
                  "browsePath": this.realUri[0]
                }, {
                  "browsePath": this.realUri[1]
                }, {
                  "browsePath": this.realUri[2]
                }, {
                  "browsePath": this.realUri[3]
                }, {
                  "browsePath": this.realUri[4]
                }, {
                  "browsePath": this.realUri[5]
                }, {
                  "browsePath": this.realUri[6]
                }, {
                  "browsePath": this.realUri[7]
                }, {
                  "browsePath": this.realUri[8]
                }, {
                  "browsePath": this.realUri[9]
                }
              ],
              "detail": {
                "maxSizePerNode": 100,
                "returnBounds": false,
                "startTime": this.startTimeSelect,
                "endTime": this.endTimeSelect
              }
            };
          }else{
            param = {
              "nodes": [
                {
                  "browsePath": this.realUri
                }
              ],
              "detail": {
                "maxSizePerNode": 500,
                "returnBounds": true,
                "startTime": this.startTimeSelect,
                "endTime": this.endTimeSelect
              }
            };
          }
          console.log('this.startTimeSelect',this.startTimeSelect);
          console.log('this.endTimeSelect',this.endTimeSelect);
          return queryHistoryRawValueByUri(param);
        },
        predict() {
          if (this.firstFlag) {
            this.firstFlag = false;
            if (this.paramName.indexOf('盘管') !== -1){
              this.queryHistory(this.realUris).then(res => {
                console.log("res%%%%",res)
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
                    data10: res.data.result[9].historyData
                  }
                } catch (e) {
                  // console.log(e)
                  this.$message('未获取到历史值');
                  this.firstFlag = true;
                  return;
                }
                this.drawMutiChart(dataset)
              })
            }else{
              this.queryHistory(this.realUri).then(res => {
                console.log("res",res)
                let data;
                try {
                  data = res.data.result[0].historyData;
                } catch (e) {
                  console.log(e)
                  console.log(res.data)
                  this.$message('未获取到历史值');
                  this.firstFlag = true;
                  return;
                }
                this.drawChart(data);
              })
            }

          }
        },
        drawChart(data) {
          const chartDom = document.getElementById('History' + this.id);
          this.myChart = this.$echarts.init(chartDom);

          this.realData = data.map(item => [item.t, item.v.toFixed(2)]);
          console.log("this.realData", this.realData)

          this.option = {
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: "time",
              splitNumber: 3
            },
            yAxis: {scale: true},
            toolbox: {
              right: 10,
              feature: {
                dataZoom: {
                  yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
              }
            },
            dataZoom: [{
              startValue:this.startTimeSelect
            }, {
              type: 'inside'
            }],
            series: [{
              name: '真实值',
              data: this.realData,
              type: 'line',
              smooth: true,
              itemStyle: {
                /*normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#50eee8'
                  }, {
                    offset: 1,
                    color: '#9be1e3'
                  }])
                }*/
                color: '#3ea548'
              },
              lineStyle: {
                width: 2,
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#91ffc7'
                }, {
                  offset: 1,
                  color: 'rgba(204,204,204,0)'
                }])
              }
            }]
          };

          this.myChart.setOption(this.option);
        },
        //盘管预警预测图
        drawMutiChart(dataSet) {
          console.log("dataset@@@@@@@@", dataSet)
          const chartDom = document.getElementById('History' + this.id);
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
                '真实值6',
                '真实值7',
                '真实值8',
                '真实值9',
                '真实值10',
              ]
            },
            xAxis: {
              type: "time",
              axisLine: {
                symbol: ['none', 'arrow'],
                symbolOffset: 10,
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

            ]
          };
          this.myChart.setOption(this.option);

        },
      }
    }

</script>

<style scoped>

</style>
