<template>
  <div>
    <el-row>
      <span style="float:left;">
        综合历史燃料：{{totalHistoryFuel}}&#12288
        综合优化燃料：{{totalOptFuel}}&#12288
        综合提升：{{totalImprove}}&#12288 &#12288
        <el-tooltip placement="top-start">
          <div slot="content">
            优化前数据来源：2021年8月1日~2021年8月20日<br/>
            优化后数据来源：2021年9月1日~2021年12月20日</div>
          <el-button>时间范围</el-button>
        </el-tooltip>
      </span>
    </el-row>
    <el-row style="margin-top: 100px" v-if=!totalImprove>
      <span style="color: #aaaaaa; font-size: 25px">请选择成本优化</span>
    </el-row>
    <div id="loadFuelOptChart" style="height: 280px;"></div>
  </div>
</template>

<script>
import {optimizeAnalysis} from "../../api/effopt";
import {setEchartsHeight} from "../../utils/chartStyle";

export default {
  name: "LoadFuelOptChart",
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
      totalHistoryFuel: '',
      totalOptFuel: '',
      totalImprove: '',
    }
  },
  props: ['id', 'transToLoadChartLoadFuel', 'transToLoadChartFuel'],
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
    transToLoadChartLoadFuel() {
      this.addOptData();
      console.log('transToLoadChartLoadFuel', this.transToLoadChartLoadFuel);
      console.log('transToLoadChartFuel', this.transToLoadChartFuel);
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
          console.log(this.boilerLoadData);
          let targetBefore = res.data.targetBefore;
          let targetAfter = res.data.targetAfter;
          console.log(targetAfter[1]);

          this.targetBeforeData = targetBefore;
          this.targetAfterData = targetAfter;
          // this.totalHistoryFuel = 0;
          let s = 0;
          //计算平均值
          if (targetAfter[1] > 2000){
            for (let i = res.data.targetBefore.length - 1; i >= 0; i--) {
              s += res.data.targetBefore[i];
            }
            this.totalHistoryFuel = (s / res.data.targetBefore.length).toFixed(2);
            let a = 0;
            for (let i = res.data.targetAfter.length - 1; i >= 0; i--) {
              a += res.data.targetAfter[i];
            }
            this.totalOptFuel = (a / res.data.targetAfter.length).toFixed(2);
            this.totalImprove = (this.totalHistoryFuel - this.totalOptFuel).toFixed(2);
            this.drawChart();
          }
        }
      });

    },

    drawChart() {
      const chartDom = document.getElementById('loadFuelOptChart');
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
          min: 4150,
          max: 4600,
          type: 'value',
          axisLabel: {
            formatter: '{value}'
            // formatter: function (value, index) {
            //   return (value).toFixed(2) + "%";
            // }
          },
          name: '供浆流量',
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
      let tmp = this.transToLoadChartLoadFuel.toFixed(2);
      console.log(tmp);
      if (tmp < parseFloat(this.boilerLoadData[0])) {
        this.boilerLoadData.unshift(tmp);
        this.boilerLoadDataList.unshift(this.transToLoadChartFuel.toFixed(2));
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
      this.scatterData.push(parseFloat(this.transToLoadChartFuel.toFixed(2)));
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
