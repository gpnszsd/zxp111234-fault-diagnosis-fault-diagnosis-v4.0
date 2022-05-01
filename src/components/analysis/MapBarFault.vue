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
    this.drawChart();
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
          text: "主要异常报警的工况分布",
        },
        legend: {
          top: 20,
          left: 150,
          data: ["负荷", "供浆量", "鼓风机", "风浆比"],
        },
        xAxis: {
          type: "category",
          data: ["提升风机", "润滑油泵", "推压风机", "主变温度"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: '负荷',
            data: [150, 210, 140, 70],
            type: "bar",
          },
          {
            name: '供浆量',
            data: [120, 200, 150, 80],
            type: "bar",
          },
          {
            name: '鼓风机',
            data: [120, 200, 150, 80],
            type: "bar",
          },
          {
            name: '风浆比',
            data: [120, 200, 150, 80],
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
