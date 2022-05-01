<template>
  <div>
    <el-col :span="24" style="height: 400px">
      <div class="chart-title">{{ chartTitle }}</div>
      <div :id="'chartBox' + id" style="height: 400px"></div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "MapChartDiagnoseHistogram",
  data() {
    return {
      myChart: null,
    };
  },
  props: [
    "id",
    "chartTitle",
    "chartData",
    "type",
    "xAxis",
    "legend",
    "faultlegend",
    "energylegend",
    "lineShow",
    "endPos",
  ],
  mounted() {
    this.drawChart({});
    // setInterval(() => {
    //   this.updateChart()
    // }, 1000);
  },
  methods: {
    resize() {
      this.myChart.resize();
      this.drawChart();
    },
    drawChart() {
      let chartDom = document.getElementById("chartBox" + this.id);
      this.myChart = this.$echarts.init(chartDom);
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },

        legend: {
          data: ['供浆泵频率', '鼓风机频率', '引风机频率']
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '供浆泵频率',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} Hz'
            }
          },
          {
            type: 'value',
            name: 'Temperature',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: '供浆泵频率',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: '鼓风机频率',
            type: 'bar',
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: '引风机频率',
            type: 'bar',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      };

      this.myChart.setOption(option);
    },
    updateChart(data) {
      console.log(data)
      this.myChart.setOption({
        xAxis: {
          data: data.xAxis,
        },
        legend: {
          data: data.faultlegend,
        },

        series:data.seriesData
      });
    },
  },
};
</script>

<style scoped>
.chart-title {
  float: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
}
</style>
