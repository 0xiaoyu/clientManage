<template>
  <div>
    <el-header style="height: 50px">
      <el-row :gutter="10" style="height: 35px;">
        <el-col :span="2" style="text-align: left">
          <el-select v-model="searchForm.searchType" placeholder="来源类别" name="source" @change="searchList"
                     size="mini">
            <el-option
                v-for="item in sources"
                :key="item"
                :label="item"
                :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1" style="margin-top: 5px">
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
              size="mini"
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
              size="mini"
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
          <i class="el-icon-magic-stick" style="margin-top: 8px" @click="showKeyW = true"/>
        </el-col>
        <el-col :span="2">
          <el-switch
              v-model="searchForm.daiding"
              active-text="显示待定项"
              style="margin-top: 5px"
              size="mini"
              @change="searchList"
          />
        </el-col>
        <el-col :span="2">
          <el-switch
              v-model="searchForm.handle"
              active-text="显示已处理"
              @change="searchList"
              style="margin-top: 5px"
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
            <template #reference>
              <el-button type="primary" size="mini" round>界面</el-button>
            </template>
          </el-popover>
        </el-col>
        <el-col :span="2" v-if="phoneStatus">
          <el-button type="info" size="mini" @click="CrmPhoneStop" round>暂停获取</el-button>
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
      </el-row>

      <el-row>
        <el-col :span="23">
          <el-select v-model="redKey" clearable multiple filterable allow-create default-first-option
                     style="float: left;width: 100%;height: 40px"
                     placeholder="输入标红词">
            <template #empty>
              <div style="display: none">无</div>
            </template>
          </el-select>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-magic-stick" style="margin-top: 15px" @click="showKeyList = true"/>
        </el-col>
      </el-row>
      <el-row style="height: 200px"/>
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
      <el-table-column label="手机" prop="cname" width="30px">
        <template #default="scope">
          <div v-if="scope.row.cname" style="background: #2c3e50;width: 100%;padding: 0 0 0 0">&thinsp;
          </div>
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
        :current-page.sync="searchForm.pageNumber"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="searchForm.pageSize"
        layout="total ,sizes, prev, pager, next, jumper"
        :total="total"
        style="height: 50px"
    />
    <!--    单选关键词框-->
    <select-key-word :close-f="searchList" :get="getAllKeyword" :word.sync="searchForm.keyWord" :title="'关键词选择'"
                     :visible.sync="showKeyW"/>

    <!--    多选标记框-->
    <!--    <select-key-word :close-f="searchList" :direction="'rtl'" :get="getAllTag" type="多选" :check-list.sync="redKey"-->
    <!--                     :title="'标记词选择'"-->
    <!--                     :visible.sync="showKeyList"/>-->

    <el-drawer
        :visible.sync="showKeyList"
        title="标记词选择"
        @close="searchList"
        direction="rtl"
        custom-class="demo-drawer"
        ref="drawer"
    >
      <el-checkbox-group v-model="redKey">
        <el-checkbox v-for="item in redKeys" :key="item.id" :label="item.tagWord"></el-checkbox>
      </el-checkbox-group>
    </el-drawer>


  </div>
</template>

<script>
import {getAllCompany, getAllTag, getAllType, insertHandled} from '@/api/searchList';
import GMT from '@/utils/timeUtil'
import {getAllKeyword} from "@/api/KeyWord";
import SelectKeyWord from "@/components/selectKeyWord.vue";
import {getCrmPhoneStart, getCrmPhoneStatus, getCrmPhoneStop} from "@/api/crmPhone";


// const _this = this;
export default {
  components: {SelectKeyWord},
  data() {
    return {
      second: 1,
      CrmPhoneStartVisible: false,
      phoneStatus: false,
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
      flagPage: true,
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
          width: '100px',
          minWidth: '100px'
        },
        {
          label: '添加时间',
          prop: 'searchTime',
          width: '95px',
          minWidth: '50px'
        },
        {
          label: '来源详细',
          prop: 'description',
        }
      ],
      options: ['相关', '待定', '不相关'],
      keyWordsLoading: false,
      keyWords: [],
      top: false,//控制显隐
      redKeys: [],

    };
  },
  created() {
    // 初始化数据
    this.searchList();
    getCrmPhoneStatus().then(res => {
      this.phoneStatus = res
    })
    // 初始化获取所有类型
    getAllType().then((res) => {
      this.sources = res.data
    })
    // 初始化关键词
    getAllKeyword().then((res) => {
      this.keyWords = res.data
    })
    getAllTag().then((res) => {
      this.redKeys = res.data
      if (this.$store.state.tagWord.length === 0) {
        this.redKey = this.redKeys.map(item => item.tagWord)
        this.$store.commit('setTagWord', this.redKey)
      } else {
        this.redKey = this.$store.state.tagWord
      }
    })

  },
  watch: {
    redKey: {
      handler: function (val) {
        this.$store.commit('setTagWord', val)
      },
      deep: true
    },
  },
  mounted() {
    window.addEventListener("scroll", () => {// 滚动事件
      let html = document.documentElement
      this.top = html.scrollTop >= 100;
    })
  },
  methods: {
    getAllKeyword,
    CrmPhoneStart() {
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
    // eslint-disable-next-line no-unused-vars
    whetherAddCrm({row, rowIndex}) {
      let cla = ''
      if (row.flag) {
        cla = 'repeat-row'
      }
      // if (row.crmid && this.searchForm.handle) {
      if (row.crmid) {
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
    // eslint-disable-next-line no-unused-vars
    handleSizeChange(val) {
      this.backTop()
      this.flagPage = false
      this.searchList();
      this.flagPage = true
    },
    // eslint-disable-next-line no-unused-vars
    handleCurrentChange(val) {
      this.backTop()
      this.flagPage = false
      this.searchList();
      this.flagPage = true
    },
    searchList() {
      if (this.flagPage) {
        this.searchForm.pageNumber = 1
      }
      const [beginTime, endTime] = this.searchForm.time.map(o => GMT(o))
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
    },
    backTop() {
      //  document.documentElement.scrollTop=0
      let html = document.documentElement
      const timer = setInterval(() => {
        if (html.scrollTop <= 0) {
          clearInterval(timer)
        }
        html.scrollTop = html.scrollTop - 1500
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
      // console.log(row, column, event)
    },
    gotoD(row) {
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

.top {
  position: fixed;
  right: 30px;
  bottom: 60px;
  padding: 20px;
  background: rgba(0, 155, 0, .3);
  width: 1px;
  height: 1px;
}

.button-info {
  position: fixed;
  right: 50px;
  width: 70px;
}

.getPhone {
  background-color: #2c3e50;
}

</style>
