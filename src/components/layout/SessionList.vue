<template>
  <ul class="yc-session">
    <li class="yc-item" v-for="item of sessionListFilter" :class="{currentId:currentSessionId === item.sessionId}" :key="item.sessionId" @click="chat(item)" @contextmenu.prevent="stick(item,$event)">
      <span class="yc-triangle" v-show="item.toppingDate" />
      <span class="yc-head" :class="{active:onlineEmployees.includes(item.chatTarget) || item.sessionType === 2}">
        <span v-if="item.sessionType ===1">{{hiddenSurname(item.sessionName)}}</span>
        <i v-else class="iconfont icon-qun" />
      </span>
      <span class="yc-name">
        {{item.sessionName}}
        <span v-show="item.offReadCount > 0" style="color:#18e">+{{ item.offReadCount }}</span>
      </span>
      <span class="yc-message">{{ item.lastMessage }}</span>
    </li>
  </ul>
</template>

<script>
import { twoSurname } from './../../utils/common'
export default {
  name: 'SessionList',
  data() {
    return {
      // 截取姓氏val
      hiddenSurname(val) {
        if (twoSurname.includes(val.substring(0, 2))) {
          name = val.substring(2)
        } else {
          name = val.substring(1)
        }
        return name
      },
    }
  },
  props: {
    keyword: {
      type: String
    },
    currentSessionId: {
      type: String
    },
    sessionList: {
      type: Array
    },
    onlineEmployees: {
      type: Array
    }
  },
  computed: {
    sessionListFilter() {
      return this.sessionList.filter(item => {
        return item.sessionName.includes(this.keyword)
      })
    }
  },
  methods: {
    chat(item) {
      this.$emit('chat',item)
    },
    stick(item,e){
      item.e = e
      this.$emit('stick',item)
    }
  },
}
</script>

<style lang="less" scoped>
  .yc-session {
    position: absolute;
    width: 200px;
    height: calc(100% - 55px);
    top: 55px;
    cursor: pointer;
    overflow-x: hidden;
    overflow-y: auto;
    border-right: 1px solid #cccccc;
    box-sizing: border-box;
    .yc-item {
      position: relative;
      float: left;
      width: 100%;
      height: 60px;
      border-bottom: 1px solid #cccccc;
      padding: 10px 5px 10px 20px;
      box-sizing: border-box;
      .yc-triangle {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        border-width: 0 0 10px 10px;
        border-color: transparent #1188ee;
        border-style: solid;
      }
      .yc-head {
        float: left;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        background-color: #ccc;
        color: #fff;
        margin-right: 5px;
      }
      .yc-name {
        float: left;
        width: calc(100% - 45px);
        height: 50%;
        line-height: 20px;
        font-weight: bold;
      }
      .yc-message {
        float: left;
        width: calc(100% - 45px);
        height: 50%;
        line-height: 20px;
        color: #666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
      }
      .active {
        background-color: #1188ee;
      }
    }
    .yc-item:hover{
      color: #409eff;
      background-color: #def;
    }
    .currentId {
      color: #409eff;
      background-color: #def;
    }
  }
</style>