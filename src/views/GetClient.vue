<script>
export default {
  data(){
    return {
      search: {
        key: '',
        body: ''
      }
    }
  }
}
</script>

<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="全局复制">
        <el-input placeholder="请输入请求体" v-model="body"></el-input>
      </el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
      <el-input placeholder="请输入筛选条件词" v-model="search.key"></el-input>
      <el-button type="primary" @click="sumbit">提交</el-button>
    </el-tabs>

  </div>
</template>

<style scoped>

</style>
