<template>
  <div>
    <el-header style="height: 50px">
      <el-row :gutter="10" style="height: 35px;">
        <el-col :span="2" style="text-align: left">
          <el-select v-model="searchForm.searchType" name="source" placeholder="来源类别" size="mini"
                     @change="searchList">
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
              :clearable="false"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期"
              size="mini"
              start-placeholder="开始日期"
              type="daterange"
              @change="searchList"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3" style="text-align: left">
          <el-input
              v-model.trim="searchForm.companyName"
              clearable
              placeholder="请输入公司名称"
              size="mini"
              @change="searchList"
              @clear="searchList"
          />
        </el-col>
        <el-col :span="3" style="text-align: left">
          <el-select
              v-model="searchForm.keyWord"
              :multiple="false"
              allow-create
              clearable
              default-first-option
              filterable
              placeholder="请选择关键词"
              size="mini"
              @change="searchList"
          >
            <el-option
                v-for="item in keyWords"
                :key="item.id"
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
              size="mini"
              style="margin-top: 5px"
              @change="searchList"
          />
        </el-col>
        <el-col :span="2">
          <el-switch
              v-model="searchForm.handle"
              active-text="显示已处理"
              style="margin-top: 5px"
              @change="searchList"
          />
        </el-col>
        <el-col :span="1.1">
          <el-button round size="mini" type="primary" @click="searchList()">查询</el-button>
        </el-col>
        <el-col :span="1.1">
          <a href="https://crm.qijiee.com/login" target="_blank">
            <el-button round size="mini" type="primary">登录</el-button>
          </a>
        </el-col>
        <el-col :span="1">
          <el-popover
              v-model="sizeV"
              placement="top"
              width="300">
            字体大小：
            <el-input-number v-model="fontsize" :max="20" :precision="2" :step="1"/>
            <br>
            加租字体大小：
            <el-input-number v-model="fontRedsize" :max="40" :precision="2" :step="1"/>
            <br>
            高度:
            <el-input-number v-model="fontWidth" :max="100" :precision="2" :step="1"/>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="sizeV = false">取消</el-button>
            </div>
            <template #reference>
              <el-button round size="mini" type="primary">界面</el-button>
            </template>
          </el-popover>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="23">
          <el-select v-model="redKey" allow-create clearable default-first-option filterable multiple
                     placeholder="输入标红词"
                     style="float: left;width: 100%;height: 40px">
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
        :cell-style="()=>({padding: fontWidth+'px 0 0 0'})"
        :data="tableData"
        :row-class-name="whetherAddCrm"
        :style="{marginTop: '20px',fontSize: fontsize +'px'}"
        border
        lazy
        @row-click="rowClick"
        @selection-change="(select)=>this.tableSelect = select"
    >
      <el-table-column type="selection" width="30"/>
      <!--      max-height="1000px"-->
      <el-table-column label="选择" width="100">
        <template v-slot:default="scope">
          <el-select v-model="scope.row.status" placeholder="未选择" size="mini"
                     @change="insertHandled(scope.row)">
            <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" :width="'150px'" minWidth="100px">
        <template v-slot:default="scope">
          <div>
            <span v-show="!scope.row.edit_enddate"
                  @dblclick="changeEnddate(scope.$index,scope.row['companyName'])">{{ scope.row.companyName }}</span>
            <!--:autofocus="true"-->
            <el-input :ref='"nameInput"+scope.$index'
                      @blur="changeNameBlur(scope.$index,newName)"
                      @keyup.enter.native="$event.target.blur()"
                      v-show="scope.row.edit_enddate"
                      size="mini"
                      v-model.trim="newName"
                      placeholder="请输入公司名"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :label="column.label"
          :min-width="column.minWidth"
          :prop="column.prop"
          :width="column.width"
      >
      </el-table-column>
      <el-table-column :label="'详情'" :width="this.$store.state.isCollapse ? '1100px' : '955px'">
        <template v-slot:default="scope">
          <span v-html="signAllKeyWord(scope.row['description'])"></span>
          <!--          <span v-else-if="column.prop === 'companyName'& scope.row.flag " style="color: #daced0;">{{ scope.row[column.prop] }}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="手机" prop="cname" width="30px">
        <template #default="scope">
          <div v-if="scope.row.cname" style="background: #2c3e50;width: 100%;padding: 0 0 0 0">&thinsp;
          </div>
        </template>
      </el-table-column>
      <el-table-column label="关联" prop="isAssociated" width="30px">
        <template #default="scope">
          <div v-if="scope.row.isAssociated" style="background: #2c3e50;width: 100%;padding: 0 0 0 0">&thinsp;
          </div>
        </template>
      </el-table-column>
      <el-table-column label="改变" prop="isPhoneChange" width="30px">
        <template #default="scope">
          <div v-if="scope.row.isPhoneChange" style="background: #2c3e50;width: 100%;padding: 0 0 0 0">&thinsp;
          </div>
        </template>
      </el-table-column>
      <el-table-column width="185px">
        <template #header>
          查看详细
          <el-popconfirm
              title="这是一段内容确定删除吗？"
              confirm-button-text="删除"
              cancel-button-text="取消"
              @confirm="deleteListClient"
          >
            <el-button round size="mini" type="primary" slot="reference">删除已选</el-button>
          </el-popconfirm>
        </template>
        <template v-slot:default="scope">
          <a :href="scope.row.link" target="_blank">
            <el-button size="mini" style="width: 50px;text-align: left">跳转</el-button>
          </a>
          <el-button :disabled="!scope.row.website" size="mini" style="width: 50px" @click="guanwang(scope.row)">官网
          </el-button>
          <el-button size="mini" style="width: 50px" @click="gotoD(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        :current-page.sync="searchForm.pageNumber"
        :page-size.sync="searchForm.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total ,sizes, prev, pager, next, jumper"
        style="height: 50px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
    <!--    单选关键词框-->
    <select-key-word :close-f="searchList" :get="getAllKeyWord" :title="'关键词选择'" :visible.sync="showKeyW"
                     :word.sync="searchForm.keyWord"/>

    <!--    多选标记框-->
    <!--    <select-key-word :close-f="searchList" :direction="'rtl'" :get="getAllTag" type="多选" :check-list.sync="redKey"-->
    <!--                     :title="'标记词选择'"-->
    <!--                     :visible.sync="showKeyList"/>-->

    <el-drawer
        ref="drawer"
        :visible.sync="showKeyList"
        custom-class="demo-drawer"
        direction="rtl"
        title="标记词选择"
        @close="searchList"
    >
      <el-checkbox-group v-model="redKey">
        <el-checkbox v-for="item in redKeys" :key="item.id" :label="item.tagWord"></el-checkbox>
      </el-checkbox-group>
    </el-drawer>


  </div>
