<template>
  <div>
    <div class="chart-title">{{ chartTitle }}</div>
    <div :id="'HealthBar'+id" style="height: 360px;"></div>
  </div>
</template>

<script>
  import {getBoilerScore} from "../../api/health";

  export default {
    name: "HealthBarChart",
    data() {
      return {
        boilerId: 0,
        monthNum: '',
        lastMonthNum: '',
        lastMonthData: [],
        monthData: []
      }
    },
    props: ['id', 'year', 'month', 'projectName'],

    async mounted() {
      await this.start();
      window.addEventListener("resize", () => {
        if (this.myChart) {
          // 计算echarts高度
          setEchartsHeight('bar-outer', 'Bar' + this.id, -30)
          this.myChart.resize();
        }
      });
      setEchartsHeight('bar-outer', 'Bar' + this.id, -30)
      this.myChart.resize();
    },
    watch: {
      //当前值，实时变化
      id(n, o) {
        this.start();
        this.myChart.setOption(this.option, true);
      },
      month(n, o) {
        this.start();
        this.myChart.setOption(this.option, true);
      },
      year(n, o) {
        this.start();
        this.myChart.setOption(this.option, true);
      }

    },
    methods: {

      async start() {
        if (this.id > 0) {
          let param1 = {
            "boiler_id": this.id,
            "year": this.year,
            "month": this.month
          };
          if (this.month === '1') {
            this.lastMonthNum = '12';
          } else {
            this.lastMonthNum = (this.month - 1).toString();
          }
          let param2 = {
            "boiler_id": this.id,
            "year": this.year,
            "month": this.lastMonthNum
          };
          let param = [];
          param.push(param1, param2);
          console.log('柱状图', param);
          await getBoilerScore(param).then((res) => {
            if (res) {
              console.log('柱res.data', res.data);
              this.lastMonthData = [];
              this.monthData = [];

              if (res.data[0].length !== 0) {
                for (let i = 0; i < res.data.length; i++) {
                  if (res.data[i].length === 0) {
                    this.$message('上月无数据');
                  }
                  //上月
                  else if (res.data[i][0].month === this.lastMonthNum) {
                    this.lastMonthData.push(res.data[i][0].cost.boiler_score.toFixed(2));
                    this.lastMonthData.push(res.data[i][0].early_waring.boiler_score.toFixed(2));
                    this.lastMonthData.push(res.data[i][0].environment_protection.boiler_score.toFixed(2));
                    this.lastMonthData.push(res.data[i][0].load.boiler_score.toFixed(2));
                  } else if (res.data[i][0].month === this.month) {//本月
                    this.monthData.push(res.data[i][0].cost.boiler_score.toFixed(2));
                    this.monthData.push(res.data[i][0].early_waring.boiler_score.toFixed(2));
                    this.monthData.push(res.data[i][0].environment_protection.boiler_score.toFixed(2));
                    this.monthData.push(res.data[i][0].load.boiler_score.toFixed(2));
                  }
                }

                console.log('lastMonthData', this.lastMonthData);
                console.log('monthData', this.monthData);
                this.drawChart();
              }
            }
          });

        }

      },

      drawChart() {
        const chartDom = document.getElementById('HealthBar' + this.id);
        this.myChart = this.$echarts.init(chartDom);

        this.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['上月评分', '本月评分'],
            textStyle: {
              color: '#2a2a2a',
              fontSize: 13.5,
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              data: ['成本系统', '预警系统', '环保系统', '锅炉寿命']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '上月评分',
              type: 'bar',
              barWidth: '18%', //barWidth设置每根柱状图的宽度
              emphasis: {
                focus: 'series'
              },
              data: this.lastMonthData,
              color: '#09CAF3',
              itemStyle: {
                normal: {
                  label: {
                    show: true,  // 开启显示标签数值
                    position: 'top',
                    textStyle: {
                      color: '#727171',
                      fontsize: 5,
                    },
                    rotate: 40   // 标签字体倾斜角度
                  }
                }
              }
            },
            {
              name: '本月评分',
              type: 'bar',
              barWidth: '18%', //barWidth设置每根柱状图的宽度
              emphasis: {
                focus: 'series'
              },
              data: this.monthData,
              color: '#F4744F',
              itemStyle: {
                normal: {
                  label: {
                    show: true,  // 开启显示标签数值
                    position: 'top',
                    textStyle: {
                      color: '#727171',
                      fontsize: 5,
                    },
                    rotate: 40   // 标签字体倾斜角度
                  }
                }
              }
            },
          ]
        };

        this.myChart.setOption(this.option);
      },

    }
  }
</script>

<style scoped>
  .chart-title {
    float: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  }
</style>
