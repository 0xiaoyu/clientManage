<template>
  <div>
    <el-header style="margin-top: 15px;height: 30px">
      <el-row :gutter="20">
        <el-col :span="1" style="margin-top: 10px">
          状态
        </el-col>
        <el-col :span="3" style="text-align: left">
          <el-select v-model="searchForm.status" clearable name="source" placeholder="请选择" @change="getAllTables">
            <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model.trim="searchForm.companyName" clearable placeholder="请输入公司名称"
                    @change="getAllTables"/>
        </el-col>
        <el-col :span="2">
          <el-select
              v-model="searchForm.crm" clearable name="source" @change="getAllTables">
            <el-option v-for="item in crmOption" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>

        <el-col :span="6">
          <el-date-picker
              v-model="searchForm.time"
              :clearable="false"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期"
              start-placeholder="开始日期"
              type="daterange"
              @change="getAllTables"
          >
          </el-date-picker>
        </el-col>

        <el-col :span="2" style="margin-top: 10px">
          来源类别 ：
        </el-col>
        <el-col :span="4" style="text-align: left">
          <el-select v-model="searchForm.searchType" clearable placeholder="请选择" @change="getAllTables">
            <el-option
                v-for="item in sources"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="deleteHand">删除不相关</el-button>
        </el-col>
      </el-row>

    </el-header>

    <el-divider/>

    <el-table
        :data="tableData"
        border
        height="1000px"
        lazy
        max-height="830px"
        style="margin-top: 20px"
    >

      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
      >
        <template v-slot:default="scope">
          <span v-if="column.prop === 'addTime' && scope.row.addTime === null || scope.row.addTime === ''">
            - -
          </span>
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否加入crm" width="130px">
        <template v-slot:default="scope">
          <el-switch v-model="scope.row.tocrm" @change="updateCRM(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" width="150px">
        <template v-slot:default="{row}">
          <el-select v-model="row.status" placeholder="未选择" size="mini"
                     @change="updateStatus(row)">
            <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template v-slot:default="{row}">
          <span @dblclick="updateRemark(row)"> {{ row.remark || '- -' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="查看详细" width="150px">
        <template v-slot:default="scope">
          <a :href="scope.row.link" target="_blank">
            <el-button size="mini">跳转</el-button>
          </a>
          <el-button :disabled="!scope.row.website" size="mini" @click="guanwang(scope.row)">官网</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="searchForm.current"
        :page-size="searchForm.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total ,sizes, prev, pager, next, jumper"
        style="height: 50px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import GMT from "@/utils/timeUtil";
import {deleteHand, getAllHandled, updateCompany, updateCrm, updateHand} from "@/api/handle";
import {getAllType} from "@/api/searchList";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'dispose',
  data() {
    return {
      status: [],
      sources: [],
      searchForm: {
        searchType: '',
        // time: [new Date(new Date().toLocaleDateString()), new Date()],
        time: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
        keyWord: '',
        status: '',
        current: 1,
        size: 50,
        daiding: false,
        handle: false,
        companyName: '',
      },
      options: ['相关', '待定', '不相关', '异常'],
      tableData: [],
      total: 100,
      columns: [
        {
          label: '公司名称',
          prop: 'companyName',
          width: '300px'
        }, {
          label: '来源类型',
          prop: 'searchType',
          width: '100px'
        }, {
          label: '加入时间',
          prop: 'addTime',
          width: '150px'
        }, {
          label: '处理时间',
          width: '180px',
          prop: 'handleTime',
        }
      ],
      crmOption: [
        {
          label: '全部',
          value: '0'
        }, {
          label: '已加入',
          value: '1'
        }, {
          label: '未加入',
          value: '2'
        }
      ]

    }
  },
  created() {
    this.getAllTables()
    getAllType().then(res => {
      this.sources = res.data
    })
  },
  methods: {
    /**
     * 修改备注
     */
    updateRemark(row) {
      this.$prompt('请输入备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.remark,
      }).then(({value}) => {
        updateCompany({id: row.id, remark: value}).then(res => {
          if (res.code === '200') {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            row.remark = value
          } else {
            this.$message({
              message: '修改失败' + res.msg,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message.info('取消输入')
      });
    },
    deleteHand() {
      deleteHand().then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getAllTables()
        } else {
          this.$message({
            message: '删除失败' + res.msg,
            type: 'error'
          })
        }
      })
    },
    updateCRM(row) {
      row.customerName = row.companyName
      updateCrm(row).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.search()
        } else {
          this.$message({
            message: '修改失败' + res.msg,
            type: 'error'
          })
        }
      })
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.search();
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.search();
    },
    updateStatus(row) {
      updateHand(row).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.search()
        } else {
          this.$message({
            message: '修改失败' + res.msg,
            type: 'error'
          })
        }
      })
    },
    search() {
      const [beginTime, endTime] = this.searchForm.time.map(o => GMT(o))
      const search = {
        ...this.searchForm,
        beginTime,
        endTime,
      }
      delete search['time']
      getAllHandled(search).then(({data}) => {
        this.tableData = data.list
        this.total = data.total
      })
    },
    getAllTables() {
      this.searchForm.current = 1;
      this.search();
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
