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
        max-height="600px"
    >

      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
      >
      </el-table-column>
      <el-table-column label="查看详细">
        <a href="https://www.baidu.com">
          <el-button>跳转</el-button>
        </a>
        <a href="https://www.baidu.com">
          <el-button>官网</el-button>
        </a>
        <a href="https://www.baidu.com">
          <el-button>登录</el-button>
        </a>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: [],
      sources: [],
      searchForm: {
        status: '',
        time: '',
        source: '',
      },

      tableData: [],
      columns: [{
        label: '公司名称',
        prop: 'name',
      }, {
        label: '来源类型',
        prop: 'source',
      }, {
        label: '加入crm',
        prop: 'crm',
      }, {
        label: '加入时间',
        prop: 'time',
      }, {
        label: '处理状态',
        prop: 'status',
      }, {
        label: '处理时间',
        prop: 'disposeTime',
      }
      ]

    }
  },
}
</script>
<style scoped>

</style>
