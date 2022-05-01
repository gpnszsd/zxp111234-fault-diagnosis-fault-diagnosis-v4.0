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
  name: "MapChartDiagnoseTrendline",

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
      this.option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "155px",
          right: "30px",
        },
        legend: {
          data: this.faultlegend,
          top: "3px",
          orient: "horizontal",
        },
        xAxis: {
          type: "category",
          boundaryGap: ["20%", "20%"],
        },
        dataZoom: [
          {
            type: "slider",
            show: this.lineShow,
            xAxisIndex: [0],
            start: 0,
            end: this.endPos,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "水煤浆",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#5470C6",
              },
            },
            position: "left",
            offset: 40,
            // min: 0,
            // max: 10000,
          },
          {
            type: "value",
            name: "负荷",
            axisLine: {
              show: true,
              lineStyle: {
                color: "green",
              },
            },
            position: "left",
            offset: 80,
            // min: 0,
            // max: 10000,
          },
          {
            type: "value",
            name: "效率",
            axisLine: {
              show: true,
              lineStyle: {
                color: "orange",
              },
            },
            position: "left",
            offset: 180,
            // min: 0,
            // max: 50,
          },
        ],

        series: [
          
        ],
      };

      this.myChart.setOption(this.option);
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
