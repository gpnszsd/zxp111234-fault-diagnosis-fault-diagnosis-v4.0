<template>
  <!--  健康管理-->
  <div class="healthManage" style="width:100%">
    <el-container style="padding: 0px 24px 24px; background-color: rgb(245, 247, 249)">
      <el-tabs v-model="activeName" @tab-click="tabClick" type="card" style="width: 100%">
        <el-tab-pane name="first">

          <span slot="label" class="fontClass">锅炉健康状态查询</span>
          <el-row
            type="flex"
            class="row-bg"
            justify="space-between"
            style="margin-bottom: 24px">
            <el-col :span="24">
              <el-card style="height: 70px">
                <div class="grid-content" style="text-align: left;">
                  <el-select
                    v-model="projectSelection"
                    placeholder="请选择"
                    size="mini"
                    @change="projectSelectionChange"
                    style="margin-right: 10px;"
                  >
                    <el-option
                      v-for="item in projectSelectionOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>

                  <el-select
                    v-model="parasSelection"
                    placeholder="请选择"
                    style="margin-right: 20px;"
                    :disabled="projectSelection===''"
                    @change="selectionChange"
                  >
                    <el-option
                      v-for="item in parasSelectionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-date-picker
                    :disabled="parasSelection===''"
                    v-model="value2"
                    format="yyyy-M"
                    value-format="yyyy-M"
                    type="month"
                    placeholder="选择月"
                    @change="monthChange"
                  >
                  </el-date-picker>
                  <el-button
                    type="primary"
                    @click="analyse"
                    style="margin-left: 1%"
                  >分析
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-row
            type="flex"
            class="row-bg grid-content"
            justify="space-between"
            style="margin-bottom: 24px">
            <el-card style="width:100%; height: auto;">
              <el-col :span="12">
                <el-row>
                  <el-col :span="24">
                    <el-empty description="请选择锅炉" v-show="emptyShow"></el-empty>
                    <span style="float: left" v-show="!emptyShow">{{equipInfo}}</span>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 1%">
                  <span style="float: left" v-show="!emptyShow">{{queryDate}}</span>
                </el-row>
                <el-row>
                  <HealthBarChart
                    :id="barId"
                    :year="choseYear"
                    :month="choseMonth"
                    :projectName="mothProjectName"
                    v-show="barShow"
                  >

                  </HealthBarChart>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row style="margin-top: 4%">
                  <el-col :span="12">
                    <div style="float: left;">健康评分：
                      <span style="font-size: 16px;font-weight: bold;">{{totalScore}}</span>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div style="float: left">环比：<span style="font-size: 16px;font-weight: bold;">{{MOM}}</span></div>
                    <el-col v-show="month_on_month > 0" :span="2">
                      <img src="../../../public/static/image/up.png" style="height: 24px;width: 24px;">
                    </el-col>
                    <el-col v-show="month_on_month < 0" :span="2">
                      <img src="../../../public/static/image/down.png" style="height: 24px;width: 24px;">
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 5%; margin-bottom: 2%">
                  <el-table
                    :data="boilerPartData"
                    :border=true
                    :header-cell-style="GLOBAL.elHeaderStyle"
                    style="font-size: 13.5px"
                  >
                    <el-table-column
                      prop="childSystem"
                      label="子系统"
                      align="left"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="score"
                      label="评分"
                      align="left"
                    >
                    </el-table-column>
                  </el-table>
                </el-row>
                <el-row>

                </el-row>
              </el-col>
            </el-card>
          </el-row>
          <el-row>
            <el-card style="width:100%">
              <el-row>
                <el-table
                  :data="boilerPartData"
                  :border=true
                  :header-cell-style="GLOBAL.elHeaderStyle"
                  style="font-size: 13.5px"
                >
                  <el-table-column
                    prop="childSystem"
                    label="子系统"
                    align="left"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="日期"
                    align="left"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="deductedScore"
                    label="扣分"
                    align="left"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="msg"
                    label="描述"
                    align="left"
                  >
                  </el-table-column>
                </el-table>
              </el-row>
            </el-card>
          </el-row>
        </el-tab-pane>

        <el-tab-pane name="second">
          <span slot="label" class="fontClass">锅炉历史趋势分析</span>
          <el-row
            type="flex"
            class="row-bg"
            justify="space-between"
            style="margin-bottom: 24px">
            <el-col :span="24">
              <el-card style="height: 70px">
                <div class="grid-content" style="text-align: left;">
                  <el-select
                    v-model="yearProjectSelection"
                    placeholder="请选择"
                    size="mini"
                    @change="projectSelectionChange"
                    style="margin-right: 10px;"
                  >
                    <el-option
                      v-for="item in projectSelectionOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>

                  <el-select
                    v-model="yearParasSelection"
                    placeholder="请选择"
                    style="margin-right: 20px;"
                    :disabled="yearProjectSelection===''"
                    @change="yearSelectionChange"
                  >
                    <el-option
                      v-for="item in parasSelectionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-date-picker
                    :disabled="yearParasSelection===''"
                    v-model="value3"
                    format="yyyy"
                    value-format="yyyy"
                    type="year"
                    placeholder="选择年"
                    @change="yearChange"
                  >
                  </el-date-picker>
                  <el-button
                    type="primary"
                    @click="analyseYear"
                    style="margin-left: 1%"
                  >分析
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-row
            type="flex"
            class="row-bg grid-content"
            justify="space-between"
            style="margin-bottom: 24px">
            <el-card style="height: 560px;width: 100%;">
              <el-empty
                description="未选择锅炉及年份"
                v-if="value3 ===''"
              ></el-empty>
              <TotalScoreChart
                :id="boilerId"
                :year="yearForChart"
                :projectName="yearProjectSelection"
                style="margin-bottom: 3%"
              >
              </TotalScoreChart>
            </el-card>
          </el-row>
          <el-row
            type="flex"
            class="row-bg grid-content"
            justify="space-between"
            style="margin-bottom: 24px">
            <el-card style="height: 560px;width: 100%;">
              <el-empty
                description="未选择锅炉及年份"
                v-if="value3 ===''"
              ></el-empty>
              <ChildSystemChart
                :id="boilerId"
                :year="yearForChart"
                :projectName="yearProjectSelection"
              >

              </ChildSystemChart>
            </el-card>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
  import {getBoilerInfo, getBoilerScore} from "../../api/health";
  import TotalScoreChart from "../../components/health/TotalScoreChart";
  import ChildSystemChart from "../../components/health/ChildSystemChart";
  import HealthBarChart from "../../components/health/HealthBarChart"

  export default {
    name: "HealthManage",
    components: {TotalScoreChart, ChildSystemChart, HealthBarChart},
    data() {
      return {
        value2: '',
        value3: '',
        queryDate: '',
        activeName: "first",
        modelInfo: [],
        projectSelection: '',
        projectSelectionOptions: [],
        parasSelectionOptions: [],
        parasSelection: '',
        boilerPartData: [],
        boilerDeductedScoreData: [],
        totalScore: 0,
        month_on_month: 0,
        MOM: '',
        equipInfo: '',
        boilerId: 0,
        yearForChart: '',
        totalChartTitle: '',
        yearProjectSelection: '',
        yearParasSelection: '',
        analysed: false,
        emptyShow: false,
        barShow: false,
        barId: '',
        choseMonth: 1,
        mothProjectName: '',
        choseYear: ''
      }
    },

    async mounted() {
      await this.boilerInfo();
      this.emptyShow = true;
    },
    methods: {
      /**
       * 获取所有模型信息
       */
      boilerInfo() {
        getBoilerInfo().then((res) => {
          this.projectSelectionOptions = [];
          this.modelInfo = [];
          if (res) {
            this.modelInfo = res.data;
            console.log('model', this.modelInfo);
            let set = new Set();
            let tmp = res.data;
            for (let i = 0; i < tmp.length; i++) {
              set.add(tmp[i].project_name);
            }
            this.projectSelectionOptions = Array.from(set);
            this.projectSelection = this.projectSelectionOptions[0];
            this.yearProjectSelection = this.projectSelectionOptions[0];
            this.projectSelectionChange();
            this.parasSelection = this.parasSelectionOptions[0].value;
            this.yearParasSelection = this.parasSelectionOptions[0].value;
            this.value2 = '2021-1';
            this.value3 = '2021';
          }
        })
      },

      /**
       * 标签栏切换
       */
      tabClick() {

      },

      /**
       * 查询数据
       */
      analyse() {
        if (this.value2 !== '' && !this.parasSelection <= 0) {
          let len = this.value2.length;
          let year = this.value2.substring(0, 4).toString();
          let month = this.value2.substring(5, len).toString();
          let param = {
            "boiler_id": this.parasSelection,
            "year": year,
            "month": month
          };
          this.barId = this.parasSelection;
          this.choseMonth = month;
          this.mothProjectName = this.projectSelection;
          this.choseYear = year;
          let paramList = [];
          paramList.push(param);
          getBoilerScore(paramList).then((res) => {
            if (res) {
              if (res.data[0].length !== 0) {
                this.boilerPartData = [];
                let tmpData = res.data[0][0];
                this.queryDate = tmpData.year + '-' + tmpData.month;
                console.log('tmpData', tmpData);
                this.totalScore = tmpData.boiler_total_score.toFixed(2);
                this.month_on_month = parseFloat(tmpData.month_on_month);
                this.MOM = this.month_on_month.toFixed(2) + '%';
                this.equipInfo = this.projectSelection + '-' + tmpData.boiler_name;
                let tuple = {};
                try {
                  tuple = {
                    childSystem: '预警系统',
                    score: tmpData.early_waring.boiler_score.toFixed(2),
                    date: tmpData.year + '-' + tmpData.month,
                    deductedScore: tmpData.early_waring.deducted_score.toFixed(2),
                    msg: tmpData.early_waring.msg,
                  };
                } catch (e) {
                    console.log(e);
                }

                this.boilerPartData.push(tuple);
                try{
                  tuple = {
                    childSystem: '成本系统',
                    score: tmpData.cost.boiler_score.toFixed(2),
                    date: tmpData.year + '-' + tmpData.month,
                    deductedScore: tmpData.cost.deducted_score.toFixed(2),
                    msg: tmpData.cost.msg,
                  };
                }catch (e){
                  console.log(e);
                }

                this.boilerPartData.push(tuple);
                try{
                  tuple = {
                    childSystem: '环保系统',
                    score: tmpData.environment_protection.boiler_score.toFixed(2),
                    date: tmpData.year + '-' + tmpData.month,
                    deductedScore: tmpData.environment_protection.deducted_score.toFixed(2),
                    msg: tmpData.environment_protection.msg,
                  };
                }catch (e){
                  console.log(e);
                }
                this.boilerPartData.push(tuple);
                try{
                  tuple = {
                    childSystem: '锅炉寿命',
                    score: tmpData.load.boiler_score.toFixed(2),
                    date: tmpData.year + '-' + tmpData.month,
                    deductedScore: tmpData.load.deducted_score.toFixed(2),
                    msg: tmpData.load.msg,
                  };
                }catch (e){
                  console.log(e);
                }
                this.boilerPartData.push(tuple);
                this.emptyShow = false;
                this.barShow = true;
              } else {
                this.$message('所选月无数据');
                this.emptyShow = true;
                this.barShow = false;
              }
            }
          })
        }
      },
      /**
       * 选择项目名称后的操作
       */
      projectSelectionChange() {
        this.parasSelectionOptions = [];
        let tmpProject = '';
        if (this.projectSelection !== '') {
          tmpProject = this.projectSelection;
        } else if (this.yearProjectSelection !== '') {
          tmpProject = this.yearProjectSelection;
        }
        for (let i = 0; i < this.modelInfo.length; i++) {
          if (tmpProject == (this.modelInfo[i].project_name)) {
            let m = {
              value: '',
              label: ''
            };
            m.value = this.modelInfo[i].boiler_id;
            m.label = this.modelInfo[i].boiler_name;
            this.parasSelectionOptions.push(m);
          }
        }
      },

      clearProjectSelection() {

      },

      selectionChange() {
        this.monthChange();
      },

      yearSelectionChange() {
        this.yearChange();
      },

      monthChange() {

      },

      analyseYear() {
        if (this.yearParasSelection !== 0 && this.value3 !== '') {
          this.boilerId = this.yearParasSelection;
          this.yearForChart = this.value3;
        }
      },

      yearChange() {

      }
    }

  }


</script>

<style scoped>
  .healthManage .el-tabs__item.is-top {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  .healthManage .el-tabs__item.is-top.is-active {
    background-color: white;
    border-bottom: 2px solid #409EFF;
  }

  .fontClass {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
</style>
