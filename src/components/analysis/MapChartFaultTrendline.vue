<template>
  <div>
    <el-col :span="24" style="height: 400px">
      <div class="chart-title">{{ chartTitle }}</div>
      <div :id="'chartBox' + id" style="height: 400px"></div>
    </el-col>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: "MapChartFaultTrendline",

  data() {
    return {

      myChart: null,
      axis : ['' , '' ,'' ,''],
      trendaxisrang : [[0 , 0 ] , [0 , 0 ] , [0 , 0 ]],
      op: {
        tooltip: {

          trigger: "axis",
          formatter:function(params){

            var res = params[0].name;
            let arr = [ ]
            let ds
            for (let i = 0; i < params.length; i++) {
              let d = new Date(params[i].axisValue)
              ds = d.getDate()+"/"+(d.getMonth()+1)+" "+d.getHours()+":"+d.getMinutes()
              // arr.push("时间 : "+  moment(params.axisValue).format("MM-DD HH:MM"))
              let va = params[i].data.value[1]
              if(params[i].seriesName!='' && i !== 3){
                arr.push("<br>"+params[i].marker+params[i].seriesName+"：" + Number(va).toFixed(2))
              }
            }
            arr.unshift("时间 : "+  ds)
            return arr.join('');
          }
        },
        grid: {
          left: "280px",
          right: "110px",
        },
        legend: {
          data: [],
          top: "3px",
          orient: "horizontal",
        },
        yAxis: [
          {
            type: "value",
            name: '',
            show: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#91CC75",
              },
            },
            axisLabel:{
              formatter: '{value} Kw/H'
            },
            splitNumber:5,
            position: "left",
            // min: trendaxisrang[0][0],
            // max: trendaxisrang[0][1],
          },
          {
            type: "value",
            name: '',
            show: false,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#5470C6",
              },
            },
            axisLabel:{
              formatter: '{value} m³'
            },
            splitNumber:5,
            position: "left",
            offset: 80,
            // min: trendaxisrang[1][0],
            // max: trendaxisrang[1][1],
          },
          {
            type: "value",
            name: '',
            show: false,
            axisLine: {
              show: true,
              lineStyle: {
              color: "#e78557",
              },
            },
            axisLabel:{
              formatter: '{value} Hz'
            },
            splitNumber:5,
            position: "left",
            offset: 160,
            // min: trendaxisrang[2][0],
            // max: trendaxisrang[2][1],
          },
          {
            type: "value",
            name: '',
            show: false,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#ff0000",
              },
            },
            axisLabel:{
              formatter: '{value} 次'
            },
            splitNumber:5,
            position: "left",
            offset: 220,
            min: 0,
            max: 20,
          },
          {
            type: "value",
            name: '',
            show: false,
            axisLine: {
              show: true,
            },
            position: "left",
          }
        ],
        xAxis: {
          type: "time",
          splitLine: {
            show: false
          },
          // splitNumber:1,
          // boundaryGap: ["20%", "20%"],
          axisLabel : {
            formatter (val) {
              // let rs = moment(parseInt(val)).format("MM-DD HH")
              // return rs
              var date = new Date(val);
              return (date.getMonth() + 1) + '/' + date.getDate();
              // return val
            }
          }
        },

        series: [
          {
            name: '',
            type: "line",
            data:  '',
            yAxisIndex:0,
            symbolSize:1,
            itemStyle:{
              normal:{
                color: "#91CC75"
              }
            }
          },
          {
            name: '',
            type: "line",
            data: '',
            yAxisIndex:1,
            symbolSize:1,
            itemStyle:{
              normal:{
                color: "#5470C6"
              }
            }
          },
          {
            name: '',
            type: "line",
            data:'',
            yAxisIndex:2,
            symbolSize:1,
            itemStyle:{
              normal:{
                color: "#e78557"
              }
            }
          },
          {
            name: '报警次数',
            type: "bar",
            data:'',
            yAxisIndex:3,
            barWidth:20,
            itemStyle:{
              normal:{
                color: "#ff0000"
              }
            },
            label : {
              show : true ,
              position : 'top'
            }
          },
          {
            name:'.anchor',
            type:'line',
            showSymbol:false,
            data:'',
            yAxisIndex:4,
            itemStyle:{normal:{opacity:0}},
            lineStyle:{normal:{opacity:0}}
          }
        ],
        // dataZoom: [
        //   {
        //     type: "inside",
        //     show: this.lineShow,
        //     xAxisIndex: [0],
        //     start: 0,
        //     end: 100,
        //   },
        // ],
        dataZoom: [
          {
            show: this.lineShow,
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
      }
    };
  },
  props: [
    "id",
    "chartTitle",
    // "Y1_name",
    // "Y2_name",
    // "Y3_name",
    "chartData",
    "type",
    "xAxis",
    "legend",
    "faultlegend",
    "energylegend",
    "lineShow"
  ],
  mounted() {
    this.drawChart();
    // setInterval(() => {
    //   this.updateChart()
    // }, 1000);
  },
  methods: {
    resize() {
      this.myChart.resize();
      this.drawChart();
    },
    drawChart() {

      let chartDom = document.getElementById("chartBox" + this.id);
      this.myChart = this.$echarts.init(chartDom);
      this.option = this.op
      this.myChart.setOption(this.op);
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
    updateChart(timeArr , arr,axis,trendaxisrang) {
      console.log(arguments)
      this.axis = axis
      this.trendaxisrang = trendaxisrang
      this.myChart.clear();
      let op= {
        grid: {
          left: "210px",
          right: "40px",
        },
        legend: {
          data: axis ,
          top: "3px",
          orient: "horizontal",
        },
        yAxis: [
          {
            type: "value",
            name: axis[0],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#91CC75",
              },
            },
            splitNumber:5,
            position: "left",
            // min: trendaxisrang[0][0],
            // max: trendaxisrang[0][1],
          },
          {
            type: "value",
            name: axis[1],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#5470C6",
              },
            },
            splitNumber:5,
            position: "left",
            offset: 60,
            // min: trendaxisrang[1][0],
            // max: trendaxisrang[1][1],
          },
          {
            type: "value",
            name: axis[2],
            axisLine: {
              show: true,
              lineStyle: {
                color: "orange",
              },
            },
            splitNumber:5,
            position: "left",
            offset: 120,
            // min: trendaxisrang[2][0],
            // max: trendaxisrang[2][1],
          },
          {
            type: "value",
            name: axis[3],
            axisLine: {
              show: true,
              lineStyle: {
                color: "red",
              },
            },
            splitNumber:5,
            position: "left",
            offset: 180,
            min: 0,
            max: 20,
          },
        ],
        xAxis: {
          type: "time",
          splitNumber:1,
          boundaryGap: ["20%", "20%"],
          axisLabel : {
            formatter (val) {
              // let rs = moment(parseInt(val)).format("MM-DD HH")
              // return rs
              var date = new Date(val);
              return date.getDate() + '/' + (date.getMonth() + 1);
              // return val
            }
          }
        },

        series: [
          {
            name: axis[0],
            type: "line",
            data:  arr[0],
          },
          {
            name: axis[1],
            type: "line",
            data: arr[1],
          },
          {
            name: axis[2],
            type: "line",
            data:arr[2],
          },
          {
            name: '报警次数',
            type: "bar",
            data:arr[4],
          },
          {
            name:'.anchor',
            type:'line',
            showSymbol:false,
            data:arr[3],
            itemStyle:{normal:{opacity:0}},
            lineStyle:{normal:{opacity:0}}
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
      };

      let opt =this.op

      ////初始化legend
      opt.legend.data=axis
      ////初始化y轴
      opt.yAxis[0].min=trendaxisrang[0][0]
      opt.yAxis[0].max=trendaxisrang[0][1]
      opt.yAxis[0].name=axis[0]
      opt.yAxis[0].show=true
      ///////////////////////
      opt.yAxis[1].min=trendaxisrang[1][0]
      opt.yAxis[1].max=trendaxisrang[1][1]
      opt.yAxis[1].name=axis[1]
      opt.yAxis[1].show=true
      ///////////////////////
      opt.yAxis[2].min=trendaxisrang[2][0]
      opt.yAxis[2].max=trendaxisrang[2][1]
      opt.yAxis[2].name=axis[2]
      opt.yAxis[2].show=true
      ///////////////////////
      opt.yAxis[3].min=trendaxisrang[3][0]
      opt.yAxis[3].max=trendaxisrang[3][1]
      opt.yAxis[3].name=axis[3]
      opt.yAxis[3].show=true
      ///////////////////////
      opt.yAxis[4].name=axis[4]
      opt.yAxis[4].show=false
      //////初始化series
      opt.series[0].name=axis[0]
      opt.series[0].data=arr[0]
      //////////////////////////
      opt.series[1].name=axis[1]
      opt.series[1].data=arr[1]
      //////////////////////////
      opt.series[2].name=axis[2]
      opt.series[2].data=arr[2]
      //////////////////////////
      opt.series[3].name=axis[3]
      opt.series[3].data=arr[3]
      //////////////////////////
      opt.series[4].name=axis[4]
      opt.series[4].data=arr[4]


      this.op=opt
      console.log(this.op)
      this.myChart.setOption(this.op)
      // this.drawChart()
      this.stoploading()

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
