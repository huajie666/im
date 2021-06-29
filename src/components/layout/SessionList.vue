<template>
  <ul class="cs-session-list">
    <li class="cs-item" v-for="item of sessionListFilter" :class="{currentItem: currentSessionId === item.sessionId}" :key="item.sessionId" @click="chat(item)" @contextmenu.prevent="stick(item,$event)">
      <span class="cs-triangle" v-show="item.toppingDate" />
      <span class="cs-head" :class="{onLine: onlineEmployees.includes(item.chatTarget) || item.sessionType === 2}">
        <span v-if="item.sessionType === 1">{{hiddenSurname(item.sessionName)}}</span>
        <i v-else class="im-iconfont im-icon-qun" />
      </span>
      <span class="cs-info">
        <span class="cs-name" :title="item.sessionName">{{item.sessionName}}</span>
        <span class="cs-count" v-show="item.offReadCount > 0">+{{ item.offReadCount }}</span>
      </span>
      <span class="cs-message" :title="item.lastMessage">{{ item.lastMessage }}</span>
    </li>
  </ul>
</template>

<script>
import { twoSurname } from './../../utils/common'
export default {
  name: 'SessionList',
  data() {
    return {
      // 截取姓氏
      hiddenSurname(val) {
        if(!val) {
          return
        }
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
    keyword: String,
    currentSessionId: String,
    sessionList: Array,
    onlineEmployees: Array
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
  .cs-session-list {
    position: absolute;
    width: 200px;
    height: calc(~"100% - 55px");
    top: 55px;
    font-size: 12px;
    cursor: pointer;
    overflow-x: hidden;
    overflow-y: auto;
    border-right: 1px solid #cccccc;
    box-sizing: border-box;
    .cs-item {
      position: relative;
      float: left;
      width: 100%;
      height: 60px;
      border-bottom: 1px solid #cccccc;
      padding: 10px 5px 10px 20px;
      box-sizing: border-box;
      .cs-triangle {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        border-width: 0 0 10px 10px;
        border-color: transparent #1188ee;
        border-style: solid;
      }
      .cs-head {
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
      .cs-info {
        float: left;
        width: calc(100% - 45px);
        height: 50%;
        line-height: 20px;
        font-weight: bold;
        .cs-name {
          float: left;
          width: 80%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .cs-count {
          float: left;
          width: 20%;
          color: #18e
        }
      }
      .cs-message {
        float: left;
        width: calc(100% - 45px);
        height: 50%;
        line-height: 20px;
        color: #666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
      }
      .onLine {
        background-color: #1188ee;
      }
    }
    .cs-item:hover{
      color: #409eff;
      background-color: #def;
    }
    .currentItem {
      color: #409eff;
      background-color: #def;
    }
  }
</style>