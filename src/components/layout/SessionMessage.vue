<template>
  <div class="yc-session">
    <div class="yc-title">
      <span>{{ currentInfo.sessionName }}</span>
      <span v-if="currentInfo.company">
        <span>({{ currentInfo.company }})</span>
        <i class="im-iconfont im-icon-tianjia" style="float: right" @click="createGroup"></i>
        <i class="im-iconfont im-icon-yijiao" style="float: right" @click="unfoldTurnOver"></i>
      </span>
      <span v-else class="yc-group" @click="viewGroupMembers">查看群成员</span>
    </div>
    <ul class="yc-content" @scroll="scrollEvent">
      <el-button class="yc-but yc-unread" v-show="unreadNum>0" :loading="unreadLoading" @click="viewUnread">{{unreadNum}}条未读消息</el-button>
      <el-button class="yc-but yc-new" v-show="newMessage>0" @click="viewNewMessage">{{newMessage}}条新消息</el-button>
      <div style="text-align:center"  v-show="lastPageNum>0">
        <el-button class="yc-but" :loading="loadMoreLoading" @click="viewMore">查看更多消息</el-button>
      </div>
      <li class="yc-list" v-for="item of messageList" :key="item.messageId">
        <p class="yc-time">{{ moment(item.timestamp).format("YYYY-MM-DD HH:mm:ss") }}</p>
        <div v-if="item.from !== userCode">
          <span class="yc-head" :class="{active:onlineEmployees.includes(item.from)}">{{hiddenSurname(employeesObj[item.from])}}</span>
          <span v-if="item.content.type === 0">
            <span class="yc-info">
              <pre>{{item.content.message}}</pre>
            </span>
            <span class="yc-status" v-if="item.content.isRead === 0">全部已读</span>
            <span class="yc-status" v-else-if="item.content.isReadList.includes(userCode)">已读</span>
            <span class="yc-status" v-else>未读</span>
          </span>
          <span class="yc-info" v-else>
            <span v-if="item.content.file.isImg === 1">
              <img :src="item.content.file.imgUrl" alt @click="previewImg(item.content.file.url)">
            </span>
            <span v-else>
              <i class="im-iconfont im-icon-wenjian file-icon"></i>
              <div class="yc-file">
                <p>{{item.content.file.name }}</p>
                <p style="padding-top:3px">{{item.content.file.smartSize}}
                  <i class="im-iconfont im-icon-xiazai yc-xiazai" @click="download(item)" />
                </p>
              </div>
            </span>
          </span>
        </div>
        <div v-else>
          <span class="yc-head head-fr">{{hiddenSurname(employeesObj[item.from])}}</span>
          <span v-if="item.content.type === 0">
            <span class="yc-info info-fr">
              <pre>{{item.content.message}}</pre>
            </span>
            <span class="yc-status status-fr" v-if="item.content.sendStatys ==='send'">发送中</span>
            <span class="yc-status status-fr" v-else-if="item.content.sendStatys ==='error'">{{item.content.errorReason}}</span>
            <span class="yc-status status-fr" v-else-if="item.content.isRead === 0">全部已读</span>
            <span class="yc-status status-fr" v-else-if="item.content.isReadList.length">已读</span>
            <span class="yc-status status-fr" v-else>未读</span>
          </span>
          <span v-else>
            <span class="yc-info info-fr" v-if="item.content.file.isImg === 1" style="background:#fff">
              <img :src="item.content.file.imgUrl" alt @click="previewImg(item.content.file.url)">
            </span>  
            <span class="yc-info info-fr" v-else>
              <i class="im-iconfont im-icon-wenjian file-icon"></i>
              <div class="yc-file">
                <p>{{item.content.file.name }}</p>
                <p style="padding-top:3px">{{item.content.file.smartSize}}
                  <i class="im-iconfont im-icon-xiazai yc-xiazai" @click="download(item)" />
                </p>
              </div>
            </span>
          </span>
        </div>
      </li>
      <div class="yc-uploader" v-show="isShowProgressBar"></div>
    </ul>
    <div class="yc-send">
      <ul>
        <li class="yc-operation">
          <uploader :options="options" @file-added="fileAdded" @file-success="fileSuccess" @file-error="fileFailed">
            <uploader-btn :attrs="attrs">
              <span class="im-iconfont im-icon-wenjian yc-icon"></span>
            </uploader-btn>
            <uploader-list v-show="isShowProgressBar"></uploader-list>
          </uploader>
        </li>
      </ul>
      <textarea class="yc-textarea" v-model="textarea" maxlength="500" @keydown.enter="keyDown"></textarea>
      <el-button class="yc-send-but" type="primary" @click="sendBut">发 送</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { twoSurname } from './../../utils/common'
