<template>
  <div id="app">
    <div class="but-control">
      <el-button @click="isOpen = true">打开窗口1</el-button>
      <el-button @click="isOpen = false">关闭窗口1</el-button>
      <el-button @click="isOpen1 = true">打开窗口2</el-button>
      <el-button @click="isOpen1 = false">关闭窗口2</el-button>
      <el-button @click="closeWebsocket">断开连接</el-button>
    </div>
    <i-m ref="im" :isOpen="isOpen" :wsurl="wsurl" :userCode="userCode" :userName="userName" :userCompany="userCompany" :token="token" :options="options" :sessionListApi="sessionList" :messageListApi="messageListApi" @closeSession="closeSession" />

    <i-m ref="im1" :isOpen="isOpen1" :wsurl="wsurl1" :userCode="userCode1" :userName="userName1" :userCompany="userCompany1" :token="token1" @closeSession="closeSession" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      isOpen: true,
      wsurl: 'ws://192.168.101.27:8081/chat/98F19003?DEVICE=WEB',
      userCode: '98F19003',
      userName: '王晓赛',
      userCompany: '石家庄',
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OEYxOTAwMyIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYyNDUwNTQ5MzM0NywiZXhwIjoxNjI1MTEwMjkzfQ.CjAHCd5swzD2a3u4bdBrf6YsqK3C3NUtfRWYxRkMSImGb1rgrfFQm5cpep7ib5JRTH06PPZvoGswC1u4IURRPQ',
      requestProxy:'api/',
      sessionList: 'manage/im/session/search',
      messageListApi: 'im/message/search/offline/message',
      options: {
        addOneself: true,
      },
      // 聊天窗口2参数
      isOpen1: false,
      wsurl1: 'ws://192.168.101.27:8081/chat/98F19004?DEVICE=WEB',
      userCode1: '98F19004',
      userName1: '胡安',
      userCompany1: '石家庄',
      token1: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OEYxOTAwNCIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYyNDg3MjIzNzI3NywiZXhwIjoxNjI1NDc3MDM3fQ.xxJEGGeS1VXngX7R1ddazX2XkEj7o5hmTz__WIgzI4217iP8q7vKXobkXdOE50pIKMMVLCNATdihGwvZE5VPww'
    }
  },
  methods: {
    closeSession(val) {
      this.isOpen = val
      this.isOpen1 = val
    },
    closeWebsocket() {
      this.$refs.im.closeWebsocket()
      this.$refs.im1.closeWebsocket()
    }
  }
}
</script>

<style scoped>
.but-control{
  text-align: center;
  padding: 10px  0;
}
</style>