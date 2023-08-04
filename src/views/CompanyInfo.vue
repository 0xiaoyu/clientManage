<script>

import {
  getCompanyInfo,
  getInfoCount,
  getInvInfo,
  getJob,
  getNetPromotion,
  getPatent,
  getTender
} from "@/api/clientInfo";


export default {
  name: 'companyInfo',
  props: {},
  data() {
    return {
      that: this,//保存this以便filter中使用
      id: {
        id: '',
      },
      data: {
        address: '',
        businessscope: '',
        companyinfo: '',
        entname: '',
        entstatuscode: '',
        esdate: '',
        legalperson: '',
        pid: '',
        regcap: '',
        regcapcur: '',
        scale: '',
        baike: [{
          URL: '',
          description: '',
          sourceName: '',
          id: 1,
        }],
        projectTag: [],
        contact: '',
      },
      baikeAction: '1',
      columns: [
        {
          field: 'legalperson',
          label: '企业法人',
          span: 2,
        }, {
          field: 'esdate',
          label: '成立日期',
          span: 4
        }, {
          field: 'scale',
          label: '企业规模',
          span: 3
        }],
      jobColumns: [
        {
          field: 'releaseDate',
          label: '发布日期',
          width: '200px'
        }, {
          field: 'jobName',
          label: '职位名称'
        }, {
          field: 'location',
          label: '工作地点'
        }, {
          field: 'salary',
          label: '薪资',
          width: '100px'
        }, {
          field: 'experience',
          label: '经验'
        }, {
          field: 'education',
          label: '学历'
        }],
      jobData: [
        {
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
      jobPage: 1,
      jobExData: [
        {
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
      jobExPage: 1,
      netDate: [
        {
          id: '',
          semDate: '',
          semTitle: '',
          sourceName: '',
          sourceType: '',
          semUrl: '',
          semKeyword: '',
          companyId: '',
        }],
      netPage: 1,
      netColumns: [
        {
          field: 'semDate',
          label: '发布日期'
        }, {
          field: 'semKeywords',
          label: '关键词'
        }, {
          field: 'semTitle',
          label: '创意文案'
        }, {
          field: 'sourceName',
          label: '推广平台'
        }],
      invData: [
        {
          id: 1,
          inv: ''
        }],
      phoneDate: [
        {
          id: '',
          value: '',
          companyId: ''
        }],
      count: {
        be_INVESTCOUNT: 0, // 股东人数
        recruitinfocount: 0, // 一年年的招聘信息
        extrarecruitcount: 0, // 年外招聘数
        patentsrelationcount: 0, // 知识产权
        websiteinfocount: 0, // 网络推广
        baikeinfocount: 0,// 百科数
        tenderrelationcount: 0 // 招标投标
      },
      patentDate: [],
      patentColumns: [
        {
          field: 'patentname',
          label: '专利名称'
        }, {
          field: 'noticetype',
          label: '专利类型'
        }, {
          field: 'applypubno',
          label: '专利号'
        }, {
          field: 'applypubdate',
          label: '日期'
        }],
      patentPage: 1,
      tenderDate: [],
      tenderColumns: [
        {
          field: 'projectName',
          label: '招标'
        }, {
          field: 'publicDate',
          label: '日期'
        }, {
          field: 'region',
          label: '地点'
        }],
      tenderPage: 1,
      show: {
        job: false,
        jobEx: false,
        net: false,
        netEx: false,
        inv: false,
        phone: false,
      },
      entstatus: ["", "存续", "吊销，未注销", "注销企业", "迁出企业", "停业企业", "其他"],
      activeNames: [],
      tagWord: '',
    }
  },
  filters: {
    reg(data) {
      return data.regcap + data.regcapcur;
    },
    tagText(res, _this) {
      console.log(_this)
      _this.tagWord.forEach((item) => {
        if (res) {
          res = res.replaceAll(item.tagWord, `<span style="color: #ff0000;font-size: larger">${item.tagWord}</span>`);
        }
      })
      return res;
    },
  },
  methods: {
    getJob() {
      getJob({...this.id, page: this.jobPage, type: 1}).then(res => {
        this.jobData = res.data;
      })
    },
    getExJob() {
      getJob({...this.id, page: this.jobExPage, type: 2}).then(res => {
        this.jobExData = res.data;
      })
    },
    getInv() {
      getInvInfo(this.id).then(res => {
        this.invData = res.data;
        this.show.inv = true
      })
    },
    getPatent() {
      getPatent({...this.id, page: this.patentPage}).then(res => {
        this.patentDate = res.data;
      })
    },
    getTender() {
      getTender({...this.id, page: this.tenderPage}).then(res => {
        this.tenderDate = res.data;
      })
    },
    getNetPromotion() {
      getNetPromotion({...this.id, page: this.netPage}).then(res => {
        this.netDate = res.data;
      })
    },
    getInfoList() {
      /*      if (this.count.baikeinfocount !== 0) {
              getBaike(this.id).then(res => {
                this.baike = res.data;
              })
            }*/
      if (this.count.recruitinfocount !== 0) {
        setTimeout(() => {
          this.getJob()
        }, 200)
      }
      if (this.count.extrarecruitcount !== 0) {
        setTimeout(() => {
          this.getExJob()
        }, 300)
      }
      if (this.count.patentsrelationcount !== 0) {
        setTimeout(() => {
          this.getPatent()
        }, 700)
      }
      if (this.count.be_INVESTCOUNT !== 0) {
        setTimeout(() => {
          this.getInv()
        }, 900)
      }
      if (this.count.tenderrelationcount !== 0) {
        setTimeout(() => {
          this.getTender()
        }, 1000)
      }
      if (this.count.websiteinfocount !== 0) {
        setTimeout(() => {
          this.getNetPromotion()
        }, 1100)
      }
    },
  },
  created: function () {
    this.id.id = this.$route.query.id;
    this.tagWord = this.$store.state.tagWord
    getCompanyInfo(this.id).then(res => {
      res.data.tag = JSON.parse(res.data.projectTag)
      // this.data = this.brightenKeyword(res.data, this.tagWord);
      /*      res.data.baike.map(o => {
              o.id = parseInt(o.id)
              console.log(o)
              return o
            })*/
      this.data = res.data
      this.baikeAction = this.data?.baike[0]?.id.toString();
      this.phoneDate = JSON.parse(this.data?.contact);
    });
    getInfoCount(this.id).then(res => {
      this.count = res.data;
      this.getInfoList();
    })
    // getContactInfo(this.id).then(res => {
    //   this.phoneDate = res.data;
    // })
  },
  mounted() {
    // getInvInfo({"id": 123});
  }

}
</script>

<template>
  <div style="margin-left: 25px">
    <el-divider>{{ data.entname }} <span style="border-radius: 10px;border: solid #1989fa;padding: 3px">{{
        entstatus[data.entstatuscode]
      }}</span>
    </el-divider>
    <el-card class="box-card">
      <el-row>
        <template v-for="item in columns">
          <el-col :key="item.field" :span="item.span" style="height: 40px" v-if="data[item.field] !== ''">
            {{ item.label }}:{{ data[item.field] }}
          </el-col>
        </template>
        <el-col :span="4">注册资本: {{ data | reg }}</el-col>
        <el-col :span="11" v-if="data.address!==null">地址:{{ data.address }}</el-col>
      </el-row>
      <el-row v-if="data.businessscope !== ''">
        <el-row style="float:left;">
          经营范围:
        </el-row>
        <el-row style="float:left;">
          {{ data.businessscope }}
        </el-row>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="6">
          <template v-if="data.tag?.length !== 0">
            <el-tag v-for="item in data.tag" :key="item" disable-transitions>{{ item }}</el-tag>
          </template>
        </el-col>
        <el-col :span="data.tag?.length === 0?24:18" style="border: dashed 1px #c0b8b8;"
                v-if="data.companyinfo !== null">
          <span v-html="$options.filters.tagText(data.companyinfo,that)"/>
          <!--          公司简介：{{ data.companyinfo | tagText(that) }}-->
        </el-col>
      </el-row>
    </el-card>
    <el-collapse v-model="activeNames">
      <template v-if="count.baikeinfocount !== 0">
        <el-collapse-item title="企业百科" name="1">
          <el-card class="box-card">
            <el-tabs v-model="baikeAction">
              <el-tab-pane v-for="item in data.baike" :key="item.id" :label="item.sourceName"
                           :name="item.id.toString()">
                <el-link :href="item.URL" type="info">访问原文 <i class="el-icon-position"/></el-link>
                <span v-html="$options.filters.tagText(item.description,that)"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-collapse-item>
      </template>
      <template v-if="count.recruitinfocount !== 0 && jobData !== null">
        <el-collapse-item title="一年内招聘信息" name="2">
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
                :width="item.width"
            />
          </el-table>
          <el-pagination
              small
              layout="prev, pager, next"
              :total="count.recruitinfocount"
              :page-size="10"
              :current-page.sync="jobPage"
              @current-change="getJob"
          >
          </el-pagination>
        </el-collapse-item>
      </template>

      <template v-if="count.extrarecruitcount !== 0 && jobExData !== null">
        <el-collapse-item title="年外招聘信息" name="3">
          <el-table
              :data="jobExData"
              max-height="1000px"
              border
              lazy
          >
            <el-table-column
                v-for="item in jobColumns"
                :key="item.field"
                :prop="item.field"
                :label="item.label"
                :width="item.width"
            />
          </el-table>
          <el-pagination
              small
              layout="prev, pager, next"
              :total="count.extrarecruitcount"
              :current-page.sync="jobExPage"
              :page-size="10"
              @current-change="getExJob"
          />
        </el-collapse-item>
      </template>
      <template v-if="count.patentsrelationcount !== 0 && patentDate !== null">
        <el-collapse-item title="知识产权" name="4">
          <el-table
              :data="patentDate"
              max-height="1000px"
              border
              lazy
          >
            <el-table-column
                v-for="item in patentColumns"
                :key="item.field"
                :prop="item.field"
                :label="item.label"
            />
          </el-table>
          <el-pagination
              small
              layout="prev, pager, next"
              :total="count.patentsrelationcount"
              :current-page.sync="patentPage"
              :page-size="10"
              @current-change="getPatent"
          />
        </el-collapse-item>
      </template>
      <template v-if="count.extrarecruitcount !== 0 && tenderDate !== null && tenderDate.length !== 0">
        <el-collapse-item title="招标投标" name="5">
          <el-table
              :data="tenderDate"
              max-height="1000px"
              border
              lazy
          >
            <el-table-column
                v-for="item in tenderColumns"
                :key="item.field"
                :prop="item.field"
                :label="item.label"
            />
          </el-table>
          <el-pagination
              small
              layout="prev, pager, next"
              :total="count.tenderrelationcount"
              :current-page.sync="tenderPage"
              :page-size="10"
              @current-change="getTender"
          />
        </el-collapse-item>
      </template>
      <template v-if="count.websiteinfocount !== 0 && netDate !== null && netDate.length !== 0">
        <el-collapse-item title="网络推广" name="6">
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
          <el-pagination
              small
              layout="prev, pager, next"
              :total="count.websiteinfocount"
              :current-page.sync="netPage"
              :page-size="10"
              @current-change="getNetPromotion"
          />
        </el-collapse-item>
      </template>
      <template v-if="count.be_INVESTCOUNT !== 0 && invData !== null">
        <el-collapse-item title="股东信息" name="6" v-show="show.inv">
          <el-tag v-for="item in invData" :key="item.id" size="medium" style="float: left;margin-right: 30px">
            {{ item.inv }}
          </el-tag>
        </el-collapse-item>
      </template>
    </el-collapse>
    <el-popover
        placement="right"
        width="140"
        trigger="click">
      <el-row style="text-align: center">手机号</el-row>
      <el-divider style="height: 10px"/>
      <el-card v-for="item in phoneDate" :key="item.value" style="text-align: center;" shadow="hover">
        {{ item }}
      </el-card>
      <template #reference>
        <el-button style="position: fixed;top: 50px;right: 50px" size="mini" type="primary">手机号</el-button>
      </template>
    </el-popover>

    <el-button style="position: fixed;top: 50px;left: 50px" size="mini" type="primary" @click="()=>this.$router.back()">
      返回
    </el-button>
  </div>
</template>

<style scoped>

</style>
