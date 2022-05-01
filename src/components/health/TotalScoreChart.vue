<template>
  <div>
    <el-col :span="24">
      <div class="chart-title"><span style="float: left;margin-left: 0.3%">{{ chartTitle }}</span></div>
      <div :id="'TotalScore'+boilerId" style="height: 500px;width:100%;margin-top: 2%"></div>
    </el-col>
  </div>
</template>

<script>
  import {setEchartsHeight} from "../../utils/chartStyle";
  import {getBoilerScore} from "../../api/health";

  export default {
    name: "TotalScoreChart",

    data() {
      return {
        boilerId: 0,
        yearNumber: '',
        chartTitle: '',
        yearData: [],
        yearTotalScoreData: []
      }
    },
    props: ['id', 'year', 'projectName'],
    watch: {
      id(n, o) {
        this.boilerId = n;
        this.start();
        this.myChart.setOption(this.option, true);
      },
      year(n, o) {
        this.yearNumber = n;
        this.start();
        this.myChart.setOption(this.option, true);
      }
    },
    mounted() {
      window.addEventListener("resize", () => {
        if (this.myChart) {
          // 计算echarts高度
          setEchartsHeight('line-outer', 'Line' + this.boilerId, 100)
          this.myChart.resize();
        }
      });
      setEchartsHeight('line-outer', 'Line' + this.boilerId, 100)
      this.myChart.resize();
    },

    methods: {
      async start() {
        let param = {
          "boiler_id": this.boilerId,
          "year": this.yearNumber,
          "month": ''
        };
        let paramList = [];
        paramList.push(param);
        getBoilerScore(paramList).then((res) => {
          if (res) {
            console.log('图res', res);
            if (res.data[0].length > 0) {
              let tmpData = res.data[0];
              this.yearData = [];
              this.yearTotalScoreData = [];
              for (let i = 0; i < tmpData.length; i++) {
                let time = tmpData[i].year + '-' + tmpData[i].month;
                this.yearData.push(time);
                this.yearTotalScoreData.push(tmpData[i].boiler_total_score.toFixed(2));
              }
              this.chartTitle = this.projectName + '-' + tmpData[0].boiler_name;
              this.drawChart();
            } else {
              this.$message('无数据记录');
            }
          }
        })
      },

      drawChart() {

        const chartDom = document.getElementById('TotalScore' + this.boilerId);
        this.myChart = this.$echarts.init(chartDom);
        this.option = {
          title: {
            text: '综合评分趋势'
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.yearData
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              symbolSize: 12,
              label: {
                show: true,
                position: 'top'
              },
              data: this.yearTotalScoreData,
              type: 'line',

            }
          ]
        };
        this.myChart.setOption(this.option);
      }
    }
  }
</script>

<style scoped>

</style>
