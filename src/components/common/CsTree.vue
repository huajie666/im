<template>
  <div>
    <ul class="clearfix">
      <li v-for="item of treeData" :key="item.id">
        <div class="cs-item" v-if="item.hasChild" @click="item.expand = !item.expand">
          <i class="yc-company-icon iconfont icon-qiye" />
          <span>{{item.name}}</span>
          <i class="yc-down-arrow iconfont icon-jiantou" :class="{roteate: item.expand}" />
        </div>
        <div class="cs-item" v-else @click="viewInfo(item)" @dblclick="openSession(item)">
          <i class="yc-contacts-icon iconfont icon-yuangong" :class="{active: item.nodeType === 'LEAF' && onlineEmployees.includes(item.code)}" />
          <span :class="{active: selectId===item.id}">{{item.name}}</span>
        </div>
        <ul v-show="item.expand">
          <li v-for="item1 of item.children" :key="item1.id">
            <div class="cs-item" style="padding-left:20px" v-if="item1.hasChild" @click="item1.expand = !item1.expand">
              <i class="yc-company-icon iconfont icon-qiye" />
              <span>{{item1.name}}</span>
              <i class="yc-down-arrow iconfont icon-jiantou" :class="{roteate: item1.expand}"></i>
            </div>
            <div class="cs-item" style="padding-left:20px" v-else @click="viewInfo(item1)" @dblclick="openSession(item1)">
              <i class="yc-contacts-icon iconfont icon-yuangong" :class="{active: item1.nodeType === 'LEAF' && onlineEmployees.includes(item1.code)}" />
              <span :class="{active: selectId===item1.id}">{{item1.name}}</span>
            </div>
            <ul v-show="item1.expand">
              <li v-for="item2 of item1.children" :key="item2.id">
                <div class="cs-item" style="padding-left:30px" v-if="item2.hasChild" @click="item2.expand = !item2.expand">
                  <i class="yc-company-icon iconfont icon-qiye" />
                  <span>{{item2.name}}</span>
                  <i class="yc-down-arrow iconfont icon-jiantou" :class="{roteate: item2.expand}"></i>
                </div>
                <div class="cs-item" style="padding-left:30px" v-else @click="viewInfo(item2)" @dblclick="openSession(item2)">
                  <i class="yc-contacts-icon iconfont icon-yuangong" :class="{active: item2.nodeType === 'LEAF' && onlineEmployees.includes(item2.code)}" />
                  <span :class="{active: selectId===item2.id}">{{item2.name}}</span>
                </div>
                <ul v-show="item2.expand">
                  <li v-for="item3 of item2.children" :key="item3.id">
                    <div class="cs-item" style="padding-left:40px" @click="viewInfo(item3)" @dblclick="openSession(item3)">
                      <i class="yc-contacts-icon iconfont icon-yuangong" :class="{active: item3.nodeType === 'LEAF' && onlineEmployees.includes(item3.code)}" />
                      <span :class="{active: selectId===item3.id}">{{item3.name}}</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CsTree',
  props: {
    treeData: {
      type: Array,
      default() {
        return []
      }
    },
    onlineEmployees: {
      type: Array,
      default() {
        return []
      }
    },
    selectId: {
      type: String
    },
    treeType: {
      type: String
    }
  },
  data() {
    return {
      timer: null, //定时器用于区分单击和双击
    }
  },
  methods: {
    viewInfo(item) {
      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        if(this.treeType === 'group') {
          this.$emit('getGroupInfo',item.id)
        } else {
          this.$emit('getEmployeeInfo',item)
        }
      },300)
    },
    openSession(item) {
      clearTimeout(this.timer)
      if(this.treeType === 'group') {
        this.$emit('openGroupSession',item)
      } else {
        this.$emit('openEmployeeSession',item)
      }
    }
  }
}
</script>

<style scoped>
  .cs-item {
    height: 32px;
    line-height: 32px;
    color: rgb(153, 153, 153);
    cursor: pointer;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .cs-item:hover {
    background-color: rgb(217, 236, 255);
  }
  .yc-down-arrow {
    float: right;
    transition: transform .3s;
    color: rgb(153, 153, 153);
  }
  .yc-company-icon {
    color: #18e;
    vertical-align: top;
  }
  .yc-contacts-icon {
    vertical-align: top;
  }
  .roteate {
    transform: rotate(180deg)
  }
  .active {
    color: #409eff;
  }
</style>