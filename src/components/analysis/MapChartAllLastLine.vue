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
          text: "关联影响趋势",
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
          data: ["Lv1", "Lv2", "Lv3", "Lv4", "Lv5"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "负荷",
            type: "line",
            data: [5, 2, 4, 3, 6],
          },
          {
            name: "供浆量",
            type: "line",
            data: [6, 4, 5, 1, 3],
          },
          {
            name: "提升机",
            type: "line",
            data: [2, 5, 4, 3, 4],
          },
          {
            name: "推压机",
            type: "line",
            data: [2, 4, 3, 5, 6],
          },
          {
            name: "NOx",
            type: "line",
            data: [3, 2, 5, 4, 3],
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
