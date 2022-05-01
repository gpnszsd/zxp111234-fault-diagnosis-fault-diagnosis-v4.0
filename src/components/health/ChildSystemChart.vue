<template>
  <div>
    <el-col :span="24">
      <div class="chart-title"><span style="float: left;margin-left: 0.3%">{{ chartTitle }}</span></div>
      <div :id="'ChildSystem'+boilerId" style="height: 500px;width:100%;margin-top: 2%"></div>
    </el-col>
  </div>
</template>

<script>
  import {setEchartsHeight} from "../../utils/chartStyle";
  import {getBoilerScore} from "../../api/health";

  export default {
    name: "ChildSystemChart",

    data() {
      return {
        boilerId: 0,
        yearNumber: '',
        chartTitle: '',
        yearData: [],
        yearTotalScoreData: [],
        //成本系统
        costData: [],
        //预警系统
        earlyWaringData: [],
        //环保系统
        environmentProtectionData: [],
        //锅炉寿命
        loadData: [],
        min: 50,
        max: 100
      }
    },
    props: ['id', 'year', 'projectName'],
    watch: {
      id(n, o) {
        this.boilerId = n;
        this.start();
        this.myChart.setOption(this.option, true);
      },
      year(n, o) {
        this.yearNumber = n;
        this.start();
        this.myChart.setOption(this.option, true);
      }
    },
    mounted() {
      window.addEventListener("resize", () => {
        if (this.myChart) {
          // 计算echarts高度
          setEchartsHeight('line-outer', 'Line' + this.boilerId, 100)
          this.myChart.resize();
        }
      });
      setEchartsHeight('line-outer', 'Line' + this.boilerId, 100)
      this.myChart.resize();
    },

    methods: {
      async start() {
        let param = {
          "boiler_id": this.boilerId,
          "year": this.yearNumber,
          "month": ''
        };
        let paramList = [];
        paramList.push(param);
        getBoilerScore(paramList).then((res) => {
          if (res) {
            console.log('图res', res);
            if (res.data[0].length > 0) {
              let tmpData = res.data[0];
              this.yearData = [];
              this.costData = [];
              this.earlyWaringData = [];
              this.environmentProtectionData = [];
              this.loadData = [];
              this.yearTotalScoreData = [];
              for (let i = 0; i < tmpData.length; i++) {
                let time = tmpData[i].year + '-' + tmpData[i].month;
                this.yearData.push(time);
                this.yearTotalScoreData.push(tmpData[i].boiler_total_score.toFixed(2));
                this.costData.push(tmpData[i].cost.boiler_score.toFixed(2));
                this.earlyWaringData.push(tmpData[i].early_waring.boiler_score.toFixed(2));
                this.environmentProtectionData.push(tmpData[i].environment_protection.boiler_score.toFixed(2));
                this.loadData.push(tmpData[i].load.boiler_score.toFixed(2));
              }
              this.chartTitle = this.projectName + '-' + tmpData[0].boiler_name;
              this.drawChart();
            } else {
            }
          }
        })
      },

      drawChart() {

        const chartDom = document.getElementById('ChildSystem' + this.boilerId);
        this.myChart = this.$echarts.init(chartDom);
        this.option = {
          title: {
            text: '子系统评分趋势'
          },
          tooltip: {
            trigger: 'axis',
          },

          legend: {
            data: ['成本系统', '预警系统', '环保系统', '锅炉寿命']
          },
          grid: {
            left: "220px",
            right: "110px",
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.yearData
          },
          yAxis: [
            {
              show: true,
              splitNumber:5,
              position: "left",

              type: 'value',
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#91CC75",
                },
              },

            },
            {
              show: true,
              splitNumber:5,
              position: "left",

              type: 'value',
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#5470C6",
                },
              },
              offset: 60,
            },
            {
              show: true,
              splitNumber:5,
              position: "left",

              type: 'value',
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#e78557",
                },
              },
              offset: 120,
            },
            {
              show: true,
              splitNumber:5,
              position: "left",

              type: 'value',
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#ff0000",
                },
              },
              offset: 180,
            },
          ],
          series: [
            {
              name: '成本系统',
              symbolSize: 12,
              label: {
                show: true,
                position: 'top'
              },
              yAxisIndex: 0,
              data: this.costData,
              type: 'line',
              itemStyle:{
                normal:{
                  color: "#91CC75"
                }
              }
            },
            {
              name: '预警系统',
              symbolSize: 12,
              yAxisIndex: 1,
              label: {
                show: true,
                position: 'top'
              },
              data: this.earlyWaringData,
              type: 'line',
              itemStyle:{
                normal:{
                  color: "#5470C6"
                }
              }

            },
            {
              name: '环保系统',
              symbolSize: 12,
              yAxisIndex: 2,
              label: {
                show: true,
                position: 'top'
              },
              data: this.environmentProtectionData,
              type: 'line',
              itemStyle:{
                normal:{
                  color: "#e78557"
                }
              }
            },
            {
              name: '锅炉寿命',
              symbolSize: 12,
              yAxisIndex: 3,
              label: {
                show: true,
                position: 'top'
              },
              data: this.loadData,
              type: 'line',
              itemStyle:{
                normal:{
                  color: "#ff0000"
                }
              },
            },

          ]
        };
        this.myChart.setOption(this.option);
      }
    }
  }
</script>

<style scoped>

</style>
