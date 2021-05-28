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
      wsurl: 'ws://192.168.101.27:8081/chat/98F19003?DEVICE=WEB',
      userCode: '98F19003',
      userName: '王晓赛',
      userCompany: '石家庄',
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OEYxOTAwMyIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYyMjAyNDQ2MTM5MiwiZXhwIjoxNjIyNjI5MjYxfQ.OIl67C-4w30cJtfP8m0RP-YuJM-PUaxvGcBRJ7_Ryh_VXOX-rSOBpr4bmq5ZD34gU9iJ-NYFMUT2IYcci-IfGA',
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

<style >
.but-control{
  text-align: center;
  padding: 10px  0;
}
</style>