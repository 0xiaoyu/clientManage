<script>
import {getAllChangePhone} from "@/api/searchList";

export default {
  data() {
    return {
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 100,
    }
  },
  created() {
    getAllChangePhone(this.page).then(res => {
      this.tableData = res.data.allChange
      this.total = res.data.total
    })
  }
}
</script>

<template>
  <div>
    <el-table
        :data="tableData"
        border
        style="width: 94%;margin-top: 80px;left: 3%;"
    >
      <el-table-column prop="companyName" label="公司名称" width="500px"/>
      <el-table-column prop="value" label="公司电话"/>
    </el-table>
    <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="page.pageNum"
        :page-size="page.pageSize"
    />
  </div>
</template>

<style scoped>

</style>
