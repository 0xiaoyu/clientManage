<script>
import {getAllChangePhone} from "@/api/searchList";
import {getCrmPhoneStart, getCrmPhoneStatus, getCrmPhoneStop} from "@/api/crmPhone";

export default {
  data() {
    return {
      second: 1,
      CrmPhoneStartVisible: false,
      phoneStatus: false,
      phoneCount: 0,
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 100,
    }
  },
  created() {
    this.getCrmPhoneStatus()
    getAllChangePhone(this.page).then(res => {
      this.tableData = res.data.allChange
      this.total = res.data.total
    })
  },
  methods: {
    CrmPhoneStart() {
      if (this.phoneCount === 0) {
        this.$message.info("没有需要抓取的数据了")
        return
      }
      getCrmPhoneStart(this.second).then(res => {
        if (res) {
          this.$message.success("开始抓取了")
          this.phoneStatus = true
        } else {
          this.$message.error("抓取失败")

        }
      })
    },
    CrmPhoneStop() {
      getCrmPhoneStop().then(res => {
        if (res) {
          this.$message.success("停止抓取了")
          this.phoneStatus = false
        } else {
          this.$message.error("停止抓取失败")
        }
      })
    },
    getCrmPhoneStatus() {
      getCrmPhoneStatus().then(res => {
        this.phoneStatus = res
      })
    },
  }
}
</script>

<template>
  <div>
    <el-col :span="2" v-if="phoneStatus">
      <el-button type="info" size="mini" @click="CrmPhoneStop" round>暂停获取</el-button>
    </el-col>
    <el-col :span="2" v-else-if="phoneCount === 0">
      <el-button type="info" size="mini" disabled round>无需要获取的数据</el-button>
    </el-col>
    <el-col :span="2" v-else>
      <el-popover
          placement="top"
          width="160"
          v-model="CrmPhoneStartVisible">
        获取间隔时间(秒)
        <el-input-number v-model="second" :precision="0" :step="1" :min="1"></el-input-number>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="CrmPhoneStartVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="CrmPhoneStart">获取</el-button>
        </div>
        <template #reference>
          <el-button type="primary" size="mini" round>crm手机号获取</el-button>
        </template>
      </el-popover>
    </el-col>
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
