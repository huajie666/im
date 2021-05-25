<template>
  <div>
    <div v-for="item of treeData" :key="item.id">
      <div class="cs-item" :style="{paddingLeft: item.index*10+'px'}" v-if="item.hasChild" @click="item.expand = !item.expand">
        <i class="yc-company-icon im-iconfont im-icon-qiye" />
        <span>{{item.name}}</span>
        <i class="yc-down-arrow im-iconfont im-icon-arrow-bottom" :class="{roteate: item.expand}" />
      </div>
      <div class="cs-item" :style="{paddingLeft: item.index*10+'px'}" v-else @click="viewInfo(item)" @dblclick="openSession(item)">
        <i class="yc-contacts-icon im-iconfont im-icon-yuangong" :class="{active: item.nodeType === 'LEAF' && onlineEmployees.includes(item.code)}" />
        <span :class="{active: selectId===item.id}">{{item.name}}</span>
      </div>
      <ul v-show="item.expand">
        <contacts :treeData="item.children" :onlineEmployees="onlineEmployees" :selectId="selectId" :treeType="treeType"></contacts>
      </ul>
    </div>
  </div>
</template>

<script>
import bus from './../../eventBus'
export default {
  name: 'Contacts',
  props: {
    treeData: {
      type: Array,
      default() {
        return []
      }
    },
    onlineEmployees: {
      type: Array,
      default() {
        return []
      }
    },
    selectId: String,
    treeType: String
  },
  data() {
    return {
      timer: null, //定时器用于区分单击和双击
    }
  },
  methods: {
    viewInfo(item) {
      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        if(this.treeType === 'group') {
          bus.$emit('groupInfo',item.id)
        } else {
          bus.$emit('employeeInfo',item)
        }
      },300)
    },
    openSession(item) {
      clearTimeout(this.timer)
      if(this.treeType === 'group') {
        bus.$emit('groupSession',item)
      } else {
        bus.$emit('employeeSession',item)
      }
    }
  }
}
</script>

<style scoped>
.cs-item {
  height: 32px;
  line-height: 32px;
  color: rgb(153, 153, 153);
  cursor: pointer;
  padding: 0 10px;
  box-sizing: border-box;
}
.cs-item:hover {
  background-color: rgb(217, 236, 255);
}
.yc-down-arrow {
  float: right;
  transition: transform .3s;
  color: rgb(153, 153, 153);
}
.yc-company-icon {
  color: #18e;
  vertical-align: top;
}
.yc-contacts-icon {
  vertical-align: top;
}
.roteate {
  transform: rotate(180deg)
}
.active {
  color: #409eff;
}
</style>