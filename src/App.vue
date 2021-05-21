<template>
  <div id="app">
    <div class="but-control">
      <el-button @click="isOpen = true">打开窗口</el-button>
      <el-button @click="isOpen = false">关闭窗口</el-button>
    </div>
    <i-m :isOpen="isOpen" :wsurl="wsurl" :userCode="userCode" :userName="userName" :token="token" :sessionListApi="sessionList" :messageListApi="messageListApi" @closeSession="closeSession" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      isOpen: true,
      wsurl: 'ws://192.168.101.69:8081/chat/98F19003?DEVICE=WEB',
      userCode: '98F19003',
      userName: '王晓赛',
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OEYxOTAwMyIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYyMTQxNDIyNzk3MCwiZXhwIjoxNjIyMDE5MDI3fQ.fVk-F1cJstjuhQ8hawrl-bQCxZYS174ulb76z7bVigifK9J6eXDsW2CLxGLJxd00GhrHE9bRWhz8Iw4r4f7SnA',
      // wsurl: 'ws://qa-im.bestlvs.com/chat/b4aaa22423a944aca4776fbadcf290b0?DEVICE=WEB',
      // userCode: 'b4aaa22423a944aca4776fbadcf290b0-A',
      // userName: '万斌峰',
      // token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3akB5eWFrLmNvbS5jbiIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYyMTQ4NTAxNTc4NiwiaXNzIjoieG1uLWJhY2tzdGFnZSIsImV4cCI6MTYyMjA4OTgxNX0.KZvcRIiOWAP9JbopsJQP7Ez6lCk8rjbSBXyzAKM6RfQ0FYzbgaF_Fo273p0zHor1w21qHUUsI2YJZQiUyBm4xA',
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

