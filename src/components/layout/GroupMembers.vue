<template>
  <div class="yc-members" :class="isShow()">
    <el-input  class="yc-serach" v-model="member" size="mini"></el-input>
    <p class="yc-number">成员{{ groupMembers.length }}/200人</p>
    <ul>
      <li class="yc-item" v-for="item of filterGroupMembers" :key="item.employeeCode" @click="viewInfo(item)" @dblclick="dbMember(item)">
        <el-popover placement="right" widtg="100%" trigger="click">
          <div>
            <ul  style="font-size:12px">
              <li v-if="memberInfo.employeeName">姓名：{{ memberInfo.employeeName }}</li>
              <li v-if="memberInfo.gender">性别：{{ memberInfo.gender }}</li>
              <li v-if="memberInfo.employeeCode">工号：{{ memberInfo.employeeCode }}</li>
              <li v-if="memberInfo.companyName">所属公司：{{ memberInfo.companyName }}</li>
              <li v-if="memberInfo.departmentName">任职部门：{{ memberInfo.departmentName }}</li>
              <li v-if="memberInfo.dutiesName">任职岗位：{{ memberInfo.dutiesName }}</li>
              <li v-if="memberInfo.mobile">手机号码：{{ memberInfo.mobile }}</li>
              <li v-if="memberInfo.email">电子邮箱：{{ memberInfo.email }}</li>
            </ul>
          </div>
          <span slot="reference" class="yc-popover">
            <span class="im-iconfont im-icon-yuangong yc-yuangong" :class="{active:onlineEmployees.includes(item.employeeCode)}"></span>
            {{ item.employeeName }}
          </span>
        </el-popover>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'GroupMembers',
  data() {
    return {
      member: '',
      memberInfo: {
        employeeName: null,
        gender: null,
        employeeCode: null,
        companyName: null,
        departmentName: null,
        dutiesName: null,
        mobile: null,
        email: null
      },
      timer:null,
    }
  },
  props: {
    isShowGroupMembers: {
      type: Boolean
    },
    groupMembers: { 
      type: Array
    },
    onlineEmployees: {
      type: Array
    },
    userCode: {
      type: String
    },
    http: {},
    requestProxy: {
      type: String,
      default : 'api/'
    },
    groupMemberInfoApi: {
      type: String,
      default: 'employee/searchContactsInfos'
    },
  },
  computed: {
    filterGroupMembers() {
      return this.groupMembers.filter(item=>{
        return item.employeeName.includes(this.member)
      })
    }
  },
  methods: {
    isShow() {
      return this.isShowGroupMembers ? 'unfoldHeader' : 'hideHeader'
    },
    viewInfo(item) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.http.get(`${this.requestProxy}${this.groupMemberInfoApi}/${item.employeeCode}`).then(res=>{
          if(res.data.resultCode !== 0) {
            if(res.data.resultMsg) {
              this.$message.warning(res.data.resultMsg)
              return
            }
            this.$message.warning('系统异常，请联系管理员！')
            return
          }
          if(res.data.data) {
            this.memberInfo = res.data.data
          }
        })
      }, 300)
    },
    dbMember(item) {
      clearTimeout(this.timer)
      if (item.employeeCode === this.userCode) {
        return
      }
      let obj = {
        type: 1,
        code: item.employeeCode,
        name: item.employeeName,
        company: item.companyName,
        isSession: true
      }
      this.$emit('initiateChat',obj)
    }
  }
}
</script>

<style lang="less" scoped>
  .yc-members {
    position: absolute;
    top: 55px;
    left: 750px;
    height: calc(100% - 55px);
    box-sizing: border-box;
    padding: 50px 5px 5px;
    font-size: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    border-left: 1px solid #cccccc;
    /deep/.el-input__inner {
      padding: 0 5px;
      border-radius: 0;
    }
  }
  .unfoldHeader {
    width: 200px;
    box-shadow: 5px 5px 10px rgb(0 0 0 / 30%);
    background-color: #ffffff;
  }
  .hideHeader {
    width: 0;
    box-shadow: 0 0 0 rgb(0 0 0 / 30%);
  }
  .yc-serach {
    position: absolute;
    top: 12px;
    left: 8px;
    width: 160px;
  }
  .yc-number {
    font-size: 14px;
    padding-left: 5px;
    margin-bottom: 3px;
  }
  .yc-item {
    float: left;
    width: 100%;
    height: 25px;
    line-height: 25px;
    padding-left: 5px;
    box-sizing: border-box;
  }
  .yc-item:hover {
    cursor: pointer;
    background-color: rgba(238, 238, 238, 1);
  }
  .yc-popover {
    display: inline-block;
    width: 100%;
    height: 25px;
    line-height: 25px;
  }
  .yc-yuangong{
    color: #cccccc;
    margin-right: 5px;
    vertical-align: middle;
  }
  .active {
    color: #409eff;
  }
</style>