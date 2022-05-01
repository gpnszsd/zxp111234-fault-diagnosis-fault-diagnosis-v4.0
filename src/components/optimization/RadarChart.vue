<template>
  <div>
    <div class="chart-title">{{ chartTitle }}</div>
    <div :id="'optRadarChart' + id" style="height: 450px"></div>
  </div>
</template>

<script>

  import {setEchartsHeight} from "../../utils/chartStyle";
  import {queryCurrentRawValueByUri} from "../../api/faultWarning";

  export default {
    name: "RadarChart",
    data() {
      return {
        timer: '',
        controlCurrent: [],
        beforOptimal: []
      }
    },

    props: ['id', 'controlParaName', 'controlAim', 'controlUri', 'chartTitle'],
   async mounted() {
      await this.start();

      window.addEventListener("resize", () => {
        if (this.myChart) {
          // 计算echarts高度
          setEchartsHeight('radar-outer', 'optRadarChart' + this.id, -300)
          this.myChart.resize();
        }
      });
      setEchartsHeight('radar-outer', 'optRadarChart' + this.id, -300)
      this.myChart.resize();

    },
    watch: {
      // controlCurrent() {
      //   this.queryCurrentValue();
      //   this.myChart.setOption(this.option, true);
      // },

      controlUri() {
        this.getBeforeOptimal();
        this.myChart.setOption(this.option, true);
      }
    },

    methods: {
      async start(){
       await this.getBeforeOptimal();
       await this.queryCurrentValue();
      },
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
      },
      async queryCurrentValue() {
        await queryCurrentRawValueByUri(this.controlUri).then((res) => {
          if (res) {
            this.controlCurrent = [];
            for (let i = 0; i < res.data.result.length; i++) {
              this.controlCurrent.push(res.data.result[i].v.toFixed(2));
            }
          }
        });
        this.drawChart();
      },

      drawChart() {
        let indicator = this.controlParaName.map(item => {
          return {name: item, min: 500}
        });

        this.myChart = this.$echarts.init(document.getElementById('optRadarChart' + this.id));

        this.option = {
          backgroundColor: 'white',
          color: ['#04C5F5', '#F4744F', '#11f317'],
          tooltip: {
            // show: false, // 弹层数据去掉
            trigger: 'item',
            // formatter(params){
            //   console.log(params.seriesName)
            //   console.log(params)
            //   return params.value.toString()
            //
            // }
          },
          legend: {
            icon: 'roundRect',
            left: '34.5%',
            top: '2%',
            show: true,
            padding: [3, 5],
            // right: '50',
            y: '1',
            center: 0,
            itemWidth: 20,
            itemHeight: 10,
            itemGap: 26,
            z: 3,
            // orient: 'horizontal',
            data: ['优化前', '当前值', '目标值'],
            textStyle: {
              fontFamily: 15
            },
          },
          radar: {
            center: ['50%', '48%'], // 外圆的位置
            radius: '55%',

            indicator: indicator,
            splitArea: {
              // 坐标轴在 grid 区域中的分隔区域，默认不显示。
              show: true,
              areaStyle: {
                // 分隔区域的样式设置。
                color: ['#FFFFFF'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
              }
            },
            axisLine: {
              // 指向外圈文本的分隔线样式
              lineStyle: {
                type: 'solid',
                color: '#EEEFF1', // 分隔线颜色
                width: 1 // 分隔线线宽
              }
            },
            splitLine: {
              lineStyle: {
                type: 'solid',
                color: '#EEEFF1', // 分隔线颜色
                width: 1 // 分隔线线宽
              }
            },
            name: {
              rich: {
                a: {
                  color: '#8B8B8B',
                  lineHeight: 20
                },
              },
              formatter: (a) => {
                return `${a}`
              },
              textStyle: {   //全局字体样式
                color: '#2a2a2a',
                fontSize: 13.5,
              }
            }
          },
          series: [
            {
              type: 'radar',
              symbol: 'circle',
              symbolSize: 8.5,
              areaStyle: {
                normal: {
                  opacity: 0.5,  //背景透明
                },
              },
              data: [
                {
                  value: this.beforOptimal,
                  name: '优化前',
                  areaStyle: {
                    normal: {
                      color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.5,
                        colorStops: [{
                          offset: 0, color: 'rgb(193,242,252)' // 0% 处的颜色
                        },
                          {
                            offset: 0.15, color: 'rgb(137,227,246)' // 100% 处的颜色
                          },
                          {
                            offset: 0.75, color: 'rgb(145,231,250)' // 100% 处的颜色
                          },
                          {
                            offset: 1, color: 'rgb(154,230,246)' // 100% 处的颜色
                          }],
                        global: false // 缺省为 false
                      }
                    }
                  },
                  itemStyle: { // 折线拐点标志的样式。
                    normal: { // 普通状态时的样式
                      lineStyle: {
                        width: 1
                      },
                      opacity: 0.3
                    },
                    emphasis: { // 高亮时的样式
                      lineStyle: {
                        width: 5
                      },
                      opacity: 0
                    }
                  },
                },
                {
                  value: this.controlCurrent,
                  name: '当前值',
                  areaStyle: {
                    normal: {
                      color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.5,
                        colorStops: [{
                          offset: 0, color: 'rgb(193,242,252)' // 0% 处的颜色
                        },
                          {
                            offset: 0.15, color: 'rgb(137,227,246)' // 100% 处的颜色
                          },
                          {
                            offset: 0.75, color: 'rgb(145,231,250)' // 100% 处的颜色
                          },
                          {
                            offset: 1, color: 'rgb(154,230,246)' // 100% 处的颜色
                          }],
                        global: false // 缺省为 false
                      }
                    }
                  },
                  itemStyle: { // 折线拐点标志的样式。
                    normal: { // 普通状态时的样式
                      lineStyle: {
                        width: 1
                      },
                      opacity: 0.3
                    },
                    emphasis: { // 高亮时的样式
                      lineStyle: {
                        width: 5
                      },
                      opacity: 0
                    }
                  },
                },
                {
                  value: this.controlAim,
                  name: '目标值',
                  areaStyle: {
                    normal: {
                      color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.5,
                        colorStops: [{
                          offset: 0, color: 'rgba(217,248,207,0.14)' // 0% 处的颜色
                        },
                          {
                            offset: 0.15, color: 'rgba(101,243,54,0.14)' // 100% 处的颜色
                          },
                          {
                            offset: 0.75, color: 'rgba(80,241,88,0.4)' // 100% 处的颜色
                          },
                          {
                            offset: 1, color: 'rgba(101,239,70,0.5)' // 100% 处的颜色
                          }],
                        global: false // 缺省为 false
                      }
                    }
                  },
                  itemStyle: { // 折线拐点标志的样式。
                    normal: { // 普通状态时的样式
                      lineStyle: {
                        width: 1
                      },
                      opacity: 0.3
                    },
                    emphasis: { // 高亮时的样式
                      lineStyle: {
                        width: 5
                      },
                      opacity: 0
                    }
                  },
                }
              ]
            }
          ]
        };
// 使用刚指定的配置项和数据显示图表。
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
