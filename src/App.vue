<template>
  <div id="app">
    <div class="but-control">
      <el-button @click="isOpen = true">打开窗口</el-button>
      <el-button @click="isOpen = false">关闭窗口</el-button>
    </div>
    <i-m :isOpen="isOpen" :wsurl="wsurl" :userCode="userCode" :userName="userName" :userCompany="userCompany" :token="token" :sessionListApi="sessionList" :messageListApi="messageListApi" @closeSession="closeSession" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      isOpen: true,
      wsurl: 'ws://192.168.101.27:8081/chat/98F19004?DEVICE=WEB',
      userCode: '98F19004',
      userName: '胡安',
      userCompany: '石家庄',
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OEYxOTAwNCIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYyMjE5ODIwMjMwNywiZXhwIjoxNjIyODAzMDAyfQ.HiTx-pVSadDSE7NU4eVSYvrSDxs1XkmmrSnwFVUClIdPPKUkP6lapxo0_tiOjZuSkn0x5ksqmIJLJTi0tQzYFA',
      requestProxy:'api/',
      sessionList: 'manage/im/session/search',
      messageListApi: 'im/message/search/offline/message',
    }
  },
  methods: {
    closeSession(val) {
      this.isOpen = val
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