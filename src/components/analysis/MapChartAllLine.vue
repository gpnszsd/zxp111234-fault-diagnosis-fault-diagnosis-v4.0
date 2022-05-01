<template>
  <div>
    <el-col :span="24" style="width: 100%; height: 400px">
      <div class="chart-title">{{ chartTitle }}</div>
      <div :id="'chartBox' + id" style="width: 100%; height: 400px"></div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "MapChartEnergyHot",
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
    "endPos",
  ],
  mounted() {
    this.$nextTick(() => {
      this.drawChart();
    });
  },
  methods: {
    resize() {
      this.myChart.resize();
    },
    drawChart() {
      const chartDom = document.getElementById("chartBox" + this.id);
      this.myChart = this.$echarts.init(chartDom);
      let option = {
        title: {
          text: "燃料供应与运行关系趋势图",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: 20,
          left: 150,
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["9-1", "9-2", "9-3", "9-4", "9-5", "9-6", "9-7"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "水煤浆",
            type: "line",
            data: [57, 88, 79, 65, 83, 59, 73],
          },
          {
            name: "负荷",
            type: "line",
            data: [67, 78, 89, 55, 73, 89, 63],
          },
          {
            name: "效率",
            type: "line",
            data: [97, 78, 89, 55, 73, 69, 83],
          },
        ],
      };
      this.myChart.setOption(option);
    },
    updateChart_old(data) {
      this.myChart.setOption({
        series: [
          {
            data: data.data,
          },
        ],
      });
    },
    startloading() {
      this.myChart.showLoading({
        text: "数据正在加载...",
        textStyle: { fontSize: 30, color: "#444" },
        effectOption: { backgroundColor: "rgba(0, 0, 0, 0)" },
      });
    },
    stoploading() {
      this.myChart.hideLoading();
    },
    updateChart(data, axisrang) {
      this.myChart.setOption({
        xAxis: {
          min: axisrang[0][0] - 1,
          max: axisrang[0][1] + 1,
        },
        yAxis: {
          min: axisrang[1][0] - 1,
          max: axisrang[1][1] + 1,
        },
        series: [
          {
            type: "scatter",
            symbolSize: 5,
            data: data,
          },
        ],
      });
      this.stoploading();
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