export default {
  name: 'SessionMessage',
  data() {
    return {
      moment,
      // 截取姓氏val
      hiddenSurname(val) {
        if(!val) {
          return
        }
        if (twoSurname.includes(val.substring(0, 2))) {
          name = val.substring(2)
        } else {
          name = val.substring(1)
        }
        return name
      },
      unreadLoading: false,
      loadMoreLoading: false,
      options: {
        target: this.requestProxy + this.uploadingApi, // 文件上传地址
        testChunks: false, //是否开启服务器分片校验
        singleFile: true, //单文件上传
        allowDuplicateUploads: true, //是否可以继续上传同一个文件
        simultaneousUploads: 1, //同时上传数（默认值：3）
        query: {}
      },
      attrs: {
        accept: this.uploadType //限制上传文件格式
      },
      textarea: '',
      isShowProgressBar: false, //是否显示上传进度条
      fileId: '', //上传文件id
      fileInfo: {}, //上传文件信息
    }
  },
  props: {
    userCode: String,
    currentInfo: Object,
    employeesObj: Object,
    messageList: Array,
    lastPageNum: Number,
    unreadNum: Number,
    newMessage: Number,
    onlineEmployees: Array,
    currentSessionId: String,
    requestProxy: {
      type: String,
      default : 'api/'
    },
    uploadingApi: {
      type: String,
      default: 'storage/file'
    },
    uploadSize: {
      type: Number,
      default: 20
    },
    uploadType: {
      type: String,
      default: ''
    }
  },
  methods: {
    viewGroupMembers() {
      this.$emit('viewGroupMembers')
    },
    unfoldTurnOver() {
      this.$emit('unfoldTurnOver')
    },
    viewNewMessage() {
      this.$emit('viewNewMessage')
    },
    viewUnread() {
      this.unreadLoading = true
      this.$emit('loadMore','0')
    },
    viewMore() {
      this.loadMoreLoading = true
      this.$emit('loadMore','1')
    },
    scrollEvent(e) {
      if (this.lastPageNum > 0 && e.srcElement.scrollTop === 0) {
        this.loadMoreLoading = true
        this.$emit('loadMore','1')
      }
      if(this.newMessage >0 && e.srcElement.scrollTop + e.srcElement.clientHeight === e.srcElement.scrollHeight) {
        this.$emit('viewNewMessage')
      }
    },
    download(item) {
      let str = item.content.file.name
      let index = str.lastIndexOf('\.')
      let name = str.substring(0,index)
      let url = item.content.file.url
      axios({ url: `${url}?displayName=${name}`}).then(res=>{
        window.open(`${url}?displayName=${name}`, "_self")
      }).catch(()=>{
        this.$message.warning('文件已过期')
      })
    },
    fileAdded(file, event) {
      if(file.size > this.uploadSize * 1024 * 1024) {
        file.paused = true
        this.$message.warning(`上传文件不能大于${this.uploadSize}M`)
        return
      }
      this.isShowProgressBar = true
      this.fileId = this.currentSessionId
      let chatArea = document.getElementsByClassName("yc-content") //聊天区域
      this.$nextTick(() => {
        chatArea[0].scrollTop = chatArea[0].scrollHeight
      })
    },
    fileSuccess(rootFile, file, message, chunk) {
      this.isShowProgressBar = false
      if (message) {
        let messageJson = JSON.parse(message)
        let imgStr = /\.(jpg|jpeg|png|bmp|gif|BMP|JPG|PNG|JPEG|GIF)$/
        this.fileInfo = { ...file }
        this.fileInfo.url = messageJson.file
        this.fileInfo.smartSize = messageJson.smartSize
        if (imgStr.test(this.fileInfo.name)) {
          this.fileInfo.imgUrl = messageJson.thumbnail
          this.fileInfo.isImg = 1
        }
        this.$emit('sendMessage',1)
      }
    },
    fileFailed(rootFile, file, message, chunk) {
      this.isShowProgressBar = false
      if (chunk.xhr.status === 500) {
        this.$message.warning('上传失败')
      }
    },
    // 回车发消息和ctrl+enter换行
    keyDown(e) {
      if (e.ctrlKey && e.keyCode === 13) {
        this.textarea += "\n"
        return
      }
      e.preventDefault()
      this.sendBut()
    },
    sendBut() {
      if(this.textarea) {
        this.$emit('sendMessage',0)
      }
    },
    previewImg(url) {
      this.$emit('previewImg',url)
    },
    // 创建群
    createGroup() {
      this.$emit('createGroup')
    }
  }
}
</script>

