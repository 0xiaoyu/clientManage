<script>

export default {
  name: 'companyInfo',
  props: {},
  data() {
    return {
      data: {},
      columns: [{
        field: 'legalperson',
        label: '企业法人',
      }, {
        field: 'esdate',
        label: '成立日期'
      }, {
        field: 'regcaps',
        label: '注册资本'
      }, {
        field: 'scale',
        label: '企业规模'
      }, {
        field: 'entstatuscode',
        label: '企业状态'
      }, {
        field: 'address',
        label: '地址'
      }],
      jobColumns:[{
        field: 'releaseDate',
        label: '发布日期'
      },{
        field: 'jobName',
        label: '职位名称'
      },{
        field: 'location',
        label: '工作地点'
      },{
        field: 'salary',
        label: '薪资'
      },{
        field: 'experience',
        label: '经验'
      },{
        field: 'education',
        label: '学历'
      }],
      jobData:[{
        id: '',
        releaseDate: '',
        jobName: '',
        location: '',
        sourceName: '',
        jobUrl: '',
        companyId: '',
        experience: '',
        education: '',
        salary: '',
      }],
      netDate:[{
        id: '',
        semDate: '',
        semTitle: '',
        sourceName: '',
        sourceType: '',
        semUrl: '',
        semKeyword: '',
        companyId: '',
      }],
      netColumns:[{
        field: 'semDate',
        label: '发布日期'
      },{
        field: 'semKeyword',
        label: '关键词'
      },{
        field: 'semTitle',
        label: '创意文案'
      },{
        field: 'sourceName',
        label: '推广平台'
      },{
        field: 'sourceType',
        label: '推广类型'
      }],
      invData:[{
        id: '',
        inv: ''
      }],
      phoneDate:[{
        id: '',
        value: '',
        companyId: ''
      }],

    }
  },
  methods: {},
  mounted() {

  }

}
</script>

<template>
  <div>
    <el-divider>{{ data.c }}</el-divider>
    <el-card class="box-card">
      <el-row>
        <el-col v-for="item in columns" :key="item.field" :span="4" style="height: 40px">{{item.label }}:{{ data[item.field] }}
        </el-col>
      </el-row>
      <el-row>
        公司简介：{{ data.companyinfo}}
      </el-row>
    </el-card>
    <el-divider>企业百科</el-divider>
    <el-row>

    </el-row>

    <el-divider>招聘信息 </el-divider>
    <el-table
        :data="jobData"
        max-height="1000px"
        border
        lazy
    >
      <el-table-column
          v-for="item in jobColumns"
          :key="item.field"
          :prop="item.field"
          :label="item.label"
      />
    </el-table>
    <el-divider>网络推广 </el-divider>
    <el-table
        :data="netDate"
        max-height="1000px"
        border
        lazy
    >
      <el-table-column
          v-for="item in netColumns"
          :key="item.field"
          :prop="item.field"
          :label="item.label"
      />
    </el-table>
    <el-divider>知识产权 </el-divider>
    <el-row>

    </el-row>
    <el-divider>招标投标 </el-divider>
    <el-row>

    </el-row>
    <el-divider>股东信息 </el-divider>
    <el-tag v-for="item in invData" :key="item.id" size="medium">{{item.inv}}</el-tag>


    <el-popover
        placement="right"
        width="400"
        trigger="click">
      <el-table :data="phoneDate">
        <el-table-column width="150" property="value" label="手机号"></el-table-column>
      </el-table>
      <el-button slot="reference" style="position: fixed;top: 50px;right: 50px" size="mini" type="primary">手机号</el-button>
    </el-popover>

    <el-button style="position: fixed;top: 50px;left: 50px" size="mini" type="primary" @click="()=>this.$router.back()">返回</el-button>
  </div>
</template>

<style scoped>

</style>
