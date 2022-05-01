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
      this.myChart.resize()
    },
    drawChart() {
      const chartDom = document.getElementById("chartBox" + this.id);
      this.myChart = this.$echarts.init(chartDom);
      let option = {
        xAxis: {
          type: "value",
          name: "负荷",
          axisLabel: {
            interval:1,
            formatter: '{value} %'
          },
          splitNumber: 20,
          min: 60,
          max: 70,
        },
        yAxis: {
          name: "效率",
          type: "value",
          axisLabel: {
            interval:1,
            formatter: '{value} %'
          },
          splitNumber: 10,
          min: 85,
          max: 95,
        },
        visualMap: {
          min: 4000,
          max: 5000,
          dimension: 2,
          orient: "vertical",
          right: 10,
          top: "center",
          text: ["高", "低"],
          calculable: true,
          inRange: {
            color: ["#f2c31a", "#24b7f2"],
          },
        },
        grid: {
          left: "120px",
          right: "60px",
          top:"50px"
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            if (params.value.length > 1) {
              return "负荷："+Math.round(params.value[0])  +
                " <br/>"  +"效率："+ Math.round(params.value[1]);
            } else {
              return (
                params.seriesName +
                " :<br/>" +
                params.name +
                " : " +
                params.value +
                "kg "
              );
            }
          },
        },
        series: [
          {
            symbolSize: 5,
            data: [

            ],
            type: "scatter",
          },
        ],
      };

      this.myChart.setOption(option);


    },
    updateChart_old(data) {
      this.myChart.setOption({

        series :[
          {
              data : data.data
          }
        ]

      });

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
    updateChart(data,axisrang){
      this.myChart.setOption({
        xAxis: {
          min: axisrang[0][0]-1,
          max: axisrang[0][1]+1,
        },
        yAxis: {
          min: axisrang[1][0]-1,
          max: axisrang[1][1]+1,
        },
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
