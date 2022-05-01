<template>
  <div>
    <div class="chart-title">{{ chartTitle }}</div>
    <div :id="'Bar'+id" style="height: 360px;"></div>
  </div>
</template>

<script>
  import {queryCurrentRawValueByUri} from "../../api/faultWarning";
  import {setEchartsHeight} from "../../utils/chartStyle";

  export default {
    name: "BarChart",
    data() {
      return {
        timer: '',
        baseLength: 20,
        controlCurrent: [],
        beforOptimal: [],
        difference: []
      }
    },
    props: ['id', 'controlParaName', 'controlAim', 'controlUri', 'chartTitle'],

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
      // controlCurrent() {
      //   console.log('调用bar实时值监听');
      //   this.getData();
      //   this.myChart.setOption(this.option, true);
      // },
      controlUri() {
        this.getBeforeOptimal();
        this.myChart.setOption(this.option, true);
      }
    },
    beforeDestroy() {
      clearInterval(this.interval);
      clearInterval(this.interval2);
    },
    methods: {
      async getBeforeOptimal() {
        await queryCurrentRawValueByUri(this.controlUri).then(res => {
          if (res) {
            this.beforOptimal = [];
            for (let i = 0; i < res.data.result.length; i++) {
              this.beforOptimal.push(res.data.result[i].v.toFixed(2));
            }
          }
          this.drawChart();
        });
        this.calValue();
      },
      async start() {
        await this.getData();
        this.interval = setInterval(this.getData, 2000);
        await this.getBeforeOptimal();
        this.calValue();
      },
      calValue() {
        this.difference = [];
        for (let i = 0; i < this.controlParaName.length; i++) {
          let diff = this.controlAim[i] - this.beforOptimal[i];
          this.difference.push(diff.toFixed(2));
        }
        this.$emit('difference', this.difference);
      },
      async getData() {
        await queryCurrentRawValueByUri(this.controlUri).then(res => {
          if (res) {
            this.controlCurrent = [];
            for (let i = 0; i < res.data.result.length; i++) {
              this.controlCurrent.push(res.data.result[i].v.toFixed(2));
            }
          }
          this.drawChart();
        })
      },
      drawChart() {
        // if (this.myChart != null && this.myChart !== "" && this.myChart !== undefined) {
        //   this.myChart.dispose();//销毁
        // }
        const chartDom = document.getElementById('Bar' + this.id);
        this.myChart = this.$echarts.init(chartDom);

        this.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['优化前', '当前值', '目标值'],
            textStyle: {
              color: '#2a2a2a',
              fontSize: 13.5,
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              data: this.controlParaName
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '优化前',
              type: 'bar',
              barWidth: '18%', //barWidth设置每根柱状图的宽度
              emphasis: {
                focus: 'series'
              },
              data: this.beforOptimal,
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
              name: '当前值',
              type: 'bar',
              barWidth: '18%', //barWidth设置每根柱状图的宽度
              emphasis: {
                focus: 'series'
              },
              data: this.controlCurrent,
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
            {
              name: '目标值',
              type: 'bar',
              barWidth: '18%', //barWidth设置每根柱状图的宽度
              emphasis: {
                focus: 'series'
              },
              data: this.controlAim,
              color: '#0cE058',
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
            }
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
