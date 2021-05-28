<template>
  <div style="height:100%">
    <div class="yc-title">个人信息</div>
    <ul class="yc-content">
      <li class="yc-row" v-if="employeeInfo.employeeName">
        <span class="yc-key">姓名:</span>
        <span>{{employeeInfo.employeeName}}</span>
      </li>
      <li class="yc-row" v-if="employeeInfo.gender">
        <span class="yc-key">性别:</span>
        <span>{{employeeInfo.gender}}</span>
      </li>
      <li class="yc-row" v-if="employeeInfo.employeeCode">
        <span class="yc-key">工号:</span>
        <span>{{employeeInfo.employeeCode}}</span>
      </li>
      <li class="yc-row" v-if="employeeInfo.companyName">
        <span class="yc-key">所属公司:</span>
        <span>{{employeeInfo.companyName}}</span>
      </li>
      <li class="yc-row" v-if="employeeInfo.departmentName">
        <span class="yc-key">任职部门:</span>
        <span>{{employeeInfo.departmentName}}</span>
      </li>
      <li class="yc-row" v-if="employeeInfo.dutiesName">
        <span class="yc-key">任职岗位:</span>
        <span>{{employeeInfo.dutiesName}}</span>
      </li>
      <li class="yc-row" v-if="employeeInfo.mobile">
        <span class="yc-key">手机号码:</span>
        <span>{{employeeInfo.mobile}}</span>
      </li>
      <li class="yc-row" v-if="employeeInfo.email">
        <span class="yc-key">电子邮箱:</span>
        <span>{{employeeInfo.email}}</span>
      </li>
    </ul>
    <div class="yc-bottom">
      <el-button type="primary" size="mini" class="yc-but" v-show="userCode !==employeeInfo.employeeCode" @click="chat">发起聊天</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeInfo',
  props: {
    employeeInfo: {
      type: Object
    },
    userCode: {
      type: String
    }
  },
  methods: {
    chat() {
      this.$emit('changeSessionPage',true)
      let obj = {
        type: 1,
        code: this.employeeInfo.employeeCode,
        name: this.employeeInfo.employeeName,
        company: this.employeeInfo.companyShortName,
      }
      this.$emit('initiateChat',obj)
    }
  }
}
</script>

<style scoped>
  .yc-title {
    height: 45px;
    line-height: 45px;
    padding-left: 10px;
    border-bottom: 1px solid #cccccc;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: bold;
  }
  .yc-content {
    height: calc(100% - 95px);
    box-sizing: border-box;
    border-bottom: 1px solid #dcdfe6;
  }
  .yc-row {
    float: left;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .yc-key {
    display: inline-block;
    width: 120px;
    color: #666;
  }
  .yc-bottom {
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 0;
  }
  .yc-but {
    float: right;
    height: 26px;
    font-size: 12px;
    padding: 0 10px;
    margin-top: 12px;
    margin-right: 10px;
    border-radius: 0;
  }
</style>