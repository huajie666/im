<template>
  <div class="im-plug">
    <div class="im-main" v-im-drag v-show="isOpen">
      <session-header :isSession="isSession" :isShowGroupMembers="isShowGroupMembers" :isShowGroupTurnOver="isShowGroupTurnOver" @changeKeyword="changeKeyword" @changeSessionPage="changeSessionPage" @closeSession="closeSession"></session-header>
      <div v-show="isSession">
        <session-list :keyword="keyword" :currentSessionId="currentSessionId" :sessionList="sessionList" :onlineEmployees="onlineEmployees" @chat="chat" @stick="stick"></session-list>
        <session-message ref="sessionMessage" v-show="currentInfo.sessionName" :userCode="userCode" :currentInfo="currentInfo" :employeesObj="employeesObj" :messageList="messageList" :lastPageNum="lastPageNum" :unreadNum="unreadNum" :newMessage="newMessage" :onlineEmployees="onlineEmployees" :currentSessionId="currentSessionId" :requestProxy="requestProxy" :uploadingApi="uploadingApi" :uploadSize="uploadSize" :uploadType="uploadType" @loadMore="loadMore" @viewNewMessage="viewNewMessage" @viewGroupMembers="viewGroupMembers" @unfoldTurnOver="unfoldTurnOver" @sendMessage="sendMessage" @previewImg="previewImg" @createGroup="createGroup"></session-message>
        <group-members v-show="isShowGroupMembers" :isShowGroupMembers="isShowGroupMembers" :groupMembers="groupMembers" :onlineEmployees="onlineEmployees" :userCode="userCode" :http="http" :requestProxy="requestProxy" :groupMemberInfoApi="groupMemberInfoApi" @initiateChat="initiateChat"></group-members>
        <turn-over ref="turnOver" v-show="isShowGroupTurnOver" :isShowGroupTurnOver="isShowGroupTurnOver" :userName="userName" :userCompany="userCompany" @turnOver="turnOver"></turn-over>
      </div>
      <div v-show="!isSession">
        <address-book ref="addressBook" :userCode="userCode" :userName="userName" :userCompany="userCompany" :options="options" :isGroupInfo="isGroupInfo" :groupInfo="groupInfo" :onlineEmployees="onlineEmployees" :keyword="keyword" :http="http" :groupInfoApi="groupInfoApi" :requestProxy="requestProxy" :groupMemberInfoApi="groupMemberInfoApi" @changeGroupInfo="changeGroupInfo" @changeEmployeeInfo="changeEmployeeInfo" @addEmployee="addEmployee" @initiateChat="initiateChat" />
        <div class="im-info" v-if="isShowInfo">
          <group-info ref="groupInfo" v-if="isGroupInfo" :groupInfo="groupInfo" :userCode="userCode" :options="options" @changeGroupInfo="changeGroupInfo" @hiddenInfo="hiddenInfo" @delEmployee="delEmployee" @saveGroup="saveGroup" @delGroup="delGroup" />
          <employee-info v-else :employeeInfo="employeeInfo" :userCode="userCode" @initiateChat="initiateChat"></employee-info>
        </div>
      </div>
    </div>
    <ul v-show="stickWindow" class="im-stick" :style="{left:stickLeft+'px',top:stickTop+'px'}">
      <li v-if="!isStick" @click="changeStick">聊天置顶</li>
      <li v-else @click="changeStick">取消置顶</li>
    </ul>
    <div ref="viewer" v-show="false">
      <img v-for="src in images" :src="src" :key="src">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ViewerJs from 'viewerjs'
