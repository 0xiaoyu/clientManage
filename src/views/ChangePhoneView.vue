<script>
import {getAllChangePhone} from "@/api/searchList";
import {getCrmPhoneStart, getCrmPhoneStatus, getCrmPhoneStop} from "@/api/crmPhone";
import {CrmCount} from "@/api/Crm";
import {rmPhoneAdd} from "@/api/rmPhone";

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
    this.getList()
  },
  methods: {
    getList() {
      getAllChangePhone(this.page).then(res => {
        this.tableData = res.data.allChange
        this.total = res.data.total
      })
    },
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
      CrmCount({flag: 0}).then(res => {
        this.phoneCount = res.data
      })
      getCrmPhoneStatus().then(res => {
        this.phoneStatus = res
      })
    },
    addRmPhone() {
      this.$prompt('请输入需要删除的联系方式', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        console.log(value)
        rmPhoneAdd(value).then(({data, msg}) => {
          if (data) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          } else {
            this.$message.error("删除失败" + msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    }
  }
}
</script>

<template>
  <div>
    <el-col v-if="phoneStatus" :span="2">
      <el-button round size="mini" type="info" @click="CrmPhoneStop">暂停获取</el-button>
    </el-col>
    <el-col v-else-if="phoneCount === 0" :span="2">
      <el-button disabled round size="mini" type="info">无需要获取的数据</el-button>
    </el-col>
    <el-col v-else :span="2">
      <el-popover
          v-model="CrmPhoneStartVisible"
          placement="top"
          width="160">
        获取间隔时间(秒)
        <el-input-number v-model="second" :min="1" :precision="0" :step="1"></el-input-number>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="CrmPhoneStartVisible = false">取消</el-button>
          <el-button size="mini" type="primary" @click="CrmPhoneStart">获取</el-button>
        </div>
        <template #reference>
          <el-button round size="mini" type="primary">crm手机号获取</el-button>
        </template>
      </el-popover>
    </el-col>
    <el-button round size="mini" type="primary" @click="addRmPhone">添加黑名单手机号</el-button>
    <el-table
        :data="tableData"
        border
        style="width: 94%;margin-top: 80px;left: 3%;"
    >
      <el-table-column label="公司名称" prop="companyName" width="500px"/>
      <el-table-column label="公司电话" prop="value"/>
    </el-table>
    <el-pagination
        :current-page.sync="page.pageNum"
        :page-size.sync="page.pageSize"
        :total="total"
        background
        layout="sizes,total, prev, pager, next"
        @size-change="()=>{
          this.page.pageNum = 1
          this.getList()
        }"
        @current-change="getList"
    />
  </div>
</template>

<style scoped>

</style>
