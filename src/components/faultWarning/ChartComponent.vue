<template>
  <div>
    <el-col :span="24">
      <el-card style="height: 300px;">
        {{ chartTitle }}
        <div :id="'predictChartLineBox'+id" style="height: 300px;"></div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import {getPrediction} from "../../api/faultWarning";

export default {
  name: "ChartComponent",
  data() {
    return {
      baseLength: 20,
    }
  },
  props: ['id', 'modelId', 'chartTitle'],
  mounted() {
    this.start();
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    start() {
      this.firstFlag = true
      this.predict()
      this.intervalId = setInterval(this.predict, 20000);
    },
    predict() {
      if (this.firstFlag) {
        this.firstFlag = false
        let param = {
          id: this.modelId,
          num: this.baseLength
        }
        getPrediction(param).then(res => {
          // console.log(res)
          this.drawChart(res.data)
        })
      } else {
        let param = {
          id: this.modelId,
          num: 1
        }
        getPrediction(param).then(res => {
          console.log(res)
          this.addChartData(res.data)
        })
      }
    },
    drawChart(dataset) {
      const chartDom = document.getElementById('predictChartLineBox' + this.id);
      this.myChart = this.$echarts.init(chartDom);

      this.realData = dataset.data.map(item => [item.t, item.avg_v])
      this.predictData = dataset.prediction.map(item => [item.t, item.avg_v])

      this.option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['真实值', '预测值']
        },
        xAxis: {type: "time"},
        yAxis: {scale: true},
        series: [{
          name: '真实值',
          data: this.realData,
          type: 'line'
        }, {
          name: '预测值',
          data: this.predictData,
          type: 'line',
          markLine: {
            silent: true,
            lineStyle: {
              normal: {
                color: '#01fef9'                   // 这儿设置安全基线颜色
              }
            },
            data: [{
              yAxis: 910
            }],
            label: {
              normal: {
                formatter: '安全\n基线'           // 这儿设置安全基线
              }
            },
          }
        }]
      };

      this.myChart.setOption(this.option);
    },

    addChartData(dataset) {
      let data = dataset.data
      let predict = dataset.prediction[0]
      let realAdd = data[0]
      if (this.realData.length >= this.baseLength)
        this.realData.splice(0, 1)
      if (this.predictData.length >= this.baseLength)
        this.predictData.splice(0, 1)
      this.realData.push([realAdd.t, realAdd.avg_v])
      this.predictData.push([predict.t, predict.avg_v])

      this.myChart.setOption(this.option);
    }
  }
}
</script>

<style scoped>

</style>
