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
import RelationGraph from "relation-graph";
import {getContactList, getRelation} from "@/api/contact";

export default {
  name: 'companyInfo',
  components: {RelationGraph},
  props: {},
  data() {
    return {
      currentCase: '横向树状图谱',
      isShowCodePanel: false,
      graphOptions: {
        'backgrounImageNoRepeat': true,
        'defaultExpandHolderPosition': 'bottom',
        'layouts': [
          {
            'label': '中心',
            'layoutName': 'force',
            'layoutClassName': 'seeks-layout-center',
            'defaultJunctionPoint': 'border',
            'defaultNodeShape': 0,
            'defaultLineShape': 1,
            'distance_coefficient': 0.7,
          }
        ],
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        'defaultLineMarker': {
          'markerWidth': 12,
          'markerHeight': 12,
          'refX': 6,
          'refY': 6,
          'data': 'M2,2 L10,6 L2,10 L6,6 L2,2'
        },
        'defaultNodeShape': 1,
        'defaultNodeWidth': '30',
        'defaultLineShape': 1,
        'defaultNodeBorderWidth': 0,
        'defaultLineColor': 'rgba(0, 186, 189, 1)',
        'defaultNodeColor': 'rgba(0, 206, 209, 1)',
        'defaultNodeHeight': '100',
        'defaultJunctionPoint': 'ltrb'
      },
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
      phoneDate: [''],
      crmPhone: [''],
      flagPhone: false,
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
      activeNames: ["1", "2", "3", "4", "5", "6"],
      tagWord: '',
      relationVisible: false,
      graphJsonData: {},
    }
  },
  filters: {
    reg(data) {
      return data.regcap + data.regcapcur;
    },
  },
  methods: {
    // 替换关键字
    redT(val) {
      // 不区分大小写  const Reg = new RegExp(searchData, 'i');
      // 全局替换  const Reg = new RegExp(searchData, 'g');
      this.tagWord.forEach((item) => {
        const Reg = new RegExp(item, 'ig');
        if (val) {
          // 注意 这里推荐使用正则占位符$& 不使用${searchData}  因为当这里使用正则表达式（i）不区分大小写时，如果你的文本是大写，搜索的关键字是小写，匹配结果会替换掉大写的文本
          // const res = val.replace(Reg, `<span style="background-color: yellow;">${searchData}</span>`);
          val = val.replace(Reg, `<span style="color: #ff0000;font-size: larger;">${item}</span>`);
        }
      })
      return val
    },
    realationV() {
      this.relationVisible = true
    },
    getSeeksGraph() {
      getRelation(this.id.id).then(res => {
        res.data.nodes.map(o => {
          if (o.nodeShape === null)
            o.color = '#43a2f1'
          return o
        })
        this.graphJsonData = res.data
      })
    },
    showSeeksGraph() {
      // 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置
      // eslint-disable-next-line no-unused-vars
      this.$refs.seeksRelationGraph.setJsonData(this.graphJsonData, (seeksRGGraph) => {
        // Called when the relation-graph is completed
      })
    },
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
      this.data = res.data
      this.baikeAction = this.data?.baike[0]?.id.toString();
      getContactList(this.id.id).then(res => {
        const {item, crm} = res.data;
        this.phoneDate = item;
        if (crm !== null) {
          this.flagPhone = true
          crm.forEach((item) => {
            this.phoneDate.push(`<span style="color: #3144a7;font-size: larger">${item}</span>`)
          })
        }
        this.getSeeksGraph()
      })
    });
    getInfoCount(this.id).then(res => {
      this.count = res.data;
      this.getInfoList();
    })

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
        <el-row style="float:left;" v-html="redT(data.businessscope)">
        </el-row>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="data.tag?.length === 0?24:18" style="border: dashed 1px #c0b8b8;"
                v-if="data.companyinfo !== null">
          <span v-html="redT(data.companyinfo)"/>
          <!--          公司简介：{{ data.companyinfo | tagText(that) }}-->
        </el-col>
        <el-col :span="6">
          <template v-if="data.tag?.length !== 0">
            <el-tag v-for="item in data.tag" :key="item" disable-transitions>{{ item }}</el-tag>
          </template>
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
                <span v-html="redT(item.description)"/>
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
                :prop="item.field "
                :label="item.label"
                :width="item.width"
            >
              <template #default="scope">
                <span v-html="redT(scope.row[item.field])"/>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
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
            >
              <template #default="scope">
                <span v-html="redT(scope.row[item.field])"/>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
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
            >
              <template #default="scope">
                <span v-html="redT(scope.row[item.field])"/>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
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
            >
              <template #default="scope">
                <span v-html="redT(scope.row[item.field])"/>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
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
            >
              <template #default="scope">
                <span v-html="redT(scope.row[item.field])"/>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
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

    <el-dialog
        title="企业关系图"
        :visible.sync="relationVisible"
        width="90%"
        style="height:calc(100vh - 20px);"
        top="20px"
        @opened="showSeeksGraph"
    >
      <div style="height:calc(100vh - 100px);">
        <RelationGraph ref="seeksRelationGraph" :options="graphOptions"/>
      </div>
    </el-dialog>


    <!--    <el-popover
            placement="right"
            width="140"
            trigger="click">
          <el-row style="text-align: center">手机号</el-row>
          <el-divider style="height: 10px"/>
          <el-card v-for="item in phoneDate" :key="item" style="text-align: center;" shadow="hover"
                   v-html="$options.filters.tagPhone(item,that)"/>
          <template #reference>
            <el-button class="button-info" style="top: 150px;" size="mini" :type="flagPhone?'warning':'primary'">
              手机号
            </el-button>
          </template>
        </el-popover>-->
    <el-tooltip placement="right" effect="light">
      <template #content>
        <el-row style="text-align: center">手机号</el-row>
        <el-divider style="height: 14px"/>
        <el-card v-for="item in phoneDate" :key="item" style="text-align: center;font-size: 15px" shadow="hover"
                 v-html="item"/>
      </template>
      <el-button class="button-info" style="top: 150px;" size="mini" :type="flagPhone?'warning':'primary'">
        手机号
      </el-button>
    </el-tooltip>
    <el-popover
        placement="right"
        width="140"
        trigger="click">

      <template #reference>

      </template>
    </el-popover>
    <el-button class="button-info" style="top: 100px;" size="mini" type="primary"
               :disabled="this.graphJsonData.lines?.length === 0"
               @click="realationV">关系图
    </el-button>

    <el-button class="button-info" style="top: 50px;" size="mini" type="primary" @click="()=>this.$router.back()">
      返回
    </el-button>
  </div>
</template>

<style scoped>
.el-dialog {
  margin-top: 20px;
}

.button-info {
  position: fixed;
  right: 50px;
  width: 70px;
}

</style>
