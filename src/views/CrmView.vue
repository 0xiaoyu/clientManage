<script>
import {changesScheduleStatus, getScheduleById} from "@/api/shedule";
import {getCrmCount, getCrmListByPage, updateCrmById} from "@/api/crmService";

export default {
  data() {
    return {
      search: {
        trackFlag: 2
      },
      status: true,
      list: [],
      total: 0,
      page: {
        page: 1,
        pageSize: 20,
      },
      countTack: 0,
      countSearch: {
        trackFlag: 0
      }
    }
  },
  created() {
    getScheduleById(2).then((res) => {
      this.status = res.data.jobStatus === 1
    })
    this.getCrmList()
    this.getCountCrm(this.countSearch)
  },
  methods: {
    getCountCrm(Crm) {
      getCrmCount(Crm).then((res) => {
        this.countTack = res.data
      })
    },
    getCrmList() {
      getCrmListByPage(this.page, {trackFlag: 2}).then((res) => {
        this.list = res.data.records
        this.total = res.data.total
      })
    },
    changeStatus() {
      changesScheduleStatus(2, this.status ? 0 : 1).then((res) => {
        if (res === true) {
          this.status = !this.status
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    addTack(row, index) {
      console.log(row)
      this.list.splice(index, 1);
      this.updateCrm({Ids: row.ids, trackFlag: 1})
    },
    updateCrm(row) {
      updateCrmById(row).then((res) => {
        if (res.code === 200) {
          this.$message.success('修改成功')
          this.getCrmList()
        } else {
          this.$message.error('修改失败')
        }
      })
    }
  }
}
</script>

<template>
  <div>
    追踪状态:{{ status }}
    <el-button type="primary" size="mini" @click="changeStatus">修改状态</el-button>
    <br>
    当前未添加信息数量{{ countTack }}

    <el-divider/>
    <el-table
        :data="list"
        max-height="870px"
        stripe
        style="width: 100%">
      <el-table-column
          label="公司名称"
          prop="customerName">
      </el-table-column>
      <el-table-column
          label="地址"
          prop="customerAddrs">
      </el-table-column>
      <el-table-column
          label="联系电话"
          prop="linkPhone">
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="这是一段内容确定删除吗？"
              @confirm="addTack(scope.row,scope.$index)"
          >
            <el-button slot="reference" round size="mini" type="primary">
              设置添加
            </el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page.sync="page.page"
        :page-size.sync="page.pageSize"
        :total="total"
        background
        layout="sizes,total,prev, pager, next"
        @size-change="()=>{
          this.page.pageNum = 1
          this.getCrmList()
        }"
        @current-change="getCrmList"
    >
    </el-pagination>
  </div>
</template>

<style scoped>

</style>
