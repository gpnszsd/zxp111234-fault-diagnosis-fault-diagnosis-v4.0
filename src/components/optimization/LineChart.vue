<template>
  <div>
    <el-col :span="24">
      <div class="chart-title">{{ chartTitle }}</div>
      <div :id="'Line'+id" style="height: 500px;width: 600px"></div>
    </el-col>
  </div>
</template>

<script>
import {queryCurrentRawValueByUri, queryHistoryRawValueByUri} from "../../api/faultWarning";
import {setEchartsHeight} from "../../utils/chartStyle";

export default {
  name: "LineChart",
  data() {
    return {
      baseLength: 7,
    }
  },
  props: ['id', 'uri', 'chartTitle'],
  async mounted() {
    await this.start();
    window.addEventListener("resize", () => {
      if (this.myChart) {
        // 计算echarts高度
        setEchartsHeight('line-outer', 'Line'+this.id, 100)
        this.myChart.resize();
      }
    });
    setEchartsHeight('line-outer', 'Line' + this.id, 100)
    this.myChart.resize();
  },
  beforeDestroy() {
    console.log("clearInterval");
    clearInterval(this.interval);
  },
  methods: {
    async start() {
      this.firstFlag = true
      await this.getData()
      this.interval = setInterval(this.getData, 1000);
    },
    queryHistory(uri, timeInterval) {
      let now =new Date().getTime();
      let param = {
        "nodes": [
          {
            "browsePath": uri
          }
        ],
        "detail": {
          "maxSizePerNode": this.baseLength,
          "returnBounds": false,
          "startTime": now,
          "endTime": now - timeInterval
        }
      };
      return queryHistoryRawValueByUri(param);
    },
    async getData() {
      if (this.firstFlag) {
        this.firstFlag = false;
        await this.queryHistory(this.uri, 3600000).then(res => {
          let data;
          try {
            data = res.data.result[0].historyData;
          } catch (e) {
            console.log(e)
            console.log(res.data)
            this.firstFlag = true;
            return;
          }
          this.drawChart(data);
        })
      } else {
        let param = [this.uri];
        await queryCurrentRawValueByUri(param).then(res => {
          let data = res.data.result[0];
          this.addChartData(data);
        })
      }
    },
    drawChart(data) {
      const chartDom = document.getElementById('Line' + this.id);
      this.myChart = this.$echarts.init(chartDom);

      this.chartData = data.map(item => [item.t, item.v.toFixed(2)]).reverse()

      this.option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: "time",
          splitNumber: 3
        },
        yAxis: {scale: true},
        series: [{
          name: '历史值',
          data: this.chartData,
          type: 'line',
          //symbolSize: 7,
          smooth: 0.5,
          itemStyle: {
            color: '#7bfe87'
          },
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#7bfe87'
            }, {
              offset: 1,
              color: 'rgba(204,204,204,0)'
            }])
          }
        }]
      };

      this.myChart.setOption(this.option);
    },

    addChartData(data) {
      if (this.chartData.length >= this.baseLength)
        this.chartData.splice(0, 1);
      if (this.chartData[this.chartData.length - 1][0] !== data.t) {
        this.chartData.push([data.t, data.v.toFixed(2)])
      }

      this.myChart.setOption(this.option);
    }
  }
}
</script>

<style scoped>
  .chart-title {
    float: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  }
</style>