</template>

<script>
import {deleteCompanyByIds, getAllCompany, getAllTag, getAllType, insertHandled} from '@/api/searchList';
import GMT from '@/utils/timeUtil'
import {getAllKeyWord} from "@/api/KeyWord";
import SelectKeyWord from "@/components/selectKeyWord.vue";
import {CrmCount} from "@/api/Crm";
import {changeName} from "@/api/common";


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
        companyName: ''
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
          label: '搜索词',
          prop: 'searchTerm',
          width: '80px',
          minWidth: '80px'
        },
        {
          label: '添加时间',
          prop: 'searchTime',
          width: '95px',
          minWidth: '50px'
        },
      ],
      options: ['相关', '待定', '不相关', '异常'],
      keyWordsLoading: false,
      keyWords: [],
      top: false,//控制显隐
      redKeys: [],
      newName: "",
    };
  },
  created() {

    // 初始化数据
    this.searchList();
    // 初始化获取所有类型
    getAllType().then((res) => {
      this.sources = res.data
    })
    // 初始化关键词
    getAllKeyWord().then((res) => {
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
    CrmCount({flag: 0}).then(res => {
      this.phoneCount = res.data
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
    getAllKeyWord,
    changeEnddate(index, data) {
      this.$set(this.tableData[index], 'edit_enddate', true)
      this.$set(this, 'newName', data)
      // this.tableData = [...this.tableData];//因为我table绑定的表格数据是后接过来赋值的，所以需要这步操作，如果没有1、2步骤这个可以不加。后面也一样
      // this.newName = data;
      console.log(this.newName)
      setTimeout(() => {//定时器是为了避免没有获取到dom的情况报错，所以象征性的给1毫秒让他缓冲
        this.$refs['nameInput' + index].focus()
        //el-input的autofocus失效，所以用这个方法。对应在template里的refs绑定值
      }, 20)
    },
    /**
     * 改名
     * @param index 数据下标
     * @param data 新名字
     */
    changeNameBlur(index, data) {
      const _this = this
      _this.$set(this.tableData[index], 'edit_enddate', false)
      const oldName = this.tableData[index].companyName;
      if (data === oldName) {
        return;
      }
      this.$confirm(`确定修改《${oldName}》改名为《${data}》`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeName(oldName, data).then(() => {
          _this.$set(this.searchForm, 'companyName', data)
          _this.searchList();
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },
    /**
     * 删除选中的数据
     */
    deleteListClient() {
      const ids = this.tableSelect.map(item => item.id)
      deleteCompanyByIds(this.searchForm.searchType, ids).then(
          (res) => {
            if (res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.tableData = this.tableData.filter(item => !ids.includes(item.id))
            } else {
              this.$message({
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            }
          }
      )
    },
    /**
     * 行数据渲染
     * @param row 行数据
     * @param rowIndex 行下标
     * @returns {string} 样式
     */
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
      const status = row.status;
      if (status !== '未处理') {
        if (status === '异常') {
          return cla + ' exception-row'
        } else {
          return cla + ' success-row'
        }
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
    /**
     * 标记所有关键词
     * @param val 原始字符串
     * @returns {*} 标记后的字符串
     */
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
    /**
     * 查询数据
     */
    searchList() {
      console.log(this.$store.state.isCollapse)
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
          ({data}) => {
            let name = ''
            let table = data.list
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
    /**
     * 更新状态
     * @param row 行数据
     */
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

.el-table .exception-row > td.el-table__cell {
  background: #8c8c89 !important;
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