<style lang="less" scoped>
  .yc-session {
    position: absolute;
    width: calc(~"100% - 200px");
    height: calc(~"100% - 55px");
    top: 55px;
    left: 200px;
    font-size: 12px;
    .yc-title {
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      font-weight: bold;
      padding-left: 10px;
      border-bottom: 1px solid  #cccccc;
      box-sizing: border-box;
      .yc-group {
        float: right;
        margin-right: 10px;
        font-size: 12px;
        font-weight: normal;
        color: #18e;
        cursor: pointer;
      }
      i {
        margin-right: 10px;
        cursor: pointer
      }
    }
    .yc-content {
      height: calc(~"100% - 175px");
      padding: 10px;
      border-bottom: 1px solid  #cccccc;
      box-sizing: border-box;
      overflow-y: auto;
      .yc-but {
        font-size: 12px;
        color: #18e;
        padding: 3px 5px;
        border-radius: 30px;
        background-color: #def;
      }
      .yc-unread {
        position: absolute;
        top: 50px;
        right: 20px;
      }
      .yc-new {
        position: absolute;
        right: 20px;
        bottom: 132px;
      }
      .yc-list {
        float: left;
        width: 100%;
        .yc-time {
          text-align: center;
          padding: 5px;
          box-sizing: border-box;
          color: #999;
        }
        .yc-head {
          float: left;
          margin-right: 5px;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background-color: #cccccc;
          color: #ffffff;
        }
        .head-fr {
          float: right;
          margin: 0 0 0 5px;
          background-color: #18e;
        }
        .yc-info {
          float: left;
          max-width: 80%;
          background-color: #eeeeee;
          padding: 5px;
          margin-top: 3px;
          box-sizing: border-box;
          border-radius: 0 5px 5px 5px;
          border: 1px solid #cccccc;
          overflow-wrap: break-word;
          pre {
            padding: 0;
            margin: 0;
            white-space: pre-wrap;
            white-space: -moz-pre-wrap;
            white-space: -pre-wrap;
            white-space: -o-pre-wrap;
            word-wrap: break-word;
          }
          .file-icon {
            float: left;
            font-size: 40px;
          }
          .yc-file {
            float: left;
            font-size: 12px;
            padding: 8px 5px 0 3px;
            .yc-xiazai {
              float: right;
              font-size: 14px;
              cursor: pointer;
            }
          }
        }
        .info-fr {
          float: right;
          background-color: #18e;
          color: #ffffff;
          border: 0;
          border-radius: 5px 0 5px 5px;
        }
        .yc-status {
          float: left;
          padding: 5px;
          margin-top: 6px;
          box-sizing: border-box;
          color: #18e;
        }
        .status-fr {
          float: right;
        }
        .active {
          background-color: #18e;
        }
      }
      .yc-uploader {
        float: left;
        width: 100%;
        height: 20px;
      }
    }
    .yc-send {
      position: absolute;
      top: 415px;
      width: 100%;
      height: 130px;
      .yc-operation {
        float: left;
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        width: 100%;
        box-sizing: border-box;
        .uploader-btn {
          padding: 0;
          border: none;
          .yc-icon {
            font-size: 24px;
            cursor: pointer;
            line-height: 1;
          }
        }
        .uploader-list{
          position: absolute;
          top: -22px;
          left: 0px;
          width: calc(~"100% - 10px");
          /deep/.uploader-file{
            height: 20px;
            line-height: 20px;
            border-bottom:none;
            .uploader-file-icon{
              display: none;
            }
          }
          /deep/.uploader-file-actions>span{
            margin-top:3px;
            margin-right:3px;
          }
          /deep/.uploader-file-progress{
            background-color: #77CCFF;
          }
        }
      }
      .yc-textarea {
        width: 100%;
        height: 80px;
        font-size: 12px;
        overflow: auto;
        border: none;
        outline: none;
        resize: none;
        padding: 5px 10px;
        box-sizing: border-box;
      }
      .yc-send-but {
        float: right;
        height: 20px;
        font-size: 12px;
        padding: 0 8px;
        margin-right: 10px;
        border-radius: 0;
      }
    }
  }
</style>