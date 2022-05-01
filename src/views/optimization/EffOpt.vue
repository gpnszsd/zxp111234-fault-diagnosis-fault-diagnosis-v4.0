<template>
  <el-container>
    <el-aside style="width: 25%">
      <el-card style="height:100%">
        <el-card shadow="never">
          <el-row>
            <!--          <div slot="header" class="clearfix" style="height: 21px">-->
            <!--            <el-button type="primary" round @click="optimization" class=button-style autofocus>一 键 优 化</el-button>-->
            <!--          </div>-->
            <el-tree
              class="flow-tree"
              :props="mainProps"
              :load="loadNode"
              node-key="uri"
              ref="tree"
              :highlight-current="true"
              :check-strictly="false"
              lazy
              @node-click="handleNodeClick"
              show-checkbox
            >
            </el-tree>
          </el-row>
          <el-row style="margin-top: 2%">
            <el-button style="float: right" type="primary" @click="registerModels">注册模型</el-button>
          </el-row>
        </el-card>
        <el-row>
          <el-card shadow="never">
            <div slot="header" class="efficiencyForm">
              <span style="font-weight: bold;">效率计算</span>
            </div>
            <el-form
              :model="efficiencyForm"
              :rules="efficiencyFormRules"
              ref="efficiencyForm"
              label-position="right"
              label-width="160px"
            >
              <el-form-item label="模型id">
                <el-select v-model="effFormModelId" clearable placeholder="请选择模型id">
                  <el-option
                    v-for="item in effFormModelIdOptions"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="气体不完全燃烧损失">
                <el-input v-model="efficiencyForm.gasBurnLoss" placeholder="默认 0.3"></el-input>
              </el-form-item>
              <el-form-item label="固体不完全燃烧损失">
                <el-input v-model="efficiencyForm.solidBurnLoss" placeholder="默认 2.5"></el-input>
              </el-form-item>
              <el-form-item label="散热损失">
                <el-input v-model="efficiencyForm.heatLoss" placeholder="默认 1"></el-input>
              </el-form-item>
              <el-form-item label="灰渣热损失">
                <el-input v-model="efficiencyForm.ashHeatLoss" placeholder="默认 0.232"></el-input>
              </el-form-item>
              <el-form-item label="冷空气理论热焓">
                <el-input v-model="efficiencyForm.airTheoryEnthalpy" placeholder="默认 177.534"></el-input>
              </el-form-item>
              <el-form-item label="低位发热量">
                <el-input v-model="efficiencyForm.lowCalorificValue" placeholder="默认 17556.091"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="calEfficiency(efficiencyForm)" type="primary" style="float: right">计算</el-button>
              </el-form-item>
              <el-form-item label="计算的实时效率:">
                <div>
                  <span>{{this.calEff}}</span>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-row>
        <el-row>
          <el-card shadow="never">
            <div slot="header" class="optMainParams">
              <span style="font-weight: bold;">优化主调参数</span>
            </div>
            <el-form
              :model="optMainParams"
              :rules="optMainParamsRules"
              ref="optMainParams"
              label-position="right"
              label-width="160px"
            >
              <el-form-item label="模型id">
                <el-select v-model="effFormModelId" clearable placeholder="请选择模型id">
                  <el-option
                    v-for="item in effFormModelIdOptions"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="供浆流量1">
                <el-input v-model="optMainParams.supplyFlow1" placeholder="输入范围：2000-2400"></el-input>
              </el-form-item>
              <el-form-item label="供浆流量2">
                <el-input v-model="optMainParams.supplyFlow2" placeholder="输入范围：2000-2400"></el-input>
              </el-form-item>
              <el-form-item label="鼓风风量">
                <el-input v-model="optMainParams.airVolume" placeholder="输入范围：16000-20000"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button @click="getOptEfficiency(optMainParams,'optMainParams')" type="primary" style="float: right">
                  计算
                </el-button>
              </el-form-item>
              <el-form-item label="计算的优化效率:">
                <div>
                  <span>{{this.ownOptEff}}</span>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-row>
      </el-card>
    </el-aside>
    <el-container>
      <el-container class="middleContainer" direction="vertical" style="width: 50%">
        <!--        模型训练-->
        <el-card style="height: 20.5%;">
          <div slot="header" class="paramShow">
            <span style="font-weight: bold;">模型管理</span>
          </div>
          <!--          <el-row :gutter="10" style="margin-bottom: 2%">-->
          <!--            <el-col :span="6">-->
          <!--              <el-select v-model="projectSelection" clearable placeholder="请选择" size="mini"-->
          <!--                         @change="projectSelectionChange" @clear="clearProjectSelection">-->
          <!--                <el-option-->
          <!--                  v-for="item in projectSelectionOptions"-->
          <!--                  :key="item.projectId"-->
          <!--                  :label="item.projectName"-->
          <!--                  :value="item.projectId">-->
          <!--                </el-option>-->
          <!--              </el-select>-->
          <!--            </el-col>-->
          <!--            <el-col :span="6">-->
          <!--              <el-select v-model="boilersSelection" :disabled="projectSelection===''"-->
          <!--                         clearable placeholder="请选择" @change="selectionChange"-->
          <!--                         @clear="selectionChange">-->
          <!--                <el-option-->
          <!--                  v-for="item in boilersSelectionOptions"-->
          <!--                  :key="item.boilerId"-->
          <!--                  :label="item.boilerName"-->
          <!--                  :value="item.boilerId">-->
          <!--                </el-option>-->
          <!--              </el-select>-->
          <!--            </el-col>-->
          <!--            <el-col :span="6">-->
          <!--              <el-select v-model="parasSelection" clearable placeholder="请选择"-->
          <!--                         @change="selectionChange"-->
          <!--                         @clear="selectionChange">-->
          <!--                <el-option-->
          <!--                  v-for="item in parasSelectionOptions"-->
          <!--                  :key="item.paraId"-->
          <!--                  :label="item.paraName"-->
          <!--                  :value="item.paraId">-->
          <!--                </el-option>-->
          <!--              </el-select>-->
          <!--            </el-col>-->
          <!--            <el-col :span="6">-->
          <!--              <el-button type="primary" round @click="optimization" class=button-style autofocus>一 键 优 化</el-button>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <el-row>
            <el-table
              :header-cell-style="GLOBAL.elHeaderStyle"
              :border="true"
              :data="optModelData"
              style="font-size: 13.5px;width: 100%;"
              height="300"
            >
              <el-table-column prop="modelId" label="模型id" align="left" width="60px"></el-table-column>
              <el-table-column prop="projectName" label="项目名称" align="left"></el-table-column>
              <el-table-column prop="boilerName" label="锅炉名称" align="left"></el-table-column>
              <el-table-column prop="optNumber" label="优化量" align="left"></el-table-column>

              <el-table-column prop="trainingState" label="训练状态" align="left">
                <template v-slot="{row}">
                  <el-switch v-model="row.trainingState" :disabled="row.trainingState" @change="trainModel(row)">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="onLineState" label="上线状态" align="left">
                <template v-slot="{row}">
                  <el-switch v-model="row.onLineState" :disabled="row.onLineState" @change="onLineModel(row)">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="opt" label="优化" align="left">
                <template v-slot="{row}">
                  <el-button @click="optimization(row)" type="primary">优化</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>

        </el-card>
        <!--得分环-->
        <!--        <el-card class="ring-outer" style="height: 300px">-->
        <el-card class="ring-outer" style="height: 20%">
          <div slot="header" class="paramShow">
            <span style="font-weight: bold">各效率展示</span>
          </div>
          <RingGaugeChart
            :before-value="beforeOptimize"
            :current-value="currentOptimize"
            :target-value="targetOptimize"
          ></RingGaugeChart>
        </el-card>
        <el-card class="bar-outer" style="height:25%">
          <!--        <el-card class="bar-outer" style="height:400px">-->
          <div slot="header" class="paramShow">
            <span style="font-weight: bold">主调参数</span>
          </div>
          <el-empty description="未优化" v-if="!optimized"></el-empty>
          <BarChart
            v-else
            id="optimization"
            chart-title="优化目标"
            :control-aim="controlAim"
            :control-para-name="controlParaName"
            :control-uri="controlUri"

          ></BarChart>
        </el-card>
        <el-card class="radar-outer" style="height: 25%">
          <!--        <el-card class="radar-outer" style="height: 400px">-->
          <div slot="header" class="paramShow">
            <span style="font-weight: bold">优化目标参数雷达图</span>
          </div>
          <el-empty description="未优化" v-if="!optimized"></el-empty>
          <RadarChart
            v-else
            id="Radar"
            :control-aim="controlAim"
            :control-para-name="controlParaName"
            :control-uri="controlUri"
          >
          </RadarChart>
        </el-card>
      </el-container>
      <el-container direction="vertical" style="width: 50%">
        <el-card style="height: 60%;">
          <el-empty description="未选择优化种类" v-if="currentParams.length===0"></el-empty>
          <!--          <el-card style="height: 800px;">-->
          <div slot="header" class="paramShow">
            <span style="font-weight: bold">部分参数数值显示</span>
          </div>
          <div>
            <el-row>
              <el-col :span="8" v-for="(currentParam,index) in this.currentParams" :key="index">
                <el-card style="height: 100%;" shadow="hover" @click.native="handleParamClick(currentParam)">
                  <div slot="header">
                    <el-row>
                      <span style="font-weight: bold;font-size: 14px">{{currentParam.optimizationGoals}}</span>
                    </el-row>
                    <el-row>
                      <span style="font-weight: bold;font-size: 16px">{{currentParam.unit}}</span>
                    </el-row>
                  </div>
                  <el-row style="margin-top: 10%">
                    <div>
                      <span style="font-size: 26px;color: darkgray">{{twoNumber(currentParam.currentValue)}}</span>
                    </div>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="line-outer" style="height:30%">
          <!--          <el-card class="line-outer" style="height:400px">-->
          <div slot="header" class="paramShow">
            <span style="font-weight: bold">实时效率图</span>
          </div>
          <el-empty description="请点击对应参数" v-if="selectedRowUri === ''"></el-empty>
          <LineChart
            :key="selectedRowUri"
            v-else
            :id="selectedRowUri"
            :uri="selectedRowUri"
            :chart-title="selectedRowName"></LineChart>
          <div id="efficiencyChart" style="height: 400px;width: 600px"></div>
        </el-card>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  import {getNodesByBrowsePath, register} from "../../api/faultWarning";
  import {
    getCurrentEfficiency,
    getOptimalEfficiency,
    queryCurrentRawValueByUri,
    getOptModelsInfo,
    getEfficiency,
    train,
    getOwnOptimalEfficiency,
    registerOptModel,

  } from "../../api/effopt";
  import BarChart from "../../components/optimization/BarChart";
  import RadarChart from "../../components/optimization/RadarChart";
  import LineChart from "../../components/optimization/LineChart";
  import RingGaugeChart from "../../components/optimization/RingGaugeChart";
  import * as echarts from "echarts";

  export default {
    name: "EffOpt",
    components: {BarChart, RadarChart, LineChart, RingGaugeChart},
    data() {
      return {
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

        //显示控制
        optimized: false,

        //************************
        //*******环状图相关***********
        //************************
        //环状图
        circle1: false,
        circle2: false,
        circle3: false,

        beforeOptimize: 0.00,
        currentOptimize: 0.00,
        targetOptimize: 0.00,
        //************************
        //*******柱状图相关***********
        //************************
        controlParas: {},
        mainControl: [],
        controlUri: [],
        chartModelId: 0,
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

        //************************
        //*******右侧表格相关***********
        //************************
        currentRowUri: null,
        afterOptTableData: [],
        valueShow: false,
        stateShow: false,
        image: '',
        currentParams: [],

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
        pageSize: 5,
        pageNum: 1,
        currentPage: 1,

        //************************
        //*****效率计算表单相关********
        //************************
        efficiencyForm: {
          gasBurnLoss: 0.3,
          solidBurnLoss: 2.5,
          heatLoss: 1,
          ashHeatLoss: 0.232,
          airTheoryEnthalpy: 177.534,
          lowCalorificValue: 17556.091
        },
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
        calEff: '',

        //************************
        //*****优化主调参数相关********
        //************************
        optMainParams: {
          supplyFlow1: '',
          supplyFlow2: '',
          airVolume: ''
        },
        ownOptEff: '',
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
        selectedRowUri: '',
        selectedRowName: '',
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
      this.intervalGetEff();
    },
    beforeDestroy() {
      clearInterval(this.intervalId);
      clearInterval(this.intervalGetEffId)
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
      UserRegister() {
        const params = new URLSearchParams({
          client_id: this.client_id,
          client_secret: this.client_secret,
          grant_type: this.grant_type
        });
        register(params).then((res) => {
          if (res) {
            //存放令牌
            this.requestToken = res.data.token_type + " " + res.data.access_token;
          }
          //console.log("令牌：" + this.requestToken);
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
            tmp.children = tmp.children.filter(function (item) {
              return item.uri.substring(0, 8) === '/Project'
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
       */
      click(node) {

      },
      /**
       * 注册节点
       */
      async registerNode(node) {
        let tree = this.$refs.tree;
        // console.log('树节点', node);
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
        console.log('注册节点nodeParam', nodeParam);
        await getNodesByBrowsePath(this.getNodeToken, nodeParam).then((res) => {
          if (res) {
            let nodes = res.data.result[0].children;
            let nodesDict = {};
            for (let item of nodes) {
              nodesDict[item.name] = item;
            }
            // console.log('nodesDict', nodesDict);
            let writeBack = {
              currentEfficiency: node.data.uri + "/" + nodesDict["实时效率"].properties.BrowseName,
              optEfficiency: node.data.uri + "/" + nodesDict["优化效率"].properties.BrowseName
            };
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

            let param = {
              "node_uri": node.data.uri,
              "write_back": writeBack,
              "uris": uris,
              "window_size": 300000,
              "project_name": projectName,
              "boiler_name": boilerName,
              "para_name": paraName
            };
            registerOptModel(param).then((res) => {
              if (res) {
                // console.log(res.data)
              }
            })
          }
        });
      },

      /**
       * 上线
       */
      onLineModel(row) {
        let model_id = row.id;
        let state = row.onLineState;
        let param = {};
        modelOnline(param).then((res) => {

        });

      },

      refreshTable() {
        /**
         * 调用api，参数model_id,查询该id的模型清单
         * 表格刷新elmentui有方法（结合刚才说的模型优化的代码流程，考虑状态数据怎么拿回来）
         *
         */
      },
      handleNodeClick1(data) {
        /**
         * 1.点击刷新右侧仪表盘
         * 2.点击刷新中部模型列表(调用表格刷新方法)refreshTable()
         * 3.判断当前节点是否为锅炉节点，如果是锅炉节点那么遍历它的孩子节点，一级，
         * 然后把当前子节点循环遍历之前代码
         * 4.
         */


      },
      handleNodeClick(data) {

        this.valueShow = false;
        this.stateShow = false;
        this.beforeOptimize = 0.00;
        this.targetOptimize = 0.00;
        this.optimized = false;

        this.showMiddleCard = true;
        this.showRightCard = true;
        this.getTableNodeParam = {
          "depth": 2,
          "forward": true,
          "id": data.uri.split("/")[2]
        };
        getNodesByBrowsePath(this.getNodeToken, this.getTableNodeParam).then((res) => {
          this.namesForSecondTable = [];
          this.urisForSecondTable = [];
          this.unitForSecondTable = [];

          if (res) {
            let nodes = res.data.result[0].children;
            let nodesDict = {};
            for (let item of nodes) {
              nodesDict[item.name] = item;
            }
            let children = nodesDict["关键参数"].children;
            let filterNodes = children.filter(function (item) {
              return item.uri.substring(0, 8) === '/Project'
            });
            //名称，uri，单位
            for (let i = 0; i < filterNodes.length; i++) {
              let nodeName = '';
              nodeName = filterNodes[i].name;
              if (nodeName.indexOf("关键") === -1 && nodeName.indexOf("效率") === -1) {
                this.namesForSecondTable.push(nodeName);
                this.urisForSecondTable.push(filterNodes[i].uri);
                let unit = '';
                if (nodeName.indexOf("流量") !== -1) {
                  unit = 'kg/h';
                } else if (nodeName.indexOf("电流") !== -1) {
                  unit = 'A';
                } else if (nodeName.indexOf("压力") !== -1) {
                  unit = 'MPa';
                } else if (nodeName.indexOf("温度") !== -1) {
                  unit = '℃';
                } else if (nodeName.indexOf("负压") !== -1) {
                  unit = 'Pa';
                } else if (nodeName.indexOf("氧量") !== -1) {
                  unit = '%';
                } else if (nodeName.indexOf("风量") !== -1) {
                  unit = 'm3/h';
                } else {
                  unit = '单位未知';
                }
                this.unitForSecondTable.push(unit);
              }
            }
            this.intervalTasks();
            this.intervalId = setInterval(this.intervalTasks, 2000);
          }
        });
      },

      intervalTasks() {
        this.drawfData();

        let uris = [];
        for (let i = 0; i < this.namesForSecondTable.length; i++) {
          let element = {
            "name": this.namesForSecondTable[i],
            "uri": this.urisForSecondTable[i]
          };
          uris.push(element);
        }
        let param = {
          "uris": uris
        };


        // getCurrentEfficiency(param).then(res => {
        //   if (res) {
        //     this.currentOptimize = res.data.toFixed(2);
        //   }
        // });
      },

      intervalGetEff() {
        this.calEfficiency(this.efficiencyForm);
        // this.intervalGetEffId = setInterval(this.calEfficiency, 2000);
      },

      /**
       * 效率计算表单相关
       */
      async calEfficiency(efficiencyForm) {

        let params = {
          "model_Id": this.effFormModelId,
          efficiencyForm
        };
        // console.log('calEfficiencyparams', params);
        await getEfficiency(params).then(res => {
          if (res) {
            this.calEff = res.data.toFixed(2);
          } else {

          }
        });

        this.drawEfficiencyChart();

      },

      /**
       * 模型表格相关
       */
      LoadModels() {

        getOptModelsInfo().then(res => {
          if (res) {
            this.optModelData = res.data;
            let modelData = res.data;
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
        })
      },

      //训练模型
      trainModel(row) {
        let param = {
          model_id: row.modelId
        };
        train(param).then((res) => {
          if (res) {

          }
        })
      },

      /**
       * 主调参数表单
       * TODO:如果效率大于100则提示锅炉停机
       */
      getOptEfficiency(optMainParams, optMainParamsRule) {

        let opt_main_paras = {
          "supplyFlow1": optMainParams.supplyFlow1,
          "supplyFlow2": optMainParams.supplyFlow2,
          "airVolume": optMainParams.airVolume
        };
        let params = {
          "model_id": this.effFormModelId,
          "opt_main_paras": opt_main_paras
        };
        getOwnOptimalEfficiency(params).then(res => {
          if (res) {
            if (res.data < 0 || res.data > 100) {
              this.ownOptEff = '所选锅炉已关闭';
            } else {
              this.ownOptEff = res.data;
            }

          }
        })
      },
      /**
       * 一键优化
       *
       */
      async optimization(row) {
        let param = {"model_id": row.modelId};
        await getOptimalEfficiency(param).then((res) => {
          this.controlAim = [];
          this.controlParaName = [];
          this.controlCurrent = [];
          this.controlUri = [];
          if (res) {
            let optPara = res.data.control_para;
            this.optMainParams.supplyFlow1 = optPara[0].toFixed(2);
            this.optMainParams.supplyFlow2 = optPara[1].toFixed(2);
            this.optMainParams.airVolume = optPara[2].toFixed(2);

            //主调参数uri，用于柱状图获取实时值
            this.mainControl = res.data.control_para_uri;
            console.log(' this.mainControl', this.mainControl);
            for (let i = 0; i < this.mainControl.length; i++) {
              this.controlParaName.push(this.mainControl[i].name);
              this.controlUri.push(this.mainControl[i].uri);
              this.controlAim.push(optPara[i].toFixed(2));
            }

            console.log(this.controlParaName, this.controlUri, this.controlAim);
            //环状图显示目标效率
            this.targetOptimize = res.data.efficiency.toFixed(2);
            this.renderChart();
            //用于使雷达图以及柱状图显示
            this.optimized = true;
            this.valueShow = true;
            this.stateShow = true;
          }
        });

      },

      /**
       * 柱状图 雷达图
       */
      renderChart() {
        //获取雷达图参数
        let uris = [];
        for (let i = 0; i < this.namesForSecondTable.length; i++) {
          let element = {
            "name": this.namesForSecondTable[i],
            "uri": this.urisForSecondTable[i]
          };
          uris.push(element);
        }
        let param = {
          "uris": uris
        };
        // console.log('param', param);
        // getOptimalEfficiency(param).then((res) => {
        //   this.controlAim = [];
        //   this.controlCurrent = [];
        //   this.controlParaName = [];
        //
        //   if (res) {
        //     this.beforeOptimize = this.currentOptimize;
        //     this.targetOptimize = res.data.optimal.toFixed(2);
        //     this.controlParas = res.data.control;
        //     for (let i in res.data.control) {
        //       let controlPara = res.data.control[i];
        //       this.controlParaName.push(i);
        //       this.controlAim.push(controlPara.aim);
        //       this.controlCurrent.push(controlPara.current);
        //     }
        //     this.optimized = true;
        //   }
        // });
      },

      /**
       * 右侧表格
       */
      async drawfData() {
        await this.getValues();
        this.currentParams = [];
        for (let i = 0; i < this.namesForSecondTable.length; i++) {
          let tmpCurrentParam;
          tmpCurrentParam = {
            uri: this.urisForSecondTable[i],
            currentValue: this.values[i],
            optimizationGoals: this.namesForSecondTable[i],
            unit: this.unitForSecondTable[i]
          };
          this.currentParams.push(tmpCurrentParam);
        }
      },
      async getValues() {
        await queryCurrentRawValueByUri(this.urisForSecondTable).then((res) => {
          if (res) {
            this.values = [];
            for (let i = 0; i < res.data.result.length; i++) {
              if (null == res.data.result[i]) {
                this.values.push(0);
              } else {
                this.values.push(res.data.result[i].v);
              }
              if (this.selectedRowName == '') {
                this.selectedRowName = this.namesForSecondTable[0];
                this.selectedRowUri = this.urisForSecondTable[0];
                this.currentRowUri = this.urisForSecondTable[0];
              }

            }
          }
        });
      },
      handleParamClick(currentParam) {
        this.selectedRowName = currentParam.optimizationGoals;
        this.selectedRowUri = currentParam.uri;
        this.currentRowUri = currentParam.uri;
      },

      /**
       * 实时效率图
       */
      drawEfficiencyChart(data) {

        this.efficiencyChart = echarts.init(document.getElementById('efficiencyChart'));


        this.option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: "time",
            splitNumber: 3
          },
          yAxis: {scale: true},
          series: [{
            name: '历史值',
            data: this.chartData,
            type: 'line',
            //symbolSize: 7,
            smooth: 0.5,
            itemStyle: {
              color: '#7bfe87'
            },
            lineStyle: {
              width: 2,
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#7bfe87'
              }, {
                offset: 1,
                color: 'rgba(204,204,204,0)'
              }])
            }
          }]
        };

        this.efficiencyChart.setOption(this.option);
      },

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

  .middleContainer {
    margin-left: 1.5%;
  }
</style>
