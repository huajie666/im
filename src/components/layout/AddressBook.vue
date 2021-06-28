<template>
  <div class="yc-address-book">
    <div class="yc-top">
      <span class="yc-add-group" @click="addGroup">+ 添加群</span>
    </div>
    <contacts :treeData="filteredGroup" :onlineEmployees="onlineEmployees" :selectId="selectId" treeType="group"></contacts>
    <contacts :treeData="filteredContacts" :onlineEmployees="onlineEmployees" :selectId="selectId" treeType="employee"></contacts>
  </div>
</template>

<script>
import Contacts from './../common/Contacts'
import bus from './../../eventBus'
export default {
  name: 'AddressBook',
  data() {
    return {
      isShowGroup: false,
      isShowContacts: false,
      groupList: [],
      contactsList: [],
      selectId: '', //当前选中的群或者员工id
      copyGroupList: [],
      copyContactsList: [],
    }
  },
  props: {
    userCode: String,
    userName: String,
    userCompany: String,
    options: {
      type: Object,
      default: ()=>({})
    },
    isGroupInfo: Boolean,
    groupInfo: Object,
    onlineEmployees: Array,
    keyword: String,
    http: {},
    requestProxy: {
      type: String,
      default : 'api/'
    },
    groupInfoApi: {
      type: String,
      default: 'manage/im/group/info/selectGroupInfo'
    },
    groupMemberInfoApi: {
      type: String,
      default: 'employee/searchContactsInfos'
    },
  },
  components: {
    Contacts
  },
  computed: {
    filteredGroup() {
      this.groupList = JSON.parse(JSON.stringify(this.copyGroupList))
      if(this.keyword) {
        return this.filteredList(this.groupList, this.keyword)
      } else {
        return this.groupList
      }
    },
    filteredContacts() {
      this.contactsList = JSON.parse(JSON.stringify(this.copyContactsList))
      if(this.keyword) {
        return this.filteredList(this.contactsList, this.keyword)
      } else {
        return this.contactsList
      }
    }
  },
  created() {
    bus.$on('groupInfo', data =>{
      this.getGroupInfo(data)
    })
    bus.$on('employeeInfo', data =>{
      this.getEmployeeInfo(data)
    })
    bus.$on('groupSession', data =>{
      this.openGroupSession(data)
    })
    bus.$on('employeeSession', data =>{
      this.openEmployeeSession(data)
    })
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
      if(this.options.addOneself) {
        data.members.push({
          employeeCode: this.userCode,
          employeeName: this.userName,
          companyName: this.userCompany
        })
      }
      this.$emit('changeGroupInfo',data)
    },
    // 获取群信息
    getGroupInfo(id) {
      this.selectId = id
      this.http.get(`${this.requestProxy}${this.groupInfoApi}/${id}`)
      .then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        if(res.data.data) {
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
        }
      })
    },
    // 获取员工信息
    getEmployeeInfo(item) {
      if(!this.groupInfo.isEdit) {
        this.selectId = item.id
        this.http.get(`${this.requestProxy}${this.groupMemberInfoApi}/${item.code}`)
        .then(res=>{
          if(res.data.resultCode !== 0) {
            if(res.data.resultMsg) {
              this.$message.warning(res.data.resultMsg)
              return
            }
            this.$message.warning('系统异常，请联系管理员！')
            return
          }
          if(res.data.data) {
            this.$emit('changeEmployeeInfo',res.data.data)
          }
        })
      }
    },
    // 打开群会话窗口
    openGroupSession(item) {
      this.http.get(`${this.requestProxy}${this.groupInfoApi}/${item.id}`).then(res=>{
        if(res.data.resultCode !== 0) {
          if(res.data.resultMsg) {
            this.$message.warning(res.data.resultMsg)
            return
          }
          this.$message.warning('系统异常，请联系管理员！')
          return
        }
        if(res.data.data) {
          let isGroupMembers = res.data.data.employeeList.some(item1 => {
            return item1.employeeCode === this.userCode
          })
          if(!isGroupMembers) {
            this.$message.warning('不是群成员不能进行群聊')
            return
          }
          let obj = {
            type: 2,
            code: item.id,
            name: item.name,
            company: '',
            isSession: true
          }
          this.$emit('initiateChat',obj)
        }
      })
    },
    // 打开员工会话窗口
    openEmployeeSession(item) {
      if(this.isGroupInfo && this.groupInfo.isEdit) {
        this.$emit('addEmployee',item)
      } else {
        if(this.userCode !== item.code) {
          let obj = {
            type: 1,
            code: item.code,
            name: item.name,
            company: item.companyShortName,
            isSession: true
          }
          this.$emit('initiateChat',obj)
        }
      }
    },
    // 联系列表过滤方法
    filteredList(treeData,keyword) {
      let newTreeData = []
      for(let item of treeData) {
        if(item.name.includes(keyword)) {
          newTreeData.push(item)
          continue
        } else {
          if(item.hasChild) {
            let children = this.filteredList(item.children, keyword)
            if(children.length) {
              item.children = children
              newTreeData.push(item)
            }
          }
        }
      }
      return newTreeData
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
  font-size: 12px;
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