<template xmlns:el-col="http://www.w3.org/1999/html">
  <el-container>
    <el-aside width="250px">
      <el-card style="height:100%">
        <div slot="header" class="clearfix" style="height: 21px">
          <el-button type="primary" round @click="registerModels" class=button-style>设 备 选 取</el-button>
        </div>
        <el-tree class="flow-tree"
                 ref="tree"
                 node-key="uri"
                 :props="mainProps"
                 :load="loadNode"
                 :highlight-current="true"
                 :check-strictly="false"
                 show-checkbox
                 lazy
        >
        </el-tree>
      </el-card>
    </el-aside>
    <el-container direction="vertical">
      <el-card>
        <div slot="header" class="paramShow">
          <span style="font-weight: bold">模型管理</span>
        </div>
        <el-row style="margin-bottom: 10px" :gutter="20">
          <el-col :span="4">
            <el-select v-model="projectSelection" clearable placeholder="请选择" size="mini"
                       @change="projectSelectionChange" @clear="clearProjectSelection">
              <el-option
                v-for="item in projectSelectionOptions"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="boilersSelection" :disabled="projectSelection===''"
                       clearable placeholder="请选择" @change="selectionChange"
                       @clear="selectionChange">
              <el-option
                v-for="item in boilersSelectionOptions"
                :key="item.boilerId"
                :label="item.boilerName"
                :value="item.boilerId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="parasSelection" clearable placeholder="请选择"
                       @change="selectionChange"
                       @clear="selectionChange">
              <el-option
                v-for="item in parasSelectionOptions"
                :key="item.paraId"
                :label="item.paraName"
                :value="item.paraId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-table
          :header-cell-style="GLOBAL.elHeaderStyle"
          :data="realParamData"
          :border=true
          @row-click="clickTr"
          style="font-size: 13.5px">
          >
          <el-table-column
            prop="modelId"
            label="模型id"
            align="center"
            width="60px"
          >
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="项目名称">
          </el-table-column>
          <el-table-column
            prop="boilerName"
            label="锅炉名称"
          >
          </el-table-column>
          <el-table-column
            prop="warningNumber"
            label="报警量">
          </el-table-column>
          <el-table-column label="创建-更新时间" align="center" min-width="315px">
            <template v-slot="{row}">
              <el-date-picker
                type="datetimerange"
                :value="[row.createDate, row.lastUpdate]"
                style="width:300px"
                format="yyyy/MM/dd HH:mm"
                disabled>
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="trainingState"
            label="训练状态">
            <template v-slot="{row}">
              <el-switch v-model="row.trainingState"
                         :disabled="row.trainingState || !row.boilerState"
                         @change="trainModel(row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="onlineState"
            label="上线状态">
            <template v-slot="{row}">
              <el-switch v-model="row.onlineState"
                         :disabled="row.trainingState || !row.boilerState"
                         @change="online(row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="historyData"
            label="历史数据">
            <template v-slot="{row}">
              <el-button type="text" @click="dialogHistory(row)">查看历史数据</el-button>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="opt" label="操作" align="center">
            <template v-slot="{row}">
              <el-button type="text" @click="deleteModel(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="提示"
          :visible.sync="confirmDialogVisible"
          width="30%">
          <span style="font-size: 16pt">确定删除模型？</span>
          <span slot="footer" class="dialog-footer">
      <el-button @click="confirmDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doDeleteModel()">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog style="text-align:left;margin:0 auto !important" :visible.sync="dialogFormVisible">
          <template>
            <el-card>
              <el-row>
                <el-col :span="3"><b><p>项目名称：</p></b></el-col>
                <el-col :span="5"><b><p>{{dialogMessage.projectName}}</p></b></el-col>
                <el-col :span="3"><b><p>锅炉名称：</p></b></el-col>
                <el-col :span="5"><b><p>{{dialogMessage.boilerName}}</p></b></el-col>
                <el-col :span="3"><b><p>报警量：</p></b></el-col>
                <el-col :span="5"><b><p>{{dialogMessage.warningNumber}}</p></b></el-col>
              </el-row>
            </el-card>
            <el-card>
              <el-row>
                <el-col :span="5"><b>历史数据起止时间：</b></el-col>
                <el-col :span="14">
                  <div class="block">
                    <el-date-picker
                      v-model="value1"
                      type="datetimerange"
                      :picker-options="pickerOptions0"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy/MM/dd HH:mm:ss"
                      align="center">
                    </el-date-picker>
                  </div>
                </el-col>
                <el-col :span="6.5">
                  <el-button type="primary" @click="onSubmit">清空</el-button>
                </el-col>
              </el-row>
            </el-card>
            <el-card>
              <el-row>
                <el-empty description="请选择起止时间" v-if="value1 === ''"></el-empty>
                <HistoryChart
                  :key="dialogMessage.modelId"
                  v-else
                  :id="dialogMessage.modelId"
                  :uri="dialogMessage.uri"
                  :token="getNodeToken"
                  :paramName="dialogMessage.warningNumber"
                  :startTimeSelect="startTime"
                  :endTimeSelect="endTime"
                >
                </HistoryChart>
              </el-row>
            </el-card>
          </template>
        </el-dialog>
        <div class="block">
          <el-pagination
            @size-change="refreshStatusTable"
            @current-change="refreshStatusTable"
            :current-page.sync="currentPage"
            :page-sizes="[5]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="paramShow">
          <span style="font-weight: bold">模型预测</span>
        </div>
        <el-row>
          <el-empty description="无上线模型" v-if="currentPageChart.length === 0"></el-empty>
          <!--            <ChartComponent-->
          <!--              v-for="(item,index) in currentPageChart"-->
          <!--              :key="item.modelId"-->
          <!--              :id="item.modelId"-->
          <!--              :modelId="item.modelId"-->
          <!--              :chartTitle="item.projectName + '_' + item.boilerName + '_' + item.warningNumber">-->
          <!--            </ChartComponent>-->
          <PredictionChart
            v-for="(item,index) in currentPageChart"
            :key="item.modelId"
            :id="item.modelId"
            :uri="item.uri"
            :token="getNodeToken"
            :paramName="item.warningNumber"
            :chartTitle="item.projectName + '_' + item.boilerName + '_' + item.warningNumber">
          </PredictionChart>
        </el-row>
        <el-row>
          <el-pagination
            @size-change="refreshChart"
            @current-change="refreshChart"
            :current-page.sync="currentChartPage"
            :page-size.sync="chartPageSize"
            :page-sizes="[1, 2, 3, 5]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalChartSize">
          </el-pagination>
        </el-row>
      </el-card>
      <el-card>
        <div slot="header" class="paramShow">
          <span style="font-weight: bold">故障预警</span>
        </div>
        <el-row type="flex" style="margin-bottom: 10px" justify="space-between">
          <el-container>
            <el-button v-on:click='showAliveTable()' autofocus="autofocus" class=button-style>实时诊断</el-button>
            <el-button v-on:click='showEventsTable()' class=button-style>历史诊断</el-button>
            <el-button v-on:click='showModelTable()' class=button-style>模型诊断</el-button>

          </el-container>
          <el-date-picker
            v-if="historyTableShow"
            v-model="screenDateTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd HH:mm:ss">
          </el-date-picker>
        </el-row>
        <el-row>
          <el-table
            border
            :header-cell-style="GLOBAL.elHeaderStyle"
            :data="liveAlarmTableData"
            v-show="aliveTableShow"
            style="width: 100%"
            max-height="450">
            <el-table-column
              label="异常状态"
              width="100"
              align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="acknowledgeAlarm(scope.$index, scope.row)"
                  :disabled="scope.row['AckedState/Id']">{{ scope.row['AckedState/Id'] | translate }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="锅炉类型"
              width="90"
              align="center">
              <template slot-scope="scope">
                {{ "水煤浆锅炉" }}
              </template>
            </el-table-column>
            <el-table-column
              label="报警路径"
              width="240"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.DeviceName | deleteSlash }}
              </template>
            </el-table-column>
            <el-table-column
              label="报警内容"
              width="120"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.Message | getMessage }}
              </template>
            </el-table-column>
            <el-table-column
              label="异常现象"
              width="auto"
              align="center">
              <template slot-scope="scope">
                {{ scope.row['abnorma_detail'] }}
              </template>
            </el-table-column>
            <el-table-column
              label="异常原因"
              width="200"
              align="center">
              <template slot-scope="scope">
                <el-table
                  :data="scope.row['reason_dp']"
                  :show-header="false"
                  style="width: 100%;"
                  border
                  :default-expand-all="true">
                  <el-table-column
                    type="index"
                    width="200">
                    <template slot-scope="props">
                      <span>{{ props.row | getReason }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              label="诊断处理"
              width="500"
              align="center">
              <template slot-scope="scope">
                <el-table
                  :data="scope.row['jun_method']"
                  :show-header="false"
                  style="width: 100%;"
                  border
                  :default-expand-all="true">
                  <el-table-column
                    type="index"
                    width="500">
                    <template slot-scope="props">
                      <span>{{ props.row | getMethod }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              label="报警时间"
              width="100"
              align="center"
              prop="ReceiveTime">
              <template slot-scope="scope">
                <span>{{ scope.row['ReceiveTime'] | formatDate }}</span>
              </template>
            </el-table-column>
          </el-table>

          <el-table
            border
            :header-cell-style="GLOBAL.elHeaderStyle"
            :data="alarmEventData"
            v-show="historyTableShow"
            style="width: 100%"
            max-height="450">
            <el-table-column
              label="异常状态"
              width="100"
              align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="acknowledgeAlarm(scope.$index, scope.row)"
                  :disabled="scope.row['AckedState/Id']">{{ scope.row['AckedState/Id'] | translate }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="锅炉类型"
              width="90"
              align="center">
              <template slot-scope="scope">
                {{ "水煤浆锅炉" }}
              </template>
            </el-table-column>
            <el-table-column
              label="报警路径"
              width="240"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.DeviceName | deleteSlash }}
              </template>
            </el-table-column>
            <el-table-column
              label="报警内容"
              width="120"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.Message | getMessage }}
              </template>
            </el-table-column>
            <el-table-column
              label="异常现象"
              width="auto"
              align="center">
              <template slot-scope="scope">
                {{ scope.row['abnorma_detail'] }}
              </template>
            </el-table-column>
            <el-table-column
              label="异常原因"
              width="200"
              align="center">
              <template slot-scope="scope">
                <el-table
                  :data="scope.row['reason_dp']"
                  :show-header="false"
                  style="width: 100%;"
                  border
                  :default-expand-all="true">
                  <el-table-column
                    type="index"
                    width="200">
                    <template slot-scope="props">
                      <span>{{ props.row | getReason }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              label="诊断处理"
              width="500"
              align="center">
              <template slot-scope="scope">
                <el-table
                  :data="scope.row['jun_method']"
                  :show-header="false"
                  style="width: 100%;"
                  border
                  :default-expand-all="true">
                  <el-table-column
                    type="index"
                    width="500">
                    <template slot-scope="props">
                      <span>{{ props.row | getMethod }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              label="报警时间"
              width="100"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.ReceiveTime | formatDate }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-row v-show="modelTableShow">
            <el-col :span="2"><span style="float:left;">误差限</span></el-col>
            <el-col :span="4">
              <el-input style="margin-left: -50%" v-model="limitOfError" placeholder="±10%"></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top: 1%">
            <el-table
              border
              :header-cell-style="GLOBAL.elHeaderStyle"
              :data="modelEventData"
              v-show="modelTableShow"
              style="width: 100%"
              max-height="450">
              <el-table-column
                label="模型"
                align="center">
              </el-table-column>
              <el-table-column
                label="误差"
                align="center">
              </el-table-column>
              <el-table-column
                label="时间"
                align="center">
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
      </el-card>
    </el-container>
  </el-container>
</template>

<script>
  import {
    createMonitoreditem,
    createSubscription,
    getAlarmEvents,
    getBoilers,
    getHistoryAlarmKnowledge,
    getLiveAlarmStatus,
    getModelStatusInfos,
    getNodesByBrowsePath,
    getParas,
    getProjects,
    getTotalInfoNum,
    modelOnline,
    register,
    registerModel, requestAcknowledgeAlarm,
    train,
    deleteFaultWaringModel
  } from "../../api/faultWarning";

  import ChartComponent from "../../components/faultWarning/ChartComponent";
  import PredictionChart from "../../components/faultWarning/PredictionChart";
  import HistoryChart from "../../components/faultWarning/HistoryChart";
  import {queryCurrentRawValueByUri} from "../../api/effopt";
  import store from '../../store/index'

  export default {
    name: "FaultWarnings",
    components: {PredictionChart, ChartComponent, HistoryChart},
    data() {
      return {
        //*****************
        //获取token相关
        //*****************
        client_id: '',
        client_secret: '',
        grant_type: '',
        requestToken: '',
        //*****************
        //树相关
        //*****************
        getNodeToken: '',
        getNodeParam: '',
        mainProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled',
          isLeaf(data, node) {
            return node.level === 4;
          }
        },
        tmpNode: [],
        tmpResolve: [],
        //*****************
        //故障模型表相关
        //*****************
        boilerState: [],
        runBoilerIndex: '',
        projectSelection: '',
        projectSelectionOptions: [],
        boilersSelection: '',
        boilersSelectionOptions: [],
        parasSelection: '',
        parasSelectionOptions: [],
        realParamData: [],
        totalSize: 0,
        pageSize: 5,
        pageNum: 1,
        currentPage: 1,
        confirmDialogVisible: false,
        waitForDeleteModelId: 0,
        noId: [],
        dialogFormVisible: false,
        pickerOptions0: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: '',
        startTime: '',
        endTime: '',
        dialogMessage: [],
        //*****************
        //图相关
        //*****************
        totalChartSize: 0,
        chartPageSize: 1,
        currentChartPage: 1,
        currentPageChart: [],
        //*****************
        //异常表相关
        //*****************
        subscriptionId: "",
        websocketUrl: "",
        limitOfError: "",
        liveAlarmTableData: [],
        alarmEventData: [],
        modelEventData: [],
        historyAlarmDataTest: [],
        historyAlarmKnowledgeData: [],
        historyAlarmKnowledgeDataTest: [],
        historyTableShow: false,
        aliveTableShow: true,
        modelTableShow: false,
        //*****************
        //报警时间筛选相关
        //*****************
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        //时间选择器绑定的值
        screenDateTime: "",

      }
    },
    /**
     * 监视器-监视日期时间选择器的变化
     */
    watch: {
      screenDateTime() {
        this.selectTimeHistoryAlarm();
      },
      value1() {
        this.selectTimeHistoryChart();
      }
    },
    /**
     * 过滤器-用于对要显示的结果进行过滤
     */
    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? ('0' + month) : month;
        let day = date.getDate();
        day = day < 10 ? ('0' + day) : day;
        let hours = date.getHours();
        hours = hours < 10 ? ('0' + hours) : hours;
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? ('0' + minutes) : minutes;
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? ('0' + seconds) : seconds;
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      },
      getCode: function (message) {
        return (message || '').split(', ')[0];
      },
      getMessage: function (message) {
        if (message === "恢复正常") {
          return "恢复正常"
        } else {
          return (message || '').split(', ')[1];
        }
      },
      translate: function (boolean) {
        if (boolean === false) {
          return "确认";
        } else if (boolean === true) {
          return "已确认";
        }
      },
      getReason: function (reason) {
        return reason[0] + " (概率: " + reason[1] + "%)";
      },
      getMethod: function (method) {
        return method[0];
      },
      deleteSlash: function (slash) {
        return slash.replace("Projects/", "");
      }
    },
    created() {
      ///获取当前登录用户，判断用户是否登录
      // let u = store.dispatch("loadUser")
      let u = this.$store.getters.user
    },
    async mounted() {
      document.documentElement.scrollTop = 0;
      //锅炉运行状态uri(分别是1,2,3号)
      this.boilerStateUri =
        [
          "/Project_XCYW/72be3a8b-c7ad-4d96-8a69-ff4c84c220b1",
          "/Project_XCYW/68918245-9202-4a51-82a3-4db09f88091c",
          "/Project_XCYW/f9e5d2d9-2c03-4f90-bb6f-7eb24f57b0b0"
        ];
      //初始化连接websocket
      this.startLink();
      //获取实时报警
      this.startQueryLiveAlarm();
      //获取所有事件
      this.queryAllAlarmEvents();
      //初始化页面时获取用户令牌以及树节点
      this.client_id = "GLYFX";
      this.client_secret = "9ddfd71b-1afe-11a2-9321-b03c30700485";
      this.grant_type = "client_credentials";
      await this.UserRegister();
      this.initProjectSelection();
      this.initParasSection();
      this.refreshTableAndGetUriSet();
      this.refreshChart();

      this.intervalId = setInterval(this.refreshStatusTable, 5000);
      this.intervalId1 = setInterval(this.initProjectSelection, 5000);
    },
    beforeDestroy() {
      clearInterval(this.intervalId);
      clearInterval(this.intervalId1);
    },

    methods: {
      //获取用户令牌
      async UserRegister() {
        this.getBoilerState();
        const params = new URLSearchParams({
          client_id: this.client_id,
          client_secret: this.client_secret,
          grant_type: this.grant_type
        });
        await register(params).then((res) => {
          if (res) {
            //存放令牌
            this.requestToken = res.data.token_type + " " + res.data.access_token;
          }
          //拿到令牌后通过客户端模式访问资源
          this.getNodeToken = this.requestToken;//(token)
        });
      },
      /**
       * 树相关
       */
      //懒加载
      loadNode(node, resolve) {
        this.node = node
        console.log(node);
        if (node.level === 0) {
          return resolve([{name: "故障预警树", uri: "root"}]);
        }

        if (node.level === 1) {
          this.tmpNode = node;
          this.tmpResolve = resolve;
          this.getNodeParam = {
            "depth": 1,
            "forward": true,
            "id": "6122e000ba3fd029798b2ebd"
          };
        } else if (node.level === 4) {
          return resolve([])
        } else {

          // console.log(this.node.data.name);
          this.getNodeParam = {
            "depth": 1,
            "forward": true,
            "id": node.data.uri.split("/")[2]
          };
        }

        getNodesByBrowsePath(this.getNodeToken, this.getNodeParam).then((res) => {
          if (res) {
            // console.log('resNode', res);
            let tmp = res.data.result[0];
            tmp.children = tmp.children.filter(item => {
              return item.uri.substring(0, 8) === '/Project'
            }).map(item => {
              item.disabled = this.uriSet.has(item.uri);
              return item
            }).sort((a, b) => a.name.localeCompare(b.name, 'en'));

            return resolve(tmp.children)
          }
        });
      },
      //刷新表格，获取表格中所有已有的uri
      async refreshTableAndGetUriSet() {
        this.uriSet = new Set();
        await this.refreshStatusTable();
        let param = {
          page: 1,
          size: this.totalSize
        };

        await getModelStatusInfos(param).then((res) => {
          if (res) {
            res.data.forEach(x => this.uriSet.add(x.uri));
          }
        });

      },

      //注册节点
      async registerNode(node) {
        let tree = this.$refs.tree;
        node.data.disabled = true;
        tree.setChecked(node.data, false, false);
        let parentNode = node.parent;
        let boilerName = parentNode.data.name;
        let projectName = parentNode.parent.data.name;
        let paraName = node.data.name;
        let nodeParam = {
          "depth": 2,
          "forward": true,
          "id": node.data.uri.split("/")[2]
        };
        // console.log(nodeParam)
        await getNodesByBrowsePath(this.getNodeToken, nodeParam).then((res) => {
          if (res) {
            let nodes = res.data.result[0].children;
            let nodesDict = {};
            for (let item of nodes) {
              nodesDict[item.name] = item;
            }
            let boilerStateUri = [];
            boilerStateUri.push(nodesDict["锅炉运行状态"].uri);
            let boilerState = 0;
            queryCurrentRawValueByUri(boilerStateUri).then((res) => {
              if (res) {
                boilerState = res.data.result[0].v;
                let writeBack = [];
                if (node.data.name.indexOf('盘管') !== -1) {
                  writeBack = [
                    {prediction: node.data.uri + "/" + nodesDict["预测值1"].properties.BrowseName},
                    {prediction: node.data.uri + "/" + nodesDict["预测值2"].properties.BrowseName},
                    {prediction: node.data.uri + "/" + nodesDict["预测值3"].properties.BrowseName},
                    {prediction: node.data.uri + "/" + nodesDict["预测值4"].properties.BrowseName},
                    {prediction: node.data.uri + "/" + nodesDict["预测值5"].properties.BrowseName},
                    {prediction: node.data.uri + "/" + nodesDict["预测值6"].properties.BrowseName},
                    {prediction: node.data.uri + "/" + nodesDict["预测值7"].properties.BrowseName},
                    {prediction: node.data.uri + "/" + nodesDict["预测值8"].properties.BrowseName},
                    {prediction: node.data.uri + "/" + nodesDict["预测值9"].properties.BrowseName},
                    {prediction: node.data.uri + "/" + nodesDict["预测值10"].properties.BrowseName}
                  ];
                } else {
                  let writeUri = {
                    prediction: node.data.uri + "/" + nodesDict["预测值"].properties.BrowseName
                  }
                  writeBack[0] = writeUri
                }
                // console.log('writeBack', writeBack);
                let children = nodesDict["关键参数"].children;
                let uris = [];
                for (let i = 0; i < children.length; i++) {
                  let uri = children[i].uri;
                  if (uri.substring(0, 8) !== '/Project') {
                    continue
                  }
                  let element = {
                    name: children[i].name,
                    uri
                  };
                  uris.push(element)
                }
                // console.log(uris);

                let param = {
                  "node_uri": node.data.uri,
                  "write_back": writeBack,
                  "uris": uris,
                  "window_size": 300000,
                  "project_name": projectName,
                  "boiler_name": boilerName,
                  "para_name": paraName,
                  "boilerState": boilerState
                };
                // console.log(param)
                registerModel(param).then((res) => {
                  if (res) {
                    this.refreshTableAndGetUriSet();
                    // console.log(res.data)
                  }
                })
              }
            })
          }
        });
        this.initProjectSelection();
        this.refreshStatusTable();
      },
      /**
       * 查询锅炉工作状态
       *
       */
      getBoilerState() {
        queryCurrentRawValueByUri(this.boilerStateUri).then((res) => {
          if (res) {
            for (let i = 0; i < res.data.result.length; i++) {
              this.boilerState.push(res.data.result[i].v)
            }
            for (let i = 0; i < this.boilerState.length; i++) {
              if (this.boilerState === 1) {
                this.runBoilerIndex = i + 1;
              }
            }
          }
        })
      },
      //确定按钮，生成并训练选中节点的模型
      async registerModels() {
        let tree = this.$refs.tree;
        // console.log('tree', tree);
        for (let key of tree.getCheckedKeys()) {
          let node = tree.getNode(key);
          if (node.level === 4) {
            // console.log('node',node);
            await this.registerNode(node);
          }
        }
        this.initProjectSelection();
        this.refreshStatusTable();
      },
      /**
       * 故障模型表格相关
       */
      initProjectSelection() {
        getProjects().then(res => {
          if (res) {
            this.projectSelectionOptions = res.data;
            // console.log(res);
          }
        })
      },
      clearProjectSelection() {
        this.boilersSelection = '';
        this.refreshStatusTable();
        this.refreshChart();
      },
      projectSelectionChange() {
        this.initBoilersSelection();
        this.refreshStatusTable();
        this.refreshChart();
      },
      selectionChange() {
        this.refreshStatusTable();
        this.refreshChart();
      },
      initBoilersSelection() {
        getBoilers({project_id: this.projectSelection}).then(res => {
          if (res) {
            this.boilersSelectionOptions = res.data;
            // console.log(res);
          }
        })
      },
      initParasSection() {
        getParas().then(res => {
          if (res) {
            this.parasSelectionOptions = res.data;
          }
        })
      },
      dialogHistory(row) {
        console.log("row", row)
        this.dialogFormVisible = true;
        this.dialogMessage = row;
        this.startTime = '';
        this.endTime = '';
        this.value1 = '';
      },
      selectTimeHistoryChart() {
        this.startTime = new Date(this.value1[0]).getTime();
        this.endTime = new Date(this.value1[1]).getTime();
        /*console.log(this.startTime);
        console.log(this.endTime);*/
      },
      onSubmit() {
        this.startTime = '';
        this.endTime = '';
        this.value1 = '';
      },

      /**
       * 表格行点击事件
       */
      clickTr(row, event, column) {
        if (row.boilerState === false) {
          this.$message('锅炉未运行，不可进行查看');
        }
      },
      //刷新表格
      async refreshStatusTable() {
        let filter = {
          project_id: this.projectSelection,
          boiler_id: this.boilersSelection,
          para_id: this.parasSelection
        }
        let totalInfoParam = {
          filter
        }
        // console.log(totalInfoParam);
        await getTotalInfoNum(totalInfoParam).then((res) => {
          if (res) {
            // console.log(res);
            this.totalSize = res.data;
          }
        });

        //获取表格数据
        let param = {
          page: this.currentPage,
          size: this.pageSize,
          filter
        };
        await getModelStatusInfos(param).then((res) => {
          if (res) {
            this.noId = [];
            for (let i = 0; i < this.boilerState.length; i++) {
              if (res.data.length === 0) {
                this.realParamData = [];
              } else {
                for (let j = 0; j < res.data.length; j++) {
                  //如果某个锅炉在运行
                  if (this.boilerState[i] === 1) {
                    //判断模型中锅炉名称是否含有锅炉号
                    if (res.data[j].boilerName.indexOf(i + 1) !== -1) {
                      //有则置0
                      this.noId.push(0)
                    } else {
                      //无则置1
                      this.noId.push(1);
                    }
                    console.log('res.data', res.data);
                    this.realParamData = res.data;
                  }
                }
              }
            }

          }
        });
      },
      //训练模型
      trainModel(row) {
        let param = {
          model_id: row.modelId
        };
        train(param).then((res) => {
          if (res) {
            // console.log(res.data);
          }
        })
      },
      //上线
      online(row) {
        // console.log(row);
        //上下线传模型id
        let param = {
          "id": row.modelId,
          "to_online": row.onlineState
        };
        // console.log(param)
        modelOnline(param).then((res) => {
          if (res) {
            // console.log(res.data)
            this.refreshChart()
          }
        });
      },


      /**
       * 删除模型
       */
      deleteModel(row) {
        this.confirmDialogVisible = true;
        this.waitForDeleteModelId = row.modelId;

      },

      doDeleteModel() {
        this.confirmDialogVisible = false;
        let param = {
          model_id: this.waitForDeleteModelId
        };
        deleteFaultWaringModel(param).then(res => {
          if (res) {
            this.$message({
              message: '已删除',
              type: "success"
            });
            this.refreshTableAndGetUriSet();
            this.refreshTree();
            this.refreshChart();
          }
        })

      },

      /**
       * 刷新树
       */
      refreshTree() {
        this.loadNode(this.tmpNode, this.tmpResolve);
        this.refreshStatusTable();
      },

      /**
       * 画图相关
       */
      async refreshChart() {
        let filter = {
          project_id: this.projectSelection,
          boiler_id: this.boilersSelection,
          para_id: this.parasSelection,
          status: true
        };
        let totalParam = {
          filter
        };
        await getTotalInfoNum(totalParam).then((res) => {
          if (res) {
            // console.log(res);
            this.totalChartSize = res.data;
          }
        });

        let param = {
          page: this.currentChartPage,
          size: this.chartPageSize,
          filter
        };
        await getModelStatusInfos(param).then((res) => {
          if (res) {
            this.currentPageChart = res.data;
          }
        });
      },
      /**
       * 建立websocket连接
       */
      startLink() {
        createSubscription({}).then((res) => {
          if (res) {
            // console.log(res);
            this.subscriptionId = res.data.result.subscriptionId;
            this.websocketUrl = res.data.result.websocketUrl;
            // console.log(this.subscriptionId);
            createMonitoreditem({subscriptionId: this.subscriptionId}, [
              {
                "nodeUri": "/Project_XCGLDSJFX/6124a64fba3fd029798b3bd6",
              }
            ]).then((resp) => {
              if (resp) {
                // console.log(resp);
                const ws = new WebSocket("wss://model-xianchuang123-xcyw.xcgfcloud.com.cn/san" + this.websocketUrl);
                ws.addEventListener('open', this.handleWsOpen.bind(this), false);//（this）是绑定给vue组件的this给ws
                ws.addEventListener('close', this.handleWsClose.bind(this), false);
                ws.addEventListener('error', this.handleWsError.bind(this), false);
                ws.addEventListener('message', this.handleWsMessage.bind(this), false);
              }
            })
          }
        })
      },
      handleWsOpen(e) {
        // console.log('FE: WebSocket open', e);
      },
      handleWsClose(e) {
        // console.log('FE: WebSocket close', e);
      },
      handleWsError(e) {
        // console.log('FE: WebSocket error', e);
      },
      handleWsMessage(e) {
        let obj = JSON.parse(e.data);
        let lastObj = JSON.parse(obj.body);
        // console.log("^^^^^^^", lastObj);
        const stringMessage = lastObj["Message"].split(',')[0];
        // console.log(stringMessage);
        if (stringMessage === "恢复正常") {
        } else {
          //通过报警码查询知识库
          getHistoryAlarmKnowledge({
            "abnorma": stringMessage,
          }).then((resp) => {
              if (resp) {
                //返回的知识库对象
                const knowledgeObj = JSON.parse(JSON.stringify(resp.data));
                //将知识库对象写入历史报警对象中
                for (let item in knowledgeObj) {
                  lastObj[item] = knowledgeObj[item];
                }
                this.liveAlarmTableData.unshift(lastObj);
              }
            }
          )
        }
      },
      /**
       * 实时报警查询
       */
      startQueryLiveAlarm() {
        this.liveAlarmTableData = [];
        getLiveAlarmStatus({
          "subscrption": {
            "filter": [
              {
                "field": "DeviceId",
                "operator": "InList",
                "value": [
                  "/Project_XCGLDSJFX/6124a64fba3fd029798b3bd6",
                ]
              }
            ],
            "parameter": {
              "maxSizePerPublish": 100
            }
          }
        }).then((resp) => {
            if (resp) {
              this.handleResponse(resp);
            }
          }
        )
      },
      /**
       * 通过时间筛选历史报警
       */
      selectTimeHistoryAlarm() {
        const startTimeStamp = new Date(this.screenDateTime[0]).getTime();
        const endTimeStamp = new Date(this.screenDateTime[1]).getTime();
        this.alarmEventData = [];
        getAlarmEvents({
          "endTime": startTimeStamp,
          "filter": [
            {
              "field": "DeviceId",
              "operator": "InList",
              "value": [
                "/Project_XCGLDSJFX/6124a64fba3fd029798b3bd6"
              ]
            }
          ],
          "startTime": endTimeStamp,
        }).then((resp) => {
          // console.log(resp.data.continuationPoint);
          //事件总条数
          const totalHits = resp.data['totalHits'];
          //请求最新的30条数据
          this.queryPageAlarmEvents(0);
        })


      },
      /**
       * JSON返回数据处理
       */
      handleResponse(res) {
        this.alarmEventData = [];
        this.liveAlarmTableData = [];
        this.queryHistoryAlarmKnowledge(res);
        this.queryLiveAlarmKnowledge(res);
      },

      /**
       * 显示实时表格
       */
      showAliveTable() {
        this.historyTableShow = false;
        this.aliveTableShow = true;
        this.modelTableShow = false;
        this.startQueryLiveAlarm();
      },
      /**
       * 显示历史表格
       */
      showEventsTable() {
        this.historyTableShow = true;
        this.aliveTableShow = false;
        this.modelTableShow = false;
        this.queryAllAlarmEvents();
      },
      /**
       * 显示模型表格
       */
      showModelTable() {
        this.historyTableShow = false;
        this.aliveTableShow = false;
        this.modelTableShow = true;
      },
      /**
       * 通过报警信息查询知识库
       */
      queryHistoryAlarmKnowledge(res) {
        //historyObj是返回的所有的历史报警的数组
        let historyObj = res.data.result;
        // console.log(historyObj);
        //遍历每一个历史报警对象
        for (let historyObjKey in historyObj) {
          const historyItem = JSON.parse(historyObj[historyObjKey]);
          const stringMessage = historyItem["Message"].split(',')[0];
          //拿到报警确认的状态,只显示已确认的报警
          const isAcknowledge = historyItem["AckedState/Id"]
          // console.log(stringMessage);
          if (stringMessage === "恢复正常") {
            // console.log("以下是恢复正常的报警，不添加到表格中");
            // console.log(historyItem);
          } else if (isAcknowledge) {
            //通过报警码查询知识库
            getHistoryAlarmKnowledge({
              "abnorma": stringMessage,
            }).then((resp) => {
                if (resp) {
                  //返回的知识库对象
                  const knowledgeObj = JSON.parse(JSON.stringify(resp.data));
                  //将知识库对象写入历史报警对象中
                  for (let item in knowledgeObj) {
                    historyItem[item] = knowledgeObj[item];
                  }
                  // console.log(historyItem);
                  this.alarmEventData.unshift(historyItem);
                }
              }
            )
          } else {
            // console.log("该条报警未确认");
            // console.log(historyItem);
          }

        }

      },
      /**
       * 查询实时报警
       */
      queryLiveAlarmKnowledge(res) {
        //liveObj是返回的所有的实时报警的数组
        let liveObj = res.data.result;
        // console.log(liveObj);
        //遍历每一个实时报警对象
        for (let liveObjKey in liveObj) {
          const liveItem = JSON.parse(liveObj[liveObjKey]);
          const stringMessage = liveItem["Message"].split(',')[0];
          //拿到报警确认的状态,只显示未确认的报警
          const isAcknowledge = liveItem["AckedState/Id"]
          // console.log(stringMessage);
          if (stringMessage === "恢复正常") {
            // console.log("以下是恢复正常的报警，不添加到表格中");
            // console.log(liveItem);
          } else if (!isAcknowledge) {
            //通过报警码查询知识库
            getHistoryAlarmKnowledge({
              "abnorma": stringMessage,
            }).then((resp) => {
                if (resp) {
                  //返回的知识库对象
                  const knowledgeObj = JSON.parse(JSON.stringify(resp.data));
                  //将知识库对象写入历史报警对象中
                  for (let item in knowledgeObj) {
                    liveItem[item] = knowledgeObj[item];
                  }
                  // console.log(liveItem);
                  this.liveAlarmTableData.unshift(liveItem);
                }
              }
            )
          } else {
            // console.log("该条报警已确认");
            // console.log(liveItem);
          }
        }

      },

      /**
       * 确认报警
       */
      acknowledgeAlarm(index, message) {
        // console.log(message['AckedState/Id']);
        // console.log(message['id']);
        //使用带query的post请求
        requestAcknowledgeAlarm(
          {
            "id": message['id'],
            "clientUserId": "test"
          }
        ).then((resp) => {
          if (resp) {
            // console.log(resp);
            this.queryAllAlarmEvents();
            setTimeout(this.startQueryLiveAlarm, 700)
            this.$message(resp.data.result);
          }
        })

      },
      /**
       * 查询所有报警事件
       * The query interval shall not be greater than 60 days
       * the uri is Phase III of Wankai
       * 开始时间和结束时间对调，从后开始查询
       */
      queryAllAlarmEvents() {
        this.alarmEventData = [];
        getAlarmEvents({
          "endTime": new Date().getTime() - 1000 * 3600 * 24 * 60,
          "filter": [
            {
              "field": "DeviceId",
              "operator": "InList",
              "value": [
                "/Project_XCGLDSJFX/6124a64fba3fd029798b3bd6"
              ]
            }
          ],
          "startTime": new Date().getTime(),
        }).then((resp) => {
          // console.log(resp.data.continuationPoint);
          //事件总条数
          const totalHits = resp.data['totalHits'];
          // console.log(totalHits);
          //请求最新的30条数据
          this.queryPageAlarmEvents(0);
        })
      },
      /**
       * 通过续传点查询数据
       */
      queryPageAlarmEvents(point) {
        getAlarmEvents({
          "endTime": new Date().getTime() - 1000 * 3600 * 24 * 60,
          "filter": [
            {
              "field": "DeviceId",
              "operator": "InList",
              "value": [
                "/Project_XCGLDSJFX/6124a64fba3fd029798b3bd6"
              ]
            }
          ],
          "startTime": new Date().getTime(),
          "continuationPoint": point,
          "maxSize": 30
        }).then((resp) => {
          // console.log("进入此处为正确道路");
          //eventObj是返回的所有的报警事件的数组
          let eventObj = resp.data.result;
          // console.log(eventObj);
          //遍历每一个报警事件
          for (let eventObjItem in eventObj) {
            const eventItem = JSON.parse(eventObj[eventObjItem]);
            const stringMessage = eventItem["Message"].split(',')[0];
            //拿到报警确认的状态,只显示未确认的报警
            const isAcknowledge = eventItem["AckedState/Id"]
            // console.log(stringMessage);
            if (stringMessage === "恢复正常") {
              // console.log("以下是恢复正常的报警，不添加到表格中");
              // console.log(eventItem);
            } else if (isAcknowledge) {
              //通过报警信息(即报警码)查询知识库
              getHistoryAlarmKnowledge({
                "abnorma": stringMessage,
              }).then((resp) => {
                  if (resp) {
                    //返回的知识库对象
                    const knowledgeObj = JSON.parse(JSON.stringify(resp.data));
                    //将知识库对象写入历史报警对象中
                    for (let item in knowledgeObj) {
                      eventItem[item] = knowledgeObj[item];
                    }
                    // console.log(eventItem);
                    this.alarmEventData.unshift(eventItem);
                  }
                }
              )
            } else {
              // console.log("该条报警未确认");
              // console.log(eventItem);
            }
          }
        })
        // console.log(point);
        // console.log(typeof (point));


      }

    }
  }
</script>

<style scoped>
  /deep/ .button-style {
    background: -webkit-gradient(linear, 100% 0%, 0% 0%, from(#30ee5a), to(#07caf6));
    border-radius: 20px;
    color: #ffffff;
    margin-bottom: 25px;
    font-size: 12px;
    font-weight: bold;
  }
</style>
