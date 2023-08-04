<script>
import {getLog, getUsers, synchronClient} from "@/api/Synchron";
import {setTimer} from "@/utils/timeUtil";

export default {
  data() {
    return {
      visible: false,
      vuser: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      searchForm: {
        unionTime: new Date(),
        userUuid: '',
      },
      users: [{
        id: '1',
        userName: '同步公共客户',
        userUuid: '0',
      }],
      logs: [{
        userName: '',
        addTime: '',
        status: '1',
        detail: ''
      }],
      total: 100,
      pages: {
        page: 1,
        pageSize: 50,
        userUuid: ''
      },
      statuss: ['同步中', '同步成功', '同步失败'],
      tv: false,
      clearTime: () => {
      },
    };
  },
  created() {
    getUsers().then(res => {
      this.users = res.data;
    });
    this.getLogList()
  },
  destroyed() {
    this.clearTime()
  },
  filters: {
    tc(status) {
      const iClass = ['t-icon-loading', 'el-icon-check', 'el-icon-warning']
      return iClass[status]
    }
  },
  methods: {
    synchron() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      synchronClient(this.searchForm).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '同步成功',
            type: 'success'
          });
          setTimeout(() => {
            this.getLogList()
          }, 300)
        } else {
          this.$message({
            message: '同步失败',
            type: 'error'
          });
        }
      });
      loading.close();
    },
    getLogList() {
      this.tv = true
      const pages = {
        page: (this.pages.page - 1) * this.pages.pageSize,
        pageSize: this.pages.pageSize
      }
      getLog(pages).then(res => {
        const logs = res.data;
        this.logs = logs.records;
        this.total = logs.total;
        if (this.logs[0].status === 0) {
          this.clearTime = setTimer(this.getLogList, 8000);
        } else {
          this.clearTime()
        }
      }).finally(() => {
        this.tv = false
      })
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getLogList()
    },
    handleCurrentChange(val) {
      this.pages.page = val
      this.getLogList()
    }

  }
};
</script>

<template>
  <div>
    <el-row>
      <span class="demonstration">选择同步联系时间</span>
    </el-row>
    <el-row>
      <el-date-picker
          v-model="searchForm.unionTime"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
      </el-date-picker>
    </el-row>
    <el-row>
      <el-popover
          placement="top"
          width="300"
          v-model="visible">
        <el-select v-model="searchForm.userUuid" placeholder="请选择需要同步的客户">
          <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.userName"
              :value="item.userUuid">
          </el-option>
        </el-select>
        <el-button type="primary" @click="synchron">确定</el-button>
        <template v-slot:reference>
          <el-button type="primary">同步客户</el-button>
        </template>
      </el-popover>
    </el-row>
    <el-divider>
      <el-popover
          placement="top"
          width="200"
          v-model="vuser">
        <el-select v-model="pages.userUuid" placeholder="请选择需要同步的客户" clearable @change="getLogList">
          <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.userName"
              :value="item.userUuid">
          </el-option>
        </el-select>
        <template v-slot:reference>
          <span title="选择同步客户">同步日志</span>
        </template>
      </el-popover>
      <el-button type="info" size="mini" @click="getLogList">刷新</el-button>
    </el-divider>

    <el-row>
      <el-table
          :data="logs"
          style="width: 100%"
          border
          v-loading="tv"
      >
        <el-table-column
            prop="userName"
            label="同步用户">
        </el-table-column>
        <el-table-column
            prop="addTime"
            label="同步时间">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="操作时间">
        </el-table-column>
        <el-table-column
            label="同步状态"
        >
          <template v-slot:default="scope">
            <i :class="{'el-icon-loading':scope.row.status === 0}"/>
            <div :class="scope.row.status | tc">
              {{ statuss[scope.row.status] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="detail"
            label="同步详情">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="pages.page"
          :page-size="pages.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<style scoped>
.el-icon-warning {
  color: red;
}

.t-icon-loading {
  color: #409EFF;
  display: inline;
}

.el-icon-check {
  color: #67C23A;
}

.select-user {
  position: fixed;
  left: 20%;
  top: 10%;
}
</style>
