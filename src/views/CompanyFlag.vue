<script>
import {getCompanyFlagList} from "@/api/companyFlag";

export default {
  data() {
    return {
      dataList: [],
      total: 0,
      search: {
        type: 1,
        pageNum: 1,
        pageSize: 20,
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getCompanyFlagList(this.search).then(({data}) => {
        this.dataList = data.list
        this.total = data.total
      })
    }
  }
}
</script>

<template>
  <div>
    <el-table
        :data="dataList"
        style="margin: 0 auto;width: 60%"
        border
    >
      <el-table-column label="ID" prop="id" width="500"/>
      <el-table-column label="公司名称" prop="name" width="500"/>
    </el-table>
    <el-pagination :current-page.sync="search.pageNum" :page-size.sync="search.pageSize"
                   :page-sizes="[10,20,50,100]"
                   :total="total"
                   layout="total ,sizes, prev, pager, next, jumper" @size-change="getData" @current-change="getData"/>
  </div>
</template>

<style scoped>

</style>
