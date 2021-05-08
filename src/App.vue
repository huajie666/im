<template>
  <div id="app">
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
      requestProxy:'api/',
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OEYxOTAwMyIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYyMDQ0Mjk4MTY4NCwiZXhwIjoxNjIxMDQ3NzgxfQ.yA8BBw2nO6reTZGv3v6-AvN-PUx9aZnt_GCd3DSCnsG6u16RudFhaqXrMYT53WXGrMaJh5LnUF1SVJKLUTQVTw',
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

