<script>
import {getChangeNameLogList} from "@/api/changeNameLog";

export default {
  data() {
    return {
      tableData: [],
      searchForm: {
        name: '',
        currentPage: 1,
        pageSize: 10,
      },
      total: 0,
      isLoading: false,
    }
  },
  created() {
    this.handlePageChange();
  },
  methods: {
    getAllTables() {
      this.searchForm.currentPage = 1;
      this.searchForm.pageSize = 10;
      this.isLoading = true;
      this.handlePageChange();
    },
    handlePageChange() {
      this.isLoading = true;
      getChangeNameLogList(this.searchForm).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
      }).finally(() => {
        this.isLoading = false;
      })
    }
  }
}
</script>

<template>
  <div>
    <el-header style="margin-top: 15px;height: 30px">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input placeholder="请输入公司名称" v-model.trim="searchForm.name" @change="getAllTables"/>
        </el-col>
      </el-row>

    </el-header>

    <el-divider/>

    <el-table
        :data="tableData"
        v-loading="isLoading"
        height="1000px"
        border
        style="margin-top: 20px"
        lazy
        max-height="730px"
    >
      <el-table-column label="旧" property="oldName"/>
      <el-table-column label="新" property="newName"/>
      <el-table-column label="修改时间" property="createTime"/>
    </el-table>
    <el-pagination
        @size-change="handlePageChange"
        @current-change="handlePageChange"
        :current-page="searchForm.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm.pageSize"
        layout="total ,sizes, prev, pager, next, jumper"
        :total="total"
        style="height: 50px"
    />
  </div>
</template>

<style scoped>

</style>
