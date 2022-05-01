<template>
  <div>
    <el-col :span="24">
      <el-card style="height: 300px">
        <div class="chart-title">{{ chartTitle }}</div>
        <div :id="'chartBox' + id" style="height: 300px"></div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "MapChart",
  data() {
    return {
    //   chartTitle: "故障地区分布",
      myChart: undefined,
    };
  },
  props: ["id", "chartTitle", "chartData", "type", "xAxis", "yAxis"],
  mounted() {
    this.drawChart();
  },
  beforeDestroy() {},
  methods: {
    resize() {
      this.myChart.resize();
    },
    drawChart() {
      const chartDom = document.getElementById("chartBox" + this.id);
      this.myChart = this.$echarts.init(chartDom);

      if (this.type == "pie") {
        this.option = {
            tooltip: {
                show: true,
                trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
          legend: {
            type: "scroll",
            orient: "vertical",
            right: 10,
            top: 20,
            bottom: 20,
          },
          series: [
            {
              name: "设备耗能",
              type: "pie",
              radius: "55%",
              center: ["40%", "50%"],
              data: [
                {
                  name: "燃烧室",
                  value: 100,
                },
                {
                  name: "输水系统",
                  value: 10,
                },
                {
                  name: "引风机",
                  value: 20,
                },
                {
                  name: "导油系统",
                  value: 40,
                },
                {
                  name: "控制器",
                  value: 5,
                },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
      } else if (this.type == "bar") {
        this.option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            data: ["1号锅炉", "2号锅炉", "3号锅炉"],
          },
          xAxis: [
            {
              type: "category",
              axisTick: { show: false },
              data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月"],
            },
          ],
          yAxis: [
            {
              type: "value",
              min:0,
              max:100
            },
          ],
          series: [
            {
              name: "1号锅炉",
              type: "bar",
              data: [97, 96, 94, 89, 88,98, 93, 94, 92],
            },
            {
              name: "2号锅炉",
              type: "bar",
              data: [98, 94, 89, 88, 92,75, 89, 88, 84],
            },
            {
              name: "3号锅炉",
              type: "bar",
              data: [88, 78, 88, 99, 91,92, 93, 87, 93],
            }
          ],
        };
      }

      this.myChart.setOption(this.option);
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
