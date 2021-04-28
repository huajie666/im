<template>
  <div class="yc-address-book">
    <div class="yc-top">
      <span class="yc-add-group" @click="addGroup">+ 添加项目群</span>
    </div>
    <div class="yc-title" @click="isShowGroup=!isShowGroup">
      <span>我的项目群</span>
      <i class="yc-down-arrow iconfont icon-jiantou" :class="{roteate: isShowGroup}" />
    </div>
    <ul v-show="isShowGroup" class="clearfix">
      <li class="yc-group" :class="{active: selectId===item.id}" v-for="item of filterGroup" :key="item.id" @click="queryGroup(item.id)" @dblclick="dbGroup(item)">{{item.groupName}}({{item.memberTotal}})</li>
    </ul>
    <div class="yc-title" @click="isShowContacts=!isShowContacts">
      <span>企业联系人</span>
      <i class="yc-down-arrow iconfont icon-jiantou" :class="{roteate: isShowContacts}"></i>
    </div>
    <ul v-show="isShowContacts">
      <li v-for="item of filterContacts" :key="item.companyCode">
        <div class="yc-company" @click="changeOpened(item)">
          <i class="yc-company-icon iconfont icon-qiye"/>
          {{item.companyShortName}}
          <i class="yc-down-arrow iconfont icon-jiantou" :class="{roteate: item.isOpened}"></i>
        </div>
        <ul class="clearfix">
          <li class="yc-contacts" :class="{active: selectId===obj.id}" v-for="obj of item.employeeList" :key="obj.id" v-show="item.isOpened" @click="queryEmployee(obj)" @dblclick="dbEmployee(obj)">
            <i class="yc-contacts-icon iconfont icon-yuangong" :class="{active: onlineEmployees.includes(obj.employeeCode)}" />
            {{obj.employeeName}}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AddressBook',
  data() {
    return {
      isShowGroup: false,
      isShowContacts: false,
      groupList: [],
      contactsList: [],
      selectId: '', //当前选中的群或者员工id
      timer: null, //定时器用于区分单击和双击
    }
  },
  props: {
    userCode: {
      type: String
    },
    isGroupInfo: {
      type: Boolean
    },
    groupInfo: {
      type: Object
    },
    onlineEmployees: {
      type: Array
    },
    keyword: {
      type: String
    },
    http: {},
    groupInfoApi: {
      type: String,
      default: 'api/manage/im/group/info/selectGroupInfo'
    },
    groupMemberInfoApi: {
      type: String,
      default: 'api/employee/searchContactsInfos'
    },
  },
  computed: {
    filterGroup() {
      return this.groupList.filter(item => {
        return item.groupName.includes(this.keyword)
      })
    },
    filterContacts() {
      let companys = []
      this.contactsList.map( item => {
        if(item.companyShortName.includes(this.keyword)) {
          companys.push(item)
        } else {
          let employees = []
          item.employeeList.map(obj => {
            if(obj.employeeName.includes(this.keyword)) {
              employees.push(obj)
            }
          })
          if(employees.length) {
            companys.push({
              companyCode: item.companyCode,
              companyShortName: item.companyShortName,
              employeeList: employees,
              employeeTotal: employees.length,
              id: item.id,
              isOpened: false
            })
          }
        }
      })
      return companys
    }
  },
  methods: {
    // 添加群
    addGroup() {
      this.selectId = ''
      let data = {
        isAdd: true,
        isEdit: true,
        id: '',
        name: '',
        members: [],
        initName: '',
        initMembers: []
      }
      this.$emit('changeGroupInfo',data)
    },
    // 查看群信息
    queryGroup(id) {
      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        this.selectId = id
        this.http.get(`${this.groupInfoApi}/${id}`).then(res=>{
          let data = {
            isAdd: false, //是否添加群状态
            isEdit: false, //是否编辑群状态
            id: res.data.data.id, //群id
            name: res.data.data.groupName, //群名称
            members: res.data.data.employeeList, //群成员列表
            initName: res.data.data.groupName, //初始群名称
            initMembers: JSON.parse(JSON.stringify(res.data.data.employeeList)) //初始群成员
          }
          this.$emit('changeGroupInfo',data)
        })
      },300)
    },
    // 双击群聊天
    dbGroup(item) {
      clearTimeout(this.timer)
      let isGroupMember = item.employeeList.filter(obj=>{
        return obj.employeeCode === this.userCode
      })
      if(!isGroupMember.length){
        this.$message.warning('您不是群成员')
        return
      }
      this.$emit('changeSessionPage',true)
      let obj = {
        type: 2,
        code: item.id,
        name: item.groupName,
        company: ''
      }
      this.$emit('initiateChat',obj)
    },
    // 查看员工信息
    queryEmployee(obj) {
      if(!this.groupInfo.isEdit) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.selectId = obj.id
          this.http.get(`${this.groupMemberInfoApi}/${obj.employeeCode}`).then(res=>{
            this.$emit('changeEmployeeInfo',res.data.data)
          })
        }, 300)
      }
    },
    // 编辑群状态双击选中员工否则聊天
    dbEmployee(item) {
      clearTimeout(this.timer)
      if(this.isGroupInfo && this.groupInfo.isEdit) {
        this.$emit('addEmployee',item)
      } else {
        if(this.userCode !== item.employeeCode) {
          // 双击其他员工聊天
          this.$emit('changeSessionPage',true)
          let obj = {
            type: 1,
            code: item.employeeCode,
            name: item.employeeName,
            company: item.companyShortName,
          }
          this.$emit('initiateChat',obj)
        }
      }
    },
    changeOpened(item) {
      item.isOpened = !item.isOpened
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.yc-address-book {
  position: absolute;
  width: 200px;
  height: calc(100% - 55px);
  top: 55px;
  overflow-x: hidden;
  overflow-y: auto;
  border-right: 1px solid #cccccc;
  box-sizing: border-box;
}
.yc-top {
  height: 45px;
  border-bottom: 1px solid #cccccc;
  text-align: center;
  line-height: 45px;
}
.yc-add-group {
  display: inline-block;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #cccccc;
  cursor: pointer;
}
.yc-title {
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  color: rgb(153, 153, 153);
  cursor: pointer;
}
.yc-title:hover {
  background-color: rgb(217, 236, 255);
}
.yc-down-arrow {
  float: right;
  transition: transform .3s;
  color: rgb(153, 153, 153);
}
.roteate {
  transform: rotate(180deg)
}
.yc-group,
.yc-company,
.yc-contacts{
  float: left;
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding-left: 20px;
  padding-right: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.yc-contacts {
  padding-left: 30px;
}
.yc-group:hover,
.yc-company:hover,
.yc-contacts:hover {
  background-color: rgb(217, 236, 255);
}
.yc-company-icon {
  color: #18e;
  vertical-align: middle;
}
.yc-contacts-icon {
  color: #cccccc;
  vertical-align: middle;
}
.active {
  color: #409eff;
}
</style>