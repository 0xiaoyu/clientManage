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
          <i class="el-icon-magic-stick" style="margin-top: 15px" @click="showKeyW = true"/>
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
          <el-button type="primary" size="mini" round @click="searchList()">查询</el-button>
        </el-col>
        <el-col :span="1.1">
          <a href="https://crm.qijiee.com/login" target="_blank">
            <el-button type="primary" size="mini" round>登录</el-button>
          </a>
        </el-col>
        <el-col :span="1">
          <el-popover
              placement="top"
              width="300"
              v-model="sizeV">
            字体大小：
            <el-input-number v-model="fontsize" :precision="2" :step="1" :max="20"/>
            <br>
            加租字体大小：
            <el-input-number v-model="fontRedsize" :precision="2" :step="1" :max="40"/>
            <br>
            高度:
            <el-input-number v-model="fontWidth" :precision="2" :step="1" :max="100"/>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="sizeV = false">取消</el-button>
            </div>
            <el-button type="primary" size="mini" round slot="reference">界面</el-button>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-select v-model="redKey" clearable multiple filterable allow-create default-first-option
                     style="float: left;width: 100%"
                     placeholder="输入标红词">
          </el-select>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-magic-stick" style="margin-top: 15px" @click="showKeyList = true"/>
        </el-col>
      </el-row>
    </el-header>
    <el-table
        :data="tableData"
        border
        :style="{marginTop: '20px',fontSize: fontsize +'px'}"
        lazy
        @row-click="rowClick"
        :cell-style="()=>({padding: fontWidth+'px 0 0 0'})"
    >
      <!--      max-height="1000px"-->
      <el-table-column width="100" label="选择">
        <template slot-scope="scope">
          <el-select v-model="scope.row.status" placeholder="未选择" @change="insertHandled(scope.row)"
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
        <template slot-scope="scope">
          <span v-if="column.prop === 'description'"
                v-html="signAllKeyWord(scope.row[column.prop])"></span>
          <span v-else> {{ scope.row[column.prop] }}</span>
        </template>
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
    <select-key-word :close-f="searchList" :get="getAllKeyword" :word.sync="searchForm.keyWord"
                     :visible.sync="showKeyW"/>

    <select-key-word :close-f="searchList" :direction="'rtl'" :get="getAllTag" type="多选" :check-list.sync="redKey"
                     :visible.sync="showKeyList"/>

  </div>
</template>

<script>
import {getAllCompany, getAllTag, getAllType, insertHandled} from '@/api/searchList';
import GMT from '@/utils/timeUtil'
import {getAllKeyword} from "@/api/KeyWord";
import SelectKeyWord from "@/components/selectKeyWord.vue";


// const _this = this;
export default {
  components: {SelectKeyWord},
  data() {
    return {
      searchForm: {
        searchType: '找招聘',
        // time: [new Date(new Date().toLocaleDateString()), new Date()],
        time: ['2023-7-1', new Date()],
        keyWord: "",
        status: '',
        pageNumber: 1,
        pageSize: 50,
        daiding: false,
        handle: false,
      },
      fontRedsize: 14,
      fontsize: 14,
      fontWidth: 10,
      showKeyW: false,
      showKeyList: false,
      sources: [],
      redKey: [],
      total: 1000,
      tableData: [],
      value: '',
      sizeV: false,
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
      keyWords: []
    };
  },
  created() {
    this.searchList();
    getAllType().then((res) => {
      this.sources = res.data
    })
    getAllKeyword().then((res)=>{
      this.keyWords = res.data
    })
  },
  watch: {},
  methods: {
    getAllKeyword,
    getAllTag,
    brightenKeyword(val, keyword) {
      let res = val
      keyword.forEach((item) => {
        if (res) {
          res = res.replaceAll(item, `<span style="color: #0e6cc9;font-size: ${this.fontRedsize}px;font-weight: bold">${item}</span>`);
        }
      })
      return res;
    },
    signAllKeyWord(val) {
      return this.brightenKeyword(val, this.redKey)
    },
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
      search.pageNumber = (search.pageNumber - 1) * search.pageSize
      getAllCompany(search).then(
          res => {
            const data = res.data
            const table = data.data
            this.tableData = table;
            this.total = data.total
          }
      )
    },
    // 测试官网是否能用，在打开
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
    insertHandled(row) {
      row.searchType = this.searchForm.searchType
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
    rowClick(row, column, event) {
      console.log(1111)
      // console.log(row, column, event)
    },

  },
};
</script>

<style scoped>
.aaa {
  height: 100px;
}
</style>
