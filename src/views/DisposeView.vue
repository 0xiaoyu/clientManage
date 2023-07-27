<template>
  <div>
    <el-header style="margin-top: 15px;height: 30px">
      <el-row :gutter="20">
        <el-col :span="2" style="margin-top: 10px">
          状态 ：
        </el-col>
        <el-col :span="4" style="text-align: left">
          <el-select v-model="searchForm.status" placeholder="请选择" name="source">
            <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="10">
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
      </el-row>

    </el-header>

    <el-divider/>

    <el-table
        :data="tableData"
        height="600"
        border
        style="margin-top: 20px"
        lazy
        max-height="600px"
    >

      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
      >
        <template v-slot:default="scope">
          <span v-if="column.prop === 'tocrm'">
            <span v-if="scope.row.addTime">
               - -
            </span>
            <span v-else>
            <el-button size="mini" type="primary" @click="addCrm(scope.row)">添加到crm</el-button>
            </span>
          </span>
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查看详细" width="150px">
        <template v-slot:default="scope">
          <a :href="scope.row.link" target="_blank">
            <el-button size="mini">跳转</el-button>
          </a>
          <el-button @click="guanwang(scope.row)" :disabled="!scope.row.website" size="mini">官网</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="scope">

          <el-popover
              placement="top"
              width="160"
              v-model="visible">
            <el-select v-model="scope.row.status" placeholder="未选择" @change="updateStatus(scope.row)"
                       size="mini">
              <el-option
                  v-for="item in options"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </el-select>
          <el-button type="primary" slot="reference">编辑</el-button>
          </el-popover>
<!--          <el-button type="danger" @click="()=>{deleteCrm(scope.row.id);this.getAllTables}">删除</el-button>-->
          <el-button type="danger" @click="deleteCrm(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import GMT from "@/utils/timeUtil";
import {addCrm, deleteCrm, getAllHandled, updateHand} from "@/api/handle";

export default {
  data() {
    return {
      status: [],
      sources: [],
      searchForm: {
        searchType: '',
        // time: [new Date(new Date().toLocaleDateString()), new Date()],
        time: ['2023-7-1', new Date()],
        keyWord: '',
        status: '',
        pageNumber: 1,
        pageSize: 50,
        daiding: false,
        handle: false,
      },
      options: ['相关', '待定', '不相关'],
      tableData: [],
      columns: [{
        label: '公司名称',
        prop: 'companyName',
      }, {
        label: '来源类型',
        prop: 'searchType',
      }, {
        label: '加入crm',
        prop: 'tocrm',
      }, {
        label: '加入时间',
        prop: 'addTime',
      }, {
        label: '处理状态',
        prop: 'status',
      }, {
        label: '处理时间',
        prop: 'handleTime',
      }
      ]

    }
  },
  created() {
    this.getAllTables()
  },
  methods: {
    updateStatus(row){
      updateHand(row).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getAllTables()
        } else {
          this.$message({
            message: '修改失败'+res.msg,
            type: 'error'
          })
        }
      })
    },
    deleteCrm(id){
      this.$confirm('此操作将删除, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteCrm(id).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getAllTables()
          } else {
            this.$message({
              message: '删除失败'+res.msg,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getAllTables() {
      const [beginTime, endTime] = this.searchForm.time.map(o => GMT(o))
      console.log(beginTime, endTime)
      const search = {
        ...this.searchForm,
        beginTime,
        endTime,
      }
      delete search['time']
      search.pageNumber = (search.pageNumber - 1) * search.pageSize
      getAllHandled(search).then(res => {
        this.tableData = res.data.data
      })
    },
    addCrm(row) {
      addCrm(row).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.getAllTables()
        } else {
          this.$message({
            message: '添加失败'+res.msg,
            type: 'error'
          })
        }
      })
    },
    /**
     *
     * @param row
     */
    guanwang(row) {
      const url = row.website.trim();
      window.open(`http://${url}`, "_blank")
      /*headHttp(url).then(
          () => {
            window.open(`http://${row.website}`, "_blank")
          }
      ).catch(
          () => {
            this.$message({
              message: "网址不可用",
              type: 'error',
              duration: 2000
            })
          }
      )*/
    },
  },
}
</script>
<style scoped>

</style>
