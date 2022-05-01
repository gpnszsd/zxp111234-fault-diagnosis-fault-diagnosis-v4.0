<template>
    <el-card style="width: 225px;height: 200px;margin-bottom: 10px;margin-left: 10px;">
        <el-row>负荷MW</el-row>
        <el-row style="margin-top: 10px;font-size: 30px;">302.5</el-row>
        <div id="zheXian" style="width: 180px;height: 180px;margin-top: -30px;"></div>
    </el-card>
</template>

<script>
    import * as echarts from 'echarts';
    export default {
        name: "Echarts",
        data(){
            return{

            }
        },
        mounted() {
            this.chart = echarts.init(document.getElementById('zheXian'));
            var option  = {
                xAxis: {
                    type: 'category',
                    data: ['1.5H', '1.0H', '0.5H']
                },
                yAxis: {
                    // type: 'value'
                },
                series: [{
                    data: [150, 230, 224],
                    type: 'line',
                    itemStyle: {normal: {label: {show: true}}},
                }]
            };
            this.chart.setOption(option);
        }

    }
</script>

<style scoped>

</style>
