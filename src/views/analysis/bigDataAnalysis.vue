<template xmlns:el-col="http://www.w3.org/1999/html">
  <div class="bdanalysis" style="width:100%">
    <el-container style="padding: 0px 24px 24px; background-color: rgb(245, 247, 249)">
      <el-tabs v-model="activeName" @tab-click="tabClick" type="card" style="width: 100%">
        <el-tab-pane label="锅炉故障分析" name="first">

          <el-row
              type="flex"
              class="row-bg"
              justify="space-between"
              style="margin-bottom: 24px">
              <el-col :span="24">
                <el-card style="height: 70px">
                  <div class="grid-content" style="text-align: left;">
                      <el-select v-model="select.project" v-on:change="selectChange" placeholder="请选择" style="margin-right: 10px;">
                        <el-option
                          v-for="item in addressOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-select v-model="select.machine" placeholder="请选择" style="margin-right: 20px;">
                        <el-option
                          v-for="item in machineOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-select v-model="select.scope" placeholder="请选择" style="margin-right: 20px;">
                        <el-option
                          v-for="item in timeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-button type="primary" v-on:click="faultSearch">分析</el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row
              type="flex"
              class="row-bg grid-content"
              justify="space-between"
              style="margin-bottom: 24px">
              <el-card style="width:100%">
                <el-col :span="10">
                  <!-- <div style="color:#559FF0;text-align:left">{{faultTrendQuota.reportTimeScope}} | 报警趋势分析</div>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.timeScale}} | {{faultTrendQuota
                    .reportTimeScope}}</div>
                  <br>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.currentDate}}{{faultTrendQuota.currentWeek}}</div>
                  <div style="text-align:left;color:#8492A6">
                    <span style="font-size:30px;color:black">{{faultTrendQuota.todayFaultNum}}</span><span>次</span>
                  </div>
                  <div style="color:#8492A6;text-align:left">
                    环比
                    <span :class="{
                      red : faultTrendQuota.todayFaultRingRatio[0] !=='-',
                      green :  faultTrendQuota.todayFaultRingRatio[0] ==='-',
                      zero :  faultTrendQuota.todayFaultRingRatio[0] == '0'
                    }">
                      {{faultTrendQuota.todayFaultRingRatio | parseArrow}}
                    </span>
                  </div>
                  <div style="color:#8492A6;text-align:left">
                    同比
                    <span :class="{
                      red : faultTrendQuota.todayFaultYearRatio[0] !=='-',
                      green :  faultTrendQuota.todayFaultYearRatio[0] ==='-',
                      zero :  faultTrendQuota.todayFaultYearRatio[0] == '0'
                    }">
                      {{faultTrendQuota.todayFaultYearRatio | parseArrow}}
                    </span>
                  </div>
                  <br>
                  <el-divider></el-divider>
                  <br>
                  <div style="color:#8492A6;text-align:left">本年合计 <span style="color:black;font-size:18px">{{faultTrendQuota.faultYearCount}}</span> 次</div>
                  <div style="color:#8492A6;text-align:left">本月每周平均 <span style="color:black;font-size:18px">{{faultTrendQuota.faultWeekAverage}}</span> 次</div> -->
                  <!-- <div style="text-align:left;color:#8492A6">
                    <span style="font-size:30px;color:black">{{faultTrendQuota.todayFaultNum}}</span><span>次</span>
                  </div> -->
                  <!-- <div style="color:#8492A6;text-align:left">
                    环比
                    <span :class="{
                      red : faultTrendQuota.todayFaultRingRatio[0] !=='-',
                      green :  faultTrendQuota.todayFaultRingRatio[0] ==='-',
                      zero :  faultTrendQuota.todayFaultRingRatio[0] == '0'
                    }">
                      {{faultTrendQuota.todayFaultRingRatio | parseArrow}}
                    </span>
                  </div>
                  <div style="color:#8492A6;text-align:left">
                    同比
                    <span :class="{
                      red : faultTrendQuota.todayFaultYearRatio[0] !=='-',
                      green :  faultTrendQuota.todayFaultYearRatio[0] ==='-',
                      zero :  faultTrendQuota.todayFaultYearRatio[0] == '0'
                    }">
                      {{faultTrendQuota.todayFaultYearRatio | parseArrow}}
                    </span>
                  </div>
                  <br> -->
                  <!-- <div style="color:#8492A6;text-align:left">
                    鼓风机风量范围:<span style="color:black;font-size:18px">{{faultTrendQuota.gfjfl}}</span>
                  </div>
                  <div style="color:#8492A6;text-align:left">
                    引风机频率范围:<span style="color:black;font-size:18px">{{faultTrendQuota.yfjpl}}</span>
                  </div>
                  <div style="color:#8492A6;text-align:left">
                    负荷范围:<span style="color:black;font-size:18px">{{faultTrendQuota.fhfw}}</span>
                  </div>
                  <br> -->
                  <!-- <div style="color:#8492A6;text-align:left">本年合计 <span style="color:black;font-size:18px">{{faultTrendQuota.faultYearCount}}</span> 次</div>
                  <div style="color:#8492A6;text-align:left">本月每周平均 <span style="color:black;font-size:18px">{{faultTrendQuota.faultWeekAverage}}</span> 次</div> -->
                  <!-- <div style="color:#8492A6;text-align:left">
                   总结: <span style="color:black;font-size:18px">在{{faultTrendQuota.reportTimeScope}}里,负荷主要在{{faultTrendQuota.fhfw}}内,鼓风机风量在{{faultTrendQuota.gfjfl}}内,引风机频率在{{faultTrendQuota.yfjpl}}内,导致{{faultTrendQuota.weizhi}}发生报警{{faultTrendQuota.faultYearCount}}次</span>
                  </div> -->
                  <div style="color:#559FF0;text-align:left">{{faultTrendQuota.reportTimeScope}} | 报警趋势分析</div>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.timeScale}} | {{faultTrendQuota.reportTimeScope}}</div>
                  <br>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.currentDate}}{{faultTrendQuota.currentWeek}}</div>
                  <el-divider></el-divider>
                  <div style="color:#559FF0;text-align:left;font-size:18px;margin:30px 0;">
                    报警信息Top3
                  </div>
                  <div style="color:#8492A6;text-align:left;font-size:16px;">
                  <el-row>
                    <el-col :span="3"><div>&nbsp;</div></el-col>
                    <el-col :offset="4" :span="2"><div >次数</div></el-col>
                    <el-col :span="3"><div>负荷</div></el-col>
                    <el-col :span="4"><div >供泵量</div></el-col>
                    <el-col :span="4"><div >鼓风机</div></el-col>
                    <el-col :span="4"><div >风浆比</div></el-col>
                  </el-row>
                  <el-row v-for="(item,index) in bjList" :key="index">
                    <el-col :span="7"><div>{{item.name}}</div></el-col>
                    <el-col :span="2"><div >{{item.cs}}</div></el-col>
                    <el-col :span="3"><div>{{item.fh}}</div></el-col>
                    <el-col :span="4"><div >{{item.gjb}}</div></el-col>
                    <el-col :span="4"><div >{{item.gfj}}</div></el-col>
                    <el-col :span="4"><div >{{item.fjb}}</div></el-col>
                  </el-row>
                  </div>
                </el-col>
                <el-col :span="14">
                  <div>
                      <MapChartFaultTrendline
                        ref="line1"
                        :id="'line1'"
                        :chartTitle="''"
                        :chartData="faultTendData"
                        :legend="faultlegend"
                        :type="'faultTrendline'"
                        :xAxis="xAxis"
                        :lineShow="true"
                        :endPos="100"
                      />

                  </div>
                </el-col>
              </el-card>
            </el-row>
            <el-row type="flex"
              class="row-bg"
              justify="space-between"
              style="margin-bottom: 24px">
              <el-col hidden="true"  :span="10" style="padding-right:24px">
                <el-card style="height:422px">
                  <div style="color:black;text-align:left;">&nbsp;&nbsp;{{faultSummaryQuota.reportTimeScope}} <span style="font-size:20px">| 设备故障摘要</span></div>
                  <el-divider class="orangeLine"></el-divider>
                  <el-row>
                    <div style="text-align:left;color:#8492A6;">上周故障次数:<span style="font-size:30px;color:black">{{faultSummaryQuota.lastWeekFaultCount}}</span>次
                      &nbsp;&nbsp;&nbsp;环比:
                      <span :class="{
                        red : faultSummaryQuota.lastWeekRingRatio[0] !=='-',
                        green :  faultSummaryQuota.lastWeekRingRatio[0] ==='-',
                        zero :  faultSummaryQuota.lastWeekRingRatio[0] == '0'
                      }">
                        {{faultSummaryQuota.lastWeekRingRatio | parseArrow}}
                      </span>
                      &nbsp;&nbsp;&nbsp;同比:<span :class="{
                        red : faultSummaryQuota.lastWeekYearRatio[0] !=='-',
                        green :  faultSummaryQuota.lastWeekYearRatio[0] ==='-',
                        zero :  faultSummaryQuota.lastWeekYearRatio[0] == '0'
                      }">
                        {{faultSummaryQuota.lastWeekYearRatio | parseArrow}}
                      </span>&nbsp;
                      &nbsp;&nbsp;平均每周发生:<span style="font-size:30px;color:black">{{faultSummaryQuota.faultWeekAverage}}</span>次</div>
                  </el-row>
                  <el-row>
                    <el-table :data="faultEquipmentTable" border :show-header="true" stripe >
                      <el-table-column
                        prop="project">
                      </el-table-column>
                      <el-table-column
                        prop="dayAlert"
                        label="每日报警次数">
                      </el-table-column>
                      <el-table-column
                        prop="dayFailure"
                        label="每日故障次数">
                      </el-table-column>
                      <el-table-column
                        prop="ringRatio"
                        label="环比">
                      </el-table-column>
                      <el-table-column
                        prop="yearRatio"
                        label="同比">
                      </el-table-column>
                      <el-table-column
                        prop="total"
                        label="近7天总计">
                      </el-table-column>
                    </el-table>
                  </el-row>
                </el-card>
              </el-col>
              <el-col :span="24">
                <el-card style="width:100%">
                  <el-col :span="10">
                    <!-- <div style="color:#559FF0;text-align:left">{{faultHotQuota.reportTimeScope}} | <span style="font-size:14px">报警热点分析</span></div>
                    <div style="color:#8492A6;text-align:left">{{faultHotQuota.timeScope}}</div>
                    <br>
                    <div style="color:#8492A6;text-align:left">{{faultHotQuota.currentDate}}{{faultHotQuota.currentWeek}}</div>
                    <div style="text-align:left;color:#8492A6"><br>
                      中心区<br><span style="font-size:30px;color:black">{{faultHotQuota.faultCenterCount}}</span><span>次</span>
                    </div>
                    <div style="color:#8492A6;text-align:left;margin-top: 8px;">占比 <span style="color:red">{{faultHotQuota.faultCenterRatio}}%</span></div>
                    <div style="color:#8492A6;text-align:left;">报警最多 <span style="color:red">{{faultHotQuota.maxFault}}</span></div>
                    <br>
                    <el-divider></el-divider>
                    <br>
                    <div style="color:#8492A6;text-align:left">合计 <span style="color:black;font-size:18px">{{faultHotQuota.faultWeekCount}}</span> 次</div>
                    <div style="color:#8492A6;text-align:left">年度占比 <span style="color:black;font-size:18px">{{faultHotQuota.faultYearRange}}</span>%</div> -->
                  <!-- <div style="color:#559FF0;text-align:left">{{faultTrendQuota.reportTimeScope}} | 报警趋势分析</div>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.timeScale}} | {{faultTrendQuota.reportTimeScope}}</div>
                  <br>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.currentDate}}{{faultTrendQuota.currentWeek}}</div>
                  <div style="color:#8492A6;text-align:left">
                    鼓风机风量范围:<span style="color:black;font-size:18px">{{faultTrendQuota.gfjfl}}</span>
                  </div>
                  <div style="color:#8492A6;text-align:left">
                    引风机频率范围:<span style="color:black;font-size:18px">{{faultTrendQuota.yfjpl}}</span>
                  </div>
                  <div style="color:#8492A6;text-align:left">
                    负荷范围:<span style="color:black;font-size:18px">{{faultTrendQuota.fhfw}}</span>
                  </div>
                  <el-divider></el-divider>
                  <br>
                  <div style="color:#8492A6;text-align:left">
                   总结: <span style="color:black;font-size:18px">在{{faultTrendQuota.reportTimeScope}}里,负荷主要在{{faultTrendQuota.fhfw}}内,鼓风机风量在{{faultTrendQuota.gfjfl}}内,引风机频率在{{faultTrendQuota.yfjpl}}内,导致{{faultTrendQuota.weizhi}}发生报警{{faultTrendQuota.faultYearCount}}次</span>
                  </div> -->
                  <div>
                    <MapBarFault
                    ref="bar1"
                    :id="'bar1'"
                    chartTitle=""
                    />
                  </div>
                  </el-col>
                  <el-col :span="14">
                    <div>
                        <MapChartHot
                          ref="dot1"
                          :id="'dot1'"
                          :chartTitle="''"
                          :chartData="dotData1"
                          :type="'dot1'"
                        />
                    </div>
                  </el-col>
                </el-card>
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="锅炉能效效率分析" name="second">
            <el-row
              type="flex"
              class="row-bg"
              justify="space-between"
              style="margin-bottom: 24px"
            >
              <el-col :span="24">
                <el-card style="height: 70px">
                  <div class="grid-content" style="text-align: left;">
                      <el-select v-model="select.project" v-on:change="selectChange" placeholder="请选择" style="margin-right: 10px;">
                        <el-option
                          v-for="item in addressOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-select v-model="select.machine" placeholder="请选择" style="margin-right: 20px;">
                        <el-option
                          v-for="item in machineOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-select v-model="select.scope" placeholder="请选择" style="margin-right: 20px;">
                        <el-option
                          v-for="item in timeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-button type="primary" v-on:click="energySearch">分析</el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row
              type="flex"
              class="row-bg grid-content"
              justify="space-between"
              style="margin-bottom: 24px">
              <el-card style="width:100%">
                <el-col :span="6">
                  <!-- <div style="color:#559FF0;text-align:left">{{energyQuota.consumption.reportTimeScope}} | 能耗趋势分析</div>
                  <div style="color:#8492A6;text-align:left" v-if="energyQuota.consumption.timeScale">{{energyQuota.consumption.timeScale}} | {{energyQuota.consumption.reportTimeScope}}</div>
                  <br>
                  <div hidden="true" style="color:#8492A6;text-align:left">{{energyQuota.consumption.currentDate}}（{{energyQuota.consumption.currentWeek}}）</div>
                  <div hidden="true" style="text-align:left;color:#8492A6">


                    <span style="font-size:30px;color:black">{{energyQuota.consumption.dateNum}}</span><span>kj</span>
                  </div>
                  <div hidden="true" style="color:#8492A6;text-align:left">
                    环比
                    <span :class="{
                        red : energyQuota.consumption.ringRatio[0] !=='-',
                        green :  energyQuota.consumption.ringRatio[0] ==='-',
                        zero :  energyQuota.consumption.ringRatio[0] == '0'
                      }">
                      {{energyQuota.consumption.ringRatio | parseArrow}}
                    </span>
                  </div>
                  <div hidden="true" style="color:#8492A6;text-align:left">
                    同比
                    <span :class="{
                        red : energyQuota.consumption.yearRatio[0] !=='-',
                        green :  energyQuota.consumption.yearRatio[0] ==='-',
                        zero :  energyQuota.consumption.yearRatio[0] == '0'
                      } ">
                      {{energyQuota.consumption.yearRatio | parseArrow}}
                    </span>
                  </div>
                  <br>
                  <el-divider></el-divider>
                  <br>
                  <div hidden="true" style="color:#8492A6;text-align:left">合计 <span style="color:black;font-size:18px">{{energyQuota.consumption.totalNum}}</span> kj</div>
                  <div hidden="true" style="color:#8492A6;text-align:left">均值 <span style="color:black;font-size:18px">{{energyQuota.consumption.averageNum}}</span> kj</div> -->

                  <div style="color:#559FF0;text-align:left">{{faultTrendQuota.reportTimeScope}} | 能耗趋势分析</div>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.timeScale}} | {{faultTrendQuota.reportTimeScope}}</div>
                  <br>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.currentDate}}{{faultTrendQuota.currentWeek}}</div>
                  <el-divider></el-divider>
                  <div style="color:#559FF0;text-align:left;font-size:18px;margin:30px 0;">
                    能效-能耗热点相关分析
                  </div>
                  <div style="color:#8492A6;text-align:left;font-size:16px">
                   <el-row>
                    <el-col :span="6"><div>热点</div></el-col>
                    <el-col :span="5"><div >负荷</div></el-col>
                    <el-col :span="6"><div >供浆量</div></el-col>
                    <el-col :span="5"><div >鼓风机</div></el-col>
                  </el-row>
                  <el-row v-for="(item,index) in List" :key="'List'+index">
                    <el-col :span="6"><div>{{item.rd}}</div></el-col>
                    <el-col :span="5"><div >{{item.fh}}</div></el-col>
                    <el-col :span="6"><div >{{item.gjl}}</div></el-col>
                    <el-col :span="5"><div >{{item.gfj}}</div></el-col>
                  </el-row>
                  </div>
                </el-col>
                <el-col :span="18">
                  <div>
                      <MapChartEnergyTrendline
                        ref="line2"
                        :id="'line2'"
                        :chartTitle="''"
                        :chartData="energyTendData"
                        :legend="energylegend"
                        :type="'energyTrendline'"
                        :xAxis="xAxis2"
                        :lineShow="true"
                        :endPos="100"
                      />
                  </div>
                </el-col>
              </el-card>
            </el-row>
            <el-row type="flex"
              class="row-bg"
              justify="space-between"
              style="margin-bottom: 24px">
              <el-col hidden="true" :span="10" style="padding-right:24px">
                <el-card style="height:422px">
                  <div style="color:black;text-align:left;">&nbsp;&nbsp;{{energyQuota.efficiency.reportTimeScope}} <span style="font-size:20px">| 能效分析摘要</span></div>
                  <el-divider class="orangeLine"></el-divider>
                  <el-row>
                    <el-col :span="12" style="border-right: 2px solid;border-color:#DCDFE6;padding-right:10px">
                      <div style="color:black;text-align:left">&nbsp;&nbsp;燃烧能耗</div>
                      <el-divider></el-divider>
                      <br>
                      <el-table :data="energySummary.efficiency" border :show-header="false" stripe >
                        <el-table-column
                          prop="name"
                          label="属性">
                        </el-table-column>
                        <el-table-column
                          prop="val"
                          label="值">
                        </el-table-column>
                      </el-table>
                      <br>
                      <br>
                      <br>
                      <br>
                    </el-col>
                    <!-- <el-divider direction="vertical"></el-divider> -->
                    <el-col :span="12" style="padding-left:10px">
                      <div style="color:black;text-align:left">&nbsp;&nbsp;&nbsp;&nbsp;转换效率</div>
                      <el-divider></el-divider>
                      <br>
                      <el-table :data="energySummary.consumption" border :show-header="false" stripe>
                        <el-table-column
                          prop="name"
                          label="属性">
                        </el-table-column>
                        <el-table-column
                          prop="val"
                          label="值">
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
              <el-col :span="24">
                <el-card style="width:100%">
                  <el-col :span="6">
                    <!-- <div style="color:#559FF0;text-align:left">{{energyQuota.efficiency.reportTimeScope}} | 能效分布分析</div>
                    <div style="color:#8492A6;text-align:left" v-if="energyQuota.efficiency.timeScale">{{energyQuota.efficiency.timeScale}}  {{energyQuota.efficiency.reportTimeScope}}</div>
                    <br>
                    <div hidden="true" style="color:#8492A6;text-align:left">{{energyQuota.efficiency.currentDate}}（{{energyQuota.efficiency.currentWeek}}）</div>
                    <div hidden="true" style="text-align:left;color:#8492A6">
                      <span style="font-size:30px;color:black">{{energyQuota.efficiency.dateNum}}</span><span>kj</span>
                    </div>
                    <div hidden="true" style="color:#8492A6;text-align:left">环比
                       <span :class="{
                          red : energyQuota.efficiency.ringRatio[0] !=='-',
                          green :  energyQuota.efficiency.ringRatio[0] ==='-',
                          zero :  energyQuota.efficiency.ringRatio[0] == '0'
                        }">
                         {{  energyQuota.efficiency.ringRatio | parseArrow}}
                        </span>
                    </div>
                    <div hidden="true" style="color:#8492A6;text-align:left">同比
                       <span :class="{
                          red : energyQuota.efficiency.yearRatio[0] !=='-',
                          green :  energyQuota.efficiency.yearRatio[0] ==='-',
                          zero :  energyQuota.efficiency.yearRatio[0] == '0'
                          }">
                         {{  energyQuota.efficiency.yearRatio | parseArrow}}
                        </span>
                    </div>
                    <br>
                    <br>
                    <el-divider></el-divider>
                    <br>
                    <div hidden="true" style="color:#8492A6;text-align:left">合计 <span style="color:black;font-size:18px">{{  energyQuota.efficiency.totalNum}}</span> kj</div>
                    <div hidden="true" style="color:#8492A6;text-align:left">均值 <span style="color:black;font-size:18px">{{  energyQuota.efficiency.averageNum}}</span> kj</div>
                    -->
                  <div style="color:#559FF0;text-align:left">{{faultTrendQuota.reportTimeScope}} | 能效分布分析</div>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.timeScale}} | {{faultTrendQuota.reportTimeScope}}</div>
                  <br>
                  <div style="color:#8492A6;text-align:left">{{faultTrendQuota.currentDate}}{{faultTrendQuota.currentWeek}}</div>
                  <el-divider></el-divider>
                  <div style="color:#559FF0;text-align:left;font-size:18px;margin:30px 0;">
                    效率和负荷分析
                  </div>
                  <div style="color:#8492A6;text-align:left;font-size:16px;">
                  <el-row>
                    <el-col :span="6"><div>参数</div></el-col>
                    <el-col :span="6"><div >峰值</div></el-col>
                    <el-col :span="6"><div >最低</div></el-col>
                    <el-col :span="6"><div >平均</div></el-col>
                  </el-row>
                  <el-row v-for="(item,index) in xlList" :key="'xl'+index">
                    <el-col :span="6"><div>{{item.cs}}</div></el-col>
                    <el-col :span="6"><div >{{item.fz}}</div></el-col>
                    <el-col :span="6"><div >{{item.zd}}</div></el-col>
                    <el-col :span="6"><div >{{item.pj}}</div></el-col>
                  </el-row>
                  </div>
                  </el-col>
                  <el-col :span="18">
                    <div>
                        <MapChartEnergyHot
                          ref="dot2"
                          :id="'dot2'"
                          :chartTitle="''"
                          :chartData="dotData2"
                          :type="'dot2'"
                      />
                    </div>
                  </el-col>
                </el-card>
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="故障分析报告" name="third">
          <el-row
              type="flex"
              class="row-bg"
              justify="space-between"
              style="margin-bottom: 24px"
            >
              <el-col :span="24">
                <el-card style="height: 70px">
                  <div class="grid-content" style="text-align: left;">
                      <el-select v-model="select.project" v-on:change="selectChange" placeholder="请选择" style="margin-right: 10px;">
                        <el-option
                          v-for="item in addressOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-select v-model="select.machine" placeholder="请选择" style="margin-right: 20px;">
                        <el-option
                          v-for="item in machineOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-select v-model="select.scope" placeholder="请选择" style="margin-right: 20px;">
                        <el-option
                          v-for="item in timeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <el-button type="primary" v-on:click="energySearch">分析</el-button>
                  </div>
                </el-card>
              </el-col>
          </el-row>
          <el-row
              type="flex"
              class="row-bg"
              justify="space-between"
              style="margin-bottom: 24px"
            >
              <el-col :span="24">
                <el-card>
                  <div style="color:black;text-align:left;font-size:18px"><span>1.运行摘要</span></div>
                  <div style="color:black;text-align:left;font-size:16px;padding-left:20px;margin-top:10px;"><span>(1)主要操作数据</span></div>
                  <div style="margin:0 auto;width:50%;">
                      <el-table
                        :data="AllData"
                        border
                        style="width: 100%">
                        <el-table-column
                          prop="czsb"
                          label="操作设备"
                          width="180">
                        </el-table-column>
                        <el-table-column
                          prop="mrfz"
                          label="每日峰值"
                          width="180">
                        </el-table-column>
                        <el-table-column
                          prop="mrgz"
                          label="每日谷值">
                        </el-table-column>
                        <el-table-column
                          prop="mrjz"
                          label="每日均值">
                        </el-table-column>
                      </el-table>
                  </div>
                  <div style="color:black;text-align:left;font-size:16px;padding-left:20px;margin-top:10px;"><span>(2)负荷、效率</span></div>
                    <div style="margin:0 auto;width:50%;">
                      <el-table
                        :data="xlList"
                        border
                        style="width: 100%">
                        <el-table-column
                          prop="cs"
                          label="参数"
                          width="180">
                        </el-table-column>
                        <el-table-column
                          prop="fz"
                          label="峰值"
                          width="180">
                        </el-table-column>
                        <el-table-column
                          prop="zd"
                          label="最低">
                        </el-table-column>
                        <el-table-column
                          prop="pj"
                          label="平均">
                        </el-table-column>
                      </el-table>
                  </div>
                  <div style="color:black;text-align:left;font-size:16px;padding-left:20px;margin-top:10px;"><span>(3)运行趋势分析</span></div>
                  <div style="width:100%;margin-top:10px;">
                    <el-row>
                      <el-col :span="12">
                      <MapChartAllLine
                          ref="allLine"
                          :id="'allLine'"
                          :chartTitle="''"
                      />
                      </el-col>
                      <el-col :span="12">
                        <MapChartAllBar 
                          ref="allBar"
                          :id="'allBar'"
                          :chartTitle="''"
                        />
                      </el-col>
                    </el-row>
                  </div>
                   <div style="color:black;text-align:left;font-size:16px;padding-left:20px;margin-top:10px;"><span>(4)预警、报警</span></div>
                   <el-row>
                     <el-col :span="12" style="padding-top:100px">
                    <el-table
                      :data="bjList"
                      style="width: 100%">
                      <el-table-column label="报警信息">
                        <el-table-column
                          prop="name"
                          label="TOP3"
                          width="150">
                        </el-table-column>
                        <el-table-column
                          prop="cs"
                          label="次数"
                          width="80">
                        </el-table-column>
                      </el-table-column>
                      <el-table-column label="相关区间">
                        <el-table-column
                          prop="fh"
                          label="负荷"
                          width="80">
                        </el-table-column>
                        <el-table-column
                          prop="gjb"
                          label="供浆泵流量"
                          width="100">
                        </el-table-column>
                        <el-table-column
                          prop="gfj"
                          label="鼓风机"
                          width="100">
                        </el-table-column>
                        <el-table-column
                          prop="fjb"
                          label="风浆比"
                          width="91">
                        </el-table-column>
                      </el-table-column>
                    </el-table>
                     </el-col>
                     <el-col :span="12">
                       <div>
                        <MapBarFault
                        ref="bar2"
                        :id="'bar2'"
                        chartTitle=""
                        />
                      </div>
                     </el-col>
                   </el-row>
                </el-card>
              </el-col>
          </el-row>
          <el-row
              type="flex"
              class="row-bg"
              justify="space-between"
              style="margin-bottom: 24px"
            >
              <el-col :span="24">
                <el-card>
                  <div style="color:black;text-align:left;font-size:18px"><span>2优化分析摘要</span></div>
                  <div style="color:black;text-align:left;font-size:16px;padding-left:20px;margin-top:10px;"><span>(1)能效-能耗热点相关分析</span></div>
                  <div style="width:80%;margin: 0 auto;">
                    <el-table
                    :data="List"
                    style="width: 100%">
                    <el-table-column label="效率">
                       <el-table-column
                          prop="rd"
                          label="热点"
                          width="120">
                        </el-table-column>
                        <el-table-column
                          prop="dj"
                          label="等级"
                          width="120">
                        </el-table-column>
                        <el-table-column
                          prop="fb"
                          label="分布"
                          width="120">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="运行">
                      <el-table-column
                          prop="fh"
                          label="负荷"
                          width="120">
                        </el-table-column>
                        <el-table-column
                          prop="gjl"
                          label="供浆量"
                          width="120">
                        </el-table-column>
                        <el-table-column
                          prop="gfj"
                          label="鼓风机"
                          width="120">
                        </el-table-column>
                        <el-table-column
                          prop="yfj"
                          label="引风机"
                          width="120">
                        </el-table-column>
                        <el-table-column
                          prop="nox"
                          label="NOx"
                          width="120">
                        </el-table-column>
                    </el-table-column>
                  </el-table>
                  </div>
                  <div style="margin-top:30px;">
                    <MapChartAllLastLine
                        ref="LastLine"
                        :id="'LastLine'"
                        chartTitle=""
                    />
                  </div>
                  <div style="color:black;text-align:left;font-size:16px;padding-left:20px;margin-top:10px;"><span>(2)运行优化建议</span></div>                
                  <div style="width:80%;margin:0 auto">
                     <el-table
                      :data="LastList"
                      :span-method="objectSpanMethod"
                      border
                      style="width: 100%; margin-top: 20px">
                      <el-table-column
                        prop="dj"
                        label="等级"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="fhbz"
                        label="负荷标准">
                      </el-table-column>
                      <el-table-column
                        prop="tsl"
                        label="提升率">
                      </el-table-column>
                      <el-table-column
                        prop="gjl"
                        label="供浆量">
                      </el-table-column>
                      <el-table-column
                        prop="gfj"
                        label="鼓风机">
                      </el-table-column>
                      <el-table-column
                        prop="yfj"
                        label="引风机">
                      </el-table-column>
                      <el-table-column
                        prop="nox"
                        label="NOx">
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
                  </el-col>
                    </el-row>
        </el-tab-pane>
        <el-tab-pane  v-if="false" label="故障分析报告"  name="third">
            <el-row
              type="flex"
              class="row-bg"
              justify="space-between"
              style="margin-bottom: 24px ; "
            >
              <el-col :span="24" class="analysis_warp">
                <el-card style="min-height : 70vh">
                  <h4 class="title">设备信息</h4>
                  <el-divider></el-divider>
                  <div class="machine_info">
                    <div class="item" v-for="item in infoData" :key="item.value">
                      <div class="left">{{item.name}}:</div>
                      <div class="right">{{item.value}}</div>
                    </div>

                  </div>
                  <h4 class="title">运行摘要</h4>
                  <!-- 运行摘要 -->
                  <div class="summary">
                    <div class="summary_warp">
                    <div class="left item">
                      <div class="title">
                        <h5>锅炉操作、效率和负荷</h5>
                        <el-divider></el-divider>
                      </div>
                      <div class="content">
                        <el-table
                          :data="run_summary"
                          border
                          style="width: 90%">

                          <el-table-column
                            prop="point"
                            label="指标项点"
                            width="100">
                          </el-table-column>
                          <el-table-column
                            prop="high"
                            label="峰值"
                            width="180">
                          </el-table-column>
                          <el-table-column
                            prop="low"
                            label="最低值"
                            width="180">
                          </el-table-column>
                          <el-table-column
                            prop="average"
                            label="均值">
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                    <div class="right item">
                      <div class="title">
                        <h5>锅炉综合性能波动趋势图</h5>
                        <el-divider></el-divider>
                      </div>
                      <div>
                        <MapChartDiagnoseTrendline
                          ref="dot3"
                          :id="'dot3'"
                        />
                      </div>
                    </div>
                    </div>
                    <div class="title">
                      <h5>锅炉诊断跟踪过程</h5>
                      <el-divider></el-divider>
                    </div>

                    <div>
                        <MapChartDiagnoseHistogram
                          ref="histogram3"
                          :id="'histogram3'"
                        />
                    </div>
                    <div class="title">
                      <h5>操作、预警</h5>
                      <el-divider></el-divider>
                    </div>
                    <div>
                      <div>
                        总共发生报警 <span style="font-weight : 600 ; font-size : 18px">223</span> 次
                      </div>
                        <el-table
                          border
                          :data="warning_summary"
                          style="width: 100%">
                          <el-table-column
                            prop="name"
                            label="TOP5"
                            width="180">
                          </el-table-column>
                          <el-table-column
                            prop="count"
                            label="次数"
                            width="180">
                          </el-table-column>
                          <el-table-column
                            prop="Load"
                            label="负荷">
                          </el-table-column>
                          <el-table-column
                            prop="machieaFrequency"
                            label="供浆泵频率">
                          </el-table-column>
                          <el-table-column
                            prop="machieaFrequency"
                            label="鼓风机频率">
                          </el-table-column>
                          <el-table-column
                            prop="machieaFrequency"
                            label="引风机频率">
                          </el-table-column>
                          <el-table-column
                            prop="windToPulpRatio"
                            label="风浆比">
                          </el-table-column>
                        </el-table>
                    </div>
                    <div class="title">
                      <h5>锅炉报警与运行关系趋势图</h5>
                    </div>
                    <div>
                      <MapChartDiagnoseHistogramMix
                        ref="mix3"
                        :id="'mix3'" />
                    </div>
                    <div class="title">
                      <h5>建议</h5>
                      <el-divider></el-divider>
                    </div>
                    <div class="suggest_warp">
                      <div v-for="(item , index) in suggest_summary" :key="item.title" class="suggest_item">
                        <p class="title">{{index + 1}}:{{item.title}}</p>
                        <p class="content">{{item.content}}</p>
                      </div>
                    </div>
                  </div>

                </el-card>
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane v-if="false" label="故障分析报告"  name="third">
          <!-- <a href="/static/data.pdf">AAA</a> -->
          <!-- <embed src="" style=" width: 540PX; height: 820px; " /> -->
            <pdf
              ref="pdf"
              src="/static/data.pdf"
            />
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>
<script>
import pdf from 'vue-pdf'

