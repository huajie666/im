<template>
  <div class="im-group-info">
    <div class="yc-title">
      <span>群名称：</span>
      <input type="text" placeholder="请输入名称" v-model="groupInfo.name" :disabled="!groupInfo.isEdit">
    </div>
    <div class="yc-record">
      <span>已添加人员</span>
      <span class="yc-number">{{groupInfo.members.length}}(1000)</span>
    </div>
    <ul class="yc-content">
      <li class="yc-employee" v-for="item of groupInfo.members" :key="item.employeeCode">
        <span>{{item.employeeName}}</span>
        <i class="yc-delete-icon im-iconfont im-icon-delete" v-show="delIcon(item.employeeCode)" @click="delEmployee(item)" />
      </li>
    </ul>
    <div class="yc-bottom">
      <el-button type="primary" size="mini" class="yc-but" v-if="groupInfo.isEdit" @click="cancel">取 消</el-button>
      <el-button type="primary" size="mini" class="yc-but" v-else :loading="delLoading" @click="del">删 除</el-button>
      <el-button type="primary" size="mini" class="yc-but" v-if="groupInfo.isEdit" :loading="saveLoading" @click="save">保 存</el-button>           
      <el-button type="primary" size="mini" class="yc-but" v-else @click="exit">编 辑</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupInfo",
  data() {
    return {
      saveLoading: false,
      delLoading: false
    }
  },
  props: {
    groupInfo: Object,
    options: {
      type: Object,
      default: ()=>({})
    },
    userCode: String
  },
  methods: {
    delEmployee(item) {
      this.$emit('delEmployee',item)
    },
    exit() {
      let data = {
        isAdd: this.groupInfo.isAdd,
        isEdit: true,
        id: this.groupInfo.id,
        name: this.groupInfo.name,
        members: this.groupInfo.members,
        initName: this.groupInfo.initName,
        initMembers: this.groupInfo.initMembers
      }
      this.$emit('changeGroupInfo',data)
    },
    cancel() {
      if(this.groupInfo.isAdd) {
        this.$emit('hiddenInfo')
      } else {
        let data = {
          isAdd: false,
          isEdit: false,
          id: this.groupInfo.id,
          name: this.groupInfo.initName,
          members: JSON.parse(JSON.stringify(this.groupInfo.initMembers)),
          initName: this.groupInfo.initName,
          initMembers: this.groupInfo.initMembers
        }
        this.$emit('changeGroupInfo',data)
      }
    },
    save() {
      if(!this.groupInfo.name) {
        this.$message.warning('群名称不能为空')
        return
      }
      if(this.groupInfo.members.length < 2) {
        this.$message.warning('群成员不能少于两人')
        return
      }
      this.$emit('saveGroup')
    },
    del() {
      this.$confirm('此操作将永久删除该群, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.delLoading = true
        this.$emit('delGroup')
      }).catch(()=>{})
    },
    delIcon(code) {
      if(this.options.addOneself && this.userCode === code) {
        return false
      }
      return this.groupInfo.isEdit
    }
  }
}
</script>

<style scoped>
  .im-group-info {
    font-size: 12px;
    height:100%
  }
  .yc-title {
    height: 45px;
    line-height: 45px;
    padding-left: 10px;
    border-bottom: 1px solid #cccccc;
    box-sizing: border-box;
  }
  input {
    height: 28px;
    line-height: 28px;
    width: 200px;
    padding: 0 5px;
    color: 606266;
    border: 1px solid #dcdfe6;
    outline: 0;
    box-sizing: border-box;
  }
  input:focus {
    border: 1px solid #409eff;
  }
  .yc-record {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    border-bottom: 1px solid #cccccc;
    box-sizing: border-box;
  }
  .yc-number {
    float: right;
    margin-right: 10px;
  }
  .yc-content {
    height: calc(100% - 135px);
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #dcdfe6;
    overflow-y: auto;
  }
  .yc-employee {
    float: left;
    padding: 0 10px;
    min-width: 80px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    margin-right: 15px;
    margin-bottom: 10px;
    background-color: #f2f2f2;
    box-sizing: border-box;
  }
  .yc-bottom {
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 0;
  }
  .yc-delete-icon {
    font-size: 12px;
    cursor: pointer;
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