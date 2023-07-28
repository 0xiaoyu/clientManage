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
        :row-class-name="whetherAddCrm"
    >
      <!--      max-height="1000px"-->
      <el-table-column width="100" label="选择">
        <template v-slot:default="scope">
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
        <template v-slot:default="scope">
          <span v-if="column.prop === 'description'"
                v-html="signAllKeyWord(scope.row[column.prop])"></span>
          <!--          <span v-else-if="column.prop === 'companyName'& scope.row.flag " style="color: #daced0;">{{ scope.row[column.prop] }}</span>-->
          <span v-else> {{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查看详细" width="185px">
        <template v-slot:default="scope">
          <a :href="scope.row.link" target="_blank">
            <el-button size="mini" style="width: 50px;text-align: left">跳转</el-button>
          </a>
          <el-button @click="guanwang(scope.row)" :disabled="!scope.row.website" size="mini" style="width: 50px">官网
          </el-button>
          <el-button @click="gotoD(scope.row)" size="mini" style="width: 50px">详情</el-button>
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
    <!--    单选关键词框-->
    <select-key-word :close-f="searchList" :get="getAllKeyword" :word.sync="searchForm.keyWord" :title="'关键词选择'"
                     :visible.sync="showKeyW"/>

    <!--    多选标记框-->
    <select-key-word :close-f="searchList" :direction="'rtl'" :get="getAllTag" type="多选" :check-list.sync="redKey"
                     :title="'标记词选择'"
                     :visible.sync="showKeyList"/>

    <div class="top"  v-show="top" @click="backTop">
      <i class="el-icon-caret-top" color="#1989fa"  size="30"  />
    </div>

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
          width: '60px',
          minWidth: '70px'
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
      keyWords: [],
      top:false,//控制显隐
    };
  },
  created() {
    // 初始化数据
    this.searchList();
    // 初始化获取所有类型
    getAllType().then((res) => {
      this.sources = res.data
    })
    // 初始化关键词和标记词
    getAllKeyword().then((res) => {
      this.keyWords = res.data
    })
  },
  watch: {},
  mounted() {
    window.addEventListener("scroll",()=>{// 滚动事件
      let html =document.documentElement
      if (html.scrollTop>=100) {//当滚动高度大于等于100返回顶部出现
        this.top=true
      } else {
        this.top=false
      }
    })
  },
  methods: {
    getAllKeyword,
    getAllTag,
    // eslint-disable-next-line no-unused-vars
    whetherAddCrm({row, rowIndex}) {
      let cla = ''
      if (row.flag) {
        cla = 'repeat-row'
      }
      if (row.crmid && this.searchForm.handle) {
        return cla + ' warning-row'
      }
      if (row.status !== '未处理') {
        return cla + ' success-row'
      }
      return cla;
    },
    brightenKeyword(val, keyword) {
      let res = val
      keyword.forEach((item) => {
        if (res) {
          res = res.replaceAll(item, `<span style="color: #ff0000;font-size: ${this.fontRedsize}px;">${item}</span>`);
        }
      })
      return res;
    },
    signAllKeyWord(val) {
      return this.brightenKeyword(val, this.redKey)
    },
    handleSizeChange(val) {
      this.backTop()
      this.searchForm.pageSize = val
      this.searchList();
    },
    handleCurrentChange(val) {
      this.backTop()
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
            let name = ''
            let table = data.data
            table.map(o => {
              if (name === o.companyName) {
                o["flag"] = true
              } else {
                name = o.companyName
              }
            })
            this.tableData = table
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
    backTop() {
      //  document.documentElement.scrollTop=0
      let html = document.documentElement
      var timer = setInterval(() => {
        if (html.scrollTop <= 0) {
          clearInterval(timer)
        }
        html.scrollTop = html.scrollTop - 1000
      }, 10);
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
    // eslint-disable-next-line no-unused-vars
    rowClick(row, column, event) {
      console.log(1111)
      // console.log(row, column, event)
    },
    gotoD(row) {
      console.log(row)
      this.$router.push({path: '/companyInfo', query: {id: row.companyId}})
    },

  },
};
</script>

<style>
.el-table .warning-row > td.el-table__cell {
  background: #97c9ef !important;
}

.el-table .success-row > td.el-table__cell {
  background: #f0f9eb !important;
}

.el-table .repeat-row > td.el-table__cell {
  color: #e7dbdd !important;
}
.top{
  position: fixed;
  right: 20px;
  bottom: 60px;
  padding: 20px;
  background: rgba(0,155,0,.3);
}


</style>
