<template>
  <div>
    <el-row>
      <span style="float:left;">
        综合历史效率：{{totalHistoryEff}}% &#12288
        综合优化效率：{{totalOptEff}}% &#12288
        综合提升：{{totalImprove}}% &#12288 &#12288
        <el-tooltip placement="top-start">
          <div slot="content">
            优化前数据来源：2021年8月1日~2021年8月20日<br/>
            优化后数据来源：2021年9月1日~2021年12月20日</div>
          <el-button>时间范围</el-button>
        </el-tooltip>
      </span>
    </el-row>
    <div id="loadEffOptChart" style="height: 280px;"></div>
  </div>
</template>

<script>
  import {optimizeAnalysis} from "../../api/effopt";
  import {setEchartsHeight} from "../../utils/chartStyle";

  export default {
    name: "LoadEffOptChart",
    data() {
      return {
        boilerLoadData: [],
        targetBeforeData: [],
        targetAfterData: [],
        boilerLoadDataList: [],
        targetBeforeDataList: [],
        targetAfterDataList: [],
        scatterData: [],
        scatterDataList: [],
        transToLoadChartEffList: [],
        totalHistoryEff: '',
        totalOptEff: '',
        totalImprove: '',
      }
    },
    props: ['id', 'transToLoadChartLoad', 'transToLoadChartEff'],
    async mounted() {
      await this.start();
      window.addEventListener("resize", () => {
        if (this.myChart) {
          // 计算echarts高度
          setEchartsHeight('line-outer', 'effChart', 100)
          this.myChart.resize();
        }
      });
      setEchartsHeight('line-outer', 'effChart', 100)
    },
    watch: {
      async id() {
        await this.start();
      },
      transToLoadChartLoad() {
        this.addOptData();
        console.log('transToLoadChartLoad', this.transToLoadChartLoad);
        console.log('transToLoadChartEff', this.transToLoadChartEff);
      },

    },
    methods: {
      async start() {
        await this.getData();

      },

      async getData() {
        let param = {
          'model_id': this.id,
        };
        await optimizeAnalysis(param).then(res => {
          if (res) {
            let load = res.data.load;
            // this.boilerLoadData = res.data.load;
            this.boilerLoadData = res.data.load.map(String);
            let targetBefore = res.data.targetBefore;
            let targetAfter = res.data.targetAfter;

            this.targetBeforeData = targetBefore;
            this.targetAfterData = targetAfter;
            this.totalHistoryEff = 0;
            let s = 0;
            //计算平均值
            for (let i = res.data.targetBefore.length - 1; i >= 0; i--) {
              s += res.data.targetBefore[i];
            }
            this.totalHistoryEff = (s / res.data.targetBefore.length).toFixed(2);
            let a = 0;
            for (let i = res.data.targetAfter.length - 1; i >= 0; i--) {
              a += res.data.targetAfter[i];
            }
            this.totalOptEff = (a / res.data.targetAfter.length).toFixed(2);
            this.totalImprove = (this.totalOptEff - this.totalHistoryEff).toFixed(2);
            this.drawChart();
          }
        });

      },

      drawChart() {
        const chartDom = document.getElementById('loadEffOptChart');
        this.myChart = this.$echarts.init(chartDom);
        this.option = {
          tooltip: {
            trigger: 'axis',

          },
          legend: {
            data: ['优化前', '优化后'],
            x: 'right',
            y: 'top',
          },
          xAxis: {
            name: '锅炉负荷',
            type: 'category',
            axisLabel: {
              formatter: '{value}(%)'
            },
            boundaryGap: true,
            data: this.boilerLoadData
          },
          yAxis: {
            min: 80,
            max: 95,
            type: 'value',
            axisLabel: {
              formatter: '{value}(%)'
              // formatter: function (value, index) {
              //   return (value).toFixed(2) + "%";
              // }
            },
            name: '锅炉效率',
          },
          series: [
            {
              name: '优化前',
              data: this.targetBeforeData,
              type: 'line',
              smooth: true,
              showSymbol: false,
              itemStyle: {
                color: '#7bfe87'
              },
              // xAxisIndex:0,
            },
            {
              name: '优化后',
              data: this.targetAfterData,
              type: 'line',
              showSymbol: false,
              smooth: true,
              itemStyle: {
                color: '#87CEFA'
              },
              // xAxisIndex:0,
            },
            {
              name: '优化后效率',
              data: this.scatterDataList,
              type: 'scatter',
              showSymbol: true,
              itemStyle: {
                color: '#50a3ba'
              },
              // xAxisIndex:1,
            },
          ]
        };
        this.myChart.setOption(this.option);
      },

      addOptData() {
        if (this.scatterDataList.length > 100) {
          this.scatterDataList = [];
        }
        this.scatterData = [];
        let tmp = this.transToLoadChartLoad.toFixed(2);
        if (tmp < parseFloat(this.boilerLoadData[0])) {
          this.boilerLoadData.unshift(tmp);
          this.boilerLoadDataList.unshift(this.transToLoadChartEff.toFixed(2));
        } else {
          for (let i = 0; i < this.boilerLoadData.length; i++) {
            if (parseFloat(this.boilerLoadData[i]) >= tmp) {
              this.boilerLoadData.splice(i, 0, tmp.toString());
              break;
            }
          }
        }
        // this.transToLoadChartEffList.push(this.transToLoadChartEff.toFixed(2));
        this.scatterData.push(tmp);
        this.scatterData.push(parseFloat(this.transToLoadChartEff.toFixed(2)));
        this.scatterDataList.push(this.scatterData);

        // this.boilerLoadDataList.push(tmp);
        console.log('this.scatterDataList', this.scatterDataList);
        console.log('this.boilerLoadData', this.boilerLoadData);
        this.drawChart();
      }
    }
  }
</script>

<style scoped>

</style>
