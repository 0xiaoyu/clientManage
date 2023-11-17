<template>
  <div>
    <el-header style="margin-top: 15px;height: 30px">
      <el-row :gutter="20">
        <el-col :span="2" style="margin-top: 10px">
          日志时间：
        </el-col>
        <el-col :span="6">
          <el-date-picker
              v-model="searchForm.time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              :clearable="false"
              @change="logList"
          >
          </el-date-picker>
        </el-col>

        <el-col :span="2" style="text-align: left">
          <el-select v-model="searchForm.searchType" placeholder="来源类别" name="source" @change="logList" clearable>
            <el-option
                v-for="item in sources"
                :key="item"
                :label="item"
                :value="item"
            >
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="2" style="margin-top: 10px">
          关键词 ：
        </el-col>
        <el-col :span="3" style="text-align: left">
          <el-select
              v-model="searchForm.keyword"
              :multiple="false"
              filterable
              allow-create
              default-first-option
              placeholder="请选择关键词"
              @change="logList"
              clearable
          >
            <el-option
                v-for="item in keyWords"
                :key="item.keyword"
                :label="item.keyword"
                :value="item.keyword">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="0.4">
          <i class="el-icon-magic-stick" style="margin-top: 15px" @click="showKeyW = true"/>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" round @click="logList">查询</el-button>
        </el-col>
      </el-row>

    </el-header>
    <select-key-word :close-f="logList" :key-words="keyWords" :word.sync="searchForm.keyWord" :get="getAllKeyword"
                     :visible.sync="showKeyW"/>

    <el-divider/>

    <el-table
        :data="tableData"
        border
        style="margin-top: 20px;font-size: 16px"
        lazy
    >

      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
      />
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm.pageSize"
        layout="total ,sizes, prev, pager, next, jumper"
        :total="total"
        style="height: 50px"
    />

  </div>

</template>
<script>
import SelectKeyWord from "@/components/selectKeyWord.vue";
import {getAllType} from "@/api/searchList";
import {getAllWord} from "@/api/KeyWord";
import {getLogList} from "@/api/Log";
import GMT from "@/utils/timeUtil";

export default {
  components: {SelectKeyWord},
  data() {
    return {
      searchForm: {
        searchType: '',
        // time: [new Date(new Date().toLocaleDateString()), new Date()],
        time: ['2023-7-1', new Date()],
        keyword: '',
        pageNumber: 1,
        pageSize: 10,
      },
      keyWords: [],
      showKeyW: false,
      sources: [],
      total: 0,
      tableData: [],
      value: '',
      columns: [
        {
          label: '日志时间',
          prop: 'createTime',
        },
        {
          label: '查询时间',
          prop: 'searchTime',
        },
        {
          label: '查询类型',
          prop: 'searchType',
        },
        {
          label: '关键词',
          prop: 'keyword',
        },

      ],
      keyWordsLoading: false,
    }
  },
  created() {
    this.logList()
    getAllType().then((res) => {
      this.sources = res.data
    })
    getAllWord().then((res) => {
      this.keyWords = res.data
    })
  },
  methods: {
    getAllKeyword: getAllWord,
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.logList()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNumber = val
      this.logList()
    },
    logList() {
      const [beginTime, endTime] = this.searchForm.time.map(o => GMT(o))
      const search = {
        ...this.searchForm,
        beginTime,
        endTime,
      }
      delete search['time']
      search.pageNumber = (search.pageNumber - 1) * search.pageSize
      getLogList(search).then((res) => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    }
  }
}
</script>
<style scoped>

</style>
