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
        grid: {
          left: "10%",
          right: "10%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["9-1", "9-2", "9-3", "9-4", "9-5", "9-6", "9-7"],
        },
        legend: {
            top: 20,
            left: 150,
          data: ["供浆泵", "鼓风机", "引风机"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "供浆泵",
            data: [50, 10, 40, 70, 60, 30, 90],
            type: "bar",
          },
          {
            name: "鼓风机",
            data: [20, 30, 50, 80, 50, 70, 60],
            type: "bar",
          },
          {
            name: "引风机",
            data: [20, 60, 50, 80, 40, 75, 88],
            type: "bar",
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
