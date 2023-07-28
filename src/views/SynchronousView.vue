<script>
import {getUsers, synchronClient} from "@/api/Synchron";

export default {
  data() {
    return {
      visible: false,
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
    };
  },
  created() {
    getUsers().then(res => {
      this.users = res.data;
    });
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
        } else {
          this.$message({
            message: '同步失败',
            type: 'error'
          });
        }
      });
      loading.close();
    },
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
        <el-button type="primary" slot="reference">同步客户</el-button>
      </el-popover>
    </el-row>
  </div>
</template>

<style scoped>

</style>
