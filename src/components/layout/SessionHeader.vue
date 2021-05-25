<template>
  <div class="yc-header" :style="{width:headerWidth}">
    <input type="text" v-model="keyword" v-stop-im-drag>
    <i class="im-iconfont im-icon-sms yc-sms" :class="{active: isSession}" v-stop-im-drag @click="changePage(true)"/>
    <i class="im-iconfont im-icon-tongxunlu yc-tongxunlu" :class="{active: !isSession}" v-stop-im-drag @click="changePage(false)"/>
    <i class="im-iconfont im-icon-delete yc-delete" v-stop-im-drag @click="close"/>
  </div>
</template>

<script>
export default {
  name: 'SessionHeader',
  data() {
    return {
      keyword: '',
    }
  },
  props: {
    isSession: {
      type: Boolean
    },
    isShowGroupMembers: {
      type: Boolean
    }
  },
  directives: {
    'stop-im-drag': {
      bind(el) {
        let element = el
        element.onmousedown = function (e) {
          e.stopPropagation()
        }
      }
    }
  },
  watch: {
    keyword(val) {
      this.$emit('changeKeyword',val)
    }
  },
  computed: {
    headerWidth() {
      let headerWidth
      if (this.isShowGroupMembers && this.isSession) {
        headerWidth = `900px`
      } else {
        headerWidth = `750px`
      }
      return headerWidth
    }
  },
  methods: {
    changePage(val) {
      this.$emit('changeSessionPage',val)
    },
    close() {
      this.$emit('closeSession')
    }
  }
}
</script>

<style lang="less" scoped>
  .yc-header {
    position: relative;
    height: 55px;
    background-color: #2b3141;
    box-shadow: 5px 0 10px rgba(0, 0, 0, 0.3);
    input {
      position: absolute;
      left: 10px;
      top: 12px;
      width: 180px;
      height: 28px;
      padding: 0 5px;
      outline:none;
      border : none;
      box-sizing: border-box;
    }
    i {
      color: #ccc;
      position: absolute;
      font-size: 20px;
      cursor: pointer;
    }
    .yc-sms {
      left: 210px;
      top: 16px;
    }
    .yc-tongxunlu {
      left: 240px;
      top: 16px;
    }
    .yc-delete {
      right: 10px;
      top: 16px;
    }
    .active {
      color: #18e;
    }
  }
</style>