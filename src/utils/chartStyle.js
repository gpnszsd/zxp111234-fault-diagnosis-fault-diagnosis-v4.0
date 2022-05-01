export function setEchartsHeight(className, idName, num) {
  // 父级高度
  let fatherHeight = document.getElementsByClassName(className)[0].offsetHeight
  // 计算echarts高度
  let echartsHeight = fatherHeight - num
  // 赋值
  document.getElementById(idName).style.height = echartsHeight + 'px'
}
