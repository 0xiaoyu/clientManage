<template>
  <div>
    <el-header style="margin-top: 15px;height: 30px">
      <el-row :gutter="20">
        <el-col :span="2" style="margin-top: 10px">
          日志时间：
        </el-col>
        <el-col :span="6">
          <el-date-picker
              v-model="searchForm.time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-col>

        <el-col :span="2" style="margin-top: 10px">
          来源类别 ：
        </el-col>
        <el-col :span="4" style="text-align: left">
          <el-select v-model="searchForm.source" placeholder="请选择" name="source">
            <el-option
                v-for="item in sources"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="2" style="margin-top: 10px">
          关键词 ：
        </el-col>
        <el-col :span="4">
          <el-select
              v-model="searchForm.keyWord"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签">
            <el-option
                v-for="item in keyWords"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" round>查询</el-button>
        </el-col>
      </el-row>

    </el-header>

    <el-divider/>

  </div>

</template>
<script>
export default {
  data() {
    return {
      searchForm: {
        source: '',
        time: '',
        keyWord: [],
      },
    }
  }
}
</script>
<style scoped>

</style>
