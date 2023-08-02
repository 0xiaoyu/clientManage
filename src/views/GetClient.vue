<script>
import {getClientByJSON, getLog} from "@/api/getClient";

export default {
  data() {
    return {
      search: {
        key: '',
        body: ''
      },
      records: [],
      activeTab: '0',
      total: 100,
      pages: {
        page: 1,
        pageSize: 50
      },
      statuss: ['同步中', '同步成功', '同步失败'],
      tv: false,
    }
  },
  filters: {
    tc(status) {
      const iClass = ['t-icon-loading', 'el-icon-check', 'el-icon-warning']
      return iClass[status]
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
    getClient() {
      if (this.search.body.trim() === '') {
        this.$message({
          message: '请输入请求体',
          type: 'warning'
        });
        return
      }
      getClientByJSON(this.search).then(res => {
        this.$message({
          message: '操作成功后台进行中',
          type: 'success'
        });
        console.log(res)
      })
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getLogList()
    },
    handleCurrentChange(val) {
      this.pages.page = val
      this.getLogList()
    },
    getLogList() {
      this.tv = true
      const pages = {
        page: (this.pages.page - 1) * this.pages.pageSize,
        pageSize: this.pages.pageSize
      }
      getLog(pages).then(res => {
        this.records = res.data.records
        this.total = res.data.total
      }).finally(() => {
        this.tv = false
      })
    },
  }
}
</script>

<template>
  <div>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="全局复制">
        <el-input placeholder="请输入请求体" v-model="search.body"></el-input>
      </el-tab-pane>
      <!--      <el-tab-pane label="只复制filter">
              <el-input placeholder="请输入请求体" v-model="search.body"></el-input>
            </el-tab-pane>-->
      <el-tab-pane label="条件查询"> 未做</el-tab-pane>
      <el-input placeholder="请输入筛选条件词" v-model="search.key"></el-input>
      <el-button type="primary" @click="getClient">提交</el-button>
    </el-tabs>
    <el-divider> 获取客户日志
      <el-button type="info" size="mini" @click="getLogList">刷新</el-button>
    </el-divider>
    <el-row>
      <el-table
          :data="records"
          style="width: 100%"
          border
          v-loading="tv"
      >
        <el-table-column
            prop="keyword"
            label="搜索词">
        </el-table-column>
        <el-table-column
            prop="selecttime"
            label="筛选时间"
        />
        <el-table-column
            prop="selectword"
            label="筛选词">
        </el-table-column>
        <el-table-column
            label="同步状态"
        >
          <template v-slot:default="scope">
            <i :class="{'el-icon-loading':scope.row.status === 0}"/>
            <div :class="scope.row.status | tc">
              {{ statuss[scope.row.status] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="json"
            label="同步详情"
            :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column type="expand" label="详细">
          <template v-slot:default="scope">
            <div> {{ scope.row.json }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="pages.page"
          :page-size="pages.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>

  </div>
</template>

<style scoped>

</style>
