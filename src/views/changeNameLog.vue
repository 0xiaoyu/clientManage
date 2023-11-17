<script>
import {getChangeNameLogList} from "@/api/changeNameLog";
import {changeName, getAllByName} from "@/api/common";
//闭包
let timeout = null
export default {
  data() {
    return {
      tableData: [],
      searchForm: {
        name: '',
        current: 1,
        pageSize: 10,
      },
      total: 0,
      isLoading: false,
      changeName: {
        oldName: '',
        newName: '',
      },
      loading: false,
      options: [],

    }
  },
  created() {
    this.handlePageChange();
  },
  methods: {
    getAllTables() {
      this.searchForm.current = 1;
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
    },
    remoteMethod(name) {
      if (timeout) {
        clearTimeout(timeout)
      }
      if (name === '') {
        this.loading = false;
        this.options = [];
        return;
      }

      timeout = setTimeout(() => {
        console.log(name)
        getAllByName(name).then(res => {
          this.options = res.data
        })
      }, 600);
    },
    change() {
      changeName(this.changeName.oldName, this.changeName.newName).then(res => {
        this.$message({
          message: '改名成功',
          type: 'success'
        })
        this.getAllTables()
      })
    },
  }
}
</script>

<template>
  <div>
    <el-header style="margin-top: 15px;height: 30px">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input v-model.trim="searchForm.name" placeholder="请输入公司名称" @change="getAllTables"/>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="getAllTables">查询</el-button>
        </el-col>
        <el-form inline>
          <el-form-item label="旧名">
            <el-select
                v-model="changeName.oldName"
                :loading="loading"
                :remote-method="remoteMethod"
                filterable
                placeholder="请输入旧名"
                remote
                reserve-keyword>
              <el-option
                  v-for="item in options"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新名">
            <el-input v-model.trim="changeName.newName" placeholder="请输入新名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="change">改名</el-button>
          </el-form-item>
        </el-form>
      </el-row>

    </el-header>

    <el-divider/>

    <el-table
        v-loading="isLoading"
        :data="tableData"
        border
        height="1000px"
        lazy
        max-height="730px"
        style="margin-top: 20px"
    >
      <el-table-column label="旧" property="oldName"/>
      <el-table-column label="新" property="newName"/>
      <el-table-column label="修改时间" property="createTime"/>
    </el-table>
    <el-pagination
        :current-page.sync="searchForm.current"
        :page-size.sync="searchForm.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total ,sizes, prev, pager, next, jumper"
        style="height: 50px"
        @size-change="handlePageChange"
        @current-change="handlePageChange"
    />
  </div>
</template>

<style scoped>

</style>
