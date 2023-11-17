<template>
  <div id="app">
    <el-button v-if="isCollapse" :style="`left:${elLeft}px;top:${elTop}px`" class="float-btn" draggable="true"
               size="mini"
               type="primary"
               @click="()=>this.isCollapse = !this.isCollapse"
               @dragstart.native="dragstart($event)"
               @dragend.native="dragend"
    >
      导航
    </el-button>

    <el-col :span="isCollapse ? 0 : 2" style="height: 100vh !important">
      <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activeIndex"
          :unique-opened="true"
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          mode="vertical"
          router
          text-color="#fff"
          @select="handleSelect"
      >
        <el-menu-item index="home" popper-append-to-body>
          <el-button class="float-btn" type="primary" @click="()=>this.isCollapse = !this.isCollapse">收起</el-button>
        </el-menu-item>
        <div class="menu-wrapper">
          <el-menu-item v-for="route in routes" :key="route.index" ref="subMenu" :base-path="route.index"
                        :index="route.index"
                        class="submenu-title-noDropdown" style="float: left">
            {{ route.title }}
          </el-menu-item>
        </div>
      </el-menu>
    </el-col>
    <el-col :span="isCollapse ? 24 : 22">
      <keep-alive exclude="dispose">
        <router-view/>
      </keep-alive>
    </el-col>
  </div>
</template>
<script>
export default {
  watch: {
    isCollapse(val) {
      this.$store.dispatch('setCollapse', val);
    }
  },
  data() {
    return {
      activeIndex: 'list',
      title: 'list',
      routes: [{
        index: 'list',
        title: '信息筛选'
      }, {
        index: 'dispose',
        title: '信息处理'
      }, {
        index: 'getChangePhone',
        title: '号码变更'
      }, {
        index: 'log',
        title: '日志查询'
      }, {
        index: 'keyWords',
        title: '词管理'
      }, {
        index: 'Synchronous',
        title: '同步企业'
      }, {
        index: 'getClient',
        title: '二级筛选'
      }, {
        index: 'crmView',
        title: 'crm相关'
      }, {
        index: 'changeNameLog',
        title: '更名日志'
      }, {
        index: 'company-flag',
        title: '关联标记'
      }],
      isCollapse: true,
      initWidth: 0, // 父元素的宽-自适应值
      initHeight: 0, // 父元素的高-自适应值
      startclientX: 0, // 元素拖拽前距离浏览器的X轴位置
      startclientY: 0, //元素拖拽前距离浏览器的Y轴位置
      elLeft: 0, // 元素左偏移量（也是按钮未拖拽之前的位置）
      elTop: 20, // 元素上偏移量（也是按钮未拖拽之前的位置）
    };
  },
  methods: {
    handleSelect(key) {
      this.title = key
    },
    dragstart(e) {
      console.log(e);
      this.startclientX = e.clientX; // 记录拖拽元素初始位置
      this.startclientY = e.clientY;
    },
    // 拖拽完成事件
    dragend(e) {
      console.log(e);
      let x = e.clientX - this.startclientX; // 计算偏移量
      let y = e.clientY - this.startclientY;
      this.elLeft += x; // 实现拖拽元素随偏移量移动
      this.elTop += y;
    },
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


.float-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 999;
  border: blue;
  border-radius: 100px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100px;
  min-height: 100px;
  height: 100vh;
  position: fixed;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
