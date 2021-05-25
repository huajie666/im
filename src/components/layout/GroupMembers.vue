<template>
  <div class="yc-members" :class="isShow()">
    <el-input  class="yc-serach" v-model="member" size="mini"></el-input>
    <p class="yc-number">成员{{ groupMembers.length }}/200人</p>
    <ul>
      <li class="yc-item" v-for="item of filterGroupMembers" :key="item.employeeCode" @click="viewInfo(item)" @dblclick="dbMember(item)">
        <el-popover placement="right" widtg="100%" trigger="click">
          <div>
            <ul  style="font-size:12px">
              <li>姓名：{{ memberInfo.employeeName }}</li>
              <li>性别：{{ memberInfo.gender }}</li>
              <li>工号：{{ memberInfo.employeeCode }}</li>
              <li>所属公司：{{ memberInfo.companyName }}</li>
              <li>任职部门：{{ memberInfo.departmentName }}</li>
              <li>任职岗位：{{ memberInfo.dutiesName }}</li>
              <li>手机号码：{{ memberInfo.mobile }}</li>
              <li>电子邮箱：{{ memberInfo.email }}</li>
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
          this.memberInfo = res.data.data
        })
      }, 300)
    },
    dbMember(item) {
      clearTimeout(this.timer)
      if (item.employeeCode === this.userCode) {
        return
      }
      this.$emit('changeSessionPage',true)
      let obj = {
        type: 1,
        code: item.employeeCode,
        name: item.employeeName,
        company: item.companyName,
      }
      this.$emit('initiateChat',obj)
    }
  }
}
</script>

<style scoped>
  .yc-members {
    position: absolute;
    top: 55px;
    left: 750px;
    height: calc(100% - 55px);
    box-sizing: border-box;
    padding: 50px 5px 5px;
    overflow-y: auto;
    overflow-x: hidden;
    border-left: 1px solid #cccccc;
  }
  .unfoldHeader {
    width: 150px;
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
    width: 130px;
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