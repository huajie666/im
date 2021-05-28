<template>
  <div class="cs-turn-over" :class="isShow()">
    <el-input class="cs-serach-input" v-model="employee" size="mini"></el-input>
    <el-button class="cs-confirm-but" type="primary" @click="turnOver" >移 交</el-button>
    <contacts :treeData="filteredContacts" :selectId="checkedId" treeType="turnOver"></contacts>
  </div>
</template>

<script>
import Contacts from '../common/Contacts'
import bus from '../../eventBus'
export default {
  name: 'TurnOver',
  props: {
    isShowGroupTurnOver: Boolean,
    userName: String,
    userCompany: String,
  },
  components: { Contacts },
  data() {
    return {
      employee: '',
      turnOverContacts: [],
      copyTurnOverContacts: [],
      checkedId: '',
      checkedObj: {}
    }
  },
  computed: {
    filteredContacts() {
      this.turnOverContacts = JSON.parse(JSON.stringify(this.copyTurnOverContacts))
      if(this.employee) {
        return this.filteredList(this.turnOverContacts,this.employee)
      } else {
        return this.turnOverContacts
      }
    }
  },
  created() {
    bus.$on('changeCode', data =>{
      this.checkedId = data.id
      this.checkedObj = data
    })
  },
  methods: {
    isShow() {
      return this.isShowGroupTurnOver ? 'unfoldHeader' : 'hideHeader'
    },
    turnOver() {
      if(!this.checkedId) {
        this.$message.warning('请选择转移到的人员')
        return
      }
      this.$confirm(`是否把会话从${this.userName}(${this.userCompany})转移到${this.checkedObj.name}(${this.checkedObj.companyShortName})?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        this.$emit('turnOver',this.checkedObj.code)
      }).catch(()=>{})
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

<style lang="less" scoped>
  .cs-turn-over {
    position: absolute;
    top: 55px;
    left: 750px;
    height: calc(100% - 55px);
    box-sizing: border-box;
    padding: 50px 5px 5px;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 12px;
    border-left: 1px solid #cccccc;
    .cs-serach-input {
      position: absolute;
      top: 12px;
      left: 8px;
      width: 130px;
    }
    .cs-confirm-but {
      position: absolute;
      top: 12px;
      left: 138px;
      height: 28px;
      font-size: 12px;
      padding: 0 8px;
      border-radius: 0;
    }
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
</style>