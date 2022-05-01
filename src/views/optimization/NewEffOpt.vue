<template>
  <el-container style="padding: 24px">
    <el-aside style="width: 18%;">
      <el-card class="treeCard" style="height: 280px;">
        <el-scrollbar style="height: 180px;">
          <el-row>
            <el-tree
              class="flow-tree"
              :props="mainProps"
              :load="loadNode"
              node-key="uri"
              ref="tree"
              :highlight-current="true"
              lazy
              show-checkbox
            >
            </el-tree>
          </el-row>
          <el-row style="margin-top: 2%">
            <el-button style="float: right" type="primary" @click="registerModels">注册模型</el-button>
          </el-row>
        </el-scrollbar>
      </el-card>
      <el-row>
        <el-card class="calCard" style="height: 566px">
          <!--          </el-form>-->
          <el-empty description="请选择优化量" v-if="!clickRow"></el-empty>
          <el-header style="margin-left: -55%" v-if="clickRow">
            <el-row style="margin-top: 1%;"><h4>
              <span style="float: left;margin-left: 34%">{{chartTitle}}</span>
            </h4></el-row>
            <el-row style="margin-top: 1%;"><h4>修改主调参数上下限</h4></el-row>
          </el-header>
          <el-form
            :model="control_range"
            :rules="optMainParamsRules"
            :id="formId"
            ref="control_range"
            label-position="right"
            label-width="80px"
            v-if="clickRow"
            style=""
          >
            <el-form-item
              v-for="keyItem in Object.keys(control_range)"
              :key="keyItem"
              style="margin-bottom: 60px"
            >
              <span slot="label">{{keyItem}}</span>
              <el-input
                v-model="control_range[keyItem]">
              </el-input>
            </el-form-item>
          </el-form>
          <el-row type="flex" justify="end">
            <el-col :span="6">
              <el-button
                @click="getOptEfficiency(control_range,'control_range')"
                type="primary"
                v-if="clickRow"
                style="">
                提交
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
      <el-row>
      </el-row>
    </el-aside>
    <el-container class="middleContainer" direction="vertical" style="width: 50%">

      <el-card class="modelCard" style="height: 280px;width: 100%">
        <el-row>
          <el-table
            :header-cell-style="GLOBAL.elHeaderStyle"
            :border="true"
            :data="optModelData"
            style="font-size: 13.5px;width: 100%;"
            height="160"
            @row-click="clickTr"
          >
            <el-table-column
              fixed="left"
              prop="modelId" label="模型id" align="center" width="60px"></el-table-column>
            <el-table-column prop="projectName" label="项目名称" align="left"></el-table-column>
            <el-table-column prop="boilerName" label="锅炉名称" align="left"></el-table-column>
            <el-table-column prop="optNumber" label="优化量" align="left"></el-table-column>

            <el-table-column prop="trainingState" label="训练状态" align="left">
              <template v-slot="{row}">
                <el-switch
                  v-model="row.trainingState"
                  :disabled="!row.boilerState"
                  @change="trainModel(row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="onLineState" label="上线状态" align="left">
              <template v-slot="{row}">
                <el-switch v-model="row.onLineState"
                           v-show="row.optNumber.indexOf('效率')!==-1"
                           :disabled="!row.boilerState || row.trainingState"
                           @change="onLineModel(row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="opt" label="操作" align="center">
              <template v-slot="{row}">
                <el-button
                  @click="optimization(row)"
                  type="text"
                  :disabled="!row.boilerState"
                >优化
                </el-button>
                <el-button type="text" @click="deleteModel(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
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
        <div class="block">
          <el-pagination
            @size-change="refreshStatusTable"
            @current-change="refreshStatusTable"
            :current-page.sync="currentPage"
            :page-sizes="[2, 3, 4, 5]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </div>
      </el-card>
      <!--得分环-->
      <!--        <el-card class="ring-outer" style="height: 300px">-->
      <el-card class="ring-outer" style="height: 200px;width: 100%">
        <RingGaugeChart
          v-if="hasParamValue"
          :id="chartModelId"
          :chartTitle="chartTitle"
          :before-value="beforeOptimize"
          :current-value="currentOptimize"
          :target-value="targetOptimize"
        ></RingGaugeChart>
      </el-card>
      <el-card class="bar-outer" style="height:350px; width: 100%">
        <el-row>
          <el-table
            :data="calEffTableData"
            :header-cell-style="GLOBAL.elHeaderStyle"
            :border="true"
            style="font-size: 13.5px;width: 100%"
          >
            <!--            <el-table-column label="效率" prop="name" width="50px"></el-table-column>-->
            <el-table-column
              fixed
              prop="name"
              label="效率"
              width="50px"
            >
            </el-table-column>
            <el-table-column label="模型id" width="70px" prop="model_id">
              <template v-slot="{row}">
                <el-select v-model="row.model_id" placeholder=" " :disabled="inputDisabled">
                  <el-option
                    v-for="item in effFormModelIdOptions"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="气体不完全燃烧损失" prop="gas_burn_loss">
              <template v-slot="{row}">
                <el-input v-model="row.gas_burn_loss" :disabled="inputDisabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="固体不完全燃烧损失" prop="solid_burn_loss">
              <template v-slot="{row}">
                <el-input v-model="row.solid_burn_loss" :disabled="inputDisabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="散热损失" prop="heat_loss">
              <template v-slot="{row}">
                <el-input v-model="row.heat_loss" :disabled="inputDisabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="灰渣热损失" prop="ash_heat_loss">
              <template v-slot="{row}">
                <el-input v-model="row.ash_heat_loss " :disabled="inputDisabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="冷空气理论热焓" prop="air_theory_enthalpy">
              <template v-slot="{row}">
                <el-input v-model="row.air_theory_enthalpy" :disabled="inputDisabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="低位发热量" prop="low_calorific_value">
              <template v-slot="{row}">
                <el-input v-model="row.low_calorific_value" :disabled="inputDisabled"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="opt"
              align="left"
            >
              <template v-slot="{row}">
                <el-button
                  @click="show()"
                  type="text"
                  v-show="row.name!=='实际效率' && inputDisabled"
                  :disabled="!inputDisabled"
                  style="display:block;margin:0 auto"
                >编辑
                </el-button>
                <el-button :disabled="inputDisabled"
                           @click="calEfficiency(row)"
                           type="text"
                           v-show="row.name!=='实际效率' && !inputDisabled"
                           style="display:block;margin:0 auto">
                  提交
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-card>
    </el-container>
    <el-container class="rightContainer" direction="vertical" style="width: 42%">
      <el-card class="preCard" style="height: 436px;">
        <el-empty
          description="未优化"
          v-if="!optimized"
        ></el-empty>
        <el-row v-if="optimized && optParamReady">
          <el-col :span="10">
            <span style="float: left">{{this.tableTitle}}</span>
          </el-col>
          <el-col :span="4">
            <el-input style="font-size: 16px" v-model="switchStatue"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button style="float: right" type="primary" @click="switchModel()">手/自动切换</el-button>
          </el-col>
          <el-col :span="4">
            <el-button style="margin-right: 10%" type="primary" @click="transParam()">参数下传</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-tabs
            v-model="activeChartName"
            style="width: 100%"
            v-if="optimized && difference != null"
            @tab-click="handleTabsClick"
          >
            <el-tab-pane label="柱状图" name="bar" lazy>
              <BarChart
                @difference="diff"
                ref="bar"
                v-if="optimized && optParamReady && isBarUpdate1"
                :id="chartModelId"
                :key="chartModelId"
                :chart-title="'主调参数优化目标'"
                :control-aim="controlAim"
                :control-para-name="controlParaName"
                :control-uri="controlUri"
              ></BarChart>
            </el-tab-pane>
            <el-tab-pane label="雷达图" name="radar" lazy>
              <RadarChart
                ref="radar"
                :id="chartModelId"
                :key="chartModelId"
                v-if="optimized && optParamReady && isRadarUpdate1"
                :chartTitle="'优化目标参数雷达图'"
                :control-aim="controlAim"
                :control-para-name="controlParaName"
                :control-uri="controlUri"
              >
              </RadarChart>
            </el-tab-pane>
            <el-tab-pane label="优化建议" name="optSuggestion" lazy>
              <el-row
                v-for="(item,index) in controlParaName"
                :key="index"
                :id="chartModelId"
                v-if="optimized && optParamReady"
              >
                <el-col :span="6" style="font-size: 22px">
                  {{item}}
                </el-col>
                <el-col :span="8" style="font-size: 22px">
                  优化前后的变化：
                </el-col>
                <el-col :span="4" style="font-size: 24px">
                  {{difference[index]}}
                </el-col>
                <el-col v-if="difference[index] > 0" :span="6">
                  <img src="../../../public/static/image/up.png" style="height: 24px;width: 24px;">
                </el-col>
                <el-col v-else="difference[index] > 0" :span="6">
                  <img src="../../../public/static/image/down.png" style="height: 24px;width: 24px;">
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-card>
      <el-card class="line-outer" style="height:410px">

        <el-empty description="实时效率图" v-if="selectedRowUri === ''"></el-empty>
        <el-row v-if="selectedRowUri=== 1 ">
          <span style="float: left">{{this.chartTitle}}</span>
        </el-row>
        <el-row>
          <el-tabs
            v-model="activeChartName2"
            style="width: 100%"
            v-if="selectedRowUri=== 1 && uriReady"
            @tab-click="handleTabsClick"
          >
            <el-tab-pane label="效率负荷图" name="line" lazy>
              <EffChart
                ref="line"
                @currentEffValue="parentFn"
                v-if="uriReady && selectedRowUri===1"
                :id="effChartId"
                :uri="writeBackUri"
                :chargeUri="boilerChargeUri"
                :transTarget="transTarget"
                :chartTitle="chartTitle"
              ></EffChart>
            </el-tab-pane>
            <el-tab-pane label="负荷效率优化图" name="opt" lazy>
              <LoadEffOptChart
                v-if="uriReady && selectedRowUri===1"
                ref="opt"
                :id="loadEffOptChartId"
                :transToLoadChartLoad="transToLoadChartLoad"
                :transToLoadChartEff="transToLoadChartEff"
              ></LoadEffOptChart>
            </el-tab-pane>
            <el-tab-pane label="负荷燃料优化图" name="fuel" lazy>
              <LoadFuelOptChart
                v-if="uriReady && selectedRowUri===1"
                ref="fuel"
                :id="loadFuelOptChartId"
                :transToLoadChartLoadFuel="transToLoadChartLoadFuel"
                :transToLoadChartFuel="transToLoadChartFuel"
              ></LoadFuelOptChart>
            </el-tab-pane>
          </el-tabs>
        </el-row>

      </el-card>
    </el-container>
  </el-container>

