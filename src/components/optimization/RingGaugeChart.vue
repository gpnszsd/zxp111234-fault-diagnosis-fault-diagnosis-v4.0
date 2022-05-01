<!--得分环组件-->
<template>
  <div>
    <div class="chart-title">{{ chartTitle }}</div>
    <div id="ring-main" style="height:100px;"></div>
  </div>
</template>

<script>
  import {setEchartsHeight} from "../../utils/chartStyle";

  export default {
    name: "RingGaugeChart",
    data() {
      return {
        titleArr: [],
        seriesArr: []
      }
    },
    props: ['beforeValue', 'currentValue', 'targetValue', 'chartTitle'],
    mounted() {
      this.init();
      this.drawChart();
      window.addEventListener("resize", () => {
        if (this.myChart) {
          // 计算echarts高度
          setEchartsHeight('ring-outer', 'ring-main', -50)
          this.myChart.resize();
        }
      });
      setEchartsHeight('ring-outer', 'ring-main', -50)
      this.myChart.resize();
    },
    watch: {
      beforeValue() {
        this.init();
        this.myChart.setOption(this.option, true);
      },
      currentValue() {
        this.init();
        this.myChart.setOption(this.option, true);
      },
      targetValue() {
        this.init();
        this.myChart.setOption(this.option, true);
      }
    },
    methods: {
      init() {

        let pieData = [
          {
            name: '优化前',
            value: this.beforeValue,
          },
          {
            name: '当前值',
            value: this.currentValue,
          },
          {
            name: '目标值',
            value: this.targetValue,
          },
        ];

        this.titleArr.length = 0;
        this.seriesArr.length = 0;

        pieData.forEach((item, index) => {
          this.titleArr.push({
            text: item.name,
            left: index * 35 + 15.5 + '%',
            top: '50%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '15',
              color: '#353535',
              textAlign: 'center',
            },
          });
          this.seriesArr.push(
            {
              type: 'pie',
              name: '外层细圆环',
              radius: ['41%', '42%'],
              center: [index * 34 + 15.5 + '%', '25.3%'],
              hoverAnimation: false,
              clockWise: false,
              itemStyle: {
                normal: {
                  color: '#6e7175',
                },
              },
              label: {
                show: false,
              },
              data: [50],
            },
            {
              type: 'pie',
              name: '内层层细圆环',
              radius: ['29%', '30%'],
              center: [index * 34 + 15.5 + '%', '25.3%'],
              hoverAnimation: false,
              clockWise: false,
              itemStyle: {
                normal: {
                  color: '#6e7175',
                },
              },
              label: {
                show: false,
              },
              data: [100],
            },
            {
              type: 'pie',
              zlevel: 3,
              silent: true,
              radius: ['25%', '26%'],
              center: [index * 34 + 15.5 + '%', '25.3%'],
              label: {
                normal: {
                  show: false,
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: this.dotArr(),
            }
          );
        });
        this.titleArr[0].left = 14.5 + '%';
        this.titleArr[1].left = 48.5 + '%';
        this.titleArr[2].left = 82.5 + '%';
        this.seriesArr.push(
          {
            name: pieData[0].name,
            type: 'pie',
            clockWise: false,
            radius: ['33%', '38%'],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#A970D1',
                  },
                  {
                    offset: 1,
                    color: '#2CBDDC',
                  },
                ]),
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            center: [0 * 34 + 15.5 + '%', '25.3%'],
            data: [
              {
                value: pieData[0].value,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%';
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '16',
                      // fontWeight: 'bold',
                      color: '#1cc7ff',
                    },
                  },
                },
              },
              {
                value: 100 - pieData[0].value,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: 'rgba(0,0,0,0)',
                  },
                  emphasis: {
                    color: 'rgba(0,0,0,0)',
                  },
                },
              },
            ],
          },
          {
            name: pieData[1].name,
            type: 'pie',
            clockWise: false,
            radius: ['33%', '38%'],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#F8A95C',
                  },
                  {
                    offset: 1,
                    color: '#F4744F',
                  },
                ]),
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            center: [1 * 34 + 15.5 + '%', '25.3%'],
            data: [
              {
                value: pieData[1].value,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%';
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '16',
                      // fontWeight: 'bold',
                      color: '#1cc7ff',
                    },
                  },
                },
              },
              {
                value: 100 - pieData[1].value,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: 'rgba(0,0,0,0)',
                  },
                  emphasis: {
                    color: 'rgba(0,0,0,0)',
                  },
                },
              },
            ],
          },
          {
            name: pieData[2].name,
            type: 'pie',
            clockWise: false,
            radius: ['33%', '38%'],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#07D0EA',
                  },
                  {
                    offset: 1,
                    color: '#2EEE5D',
                  },
                ]),
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            center: [2 * 34 + 15.5 + '%', '25.3%'],
            data: [
              {
                value: pieData[2].value,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%';
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '16',
                      // fontWeight: 'bold',
                      color: '#1cc7ff',
                    },
                  },
                },
              },
              {
                value: 100 - pieData[2].value,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: 'rgba(0,0,0,0)',
                  },
                  emphasis: {
                    color: 'rgba(0,0,0,0)',
                  },
                },
              },
            ],
          }
        );
      },
      dotArr() {
        let dataArr = [];
        for (var i = 0; i < 80; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              name: (i + 1).toString(),
              value: 1,
              itemStyle: {
                normal: {
                  color: '#676a6c',
                  borderWidth: 1,
                  borderColor: '#676a6c',
                },
              },
            });
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 2,
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)',
                  borderWidth: 0,
                  borderColor: 'rgba(0,0,0,0)',
                },
              },
            });
          }
        }
        return dataArr;
      },
      drawChart() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = this.$echarts.init(document.getElementById("ring-main"));
        // 指定图表的配置项和数据
        this.option = {
          grid: {
            left: '5%',
            right: '2%',
            bottom: '0%',
            top: '0%',
            containLabel: true,
          },
          backgroundColor: "#FFFFFF",
          title: this.titleArr,
          series: this.seriesArr,
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
