<template>
  <div id="app">
    <div class="but-control">
      <el-button @click="isOpen = true">打开窗口</el-button>
      <el-button @click="isOpen = false">关闭窗口</el-button>
      <el-button @click="closeWebsocket">断开连接</el-button>
    </div>
    <i-m ref="im" :isOpen="isOpen" :wsurl="wsurl" :userCode="userCode" :userName="userName" :userCompany="userCompany" :token="token" :sessionListApi="sessionList" :messageListApi="messageListApi" @closeSession="closeSession" />
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
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OEYxOTAwMyIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYyMzMwOTIzNDk3MSwiZXhwIjoxNjIzOTE0MDM0fQ.50Nnoh-cLmPzLNG2zO9oaN1e40qZwP5uLYG3J1FoseagFo1rabtWNh-Mc5eJ0Sn8QIyihkTipISFIF54cANEvg',
      requestProxy:'api/',
      sessionList: 'manage/im/session/search',
      messageListApi: 'im/message/search/offline/message',
    }
  },
  methods: {
    closeSession(val) {
      this.isOpen = val
    },
    closeWebsocket() {
      this.$refs.im.closeWebsocket()
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