</template>

<script>
  import {getNodesByBrowsePath, register, queryHistoryRawValueByUri, getModelStatusInfos} from "../../api/faultWarning";
  import {
    getCurrentEfficiency,
    getOptimalEfficiency,
    queryCurrentRawValueByUri,
    getOptModelsInfo,
    getEfficiency,
    train,
    getOwnOptimalEfficiency,
    registerOptModel,
    onlineEfficiency,
    getOptimalCost,
    getOptimalEco,
    getFilteredModelInfoByModelId,
    deleteOptModel
  } from "../../api/effopt";
  import BarChart from "../../components/optimization/BarChart";
  import RadarChart from "../../components/optimization/RadarChart";
  import LineChart from "../../components/optimization/LineChart";
  import RingGaugeChart from "../../components/optimization/RingGaugeChart";
  import EffChart from "../../components/optimization/EffChart"
  import LoadEffOptChart from "../../components/optimization/LoadEffOptChart"
  import LoadFuelOptChart from "../../components/optimization/LoadFuelOptChart";

  export default {
    name: "NewEffOpt",
    components: {LoadFuelOptChart, BarChart, RadarChart, LineChart, RingGaugeChart, EffChart, LoadEffOptChart},
    data() {
      return {
        switchStatue:'手动模式',
        //************************
        //*********判断锅炉是否在运行***********
        //************************
        boilerStateUri: [],
        boilerState: [],

        //************************
        //*********树相关***********
        //************************
        //获取令牌
        client_id: '',
        client_secret: '',
        grant_type: '',
        requestToken: '',
        getNodeToken: '',
        getNodeParam: '',
        //树
        mainProps: {
          children: 'children',
          label: 'name',
          isLeaf(data, node) {
            return node.level === 4;
          }
        },
        //点击树节点使用的量
        getTableNodeParam: '',
        namesForSecondTable: [],
        urisForSecondTable: [],
        unitForSecondTable: [],
        tmpNode: [],
        tmpResolve: [],

        //显示控制
        optimized: false,
        activeName: "first",
        chartTitle: '',

        //************************
        //*******环状图相关***********
        //************************
        //环状图
        circle1: false,
        circle2: false,
        circle3: false,
        hasParamValue: false,

        isBarUpdate1: true,
        isRadarUpdate1: false,
        beforeOptimize: 0.00,
        currentOptimize: 0.00,
        targetOptimize: 0.00,
        targetOptimizeArray: [],
        transTarget: [],
        transToLoadChartLoad: 0.00,
        transToLoadChartLoadFuel: 0.00,
        transToLoadChartEff: 0.00,
        transToLoadChartFuel: 0.00,
        //************************
        //*******柱状图相关***********
        //************************
        activeChartName: 'bar',
        activeChartName2: 'line',
        controlParas: {},
        mainControl: [],
        controlUri: [],
        chartModelId: 0,
        optParamReady: false,

        dialogVisible: false,
        // optNum: 5,
        // optEfficiency: 2,

        //************************
        //*******雷达图相关***********
        //************************
        // 雷达图
        controlAim: [],
        controlCurrent: [],
        controlParaName: [],
        optimal: 0,
        difference: [],

        tableTitle: '',

        //************************
        //*******右侧表格相关***********
        //************************
        currentRowUri: null,
        afterOptTableData: [],
        valueShow: false,
        stateShow: false,
        image: '',
        currentParams: [],
        defaultPreUri: '',

        //************************
        //*****优化模型表相关********
        //************************
        optModelData: [],
        projectSelection: '',
        projectSelectionOptions: [],
        boilersSelection: '',
        boilersSelectionOptions: [],
        parasSelection: '',
        parasSelectionOptions: [],
        realParamData: [],
        totalSize: 0,
        pageSize: 3,
        pageNum: 1,
        currentPage: 1,
        allModel: [],
        noId: [],
        confirmDialogVisible: false,
        waitForDeleteModelId: 0,
        //************************
        //*****效率计算表单相关********
        //************************
        control_range: [],
        controlForm: {
          controlMain: {
            controlName: [],
            controlPlaceHolder: [],
            controlLimit: []
          },

        },

        calInput: [],
        inputDisabled: true,
        calEffTableData: [{
          name: '实际效率',
          model_id: '',
          gas_burn_loss: 0.3,
          solid_burn_loss: 2.5,
          heat_loss: 1,
          ash_heat_loss: 0.232,
          air_theory_enthalpy: 177.534,
          low_calorific_value: 17556.091
        },
          {
            name: '设计效率',
            model_id: '',
            gas_burn_loss: 0.3,
            solid_burn_loss: 2.5,
            heat_loss: 1,
            ash_heat_loss: 0.232,
            air_theory_enthalpy: 177.534,
            low_calorific_value: 17556.091
          }],
        efficiencyForm: {
          gas_burn_loss: 0.3,
          solid_burn_loss: 2.5,
          heat_loss: 1,
          ash_heat_loss: 0.232,
          air_theory_enthalpy: 177.534,
          low_calorific_value: 17556.091
        },
        designEfficiencyForm: {
          gas_burn_loss: 0.3,
          solid_burn_loss: 2.5,
          heat_loss: 1,
          ash_heat_loss: 0.232,
          air_theory_enthalpy: 177.534,
          low_calorific_value: 17556.091
        },
        designEffFormModelId: '',
        effFormModelIdOptions: [
          {
            value: '',
            label: ''
          }
        ],
        effFormModelId: '',
        efficiencyFormRules: {
          gasBurnLoss: [
            {required: true, message: '请输入数字', trigger: 'blur'}
          ],
          solidBurnLoss: [{required: true, message: '请输入数字', trigger: 'blur'}],
          heatLoss: [{required: true, message: '请输入数字', trigger: 'blur'}],
          ashHeatLoss: [{required: true, message: '请输入数字', trigger: 'blur'}],
          airTheoryEnthalpy: [{required: true, message: '请输入数字', trigger: 'blur'}],
          lowCalorificValue: [{required: true, message: '请输入数字', trigger: 'blur'}]
        },
        calEff: 0,
        limited1: '',
        limitedValue1: '2000-2400',
        limited2: '',
        limitedValue2: '2000-2400',
        limited3: '',
        limitedValue3: '16000-20000',
        changLimitModelId: '',

        //************************
        //*****优化主调参数相关********
        //************************
        clickRow: false,
        noticeTitle: '',
        optMainParams: {
          supplyFlow1: '',
          supplyFlow2: '',
          airVolume: ''
        },
        formId: 0,
        ownOptEff: 0,
        optMainParamsRules: {
          supplyFlow1: [
            {required: true, message: '请输入数字', trigger: 'blur'},

          ],
          supplyFlow2: [{required: true, message: '请输入数字', trigger: 'blur'}],
          airVolume: [{required: true, message: '请输入数字', trigger: 'blur'}]
        },

        //************************
        //*****右侧效率曲线相关********
        //************************
        effData: [],
        effChartId: 0,
        loadEffOptChartId: 1,
        loadFuelOptChartId: 1,
        selectedRowUri: '',
        selectedRowName: '',
        writeBackUri: '',
        writeBackUriList: [],
        uriReady: false,
        timeInterval: 300000,
        realCurrentEffTime: [],
        realCurrentEffValue: [],
        effChartData: [],
        boilerChargeUri: '',
        boilerChargeUriList: [],
      }
    },

    async mounted() {
      document.documentElement.scrollTop = 0;
      //初始化页面时获取用户令牌以及树节点
      this.client_id = "GLYFX";
      this.client_secret = "9ddfd71b-1afe-11a2-9321-b03c30700485";
      this.grant_type = "client_credentials";
      await this.UserRegister();
      this.LoadModels();
      this.refreshStatusTable();

    },
    beforeDestroy() {

      // clearInterval(this.currentInternal);
      clearInterval(this.intervalId);

    },

    methods: {

      /**
       *显示两位小数
       */
      twoNumber(val) {
        return val.toFixed(2);
      },


      /**
       * 树相关
       * @constructor
       */
      //获取用户令牌
      async UserRegister() {

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

      //懒加载
      loadNode(node, resolve) {
        this.node = node;
        if (node.level === 0) {
          return resolve([{name: "优化运行", uri: "root"}]);
        }

        if (node.level === 1) {
          this.tmpNode = node;
          this.tmpResolve = resolve;
          this.getNodeParam = JSON.stringify({
            "depth": 1,
            "forward": true,
            "id": "6122e02dba3fd029798b2ebe"
          });

        } else if (node.level === 4) {
          return resolve([])
        } else {
          this.getNodeParam = {
            "depth": 1,
            "forward": true,
            "id": node.data.uri.split("/")[2]
          };
        }
        //获取树节点并按拼音首字母排序
        getNodesByBrowsePath(this.getNodeToken, this.getNodeParam).then((res) => {
          if (res) {

            let tmp = res.data.result[0];
            console.log('树节点', tmp);
            tmp.children = tmp.children.filter(function (item) {
              return item.uri.substring(0, 8) === '/Project'
            }).map(item => {
              item.disabled = this.uriSet.has(item.uri);
              return item
            }).sort((a, b) => a.name.localeCompare(b.name, 'en'));

            return resolve(tmp.children);
          }
        });
      },

      /**
       * 确定按钮，生成并训练选中节点的模型
       */
      async registerModels() {
        let tree = this.$refs.tree;
        // console.log('tree', tree);
        for (let key of tree.getCheckedKeys()) {
          let node = tree.getNode(key);
          if (node.level === 4) {
            await this.registerNode(node);

          }
        }
      },

      /**
       * 注册节点
       *
       */
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

        await getNodesByBrowsePath(this.getNodeToken, nodeParam).then((res) => {
          if (res) {
            let nodes = res.data.result[0].children;
            let nodesDict = {};
            for (let item of nodes) {
              nodesDict[item.name] = item;
            }
            let writeBack;

            if (boilerName.indexOf('水煤浆') !== -1) {
              if (paraName.indexOf('成本') !== -1) {
                writeBack = {
                  slurry_supply_flow: node.data.uri + "/" + nodesDict["供浆流量"].properties.BrowseName,
                };
              } else if (paraName.indexOf('环保') !== -1) {
                writeBack = {
                  NOx: node.data.uri + "/" + nodesDict["NOx"].properties.BrowseName,
                };
              } else if (paraName.indexOf('效率') !== -1) {
                writeBack = {
                  currentEfficiency: node.data.uri + "/" + nodesDict["实时效率"].properties.BrowseName,
                  optEfficiency: node.data.uri + "/" + nodesDict["优化效率"].properties.BrowseName,
                  realTimeEffUri: nodesDict["实时效率"].uri
                };
              }
            }

            if (boilerName.indexOf('天然气') !== -1) {
              if (paraName.indexOf('成本') !== -1) {
                writeBack = {
                  natural_gas_flow: node.data.uri + "/" + nodesDict["天然气流量"].properties.BrowseName,
                };
              } else if (paraName.indexOf('效率') !== -1) {
                writeBack = {
                  currentEfficiency: node.data.uri + "/" + nodesDict["实时效率"].properties.BrowseName,
                  optEfficiency: node.data.uri + "/" + nodesDict["优化效率"].properties.BrowseName,
                  realTimeEffUri: nodesDict["实时效率"].uri
                };
              }
            }
            let boilerStateUri = [];
            boilerStateUri.push(nodesDict["锅炉运行状态"].uri);
            let boilerChargeUri = [];
            boilerChargeUri.push(nodesDict["锅炉负荷"].uri);
            let noxUri;
            let boilerOptRecordUri;
            console.log('nodesDict', nodesDict);

            if (projectName.indexOf('中纺') === -1) {
              noxUri = nodesDict["NOx"].uri;
              boilerOptRecordUri = node.data.uri + "/" + nodesDict["优化记录"].properties.BrowseName;
            } else {
              noxUri = '';
              boilerOptRecordUri = '';
            }

            let boilerState = 0;
            queryCurrentRawValueByUri(boilerStateUri).then((res) => {
              if (res) {
                boilerState = res.data.result[0].v;
                let calculate_uri = [];
                let control_uri = [];
                let uris = [];
                // console.log('内', boilerState);
                let children = nodesDict["关键参数"].children;
                let mainContolParam = nodesDict["主调参数"].children;
                let calParam;

                calParam = nodesDict["计算参数"].children;
                for (let i = 0; i < calParam.length; i++) {
                  let uri = calParam[i].uri;
                  if (uri.substring(0, 8) !== '/Project') {
                    continue
                  }
                  let element = {
                    name: calParam[i].name,
                    uri
                  };
                  calculate_uri.push(element)
                }

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
                //注册时每个模型传回主调参数名
                for (let i = 0; i < mainContolParam.length; i++) {
                  let uri = mainContolParam[i].uri;
                  if (uri.substring(0, 8) !== '/Project') {
                    continue
                  }
                  let element = {
                    name: mainContolParam[i].name,
                    uri
                  };
                  control_uri.push(element)
                }

                let param = {};
                //TODO 后端返回模型时带有node.data.uri
                param = {
                  "node_uri": node.data.uri,
                  "write_back": writeBack,
                  "uris": uris,
                  "window_size": 300000,
                  "project_name": projectName,
                  "boiler_name": boilerName,
                  "para_name": paraName,
                  "boilerState": boilerState,
                  "control_uri": control_uri,
                  "boilerChargeUri": boilerChargeUri,
                  "calculate_uri": calculate_uri,
                  "nox_uri": noxUri,
                  "boiler_opt_record_uri": boilerOptRecordUri
                };
                registerOptModel(param).then((res) => {
                  if (res) {
                    this.LoadModels();

                    // console.log(res.data)
                  }
                })
              }
            });


          }
        });
      },

      /**
       * 上线
       */

      onLineModel(row) {
        let model_id = '';
        model_id = row.modelId;
        let state = row.onLineState;
        let param = {
          "model_id": model_id,
          "to_online": state
        };
        // console.log(param);
        onlineEfficiency(param).then((res) => {
          if (res) {
            if (row.onLineState === true) {
              this.selectedRowUri = 1;
              this.uriReady = true;
              this.writeBackUri = row.writeBack.realTimeEffUri;
              this.effChartId = row.modelId;
              this.loadEffOptChartId = row.modelId;
              this.loadFuelOptChartId = row.modelId;
              this.chartModelId = row.modelId;
              this.hasParamValue = true;
            } else {
              this.selectedRowUri = '';
              this.currentOptimize = 0.0;
              this.hasParamValue = false;
              this.loadEffOptChartId = row.modelId;
              this.loadFuelOptChartId = row.modelId;
              this.beforeOptimize = 0.0;
              this.targetOptimize = 0.0;
              this.LoadModels();
            }
          }
        });


      },


      /**
       * 控制表格输入框是否可编辑
       */
      show() {
        this.inputDisabled = false;
      },

      /**
       * 效率计算表单相关
       */
      async calEfficiency(row) {
        this.$message('参数已修改');
        this.inputDisabled = true;

        let params = {
          "model_id": row.model_id,
          "gas_burn_loss": parseFloat(row.gas_burn_loss),
          "solid_burn_loss": parseInt(row.solid_burn_loss),
          "heat_loss": parseFloat(row.heat_loss),
          "ash_heat_loss": parseFloat(row.ash_heat_loss),
          "air_theory_enthalpy": parseFloat(row.air_theory_enthalpy),
          "low_calorific_value": parseFloat(row.low_calorific_value),
        };

        await getEfficiency(params).then(res => {
          if (res) {
            if (row.name === '实际效率') {
              this.currentOptimize = res.data.toFixed(2);
              // console.log('实际效率', this.currentOptimize);
            } else {
              this.calEff = res.data.toFixed(2);
            }
          } else {
            this.calEff = '有参数未选择！';
          }
        });

        // this.drawEfficiencyChart();

      },

      /**
       * 模型表格相关
       */
      LoadModels() {

        getOptModelsInfo().then(res => {
          if (res) {
            this.allModel = res.data;
            this.totalSize = res.data.length;
            let filterModel = [];
            this.uriSet = new Set();
            let showModels = [];
            this.optModelData = this.allModel.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
            console.log('allModel', this.allModel);
            //将正在运行的锅炉以及上线的模型装入数组
            for (let i = 0; i < this.allModel.length; i++) {
              if (this.allModel[i].boilerState === true
                && this.allModel[i].onLineState === true
                && this.allModel[i].optNumber.indexOf('效率') !== -1) {
                showModels.push(this.allModel[i]);
              }
            }
            console.log('showmodel', showModels);
            this.allModel.forEach(x => this.uriSet.add(x.nodeUri));
            //默认展示数组中第一个模型的实时效率和锅炉负荷
            if (showModels.length !== 0) {
              this.selectedRowUri = 1;
              this.writeBackUri = showModels[0].writeBack.realTimeEffUri;
              this.boilerChargeUri =
                showModels[0].boilerChargeUri.replace(/\[|]/g, '').replace(/\'/g, "");
              this.chartTitle = showModels[0].projectName + '-' + showModels[0].boilerName;
              this.uriReady = true;
              this.chartModelId = showModels[0].modelId;
              this.loadEffOptChartId = showModels[0].modelId;
              this.loadFuelOptChartId = showModels[0].modelId;
              this.hasParamValue = true;
              // this.effChartId = showModels[0].modelId;
            } else {
              this.uriReady = false;
              this.hasParamValue = false;
            }
            let modelData = filterModel;
            this.effFormModelIdOptions = [];
            for (let i = 0; i < modelData.length; i++) {
              let effFormModelId = {
                value: modelData[i].modelId,
                label: modelData[i].modelId
              };
              this.effFormModelIdOptions.push(effFormModelId);
            }
          } else {

          }
        });

      },

      async refreshStatusTable() {
        this.optModelData = this.allModel.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        //this.getOptTree();
      },

      /**
       * 点击模型表格中某行触发事件
       */
      clickTr(row, event, column) {
        let flag = row.optNumber.indexOf('效率');
        if (row.boilerState !== true) {
          this.$message('锅炉未运行，不可进行查看');
        } else if (row.onLineState === false && flag !== -1) {
          this.$message('模型需要训练并上线');
        }
        //锅炉在运行
        if (row.boilerState === true && row.onLineState === true) {
          this.formId = row.modelId;
          //是效率优化，模型已上线，更改uri
          if (flag !== -1 && row.onLineState === true) {
            this.writeBackUri = row.writeBack.realTimeEffUri;
          }
          this.loadEffOptChartId = row.modelId;
          //去除字符串中的中括号以及单引号
          this.boilerChargeUri = row.boilerChargeUri.replace(/\[|]/g, '').replace(/\'/g, "");

        }

        //更新chartTable
        if (row.boilerState === true) {
          this.chartTitle = row.projectName + '-' + row.boilerName + '-' + row.optNumber;
        }

        let param = {
          "model_id": row.modelId
        };
        if (row.boilerState === true) {
          getFilteredModelInfoByModelId(param).then((res) => {
            if (res) {
              this.control_range = res.data.control_range;
              this.changLimitModelId = row.modelId;
              if (row.boilerState === true) {
                this.clickRow = true;
              }

            }
          })
        }

      },

      /**
       * 主调参数表单
       *
       */
      getOptEfficiency(optMainParams, optMainParamsRule) {
        this.limitedChange();
        this.$message('数据已更改');

        let params = {
          "model_id": this.changLimitModelId,
          "opt_main_paras": this.control_range
        };

        getOwnOptimalEfficiency(params).then(res => {
          if (res) {
            if (res.data < 0 || res.data > 100) {
              this.ownOptEff = '所选锅炉已关闭';
            } else {

            }

          }
        })
      },

      /**
       * 切换柱状图与雷达图
       */
      handleTabsClick(tab) {
        if (tab.name == "bar") {
          this.isBarUpdate1 = true;
          this.isRadarUpdate1 = false;
        } else if (tab.name == "radar") {
          this.isBarUpdate1 = false;
          this.isRadarUpdate1 = true;
        }
      },
      //训练模型
      trainModel(row) {
        if (row.trainingState === true) {
          row.dis = true
        }
        let param = {
          model_id: row.modelId
        };
        train(param).then((res) => {
          this.$message('训练中...');
          if (res) {
            row.trainState = false;
            let _this = this;
            setTimeout(() => {
              this.$message('训练成功');
              _this.LoadModels()
            }, 3000)

          }
        })
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
        deleteOptModel(param).then(res => {
          if (res) {
            this.refreshChart();
            this.LoadModels();
            this.refreshTree();
            let _this = this;
            setTimeout(() => {
              this.$message({
                message: '删除成功',
                type: "success"
              });
              _this.LoadModels();
            }, 1500)


          }
        })

      },

      /**
       * 刷新树
       */
      refreshTree() {
        this.loadNode(this.tmpNode, this.tmpResolve);
        console.log('刷新树this.tmpNode', this.tmpNode);
      },

      /**
       * 刷新图
       */
      refreshChart() {

        if (this.waitForDeleteModelId === this.chartModelId) {
          this.optParamReady = false;
          this.hasParamValue = false;
          this.beforeOptimize = 0.0;
          this.targetOptimize = 0.0;
          this.currentOptimize = 0.0;
          console.log('执行删除this.hasParamValue', this.hasParamValue);
        }
        if (this.waitForDeleteModelId === this.formId) {
          this.clickRow = false;
        }

      },
      /**
       * 上下限更改
       *
       */
      limitedChange() {
        this.limitedValue1 = this.limited1;
        this.limitedValue2 = this.limited2;
        this.limitedValue3 = this.limited3;
      },


      /**
       * 一键优化
       *
       */
      async optimization(row) {
        if (row.modelId !== -1) {
          this.$message('模型正在优化中');
          let writeBackUriParam = [];
          writeBackUriParam[0] = row.writeBack.realTimeEffUri;
          queryCurrentRawValueByUri(writeBackUriParam).then((res) => {
            if (res) {
              this.beforeOptimize = res.data.result[0].v.toFixed(2);
            }
          });

          let param = {"model_id": row.modelId};
          this.chartModelId = row.modelId;
          this.loadFuelOptChartId = row.modelId;
          this.controlAim = [];
          this.controlParaName = [];
          this.controlCurrent = [];
          this.controlUri = [];
          if (row.optNumber.indexOf('成本') !== -1) {
            await getOptimalCost(param).then((res) => {
              this.transToLoadChartLoadFuel = 0;
              this.transToLoadChartFuel = 0;
                if (res) {

                  let optPara = res.data.control_para.filter(function (item) {
                    return item.uri.substring(0, 8) === '/Project'
                  }).sort((a, b) => a.name.localeCompare(b.name, "en"));

                  for (let i = 0; i < optPara.length; i++) {
                    this.controlParaName.push(optPara[i].name);
                    this.controlUri.push(optPara[i].uri);
                    this.controlAim.push(optPara[i].value.toFixed(2));
                  }
                  //传给负荷燃料优化图的参数
                  console.log(res.data);
                  this.transToLoadChartLoadFuel=res.data.load;
                  this.transToLoadChartFuel=res.data.model_output;
                  console.log(this.transToLoadChartLoadFuel);
                  console.log(this.transToLoadChartFuel);
                  //用于使雷达图以及柱状图显示
                  this.optimized = true;
                  this.tableTitle = row.projectName + '-' + row.boilerName + '-' + row.optNumber;
                  this.noticeTitle = row.projectName + row.boilerName;
                  this.optParamReady = true;
                  this.valueShow = true;
                  this.stateShow = true;
                }
              }
            )
          }
          if (row.optNumber.indexOf('环保') !== -1) {
            await getOptimalEco(param).then((res) => {
                if (res) {

                  let optPara = res.data.control_para.filter(function (item) {
                    return item.uri.substring(0, 8) === '/Project'
                  }).sort((a, b) => a.name.localeCompare(b.name, "en"));
                  for (let i = 0; i < optPara.length; i++) {
                    this.controlParaName.push(optPara[i].name);
                    this.controlUri.push(optPara[i].uri);
                    this.controlAim.push(optPara[i].value.toFixed(2));
                  }
                  //用于使雷达图以及柱状图显示
                  this.optimized = true;
                  this.tableTitle = row.projectName + '-' + row.boilerName + '-' + row.optNumber;
                  this.noticeTitle = row.projectName + row.boilerName;
                  this.optParamReady = true;
                  this.valueShow = true;
                  this.stateShow = true;
                }
              }
            )
          }
          if (row.optNumber.indexOf('效率') !== -1) {
            await getOptimalEfficiency(param).then((res) => {
              this.targetOptimizeArray = [];
              this.transTarget = [];
              this.transToLoadChartLoad = 0;
              this.transToLoadChartEff = 0;
              if (res) {

                //传给负荷效率优化图的参数
                console.log(res.data);
                this.transToLoadChartLoad=res.data.load;
                this.transToLoadChartEff=res.data.efficiency;
                //排序
                let optPara = res.data.control_para.filter(function (item) {
                  return item.uri.substring(0, 8) === '/Project'
                }).sort((a, b) => a.name.localeCompare(b.name, "en"));

                for (let i = 0; i < optPara.length; i++) {
                  this.controlParaName.push(optPara[i].name);
                  this.controlUri.push(optPara[i].uri);
                  this.controlAim.push(optPara[i].value.toFixed(2));
                }

                //环状图显示目标效率
                this.targetOptimize = res.data.efficiency.toFixed(2);
                var date = new Date().getTime();
                this.targetOptimizeArray.push(date);
                this.targetOptimizeArray.push(this.targetOptimize);
                for (let i = 0; i < this.controlParaName.length; i++) {
                  this.targetOptimizeArray.push(this.controlParaName[i]);
                  this.targetOptimizeArray.push(this.controlAim[i]);
                }

                this.transTarget.push(this.targetOptimizeArray);

                //用于使雷达图以及柱状图显示
                this.optimized = true;
                this.tableTitle = row.projectName + '-' + row.boilerName + '-' + row.optNumber;
                this.noticeTitle = row.projectName + row.boilerName;
                this.optParamReady = true;
                this.valueShow = true;
                this.stateShow = true;
              }

            });
          }

        }
      },

      switchModel(){
        if (this.switchStatue === '手动模式') {
          this.switchStatue = '自动模式';
        }
        else if (this.switchStatue === '自动模式') {
          this.switchStatue = '手动模式';
        }
        setTimeout(() => {
          this.$message('已切换到' + this.switchStatue);
        }, 2000)
      },
      /**
       * 参数下传到边缘侧
       */
      transParam() {
        setTimeout(() => {
          this.$message('优化参数已下传到' + this.noticeTitle + '边缘侧');
        }, 3000)
      },
      /**
       * 子组件向父组件传值，优化参数修改值
       */
      parentFn(value) {
        if (value) {
          this.currentOptimize = value.v.toFixed(2);
          this.hasParamValue = true;
        } else {
          this.currentOptimize = 0
        }

      },

      diff(value) {
        this.difference = value;
      },


    }
  }
</script>

<style scoped>

  .middleContainer {
    margin-left: 15px;
  }

  .treeCard {
    margin-bottom: 15px;
  }

  .calCard {
    margin-bottom: 15px;
  }

  .modelCard {
    margin-bottom: 16px;
  }

  .ring-outer {
    margin-bottom: 15px;
  }

  .preCard {
    margin-bottom: 15px;
  }

  .rightContainer {
    margin-left: 15px;
  }

  .customer-page {
    background: #FFFFFF;
    box-shadow: 0 2px 4px 0 rgba(147, 157, 165, 0.48);
    text-align: left;
  }

  .customer-page-table {
    display: table;
    width: 100%;
  }

  .table-row.header {
    background: #F8F8F9;
    color: #515A6E;
    display: table-row;
    height: 40px;
  }

  .table-row {
    display: table-row;
  }

  .item-content {
    display: table-cell;
  }

  .table-row.header .item-content {
    font-weight: 600;
    color: #707485;
  }

  .table-row:not(:last-child) .item-content {
    border-bottom: 1px solid #979797;
  }

  .table-row .item-content {
    /*height: 60px;*/
    text-align: left;
    /*line-height: 60px;*/
    width: auto;
  }


  /*@media screen and (max-width: 500px) {*/

  /*  .customer-page-tabl {*/
  /*    display: inline;*/
  /*  }*/

  /*  .table-row {*/
  /*    border: 1px solid #ddd;*/
  /*    margin-bottom: 10px;*/
  /*    display: block;*/
  /*    border-bottom: 2px solid #ddd;*/
  /*  }*/

  /*  .table-row.header {*/
  /*    display: none;*/
  /*  }*/

  /*  .table-row .item-content {*/
  /*    display: block;*/
  /*    text-align: right;*/
  /*    font-size: 13px;*/
  /*    border-bottom: 1px dotted #ccc;*/
  /*    height: 50px;*/
  /*    line-height: 50px;*/
  /*    padding: 0 10px;*/
  /*  }*/

  /*  .table-row .item-content:last-child {*/
  /*    border-bottom: 0;*/
  /*  }*/

  /*  .table-row .item-content:before {*/
  /*    content: attr(data-label);*/
  /*    float: left;*/
  /*    text-transform: uppercase;*/
  /*    font-weight: bold;*/
  /*  }*/
  /*}*/

</style>