import moment from 'moment'
import {

  getFaultTrendChartData,
  getFaultTrendQuotaData,
  getFaultHotPoint ,
  getFaultEquipmentSummary,

  getEnergyTendData,
  getEnergyQuotaData,
  getEnergySummary ,
  getEnergyHotPoint ,

  getDiagnoseSummary,
  getDiagnoseChart,
  getAnalsisOptions,

} from "../../api/bigDataAnalysis";
import {

  // getFaultHistoryData,
  // getHistoryRawData,
  getModelLevelData

} from "../../api/bigDataAnalysisV2";
import {
  getHistoryRawData,
  getFaultHistoryData,
  getAggregateHistoryRawData
}from "../../api/bigDataAnalysisV3";
import BigData from "../../api/bigDataConfig"
import MapChart from "../../components/analysis/MapChart";
import MapChartFaultTrendline from  '../../components/analysis/MapChartFaultTrendline'
import MapChartHot from '../../components/analysis/MapChartHot'
import OtherChart from "../../components/analysis/OtherChart"
import MapChartEnergyTrendline from '../../components/analysis/MapChartEnergyTrendline'
import MapChartEnergyHot from '../../components/analysis/MapChartEnergyHot'
import MapChartDiagnoseTrendline from '../../components/analysis/MapChartDiagnoseTrendline'
import MapChartDiagnoseHistogram from '../../components/analysis/MapChartDiagnoseHistogram'
import MapChartDiagnoseHistogramMix from '../../components/analysis/MapChartDiagnoseHistogramMix'
import MapBarFault from '../../components/analysis/MapBarFault.vue'
import MapChartAllLine from '../../components/analysis/MapChartAllLine.vue'
import MapChartAllBar from '../../components/analysis/MapChartAllBar.vue'
import MapChartAllLastLine from '../../components/analysis/MapChartAllLastLine.vue'
export default {
  name: "BigData",
  components: {pdf ,  MapChartFaultTrendline ,MapChartHot , MapChartEnergyTrendline ,MapChart, OtherChart ,MapChartEnergyHot , MapChartDiagnoseTrendline ,MapChartDiagnoseHistogram , MapChartDiagnoseHistogramMix ,MapBarFault, MapChartAllLine, MapChartAllBar, MapChartAllLastLine},
  data() {
    return {
      radio: '上个月',
      faultTrendData : [],
      energyQuota:{
        efficiency:{
          dateNum: '',
          ringRatio: '',
          yearRatio: '',
          totalNum: '',
          averageNum: '',
        },
        consumption:{
          dateNum: '',
          ringRatio: '',
          yearRatio: '',
          totalNum: '',
          averageNum: '',
        },
      },
      faultTrendQuota: {
        reportTimeScope: '近七天',
        timeScale: "2022-2-11~2022-2-4",
        currentDate: "2-11",
        currentWeek:'(五)',
        todayFaultNum: "4",
        todayFaultRingRatio: "-1",
        todayFaultYearRatio: "1",
        faultYearCount: "5",
        faultCount:"6",
        faultWeekAverage:"7"
      },
      faultSummaryQuota: {
        lastWeekFaultCount: "",
        lastWeekRingRatio: "",
        lastWeekYearRatio: "",
        faultWeekAverage: "",
        todayFaultYearRatio: ""
      },
      faultHotQuota:{
        searchScope:"",
        timeScope: "",
        currentDate: "",
        currentWeek:'',
        faultCenterRatio: "",
        faultCenterCount:"",
        maxFault:"",
        faultYearRange:"",
        faultWeekCount:''
      },
      tips: {
        name: '电气室温度预警',
        frequency: '39',
        fh: '67',
        gjb: '400.32',
        gfj: '332.22',
        fjb: '54.55'
      },
      activeName: "first",
      faultAxisName:{
        faultTrendYaxis:{
          Y1_name:'',
          Y2_name:'',
          Y3_name:''
        }
      },
      faultEquipmentTable: [
      ],
      energySummary:{
        efficiency : [],
        consumption : []
      },
      legend: [],
      faultlegend: [],
      energylegend: [],
      xAxis: [],
      xAxis2: [],
      endPos: 100,
      // ***** 散点图数据相关
      scatterData: [],
      ///报警趋势分析数据
      faultTendData: [],
      // 能效趋势折线数据
      energyTendData: [],
      comboxOptions:[],
      // 下拉框选项
      addressOptions:[],
      machineOptions:[],
      timeOptions: [
        {
          value: "near7",
          label: "近7天",
          getSE_timestamp:function(){
            let end = new Date();
            let start = new Date();
            let one =  1000 * 60 * 60 * 24;
            start.setHours(0,0,0,0);
            end.setHours(0,0,0,0);
            start=new Date(start.getTime()-7*one)

            let wind= one/24
            let len = Math.round((end.getTime() -start.getTime())/1000)
            let timeAxis=[]
            // let st = start.getTime()
            // for (let i =0 ;i<len;i++){
            //   st+=(i*1000)
            //   timeAxis.push(st)
            // }
            return {start:start.getTime(),end:end.getTime(),axis:timeAxis,window:wind}
          }
        },
        {
          value: "near30",
          label: "近30天",
          getSE_timestamp:function(){
            let end = new Date();
            let start = new Date();
            let one =  1000 * 60 * 60 * 24;
            start.setHours(0,0,0,0);
            end.setHours(0,0,0,0);

            start=new Date(start.getTime()-30*one)
            let wind= one/24
            let len = Math.round((end.getTime() -start.getTime())/1000)
            let timeAxis=[]
            let st = start.getTime()
            // for (let i =0 ;i<len;i++){
            //   st+=(i*1000)
            //   timeAxis.push(st)
            // }
            return {start:start.getTime(),end:end.getTime(),axis:timeAxis,window:wind}
          }
        },
        // {
        //   value: "lastMonth",
        //   label: "上个月",
        //   getSE_timestamp:function(){
        //     let end = new Date();
        //     let start = new Date();
        //     let one =  1000 * 60 * 60 * 24;
        //     // start.setHours(0,0,0,0);
        //     end.setHours(0,0,0,0);

        //     end.setDate(1)
        //     end=new Date(start.getTime()-1*one)

        //     start=new Date(end.getTime())
        //     start.setDate(1)
        //     let wind= one/24
        //     let len = Math.round((end.getTime() -start.getTime())/1000)
        //     let timeAxis=[]
        //     let st = start.getTime()
        //     // for (let i =0 ;i<len;i++){
        //     //   st+=(i*1000)
        //     //   timeAxis.push(st)
        //     // }
        //     return {start:start.getTime(),end:end.getTime(),axis:timeAxis,window:wind}
        //   }
        // }
      ],
      select: {
        project: "1",
        machine: "2",
        scope: "near7",
      },
      // 饼图数据
      pieData: [],
      barData: [],
      dotData1: [],
      dotData2: [],
      infoData : [],
      run_summary : [],
      bjList: [
        {
           name: '电气室温度预警',
           cs: '39',
           fh: '67%',
           gjb: '400.32',
           gfj: '332.22Hz',
           fjb: '54.55%',
          }, {
            name: '提升风机温度预警',
           cs: '28',
           fh: '68%',
           gjb: '387.22',
           gfj: '372.22Hz',
           fjb: '52.55%',
          }, {
            name: '推压风机预警',
           cs: '24',
           fh: '69%',
           gjb: '376.32',
           gfj: '432.22Hz',
           fjb: '74.55%',
          }],
          List: [{
            rd: '95.55%',
            dj: 'Lv1',
            fb: '39%',
            fh: '67%',
            gjl: '400.32',
            gfj: '332.22Hz',
            yfj: '332.22Hz',
            nox: '3324',
          },{
            rd: '96.55%',
            dj: 'Lv2',
            fb: '18%',
            fh: '68%',
            gjl: '432.32',
            gfj: '322.22Hz',
            yfj: '322.22Hz',
            nox: '4324',
          },{
            rd: '93.65%',
            dj: 'Lv3',
            fb: '14%',
            fh: '69%',
            gjl: '376.32',
            gfj: '432.22Hz',
            yfj: '432.22Hz',
            nox: '1367',
          }],
          xlList:[{
            cs: '负荷',
            fz: '86.55%',
            zd: '54.34%',
            pj: '67.32%'
          },{
            cs: '效率',
            fz: '98.32%',
            zd: '92.32%',
            pj: '95.54%'
          }],
          AllData: [{
            czsb: 'xxxx',
            mrfz: '13056.03t',
            mrgz: '10056.03t',
            mrjz: '12056.03t',
          },{
            czsb: 'xxxx',
            mrfz: '334.43Hz',
            mrgz: '304.43Hz',
            mrjz: '314.43Hz',
          },{
            czsb: 'xxxx',
            mrfz: '354.32Hz',
            mrgz: '301.32Hz',
            mrjz: '324.32Hz',
          }],
          LastList: [{
            dj: '效率优化',
            fhbz:'70%',
            tsl: '1.1%',
            gjl: '3244',
            gfj: '233Hz',
            yfj: '444Hz',
            nox: '233',
          },{
            dj: '效率优化',
            fhbz:'80%',
            tsl: '1.0%',
            gjl: '4010.32',
            gfj: '332.22Hz',
            yfj: '332.22Hz',
            nox: '3324',
          },{
            dj: '环保指标优化',
            fhbz:'70%',
            tsl: '2.1%',
            gjl: '3244',
            gfj: '233Hz',
            yfj: '444Hz',
            nox: '233',
          },{
            dj: '环保指标优化',
            fhbz:'80%',
            tsl: '1.3%',
            gjl: '4020.32',
            gfj: '332.22Hz',
            yfj: '332.22Hz',
            nox: '3324',
          },{
            dj: '成本指标优化',
            fhbz:'70%',
            tsl: '1.1%',
            gjl: '3244',
            gfj: '333Hz',
            yfj: '444Hz',
            nox: '233',
          },{
            dj: '成本指标优化',
            fhbz:'80%',
            tsl: '1.2%',
            gjl: '4100.32',
            gfj: '332.22Hz',
            yfj: '332.22Hz',
            nox: '3324',
          },]
    };
  },
  watch: {},
  filters: {
    parseArrow(data){
      if(data == ''){
        return ''
      }
      if(data == 0){
        return "0%"
      }
      data = data + ''
      if(data[0] === '-'){
        return "↓" + data.substring(1) +'%'
      }else{
        return  "↑" + data + "%"
      }
    }
  },
  created(){

    ////初始化项目下拉选
    let se = []
    for( let k in BigData){
      let seo = {
        value:'',
        label:'',
        childs:[]
      }
      seo.value=k
      seo.label=k
      ////格式化锅炉信息
      for(let i in BigData[k]){
        let mao = {
          value:'',
          label:''
        }
        mao.value=i;
        mao.label=i;
        seo.childs.push(mao)
      }
      se.push(seo)
    }
    this.comboxOptions=se
    this.addressOptions=se
    this.machineOptions=se[0]['childs']


    this.select.project=se[0]['value']
    this.select.machine=se[0]['childs'][0]['value']


    return
    // 历史报警数据
    let alarmPostData = {
        "startTime": "2021/10/16 00:00:00",
        "endTime": "2021/10/30 00:00:00",
        "filter": [
            {
                "field": "DeviceId",
                "operator": "InList",
                "value": [
                    "/Project_XCGLDSJFX/6124a64fba3fd029798b3bd6"
                ]
            }
        ],
        "maxSize" : 1000,
        "continuationPoint" : "0"
    }
    getFaultHistoryData(alarmPostData).then(res=>{
      // console.log("----------")
      // console.log(res)

      // console.log(res.data.result[0])
      // console.log(JSON.parse(res.data.result[0]))
    })


    // 故障分析获取
    getDiagnoseSummary().then(res=>{
      console.log(res.data)
      this.infoData = res.data.info
      this.run_summary = res.data.run_summary
      this.warning_summary = res.data.warning_summary
      this.suggest_summary = res.data.suggest_summary
    })
    getDiagnoseChart().then(res=>{
    })
    // 下拉获取
    getAnalsisOptions().then(res=>{
      this.addressOptions = res.data.addressOptions
      this.machineOptions = res.data.machineOptions

      this.select.value1 = res.data.addressOptions[0].value
      this.select.value2 = res.data.machineOptions[0].value

    })
  },
  mounted(){

    getDiagnoseChart().then(resp=>{
      console.log('---------')
      console.log(resp.data.performanceTrends)
          let res = resp.data.performanceTrends
          let legend = [];
          let xAxis = [];
          let seriesData = [];
          for (let i = 0; i < res.length; i++) {
            legend.push(res[i].name);
            let tmp = {
              name: res[i].name,
              type: 'line',
              yAxisIndex: res[i].yAxisIndex,
              data: []
            }
            for (let j = 0; j < res[i].valueList.length; j++) {
              if (i == 0) {
                xAxis.push(res[i].valueList[j].xAxis);
              }
              tmp.data.push(res[i].valueList[j].value);
            }
            seriesData.push(tmp);
          }
          let data = {
            xAxis : xAxis,
            legend : legend,
            seriesData : seriesData
          }
        // this.$refs.dot3.updateChart(data)

    })
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
    getData() {
      let params = this.select;

      /**
       * 报警趋势分析图表数据加载方法
       */
      // this.reloadFaultData();



      // getScatterData({}).then(res => {
      //
      // });
      /**
       * 能效趋势分析面板数据接口
       */
      // this.reloadEnergyData();

      // getAnalysisDotData({}).then(res => {
      //
      // });
      // getAnalysisDotData2({}).then(res => {
      //
      // });
    },
    reloadEnergyData() {
      let params = this.select;

      ////能效效率分析图表
      getEnergyTendData(params).then(res => {
        if (res) {
          res = res.data
          let legend = [];
          let xAxis = [];
          let seriesData = [];
          for (let i = 0; i < res.length; i++) {
            legend.push(res[i].name);
            let tmp = {
              name: res[i].name,
              type: 'line',
              yAxisIndex: res[i].yAxisIndex,
              data: []
            }
            for (let j = 0; j < res[i].valueList.length; j++) {
              if (i == 0) {
                xAxis.push(res[i].valueList[j].xAxis);
              }
              tmp.data.push(res[i].valueList[j].value);
            }
            seriesData.push(tmp);
          }
          let data = {
            xAxis: xAxis,
            legend: legend,
            seriesData: seriesData
          }
          console.log(data)
          this.$refs.line2.updateChart(data)
        }
      });

      ////能效各指标简述接口
      getEnergyQuotaData(params).then(res => {
        if (res) {
          res = res.data
          this.energyQuota = res;
        }
      })

      //能效分析table
      getEnergySummary(params).then(res => {
        this.energySummary = res.data
      })

      // 能效分析热点
      getEnergyHotPoint(params).then(res => {
        this.$refs.dot2.updateChart(res.data)
      })
    },

    reloadFaultData() {
      let params = this.select;

      /**
       * 查询指定的数据模型  工业锅炉的报警输几局
       */
      // getFaultHistoryData().then(res =>{
      //   if(res){
      //     //查询指定项目锅炉的报数，帅选出来
      //     //每天的报警次数计算出来
      //   }
      // })
      /**
       * 查询供浆量  鼓风机  引风机的历史数据
       */

      getHistoryRawData().then(res => {

      })

    },
    // 标签栏切换
    tabClick(tab, event) {
      this.$nextTick(() => {
        if (tab.name == 'first') {
          this.$refs.line1.resize();
          this.$refs.dot1.resize();
          this.$refs.bar1.resize();
        } else if (tab.name == 'second') {
          this.$refs.line2.resize();
          this.$refs.dot2.resize();
        } else if(tab.name == 'third'){
          this.$refs.allLine.resize();
          this.$refs.allBar.resize();
          this.$refs.bar2.resize();
          this.$refs.LastLine.resize();
        }
      })
    },
    selectChange(event) {
      let p = this.select.project
      for (let i in this.comboxOptions) {
        if (this.comboxOptions[i]['value'] == p) {
          this.machineOptions = this.comboxOptions[i]['childs']

          this.select.machine = this.machineOptions[0]['value']
          continue
        }
      }
    },
    dateMinMax(start,end,date){
      if(date<start){
        start=new Date(date)
      }
      if(date>end){
        end=new Date(date)
      }
      return {s:start,e:end}
    },
    dateStr(date){
      let d= new Date(date)
      return d.getFullYear() +'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+(d.getHours()+1)+':'+d.getMinutes()+':'+d.getSeconds()
    },
    // 根据下拉选获取数据
    /**
     * 报警趋势分析按钮事件
     * zxp
     */
    async faultSearch() {
      let para = this.select
      let project = para.project
      let machine = para.machine
      let scope = para.scope
      let Y1_key, Y2_key, Y3_key,fault_key;
      let Y1_uri, Y2_uri, Y3_uri,fault_uri;

      /////硬编码~~~  适配各个项目炉型 需要的参数
      if (project == '万凯三期') {
        Y1_key = '能耗'
        Y2_key = '鼓风机风量'
        Y3_key = '引风机频率'
      } else if (project == '中纺') {
        Y1_key = '能耗'
        Y2_key = '鼓风机风量'
        Y3_key = '烟气含氧量'
      } else {
        Y1_key = '能耗'
        Y2_key = '鼓风机风量'
        Y3_key = '引风机频率'
      }
      fault_key="报警root";
      Y1_uri = BigData[project][machine][Y1_key]
      Y2_uri = BigData[project][machine][Y2_key]
      Y3_uri = BigData[project][machine][Y3_key]
      fault_uri = BigData[project][machine][fault_key]
      let to = this.timeOptions[0]
      for (let d in this.timeOptions) {
        if (scope == this.timeOptions[d]['value']) {
          to = this.timeOptions[d]
          continue
        }
      }

      let tt = to['getSE_timestamp']()
      let start = tt['start']
      let end = tt['end']
      let wind = tt['window']
      let xaxis = tt['axis']////////////创建一个大时间轴，每秒一个
      let agg = "avg"
      let agg_vkey = "avg_v"

      // let postParam = {
      //   "nodes": [],
      //   "detail": {
      //     "maxSizePerNode": 1000000,
      //     "returnBounds": true,
      //     "startTime": start,
      //     "endTime": end,
      //   }
      // }

      let postParam = {
        "nodes": [],
        "detail": {
          "aggregateType": agg,
          "startTime": start,
          "endTime": end,
          "window": wind
        }
      }
      let nodes = [
        {
          "browsePath": Y1_uri
        },
        {
          "browsePath": Y2_uri
        },
        {
          "browsePath": Y3_uri
        }
      ]
      postParam['nodes'] = nodes

      // 设备属性数据
      this.$refs.line1.startloading()
      this.$refs.dot1.startloading()
      this.$refs.bar1.startloading()
      // 历史报警数据
      let alarmPostData = {
        "startTime": start,
        "endTime": end,
        "filter": [
          {
            "field": "DeviceId",
            "operator": "InList",
            "value": fault_uri
          }
        ],
        "maxSize" : 1000,
        "continuationPoint" : "0"
      }
      let faultDta=[];

      ///////////////查询报警接口 该接口最好等待 同步
      let res = await getFaultHistoryData(alarmPostData)

      let resu
      let result = res.data['result']
      let fdate=[]
      let fd=[]
      for( let i in result){
        resu= JSON.parse(result[i])

        faultDta.push(resu)////把报警数据原始数据缓存起来
        let tim = resu['OccurTime']
        let date = new Date(tim)
        date.setHours(0,0,0,0)

        /////装载报警数据，最后混合到能耗或者风量的一些数据中
        let index = fdate.indexOf(date.getTime())
        if(index<0){

          fdate.push(date.getTime())
          fd.push(1)
        }else{
          fd[index]++;/////当日报警次数 +1
        }
      }
      let faultData =[]

      let minStart=new Date()
      let maxStart=new Date()


      for (let i in fd){
        let v = fd[i]
        let t = new Date(fdate[i])
        t.setHours(t.getHours(),t.getMinutes(),t.getSeconds(),0)
        let aa= this.dateMinMax(minStart,maxStart,t)///计算最大最小时间
        minStart=aa.s
        maxStart=aa.e
        t=this.dateStr(t)

        let dataObj ={name:t, value:[t, v]};
        faultData.push(dataObj)
      }

      let ss =this.dateStr(new Date(start))
      let es =this.dateStr(new Date(end))
      let anchor = [
        {name:ss, value:[ss, 0]},
        {name:es, value:[es, 0]}
      ];
      let _self = this;

      getAggregateHistoryRawData(postParam).then(res => {
        // getHistoryRawData(postParam).then(res => {

        // debugger
        // console.log(res.data.result[0])
        let timeArr = []
        let arr = [[], [], [] , faultData,[]]
        arr[4]=anchor ///初始化 数据，框定横轴范围

        let hotarr = []
        ////热点图纵轴区间
        let axisrang=[[101,0],[101,0]]
        ////趋势图纵轴区间 能耗 鼓风机风量  引风机频率  报警次数
        let trendaxisrang=[[3000,6000],[15000,19000],[0,200],[0,1000]]
        if (res.data.result[0] !== null) {
          let axisRange=[0,100]
          for (let i = 0; i < res.data.result[0].historyData.length; i++) {
            timeArr.push(moment(res.data.result[0].historyData[i]['t']).format("MM-DD HH:mm"))
            let v = res.data.result[0].historyData[i][agg_vkey]
            let t = res.data.result[0].historyData[i]['t']
            let aaa = _self.dateMinMax(minStart,maxStart,t)///计算最大最小时间
            minStart=aaa.s
            maxStart=aaa.e
            t=_self.dateStr(new Date(t))
            let _dataObj ={name:t, value:[t, v]};
            arr[0].push(_dataObj)

            ////热点图  取能耗 作为横坐标
            hotarr.push([v, 0])
            if(v&& v<axisrang[0][0]){
              axisrang[0][0]=Math.round(v)
            }
            if(v >0 && v>axisrang[0][1]){
              axisrang[0][1]=Math.round(v)
            }

            if(v>axisRange[1]){
              axisRange[1]=Math.ceil(Math.ceil(v)/100)*100
            }
            if(v<axisRange[0]){
              axisRange[0]=Math.ceil(Math.ceil(v)/100)*100
            }
          }
          trendaxisrang[0]=axisRange
        }
        if (res.data.result[1] !== null) {
          let axisRange=[0,100]
          for (let i = 0; i < res.data.result[1].historyData.length; i++) {
            let v = res.data.result[1].historyData[i][agg_vkey]
            let t = res.data.result[1].historyData[i]['t']
            let aaa = _self.dateMinMax(minStart,maxStart,t)///计算最大最小时间
            minStart=aaa.s
            maxStart=aaa.e
            t=_self.dateStr(new Date(t))
            let _dataObj ={name:t, value:[t, v]};
            arr[1].push(_dataObj)

            ////热点图 取鼓风量 作为纵坐标
            try {
              ////如果查询报警信息接口 是同步的 这里可以拿到faultDta
              //// 用 年月日 时分秒 进度 去比较 如果某一时刻 发生故障，就组织一个热点数据，放到散点图中
              ///  TODO
              hotarr[i][1] = v;
            } catch (e) {
              break
            }
            if(v&& v<axisrang[1][0]){
              axisrang[1][0]=Math.round(v)
            }
            if(v >0 && v>axisrang[0][1]){
              axisrang[1][1]=Math.round(v)
            }
            if(v>axisRange[1]){
              axisRange[1]=Math.ceil(Math.ceil(v)/100)*100
            }
            if(v<axisRange[0]){
              axisRange[0]=Math.ceil(Math.ceil(v)/100)*100
            }
          }
          trendaxisrang[1]=axisRange
        }
        if (res.data.result[2] !== null) {
          let axisRange=[0,100]
          for (let i = 0; i < res.data.result[2].historyData.length; i++) {
            let v = res.data.result[2].historyData[i][agg_vkey]
            let t = res.data.result[2].historyData[i]['t']
            let aaa = _self.dateMinMax(minStart,maxStart,t)///计算最大最小时间
            minStart=aaa.s
            maxStart=aaa.e
            t=_self.dateStr(new Date(t))
            let _dataObj ={name:t, value:[t, v]};
            arr[2].push(_dataObj)
            // arr[2].push(res.data.result[2].historyData[i]['v'])
            if(v>axisRange[1]){
              axisRange[1]=Math.ceil(Math.ceil(v)/100)*100
            }
            if(v<axisRange[0]){
              axisRange[0]=Math.ceil(Math.ceil(v)/100)*100
            }
          }
          trendaxisrang[2]=axisRange
        }

        ///////////////////////////总装完成 渲染图表
        // console.log(arr)
        this.$refs.line1.updateChart(timeArr, arr, [Y1_key, Y2_key, Y3_key , '报警次数',''],trendaxisrang)

        this.$refs.dot1.updateChart(hotarr,axisrang)

        this.$refs.bar1.stoploading()
      })

      return
    },
    /**
     * 能效分析按钮事件
     */
    energySearch() {
      let para = this.select
      let project = para.project
      let machine = para.machine
      let scope = para.scope
      let Y1_key, Y2_key, Y3_key;
      let Y1_uri, Y2_uri, Y3_uri;
      /////硬编码~~~  适配各个项目炉型 需要的参数
      if (project == '万凯三期') {
        Y1_key = '能耗'
        Y2_key = '效率'
        Y3_key = '负荷'
      } else if (project == '中纺') {
        Y1_key = '能耗'
        Y2_key = '效率'
        Y3_key = '负荷'
      } else {
        Y1_key = '能耗'
        Y2_key = '效率'
        Y3_key = '负荷'
      }
      Y1_uri = BigData[project][machine][Y1_key]
      Y2_uri = BigData[project][machine][Y2_key]
      Y3_uri = BigData[project][machine][Y3_key]
      let to = this.timeOptions[0]
      for (let d in this.timeOptions) {
        if (scope == this.timeOptions[d]['value']) {
          to = this.timeOptions[d]
          continue
        }
      }

      let tt = to['getSE_timestamp']()
      let start = tt['start']
      let end = tt['end']
      let wind = tt['window']
      let xaxis = tt['axis']////////////创建一个大时间轴，每秒一个
      let agg = "avg"
      let agg_vkey = "avg_v"

      let postParam = {
        "nodes": [],
        "detail": {
          "aggregateType": agg,
          "startTime": start,
          "endTime": end,
          "window": wind
        }
      }
      let nodes = [
        {
          "browsePath": Y1_uri
        },
        {
          "browsePath": Y2_uri
        },
        {
          "browsePath": Y3_uri
        }
      ]
      postParam['nodes'] = nodes
      let minStart=new Date()
      let maxStart=new Date()
      let ss =this.dateStr(new Date(start))
      let es =this.dateStr(new Date(end))
      let anchor = [
        {name:ss, value:[ss, 0]},
        {name:es, value:[es, 0]}
      ];
      let _self = this;
      this.$refs.line2.startloading()
      this.$refs.dot2.startloading()
      getAggregateHistoryRawData(postParam).then(res => {
      // getHistoryRawData(postParam).then(res => {

        // debugger
        // console.log(res.data.result[0])

        let timeArr = []
        let arr = [[], [], [],[]]
        arr[3]=anchor ///初始化 数据，框定横轴范围
        let hotarr = []
        ////热点图纵轴区间
        let axisrang=[[101,0],[101,0]]
        ////趋势图纵轴区间 能耗 效率  负荷
        let trendaxisrang=[[3000,6000],[0,100],[0,100],[0,100]]
        if (res.data.result[0] !== null) {
          let axisRange=[0,0]
          for (let i = 0; i < res.data.result[0].historyData.length; i++) {
            timeArr.push(moment(res.data.result[0].historyData[i]['t']).format("MM-DD HH:mm"))
            let v = res.data.result[0].historyData[i][agg_vkey]
            let t = res.data.result[0].historyData[i]['t']
            let aaa = _self.dateMinMax(minStart,maxStart,t)///计算最大最小时间
            minStart=aaa.s
            maxStart=aaa.e
            t=_self.dateStr(new Date(t))
            let _dataObj ={name:t, value:[t, v]};
            arr[0].push(_dataObj)

            ////热点图  取能耗 作为值
            hotarr.push([0, 0,v])

            if(v>axisRange[1]){
              axisRange[1]=Math.ceil(Math.ceil(v)/100)*100
            }
            if(v<axisRange[0]){
              axisRange[0]=Math.ceil(Math.ceil(v)/100)*100
            }
          }
          trendaxisrang[0]=axisRange
        }
        if (res.data.result[1] !== null) {
          for (let i = 0; i < res.data.result[1].historyData.length; i++) {
            let v = res.data.result[1].historyData[i][agg_vkey]
            let t = res.data.result[1].historyData[i]['t']
            let aaa = _self.dateMinMax(minStart,maxStart,t)///计算最大最小时间
            minStart=aaa.s
            maxStart=aaa.e
            t=_self.dateStr(new Date(t))
            let _dataObj ={name:t, value:[t, v]};
            arr[1].push(_dataObj)

            ////热点图 取效率 作为纵坐标
            try {
              hotarr[i][1] = v;
              if(v&& v<axisrang[1][0]){
                axisrang[1][0]=Math.round(v)
              }
              if(v >0 && v>axisrang[1][1]){
                axisrang[1][1]=Math.round(v)
              }
            } catch (e) {
              break
            }
            if(v&& v<axisrang[1][0]){
              axisrang[1][0]=Math.round(v)
            }
            if(v >0 && v>axisrang[0][1]){
              axisrang[1][1]=Math.round(v)
            }
          }
        }
        if (res.data.result[2] !== null) {
          for (let i = 0; i < res.data.result[2].historyData.length; i++) {
            let v = res.data.result[2].historyData[i][agg_vkey]
            let t = res.data.result[2].historyData[i]['t']
            let aaa = _self.dateMinMax(minStart,maxStart,t)///计算最大最小时间
            minStart=aaa.s
            maxStart=aaa.e
            t=_self.dateStr(new Date(t))
            let _dataObj ={name:t, value:[t, v]};
            arr[2].push(_dataObj)

            /////取负荷 为横坐标
            try{
              hotarr[i][0] = v;
              if(v&& v<axisrang[0][0]){
                axisrang[0][0]=Math.round(v)
              }
              if(v >0 && v>axisrang[0][1]){
                axisrang[0][1]=Math.round(v)
              }
            } catch (e) {
              break
            }
          }
        }

        ///////////////////////////总装完成 渲染图表
        // console.log(arr)
        this.$refs.line2.updateChart(timeArr, arr, [Y1_key, Y2_key, Y3_key,''],trendaxisrang)

        this.$refs.dot2.updateChart(hotarr,axisrang)
      })

      return

      let params = this.select;

      // 根据参数从新获取数据
      this.reloadFaultData(params);
    },
    /**
     * 能效分析按钮事件
     */
  },
};
</script>
<style  scoped>
.page_warp{
  text-align: right;
  margin-top: 20px;
}
.red{
  color: red;
  font-weight: 700;
}
.green {
  color: #093;
  font-weight: 700;
}
.zero{
  color: rgb(132, 146, 166) !important;
  font-weight: 700;
}
.analysis_warp .el-divider.el-divider--horizontal {
  width: 100%;
}
.analysis_warp h4.title {
  line-height: 45px;
  text-align: left;
}
.analysis_warp .machine_info{
  overflow: hidden;
}
.analysis_warp .machine_info .item {
  width: 50%;
  float: left;
  display: flex;
  margin: 5px 0;
}
.analysis_warp .machine_info .item .left{
  width: 90px;
  text-align: left;
}
.analysis_warp .machine_info .item .right{
  flex: 1;
  text-align: left;
}
.analysis_warp .summary_warp{
  display: flex;
}
.analysis_warp .summary_warp .item{
  flex: 1;
}

.analysis_warp .summary .title{
  width: 80%;
}
.analysis_warp .summary .title h5{
  text-align: left;
  font-weight: normal;
  font-size: 16px;
  padding: 10px 0;
}
.suggest_warp{
  width: 95%;
  margin: 0 auto;
}
.suggest_warp .suggest_item{
  margin: 10px 0 20px;
}
.suggest_warp .suggest_item .title {
  text-align: left;
  margin-bottom: 5px;
}

.suggest_warp .suggest_item .content {
  text-align: left;
}
</style>
<style>
  .bdanalysis .el-divider.el-divider--horizontal {
    width: 50%;
    margin: 0 0 12px;
  }

  .bdanalysis .orangeLine.el-divider.el-divider--horizontal {
    width: 100%;
    background-color: #DCDFE6;
    /* margin: 0 0 12px; */
  }

  .bdanalysis .el-tabs__item.is-top {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  .bdanalysis .el-tabs__item.is-top.is-active {
    background-color: white;
    border-bottom: 2px solid #409EFF;
  }

</style>
