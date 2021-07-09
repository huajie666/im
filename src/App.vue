<template>
  <div id="app">
    <div class="but-control">
      <el-button @click="isOpen = true">打开窗口</el-button>
      <el-button @click="isOpen = false">关闭窗口</el-button>
      <el-button @click="closeWebsocket">断开连接</el-button>
      <el-button @click="switchAccount">切换账号</el-button>
    </div>
    <el-form v-model="form" :inline="true" style="padding-left: 20px">
      <el-form-item label="登录者code">
        <el-input v-model="form.userCode" size="mini" />
      </el-form-item>
      <el-form-item label="登录者name">
        <el-input v-model="form.userName" size="mini" />
      </el-form-item>
      <el-form-item label="登录者company">
        <el-input v-model="form.userCompany" size="mini" />
      </el-form-item>
      <el-form-item label="登录者wsurl">
        <el-input v-model="form.wsurl" size="mini" style="width: 350px" />
      </el-form-item>
      <el-form-item label="登录者token">
        <el-input v-model="form.token" size="mini" style="width: 350px" />
      </el-form-item>
    </el-form>
    <i-m ref="im" v-if="isCreated" :isOpen="isOpen" :wsurl="wsurl" :userCode="userCode" :userName="userName" :userCompany="userCompany" :token="token" :options="options"  @closeSession="closeSession" />
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
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5OEYxOTAwMyIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTYyNTgxMDc2MjkwMiwiZXhwIjoxNjI2NDE1NTYyfQ.eOfUO9-VcOu3hAnKorJHZ1KitSh39b2qcBJ1iPhItgeZ9TZ5o5te88LWwrGWX328MNtpJ0oMPH6UVByk6M50IA',
      options: {
        addOneself: true, // 添加群时是否自动添加本人,默认不添加。
        // reconnectionCount: 3, // 非主动断开连接时重连次数,默认一直重连。
      },
      isCreated: true,
      form: {
        userCode: '',
        userName: '',
        userCompany: '',
        wsurl: '',
        token: ''
      }
    }
  },
  created() {
    this.form.userCode = this.userCode
    this.form.userName = this.userName
    this.form.userCompany = this.userCompany
    this.form.wsurl = this.wsurl
    this.form.token = this.token
  },
  methods: {
    closeSession(val) {
      this.isOpen = val
    },
    closeWebsocket() {
      this.$refs.im.closeWebsocket()
    },
    switchAccount() {
      this.isCreated= false
      this.userCode = this.form.userCode
      this.userName = this.form.userName
      this.userCompany = this.form.userCompany
      this.wsurl = this.form.wsurl
      this.token = this.form.token
      this.$nextTick(()=>{
        this.isCreated= true
      })
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