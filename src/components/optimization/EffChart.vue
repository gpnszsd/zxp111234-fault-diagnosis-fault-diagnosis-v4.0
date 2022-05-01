<template>
  <div>
    <div>
      <el-row>
        <el-alert
          v-show="this.effoptValueShow"
          type="error"
          title="未获取到实时效率值"
        ></el-alert>
        <el-alert
          v-show="this.boilerCahrgeValueShow"
          type="error"
          title="未获取到锅炉负荷"
        ></el-alert>
      </el-row>
    </div>
    <div id="effChart" style="height: 320px;"></div>
  </div>
</template>

<script>
  import {queryHistoryRawValueByUri, queryCurrentRawValueByUri} from "../../api/faultWarning";
  import {setEchartsHeight} from "../../utils/chartStyle";
  import {queryAggregateValueWithAlgByUri} from "../../api/effopt";

  export default {
    name: "EffChart",
    data() {
      return {
        boilerChargeData: [],
        baseLength: 500,
        targetOpt: [],
        controlAim: '',
        controlParaName: '',
        effoptValueShow: false,
        boilerChargeTime: [],
        boilerCahrgeValueShow: false,
        chartDataMin: 0,
        chartDataMax: 0,
        boilerChargeDataMin: 0,
        boilerChargeDataMax: 0
      }
    },
    props: ['id', 'uri', 'chargeUri', 'transTarget', 'chartTitle'],
    async mounted() {
      await this.start();
      window.addEventListener("resize", () => {
        if (this.myChart) {
          // 计算echarts高度
          setEchartsHeight('line-outer', 'effChart', 100)
          this.myChart.resize();
        }
      });
      setEchartsHeight('line-outer', 'effChart', 100)
      this.myChart.resize();
    },
    watch: {
      transTarget() {
        this.addOptData();
        this.myChart.setOption(this.option, true);
      },
      async uri() {
        await this.start();

      },
      async chargeUri() {
        await this.start();
      },
    },
    beforeDestroy() {
      console.log("clearInterval");
      clearInterval(this.interval);
    },
    methods: {
      async start() {

        this.firstFlag = true;
        await this.getData();
        this.interval = setInterval(this.getData, 2000);
      },
      async getData() {
        // console.log('实时效率uri', this.uri);
        let tmpMap = new Map();
        if (this.firstFlag) {
          this.firstFlag = false;
          await this.queryPointHistory(this.uri, 6600000, 0).then(res => {
            // console.log('实时效率', res);
            let data;
            try {
              data = res.data.result[0].historyData;
              tmpMap.set('effData', data);
              this.drawChangeChart(tmpMap);
            } catch (e) {
              this.effoptValueShow = true;
              console.log(e)
              // this.firstFlag = true;
            }
          });
          //和利时插值查询接口
          await this.queryPointHistory(this.chargeUri, 6600000, 0).then(res => {
            console.log('锅炉负荷', res);
            let data;
            try {
              data = res.data.result[0].historyData;
              tmpMap.set('chargeData', data);
              this.drawChangeChart(tmpMap);
            } catch (e) {
              this.boilerCahrgeValueShow = true;
              console.log(e)
              // this.firstFlag = true;
            }
          });
        } else {
          let param1 = [this.uri, this.chargeUri];
          await queryCurrentRawValueByUri(param1).then(res => {
            let data1 = res.data.result[0];
            let data2 = res.data.result[1];
            this.$emit('currentEffValue', data1);
            if (data1 !== null && data2 !== null) {
              this.addChartData(data1, data2);
            }

          });
        }
      },

      //和利时插值查询接口
      queryPointHistory(uri, timeInterval, len) {
        let now = new Date().getTime();
        let param = {
          "nodes": [
            {
              "browsePath": uri
            },
          ],
          "detail": {
            "aggregateType": "interpolation",
            "interval": 200,
            "maxSizePerNode": parseInt(timeInterval / 200),
            "startTime": now - timeInterval,
            "endTime": now,
          },
        };

        return queryAggregateValueWithAlgByUri(param);
      },
      initDom(chartDom) {
        chartDom = document.getElementById('effChart');
        console.log('chartDom', chartDom);
      },
      drawChangeChart(data) {

        const chartDom = document.getElementById('effChart');
        this.myChart = this.$echarts.init(chartDom);
        if (data.has('effData')) {
          this.chartData = data.get('effData').map(item => [item.t, item.v.toFixed(2)]);
        }
        if (data.has('chargeData')) {
          this.boilerChargeData = data.get('chargeData').map(item => [item.t, item.v.toFixed(2)]);

        }

        this.option = {
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {

              //更改效率图中优化后各值的显示
              if (params[0].seriesName === '目标效率') {
                let paramLink = '';
                for (let i = 2; i < params[0].value.length; i = i + 2) {
                  paramLink = paramLink + '</br>' + params[0].value[i] + '：'
                    + params[0].value[i + 1];
                }
                return params[0].axisValueLabel + '</br>' + params[0].seriesName + '：'
                  + params[0].value[1] + paramLink;

              } else {
                return params[0].axisValueLabel + '</br>' +
                  params[0].seriesName + '：' + params[0].value[1];
              }
            }
          },
          legend: {
            // left:right,
            data: ['实时效率', '锅炉负荷']
          },
          xAxis: {
            type: "time",
            splitNumber: 3
          },
          yAxis: [
            {
              axisLabel: {
                formatter: function (value, index) {
                  return (value).toFixed(2) + "%";
                }
              },
              scale: true,
              min: 0,
              max: 100
            },

          ],
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
            startValue: this.chartData[0].t
          }, {
            type: 'inside'
          }],
          series: [
            {
              name: '实时效率',
              data: this.chartData,
              type: 'line',
              smooth: true,

              itemStyle: {

                color: '#7bfe87'
              },
              lineStyle: {
                width: 2,
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#7bfe87'
                }, {
                  offset: 1,
                  color: 'rgba(204,204,204,0)'
                }])
              }
            },
            {
              name: '锅炉负荷',
              data: this.boilerChargeData,
              type: 'line',
              smooth: true,
              itemStyle: {

                color: '#87CEFA'
              },
              lineStyle: {
                width: 2,
              },

              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#87CEFA'
                }, {
                  offset: 1,
                  color: 'rgba(204,204,204,0)'
                }])
              }
            },
            {
              name: '目标效率',
              data: this.targetOpt,
              type: 'scatter',
              itemStyle: {
                color: '#50a3ba'
              }
            }
          ]
        };
        this.myChart.setOption(this.option);
      },

      addChartData(data1, data2) {
        // console.log('this.chartData', this.chartData);
        //控制图中显示的数据个数
        if (this.chartData.length >= this.baseLength + 6)
          this.chartData.splice(0, 1);
        if (this.chartData[this.chartData.length - 1][0] < data1.t) {
          this.chartData.push([data1.t, data1.v.toFixed(2)])
        }
        //控制图中显示的数据个数
        if (this.boilerChargeData.length >= this.baseLength + 6)
          this.boilerChargeData.splice(0, 1);
        if (this.boilerChargeData[this.boilerChargeData.length - 1][0] < data2.t) {
          this.boilerChargeData.push([data2.t, data2.v.toFixed(2)])
        }

        //优化页面传递到画图组件的值（优化量），随时间变化优化量会删去
        if (this.targetOpt.length !== 0) {
          if (this.targetOpt[0][0] < this.chartData[0][0]) {
            this.targetOpt.splice(0, 1);
          }
        }

        this.myChart.setOption(this.option);
      },
      addOptData() {
        this.targetOpt.push(this.transTarget[0]);
        if (this.targetOpt.length >= 100) {
          this.targetOpt.splice(0, 1);
        }


      }
    }
  }

</script>

<style scoped>
  .chart-title {
    float: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  }
</style>