import { isExistChat } from './../utils/common'
import SessionHeader from './layout/SessionHeader'
import SessionList from './layout/SessionList'
import SessionMessage from './layout/SessionMessage'
import GroupMembers from './layout/GroupMembers'
import AddressBook from './layout/AddressBook'
import GroupInfo from './layout/GroupInfo'
import EmployeeInfo from './layout/EmployeeInfo'
import TurnOver from './layout/TurnOver'
export default {
  name: 'IM',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    wsurl: String,
    userCode: String,
    userName: String,
    userCompany: String,
    token: String,
    options: {
      type: Object,
      default: ()=>({})
    },
    requestProxy: {
      type: String,
      default: 'api/'
    },
    sessionListApi: {
      type: String,
      default: 'manage/im/session/search'
    },
    messageListApi: {
      type: String,
      default: 'im/message/search/offline/message'
    },
    groupMemberInfoApi: {
      type: String,
      default: 'employee/searchContactsInfos'
    },
    groupApi: {
      type: String,
      default: 'manage/im/group/info/listGroups'
    },
    groupInfoApi: {
      type: String,
      default: 'manage/im/group/info/selectGroupInfo'
    },
    contactsApi: {
      type: String,
      default: 'employee/group/list'
    },
    addGroupApi: {
      type: String,
      default: 'manage/im/group/info/save'
    },
    editGroupApi: {
      type: String,
      default: 'manage/im/group/info/update'
    },
    delGroupApi: {
      type: String,
      default: 'manage/im/group/info/delete'
    },
    stickApi: {
      type: String,
      default: 'im/session/topping'
    },
    uploadingApi: {
      type: String,
      default: 'storage/file'
    },
    turnOverApi: {
      type: String,
      default: 'im/message/turnover'
    },
    uploadSize: {
      type: Number,
      default: 20
    },
    uploadType: {
      type: String,
      default: ''
    },
    onlineSimultaneously: {
      type: Boolean,
      default: true
    }
  },
  directives: {
    'im-drag': {
      bind(el) {
        let oDiv = el
        let dragPart = oDiv.children[0]
        dragPart.onmousedown = (e) => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - oDiv.offsetLeft
          let disY = e.clientY - oDiv.offsetTop
          document.onmousemove = (e) => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX
            let top = e.clientY - disY
            if (top < 0) {
              top = 0
            }
            if (top > document.body.clientHeight - 55) {
              top = top > document.body.clientHeight - 55
            }
            if (left < -100) {
              left = -100
            }
            if (left > document.body.clientWidth + 100) {
              left = document.body.clientWidth + 100
            }
            //移动当前元素
            oDiv.style.left = left + 'px'
            oDiv.style.top = top + 'px'
          }
          document.onmouseup = () => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  data() {
    return {
      http: null,
      keyword: '',
      isSession: true, //是否会话页 false表示通讯录页面
      currentSessionId: '', //当前会话id
      sessionList: [], //会话列表
      messageList: [], //当前会话消息列表
      lastPageNum: 0, //当前会话没有加载完的历史消息
      unreadNum: 0, //当前会话未读消息数
      newMessage: 0, //查看聊天记录接收到的新消息
      currentInfo: {}, //当前聊天信息
      onlineEmployees: [], //在线员工列表
      employeesObj: {}, //存储有关联员工键值对
      localData: {}, //已经获取的会话消息列表存储
      localInfo: {}, //已经获取的会话消息内容存储
      isShowInfo: false, //是否展示信息区
      isGroupInfo: false, //当前选中的是否是群消息
      groupInfo: {}, //群信息
      employeeInfo: {}, //员工信息
      isReconnect: true, //是否需要重新连接
      groupMembers: [], //群成员列表
      isShowGroupMembers: false, //是否显示群成员列表
      isShowGroupTurnOver: false, // 是否显示移交列表
      newNotify: null,
      stickWindow: false, //置顶弹窗
      stickId: '',
      stickLeft: 0,
      stickTop: 0,
      isStick: false,
      images: [],
      viewer: null
    }
  },
  components: {
    SessionHeader,
    SessionList,
    SessionMessage,
    GroupMembers,
    AddressBook,
    GroupInfo,
    EmployeeInfo,
    TurnOver
  },
  mounted() {
    // 创建axios实例
    this.http = axios.create({
      timeout: 12000
    })
    //  拦截添加token
    this.http.interceptors.request.use(
      config => {
        if (this.token) {
          config.headers['Authorization'] = this.token
        }
        return config
      },
      error => {
        Promise.reject(error)
      }
    )
    this.initWebSocket()
    this.getSessionList()
    this.getGroup()
    this.getContacts()
    this.getTurnOverContacts()
  },
  beforeDestroy() {
    this.closeWebsocket()
  },
  watch: {
    currentSessionId: {
      handler(val) {
        if(this.localData.hasOwnProperty(val)) {
          this.messageList = this.localData[val]
          this.lastPageNum = this.localInfo[val].lastPageNum
          this.unreadNum = this.localInfo[val].unreadNum
          this.updateReadStatus()
        } else {
          let data = {
            employeeCode: this.userCode,
            sessionId: val,
          }
          this.http.post(this.requestProxy + this.messageListApi,data).then(res=>{
            if(res.data.resultCode !== 0) {
              if(res.data.resultMsg) {
                this.$message.warning(res.data.resultMsg)
                return
              }
              this.$message.warning('系统异常，请联系管理员！')
              return
            }
            if(res.data.data) {
              this.messageList = res.data.data.messageList
              this.lastPageNum = res.data.data.lastPageNum
              this.unreadNum = res.data.data.omCount
              this.localInfo[val] = {
                lastPageNum: res.data.data.lastPageNum,
                unreadNum: res.data.data.omCount
              }
              this.updateReadStatus()
            }
          })
        }
      },
      deep: true,
    },
    messageList: {
      handler(value) {
        this.images = []
        value.forEach(item => {
          if (item.content.file && item.content.file.imgUrl) {
            this.images.push(item.content.file.url)
          }
        });
        this.localData[this.currentSessionId] = value
      },
      deep: true,
      immediate: true
    },
    isOpen: {
      handler(val) {
        if(val) {
          if(this.messageList.length) {
            this.updateReadStatus()
          }
        }
      },
      deep: true
    },
    stickWindow(val) {
      if (val) {
        document.body.addEventListener("click", this.closeStick);
      } else {
        document.body.removeEventListener("click", this.closeStick);
      }
    }
  },
  methods: {
    // WebSocket连接
    initWebSocket() {
      let token = `Authorization-${this.token}`
      this.webscoket = new WebSocket(this.wsurl, [token, "stomp"])
      this.webscoket.onopen = this.websocketonopen
      this.webscoket.onmessage = this.websocketonmessage
      this.webscoket.onclose = this.websocketclose
    },
    // 连接成功
    websocketonopen() {
      console.log('---连接成功')
    },
    // 接收到的推送消息
    websocketonmessage(e) {
      let data = JSON.parse(e.data)
      console.log(data,`${this.userName}接收消息`)
      // 后台推送断开消息，不需要重连
      if(data.RepetitionLoggingIn && !onlineSimultaneously) {
        this.isReconnect = false
        return
      }
      // 获取在线员工
      if(data.type === 'ONLINE_EMPLOYEES') {
        this.onlineEmployees = data.content.onlineEmployees
        return
      }
      if(data.type === 'ACTION_SERVER_2_USER') {
        // 关联员工上线
        if(data.content.type === 'USER_ONLINE') {
          this.onlineEmployees.push(data.from)
          return
        }
        // 关联员工下线
        if(data.content.type === 'USER_OFFLINE') {
          this.onlineEmployees.forEach((val, index) => {
            if (val === data.from) {
              this.onlineEmployees.splice(index, 1)
            }
          })
          return
        }
      }
      // 关联群变化
      if(data.type === 'GROUP_UPDATE_STATUS') {
        this.getGroup()
        return
      }
      // 刷新会话列表
      if(data.type === 'ACTION_RENEW_SESSION_LIST') {
        if(data.sessionId === this.currentSessionId) {
          this.currentInfo.sessionName = ''
          this.isShowGroupTurnOver = false
        }
        this.getSessionList()
      }
      if(data.sessionId) {
        let that = this
        // 推送消息是否为当前聊天消息
        if(data.sessionId === this.currentSessionId) {
          // 收到个人聊天消息和群消息
          if(data.type === 'PRIVATE' || data.type === 'GROUP') {
            let toppingDateIndex = 0
            this.sessionList.forEach((item,index)=> {
              if(item.toppingDate) {
                toppingDateIndex++
              }
              if (item.sessionId === data.sessionId) {
                this.sessionList.splice(index, 1)
                if(data.content.file) {
                  item.lastMessage = data.content.file.isImg === 1 ? '[图片]' : '[文件]'
                } else {
                  item.lastMessage = data.content.message
                }
                if(data.from !== this.userCode && !this.isOpen) {
                  item.offReadCount++
                  this.unreadNum++
                  this.localInfo[data.sessionId].unreadNum++
                }
                if (item.toppingDate) {
                  this.sessionList.unshift(item)
                } else {
                  this.sessionList.splice(toppingDateIndex, 0, item)
                }
              }
            })
            if(this.isOpen) {
              if(data.from !== this.userCode) {
                data.content.isReadList.push(this.userCode)
              }
              this.messageList.push(data)
              let chatArea = document.getElementsByClassName("yc-content") //聊天区域
              this.$nextTick(()=>{
                if(chatArea[0].scrollTop + chatArea[0].clientHeight*2 < chatArea[0].scrollHeight) {
                  if(data.from !== this.userCode){
                    this.newMessage++
                  }
                } else {
                  chatArea[0].scrollTop = chatArea[0].scrollHeight
                }
                if(data.from !== this.userCode) {
                  let sendDate = {
                    sessionId: this.currentSessionId,
                    from: data.from,
                    to: this.userCode,
                    type: "READ_UNREAD",
                    content: { type: data.type, messageId: [data.messageId] },
                    timestamp: new Date().getTime(),
                  }
                  this.webscoket.send(JSON.stringify(sendDate))
                }
                return
              })
            } else {
              this.messageList.push(data)
              if(data.from !== this.userCode) {
                if (this.newNotify) {
                  this.newNotify.close()
                }
                let messageContent
                if(data.content.file){
                  messageContent = data.content.file.isImg ===1 ? '[图片]' : '[文件]'
                } else {
                  messageContent = data.content.message
                }
                this.newNotify = this.$notify.info({
                  title: "消息",
                  message: `<p class="im-notify">${data.fromName}:${messageContent}</p>`,
                  dangerouslyUseHTMLString: true,
                  duration: 2000,
                  onClick() {
                    that.isOpen = true
                  }
                })
              }
            }
          }
          // 关联消息已读
          if(data.type === 'ACTION_SERVER_2_USER') {
            let messageIdList = []
            data.content.readStatus.forEach(item => {
              messageIdList.push({
                id:item.messageId,
                isReadList:item.isReadList,
                isRead:item.isRead
              })
            })
            this.messageList.forEach(item => {
              messageIdList.some(obj => {
                if (obj.id === item.messageId) {
                  item.content.isReadList = obj.isReadList
                  item.content.isRead = obj.isRead
                }
              })
            })
            return
          }
          // 发送状态处理
          if(data.type === "ACTION_MESSAGE_STATUS") {
            this.messageList.forEach(item => {
              if(item.timestamp === data.timestamp) {
                if (data.content.status === "ok") {
                  item.messageId = data.messageId
                  item.content.sendStatys = null
                } else {
                  item.content.sendStatys = "error"
                  item.content.errorReason = data.content.status
                }
              }
            })
          }
        } else {
          // 收到个人聊天消息和群消息
          if(data.type === 'PRIVATE' || data.type === 'GROUP') {
            if(!this.isOpen && data.from !== this.userCode) {
              if (this.newNotify) {
                this.newNotify.close()
              }
              let messageContent
              if(data.content.file){
                messageContent = data.content.file.isImg === 1 ? '[图片]' : '[文件]'
              } else {
                messageContent = data.content.message
              }
              this.newNotify = this.$notify.info({
                title: "消息",
                message: `<p class="im-notify">${data.fromName}:${messageContent}</p>`,
                dangerouslyUseHTMLString: true,
                duration: 2000,
                onClick() {
                  that.isOpen = true
                }
              })
            }
            let chatTarget = data.type === "PRIVATE" ? data.from : data.to
            let isExist = isExistChat(this.sessionList,chatTarget) // 当前会话列表是否存在
            if(isExist) {
              if(this.localData.hasOwnProperty(data.sessionId)){
                this.localData[data.sessionId].push(data)
                this.localInfo[data.sessionId].unreadNum++
              }
              let toppingDateIndex = 0
              this.sessionList.forEach((item,index)=> {
                if(item.toppingDate) {
                  toppingDateIndex++
                }
                if (item.sessionId === data.sessionId) {
                  this.sessionList.splice(index, 1)
                  item.lastMessage = data.content.message
                  if(data.from !== this.userCode) {
                    item.offReadCount++
                  }
                  if (item.toppingDate) {
                    this.sessionList.unshift(item)
                  } else {
                    this.sessionList.splice(toppingDateIndex, 0, item)
                  }
                }
              })
            } else {
              let type = data.type === "PRIVATE" ? "1" : "2"
              let params = {
                searchType: "0",
                employeeCode: this.userCode,
                sessionType: type,
                chatTarget: chatTarget
              }
              this.http.post(this.requestProxy + this.sessionListApi,params).then(res=>{
                if(res.data.resultCode !== 0) {
                  if(res.data.resultMsg) {
                    this.$message.warning(res.data.resultMsg)
                    return
                  }
                  this.$message.warning('系统异常，请联系管理员！')
                  return
                }
                if(res.data.data) {
                  this.sessionList = res.data.data
                  if(data.type === 'PRIVATE'){
                    this.employeesObj[data.from] = data.fromName
                  }
                }
              })
            }
            return
          }
          // 关联消息已读
          if(data.type === 'ACTION_SERVER_2_USER') {
            if(this.localData.hasOwnProperty(data.sessionId)){
              let messageIdList = []
              data.content.readStatus.forEach(item => {
                messageIdList.push({
                  id: item.messageId,
                  isReadList: item.isReadList,
                  isRead: item.isRead
                })
              })
              this.localData[data.sessionId].forEach(item=>{
                messageIdList.some(obj => {
                  if (obj.id === item.messageId) {
                    item.content.isReadList = obj.isReadList
                    item.content.isRead === obj.isRead
                  }
                })
              })
              return
            }
          }
           // 发送状态处理
          if(data.type === "ACTION_MESSAGE_STATUS") {
            this.localData[data.sessionId].forEach(item => {
              if (item.timestamp === data.timestamp) {
                if (data.content.status === "ok") {
                  item.messageId = data.messageId
                  item.content.sendStatys = null
                } else {
                  item.content.sendStatys = "error"
                  item.content.errorReason = data.content.status
                }
              }
            })
          }
        }
      }
    },
    // 连接断开
    websocketclose() {
      console.log('---连接断开')
    },
    // 关闭websocket
    closeWebsocket() {
      this.webscoket.close()
    },
    // 查询关键字改变
    changeKeyword(val) {
      this.keyword = val
    },
    // 聊天页和通讯录切换
    changeSessionPage(val) {
      this.isSession = val
    },
    // 隐藏聊天窗口
    closeSession() {
      this.$emit('closeSession',false)
    },
    // 获取会话列表
    getSessionList() {
      let data = {
        searchType: "0",
        employeeCode: this.userCode
      }
      this.http.post(this.requestProxy + this.sessionListApi,data).then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        if(res.data.data) {
          this.sessionList = res.data.data
          this.employeesObj[this.userCode] = this.userName
          this.sessionList.forEach(item =>{
            if(item.sessionType === 1) {
              this.employeesObj[item.chatTarget] = item.sessionName
            }
          })
        }
      })
    },
    // 获取群成员列表
    getGroupMembers(id) {
      this.http.get(`${this.requestProxy}${this.groupInfoApi}/${id}`).then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        if(res.data.data) {
          this.groupMembers = res.data.data.employeeList
          this.groupMembers.forEach(item => {
            this.employeesObj[item.employeeCode] = item.employeeName
          })
        }
      })
    },
    // 点击会话列表聊天
    chat(item) {
      if(this.currentSessionId === item.sessionId) {
        return
      }
      this.isShowGroupMembers = false
      this.isShowGroupTurnOver = false
      this.currentInfo = {
        chatTarget: item.chatTarget,
        sessionName: item.sessionName,
        company: item.company
      }
      if(item.sessionType === 2){
        this.http.get(`${this.requestProxy}${this.groupInfoApi}/${item.chatTarget}`).then(res=>{
          if(res.data.resultCode !== 0) {
            if(res.data.resultMsg) {
              this.$message.warning(res.data.resultMsg)
              return
            }
            this.$message.warning('系统异常，请联系管理员！')
            return
          }
          if(res.res.data.data) {
            this.groupMembers = res.data.data.employeeList
            this.groupMembers.forEach(obj => {
              this.employeesObj[obj.employeeCode] = obj.employeeName
              this.currentSessionId = item.sessionId
            })
          }
        })
      } else {
        this.currentSessionId = item.sessionId
      }
    },
    // 通讯录发起聊天
    initiateChat(obj) {
      this.isShowGroupMembers = false
      this.isShowGroupTurnOver = false
      this.currentInfo = {
        chatTarget: obj.code,
        sessionName: obj.name,
        company: obj.company
      }
      let isExist = isExistChat(this.sessionList,obj.code) // 当前会话列表是否存在
      if(isExist) {
        if(obj.type === 2) {
          this.getGroupMembers(obj.code)
        }
        this.sessionList.forEach(item=>{
          if(item.chatTarget === obj.code){
            this.currentSessionId = item.sessionId
          }
        })
        this.changeSessionPage(obj.isSession)
      } else {
        let data = {
          searchType: "0",
          employeeCode: this.userCode,
          chatTarget: obj.code,
          sessionType: obj.type
        }
        this.http.post(this.requestProxy + this.sessionListApi,data).then(res=>{
          if(res.data.resultCode !== 0) {
            if(res.data.resultMsg) {
              this.$message.warning(res.data.resultMsg)
              return
            }
            this.$message.warning('系统异常，请联系管理员！')
            return
          }
          if(res.data.data) {
            this.sessionList = res.data.data
            if(obj.type === 1) {
              this.employeesObj[obj.code] = obj.name
            } else{
              this.getGroupMembers(obj.code)
            }
            this.sessionList.forEach(item=>{
              if(item.chatTarget === obj.code) {
                this.currentSessionId = item.sessionId
              }
            })
            this.changeSessionPage(obj.isSession)
          }
        })
      }
    },
    // 加载更多消息
    loadMore(type) {
      let data = {
        employeeCode: this.userCode,
        sessionId: this.currentSessionId,
        order: type,
      }
      if(type === '1') {
        data.minDate = this.messageList[0].timestamp
        data.maxDate = this.messageList[this.messageList.length - 1].timestamp
      }
      let chatArea = document.getElementsByClassName("yc-content") //聊天区域
      let chatAreaScrollHeight = chatArea[0].scrollHeight
      this.http.post(this.requestProxy + this.messageListApi,data).then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        if(res.data.data) {
          this.lastPageNum = res.data.data.lastPageNum
          this.unreadNum = res.data.data.omCount
          this.localInfo[this.currentSessionId] = {
            lastPageNum: res.data.data.lastPageNum,
            unreadNum: res.data.data.omCount
          }
          if(type === '1') {
            this.$refs.sessionMessage.loadMoreLoading = false
            this.messageList = res.data.data.messageList.concat(this.messageList)
            this.updateReadStatus(type,chatAreaScrollHeight)
          } else {
            this.$refs.sessionMessage.unreadLoading = false
            this.messageList = res.data.data.messageList
            this.updateReadStatus(type)
          }
        }
      }).catch(()=> {
        this.$refs.sessionMessage.loadMoreLoading = false
        this.$refs.sessionMessage.unreadLoading = false
      })
    },
    // 查看消息更新已读状态
    updateReadStatus(type,scrollHeight) {
      let chatArea = document.getElementsByClassName("yc-content") //聊天区域
      this.$nextTick(()=>{
        if(type === '1'){
          chatArea[0].scrollTop = chatArea[0].scrollHeight - scrollHeight
        } else if(type === '0'){
          chatArea[0].scrollTop = 3
        } else {
          chatArea[0].scrollTop = chatArea[0].scrollHeight
        }
        if(this.unreadNum > 0) {
          let unreadId = [] //未读消息id
          let type //消息类型
          let from //消息发送人code
          this.messageList.forEach(item => {
            if(item.from !== this.userCode && !item.content.isReadList.includes(this.userCode)) {
              type = item.type
              from = item.from
              unreadId.push(item.messageId)
            }
          })
          if(unreadId.length) {
            this.unreadNum =  this.unreadNum - unreadId.length
            this.localInfo[this.currentSessionId].unreadNum = this.unreadNum
            let data = {
              sessionId: this.currentSessionId,
              from: from,
              to: this.userCode,
              type: "READ_UNREAD",
              content: { type: type, messageId: unreadId },
              timestamp: new Date().getTime(),
            }
            this.webscoket.send(JSON.stringify(data))
            this.messageList.forEach(item => {
              if (unreadId.includes(item.messageId)) {
                item.content.isReadList.push(this.userCode)
              }
            })
            this.sessionList.forEach(item => {
              if (item.sessionId === this.currentSessionId) {
                item.offReadCount = item.offReadCount - unreadId.length
              }
            })
          }
        }
      })
    },
    // 查看群成员
    viewGroupMembers() {
      this.isShowGroupMembers = !this.isShowGroupMembers
    },
    // 展开移交列表
    unfoldTurnOver() {
      this.isShowGroupTurnOver = !this.isShowGroupTurnOver
      this.$refs.turnOver.checkedId = ''
      this.$refs.turnOver.checkedObj = {}
    },
    // 查看新消息
    viewNewMessage() {
      this.newMessage = 0
      let chatArea = document.getElementsByClassName("yc-content") //聊天区域
      chatArea[0].scrollTop = chatArea[0].scrollHeight
    },
    //添加联系层级
    addIndex(data,index) {
      data.forEach(item=>{
        item.index = index
        if(item.hasChild) {
          let newIndex = item.index + 1
          this.addIndex(item.children,newIndex)
        }
      })
    },
    // 获取群列表
    getGroup() {
      this.http.get(this.requestProxy + this.groupApi).then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        if(res.data.data) {
          this.addIndex(res.data.data,1)
          this.$refs.addressBook.groupList = res.data.data
          this.$refs.addressBook.copyGroupList = JSON.parse(JSON.stringify(res.data.data))
        }
      })
    },
    // 获取联系人列表
    getContacts() {
      this.http.get(this.requestProxy + this.contactsApi).then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        if(res.data.data){
          this.addIndex(res.data.data,1)
          this.$refs.addressBook.contactsList = res.data.data
          this.$refs.addressBook.copyContactsList = JSON.parse(JSON.stringify(res.data.data))
        }
      })
    },
    // 获取移交人员列表
    getTurnOverContacts() {
      this.http.get(`${this.requestProxy}${this.contactsApi}/EMP`).then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        if(res.data.data) {
          this.addIndex(res.data.data,1)
          this.$refs.turnOver.turnOverContacts = res.data.data
          this.$refs.turnOver.copyTurnOverContacts = JSON.parse(JSON.stringify(res.data.data))
        }
      })
    },
    // 更新群信息
    changeGroupInfo(data) {
      this.isShowInfo = true
      this.isGroupInfo = true
      this.groupInfo = data
    },
     // 编辑群保存
    saveGroup() {
      this.$refs.groupInfo.saveLoading = true
      let employees = []
      this.groupInfo.members.forEach(item=>{
        employees.push(item.employeeCode)
      })
      let data = {
        groupName: this.groupInfo.name,
        employeeCodeList: employees,
        memberTotal: this.groupInfo.members.length
      }
      if(this.groupInfo.isAdd) {
        this.http.post(this.requestProxy + this.addGroupApi,data).then(res=>{
          if(res.data.resultCode !== 0) {
            if(res.data.resultMsg) {
              this.$message.warning(res.data.resultMsg)
              return
            }
            this.$message.warning('系统异常，请联系管理员！')
            return
          }
          if(res.data.data) {
            this.groupInfo.isAdd = false
            this.groupInfo.isEdit = false
            this.groupInfo.id = res.data.data.id
            this.$refs.groupInfo.saveLoading = false
            this.$refs.addressBook.selectId = res.data.data.id
            this.$message.success('添加群成功')
          }
        }).catch(()=>{
          this.$refs.groupInfo.saveLoading = false
        })
      } else {
        data.id = this.$refs.addressBook.selectId
        this.http.post(this.requestProxy + this.editGroupApi,data).then(res=>{
          if(res.data.resultCode !== 0) {
            if(res.data.resultMsg) {
              this.$message.warning(res.data.resultMsg)
              return
            }
            this.$message.warning('系统异常，请联系管理员！')
            return
          }
          if(res.data.data) {
            this.groupInfo.isEdit = false
            this.$refs.groupInfo.saveLoading = false
            this.$message.success('保存群成功')
          }
        }).catch(()=>{
          this.$refs.groupInfo.saveLoading = false
        })
      }
    },
    // 删除群
    delGroup() {
      this.http.delete(`${this.requestProxy}${this.delGroupApi}/${this.$refs.addressBook.selectId}`).then(res=> {
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        this.getGroup()
        let exist = false
        let delSessionId = ''
        this.sessionList.forEach(item=>{
          if(item.chatTarget === this.$refs.addressBook.selectId) {
            exist= true
            delSessionId = item.sessionId
          }
        })
        if(exist) {
          this.getSessionList()
        }
        if(delSessionId === this.currentSessionId) {
          this.currentInfo.sessionName = ''
          this.isShowGroupMembers = false
        }
        this.$refs.addressBook.selectId = ''
        this.isShowInfo = false
        this.$refs.groupInfo.delLoading = false
        this.$message.success('删除群成功')
      }).catch(()=> {
        this.$refs.groupInfo.delLoading = false
      })
    },
    // 更新员工信息
    changeEmployeeInfo(data) {
      this.isShowInfo = true
      this.isGroupInfo = false
      this.employeeInfo = data
    },
    // 添加群成员
    addEmployee(obj) {
      let employees = []
      this.groupInfo.members.forEach(item=>{
        employees.push(item.employeeCode)
      })
      if(employees.includes(obj.code)) {
        this.$message.warning('请勿重复添加')
      } else {
        let data = {
          employeeCode: obj.code,
          employeeName: obj.name,
          companyName: obj.companyShortName
        }
        this.groupInfo.members.push(data)
      }
    },
    // 删除群成员
    delEmployee(obj) {
      this.groupInfo.members.forEach((item,index)=>{
        if(item.employeeCode === obj.employeeCode) {
          this.groupInfo.members.splice(index,1)
        }
      })
    },
    // 隐藏消息区
    hiddenInfo() {
      this.isShowInfo = false
      this.groupInfo.isEdit = false
    },
    // 发送消息
    sendMessage(type) {
      let sessionType = this.currentInfo.company ? 'PRIVATE' : 'GROUP'
      let newMessage = {
        sessionId: this.currentSessionId,
        type: sessionType,
        fromName: this.currentInfo.sessionName,
        from: this.userCode,
        to: this.currentInfo.chatTarget,
        timestamp: new Date().getTime(),
        content: {
          message: this.$refs.sessionMessage.textarea,
          isReadList: [],
          sendStatys: "send",
          companyShortName: this.currentInfo.company,
          type: type
        }
      }
      if(type === 0 ) {
        this.messageList.push(newMessage)
        let toppingDateIndex = 0
        this.sessionList.forEach((item,index) => {
          if (item.toppingDate) {
            toppingDateIndex++
          }
          if (item.sessionId === this.currentSessionId) {
            this.sessionList.splice(index, 1)
            item.lastMessage = this.$refs.sessionMessage.textarea
            if (item.toppingDate) {
              this.sessionList.unshift(item)
            } else {
              this.sessionList.splice(toppingDateIndex, 0, item)
            }
          }
        })
        this.webscoket.send(JSON.stringify(newMessage))
        let chatArea = document.getElementsByClassName("yc-content") //聊天区域
        this.$nextTick(() => {
          this.$refs.sessionMessage.textarea = ''
          chatArea[0].scrollTop = chatArea[0].scrollHeight
        })
      } else {
        newMessage.content.message = ''
        newMessage.content.file = this.$refs.sessionMessage.fileInfo
        let id
        if(this.currentSessionId === this.$refs.sessionMessage.fileId) {
          this.messageList.push(newMessage)
          id = this.currentSessionId
        } else {
          id = this.$refs.sessionMessage.fileId
          newMessage.sessionId = this.$refs.sessionMessage.fileId
          this.localData[this.$refs.sessionMessage.fileId].push(newMessage)
        }
        let toppingDateIndex = 0
        this.sessionList.forEach((item, index) => {
          if (item.toppingDate) {
            toppingDateIndex++
          }
          if (item.sessionId === id) {
            this.sessionList.splice(index, 1)
            item.lastMessage = this.$refs.sessionMessage.fileInfo.isImg === 1 ? '[图片]' : '[文件]'
            if (item.toppingDate) {
              this.sessionList.unshift(item)
            } else {
              this.sessionList.splice(toppingDateIndex, 0, item)
            }
          }
        })
        this.webscoket.send(JSON.stringify(newMessage))
        let chatArea = document.getElementsByClassName("yc-content") //聊天区域
        this.$nextTick(() => {
          chatArea[0].scrollTop = chatArea[0].scrollHeight
        })
      }
    },
    // 显示置顶弹窗位置
    stick(item) {
      this.stickWindow = true
      this.stickId = item.sessionId
      this.isStick = item.toppingDate ? true : false
      this.stickLeft = item.e.pageX
      this.stickTop = item.e.pageY
    },
    closeStick() {
      this.stickWindow = false
    },
    // 置顶
    changeStick() {
      let data = {
        sessionId: this.stickId,
        employeeCode: this.userCode
      }
      this.http.post(this.requestProxy + this.stickApi,data).then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        this.getSessionList()
      })
    },
    previewImg(url) {
      if(this.viewer) {
        this.viewer.destroy()
      }
      let index
      this.images.forEach((v, i) => {
        if (v === url) {
          index = i
        }
      })
      this.$nextTick(()=>{
        this.viewer = new ViewerJs(this.$refs.viewer,{
          initialViewIndex: index
        })
        this.viewer.show()
      })
    },
    // 私聊窗口创建群
    createGroup() {
      this.isSession = false
      this.$refs.sessionMessage.selectId = ''
      let data = {
        isAdd: true,
        isEdit: true,
        id: '',
        name: `${this.userName},${this.currentInfo.sessionName}`,
        members: [{
          companyName: this.userCompany, employeeCode: this.userCode, employeeName: this.userName
        },{
          companyName: this.currentInfo.company, employeeCode: this.currentInfo.chatTarget, employeeName: this.currentInfo.sessionName
        }],
        initName: '',
        initMembers: []
      }
      this.changeGroupInfo(data)
    },
    // 移交会话
    turnOver(code) {
      this.http.patch(`${this.requestProxy}${this.turnOverApi}/${this.currentSessionId}/${this.userCode}/${code}`).then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        this.$message.success('会话移交成功')
      })
    }
  }
}
</script>

<style lang="less">
  .im-plug ul,
  .im-plug li,
  .im-plug p,
  .im-plug pre {
    padding: 0;
    margin: 0;
  }
  .im-plug ul {
    list-style: none;
  }
  .im-plug .im-main {
    position: absolute;
    width: 750px;
    height: 600px;
    top: 15vh;
    left: 50%;
    transform: translate(-50%);
    border-radius: 4px;
    box-shadow: 5px 5px 10px rgb(0 0 0 / 30%);
    background-color: #fff;
    z-index: 2000;
  }
  .im-plug .im-main .im-info {
    position: absolute;
    width: calc(100% - 200px);
    height: calc(100% - 55px);
    left: 200px;
    top: 55px;
  }
  .im-plug .im-stick {
    position: absolute;
    background: #fff;
    white-space: nowrap;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #000;
    z-index: 3000;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  }
  .im-plug .im-stick li {
    cursor: pointer;
    padding: 7px 16px;
  }
  .im-plug .im-stick li:hover{
    background: #eee;
  }
  // 提示消息超出显示省略号
  .el-notification .el-notification__group {
    width: calc(~"100% - 15px");
  }
  .el-notification .el-notification__group .el-notification__content .im-notify {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
</style>