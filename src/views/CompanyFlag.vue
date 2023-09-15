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
        pageSize: 50,
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
    >
      <el-table-column label="ID" prop="id"/>
      <el-table-column label="公司名称" prop="name"/>
    </el-table>
    <el-pagination :current-page.sync="search.pageNum" :page-size.sync="search.pageSize"
                   :page-sizes="[10,20,50,100]"
                   :total="total"
                   layout="total ,sizes, prev, pager, next, jumper" @size-change="getData" @current-change="getData"/>
  </div>
</template>

<style scoped>

</style>
