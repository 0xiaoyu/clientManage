<template>
  <div>
    <el-header style="height: 10px">
      <el-row :gutter="10" style="height: 30px;">
        <el-col :span="2" style="text-align: left">
          <el-select v-model="searchForm.searchType" placeholder="来源类别" name="source" @change="searchList">
            <el-option
                v-for="item in sources"
                :key="item"
                :label="item"
                :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1" style="margin-top: 10px">
          时间
        </el-col>
        <el-col :span="6">
          <el-date-picker
              v-model="searchForm.time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              :clearable="false"
              @change="searchList"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3" style="text-align: left">
          <el-select
              v-model="searchForm.keyWord"
              :multiple="false"
              filterable
              allow-create
              default-first-option
              placeholder="请选择关键词"
              @change="searchList"
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
          <i class="el-icon-magic-stick" style="margin-top: 15px" @click="()=>showKeyW = true"/>
        </el-col>
        <el-col :span="2">
          <el-switch
              v-model="searchForm.daiding"
              active-text="显示待定项"
              style="margin-top: 11px"
              @change="searchList"
          />
        </el-col>
        <el-col :span="2">
          <el-switch
              v-model="searchForm.handle"
              active-text="显示已处理"
              @change="searchList"
              style="margin-top: 11px"
          />
        </el-col>
        <el-col :span="1.1">
          <el-button type="primary" round @click="searchList()">查询</el-button>
        </el-col>
        <el-col :span="1">
          <a href="https://crm.qijiee.com/login" target="_blank">
            <el-button type="primary" round>登录</el-button>
          </a>
        </el-col>
      </el-row>
    </el-header>
    <el-table
        :data="tableData"
        border
        style="margin-top: 20px;font-size: 3px"
        lazy
        @row-click="rowClick"
        :cell-style="()=>({padding: '0 0 0 0'})"
    >
      <!--      max-height="1000px"-->
      <el-table-column width="100" label="选择">
        <template slot-scope="scope">
          <el-select v-model="scope.row.status" placeholder="未选择" clearable @change="insertHandled(scope.row)"
                     size="mini">
            <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
      >
      </el-table-column>
      <el-table-column label="查看详细" width="150px">
        <template slot-scope="scope">
          <a :href="scope.row.link" target="_blank">
            <el-button size="mini">跳转</el-button>
          </a>
          <el-button @click="guanwang(scope.row)" :disabled="!scope.row.website" size="mini">官网</el-button>
        </template>
      </el-table-column>
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
    <select-key-word :close-f="searchList" :key-words="keyWords" :word.sync="searchForm.keyWord" :visible.sync="showKeyW"/>

  </div>
</template>

<script>
import {getAllCompany, getAllType, insertHandled} from '@/api/searchList';
import GMT from '@/utils/timeUtil'
import headHttp from "@/utils/headHttp";
import {getAllKeyword} from "@/api/KeyWord";
import SelectKeyWord from "@/components/selectKeyWord.vue";


// const _this = this;
export default {
  components: {SelectKeyWord},
  data() {
    return {
      searchForm: {
        searchType: '找线索',
        // time: [new Date(new Date().toLocaleDateString()), new Date()],
        time: ['2023-7-1', new Date()],
        keyWord: "",
        status: '',
        pageNumber: 1,
        pageSize: 50,
        daiding: false,
        handle: false,
      },
      showKeyW: false,
      keyWords: [],
      sources: [],
      total: 1000,
      tableData: [],
      value: '',
      columns: [
        {
          label: '公司名称',
          prop: 'companyName',
          width: '150px',
          minWidth: '100px'
        },
        {
          label: '搜索词',
          prop: 'searchTerm',
          width: '70px',
          minWidth: '50px'
        },
        {
          label: '添加时间',
          prop: 'searchTime',
          width: '135px',
          minWidth: '100px'
        },
        {
          label: '来源详细',
          prop: 'description',
        }
      ],
      options: ['相关', '待定', '不相关'],
      keyWordsLoading: false,
    };
  },
  created() {
    this.searchList();
    getAllType().then((res) => {
      this.sources = res.data
    })
    getAllKeyword().then((res) => {
      this.keyWords = res.data
    })
  },
  watch: {},
  methods: {
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.searchList();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNumber = val
      this.searchList();
    },
    searchList() {
      const [beginTime, endTime] = this.searchForm.time.map(o => GMT(o))
      console.log(beginTime, endTime)
      const search = {
        ...this.searchForm,
        beginTime,
        endTime,
      }
      delete search['time']
      search.pageNumber--
      getAllCompany(search).then(
          res => {
            this.tableData = res.data.data;
            this.total = res.data.total
          }
      )
    },
    // 测试官网是否能用，在打开
    guanwang(row) {
      const url = row.website;
      headHttp(url).then(
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
      )
    },
    insertHandled(row) {
      insertHandled(row).then(
          () => {
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }
      ).catch(
          () => {
            this.$message({
              message: '更新失败',
              type: 'error',
              duration: 2000
            })
          }
      )
    },
    getAllKey() {
      this.keyWordsLoading = true
      getAllKeyword().then(
          res => {
            this.keyWords = res.data.map(o => {
              return {
                label: o.keyword,
                value: o.keyword
              }
            })
          }
      )
    },
    rowClick(row, column, event) {
      console.log(1111)
      // console.log(row, column, event)
    },
    setKeyDrawer(val){
      this.showKeyW = val
    }

  },
};
</script>

<style scoped>
.aaa {
  height: 100px;
}
</style>
