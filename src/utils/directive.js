import Vue from "vue"
// 拖拽效果
Vue.directive('drag', function (el) {
  let oDiv = el
  let dragPart = oDiv.children[0]
  dragPart.onmousedown = (e) => {
    //算出鼠标相对元素的位置
    let disX = e.clientX - oDiv.offsetLeft
    let disY = e.clientY - oDiv.offsetTop
    document.onmousemove = (e) => {
      //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      let left = e.clientX - disX
      let top = e.clientY - disY
      if (top < 0) {
        top = 0
      }
      if (top > document.body.clientHeight - 55) {
        top = top > document.body.clientHeight - 55
      }
      if (left < -100) {
        left = -100
      }
      if (left > document.body.clientWidth + 100) {
        left = document.body.clientWidth + 100
      }
      //移动当前元素
      oDiv.style.left = left + 'px'
      oDiv.style.top = top + 'px'
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
})
// 阻止拖拽冒泡
Vue.directive('stopDrag', function (el) {
  let element = el
  element.onmousedown = function (e) {
    e.stopPropagation()
  }
})