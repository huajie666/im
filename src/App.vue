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
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OEYxOTAwMyIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYxOTUwMzA3NTU1MiwiZXhwIjoxNjIwMTA3ODc1fQ.cVziFxKjKzePIkUudmRil_oKnezZXX1kibQuBHJABf3khgsdP1-F7ouw14N6P1tLKlOzMz_on40IV1Mk1dLXLg',
      sessionList: 'api/manage/im/session/search',
      messageListApi: 'api/im/message/search/offline/message',
    }
  },
  methods: {
    closeSession(val) {
      this.isOpen = val
    }
  }
}
</script>

