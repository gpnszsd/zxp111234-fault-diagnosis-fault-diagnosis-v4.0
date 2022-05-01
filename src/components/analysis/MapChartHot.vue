<template>
  <div>
    <el-col :span="24" style="height: 400px">
        <div class="chart-title">{{ chartTitle }}</div>
        <div :id="'chartBox' + id" style="height: 400px"></div>
    </el-col>
  </div>
</template>

<script>

// 故障热点分析

export default {
  name: "MapChartHot",
  data() {
    return {
      myChart: undefined,
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
    "endPos"
  ],
  mounted() {
    this.start();
  },
  methods: {
    start() {
      setTimeout(() => {
        this.drawChart({});
      });
    },
    resize() {
        this.myChart.resize();
        this.drawChart()
    },
    drawChart(config) {
      const chartDom = document.getElementById("chartBox" + this.id);
      this.myChart = this.$echarts.init(chartDom);

      this.option = {

          xAxis: {
            type: 'value',
            name: '能耗',
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: '{value} Kw/H'
            },
            splitNumber: 5,
            min: 4000,
            max: 5000
          },
          yAxis: {
            type: 'value',
            name: '鼓风机风量',

            axisLabel: {
              show: true,
              formatter: '{value} m³'
            },
            axisLine: {
              show: true,
            },
            splitNumber: 20,
            position: 'left',
            min: 0,
            max: 20000
          },
          grid: {
            left: "150px",
            right: "40px",
            top:"50px"
          },
          legend: {
            data: ['报警'],
            top: 'center',
            orient: 'vertical',
            right: 0
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (params.value.length > 1) {
                return (
                  params.value[0] +
                  ',' +
                  params.value[1]
                );
              } else {
                return (
                  params.seriesName +
                  ' :<br/>' +
                  params.name +
                  ' : ' +
                  params.value +
                  'kg '
                );
              }
            },
          },
          series: [

          ]
      }

      this.myChart.setOption(this.option);
    },
    startloading(){
      this.myChart.showLoading({
        text: '数据正在加载...',
        textStyle: { fontSize : 30 , color: '#444' },
        effectOption: {backgroundColor: 'rgba(0, 0, 0, 0)'}
      });
    },
    stoploading(){
      this.myChart.hideLoading();
    },
    updateChart(data,range){
      this.myChart.setOption({
        series: [
          {
            type: 'scatter',
            symbolSize: 5,
            data: data
          }
        ]
      })
      this.stoploading()
    }
  },
};
</script>

<style scoped>
.chart-title {
  float: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
}
</style>
