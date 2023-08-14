<script>
import {addTag, deleteTagById, getAllTag, getAllType} from "@/api/searchList";
import {addKeyword, deleteKeyword, getAllWord} from "@/api/KeyWord";

export default {
  name: 'KeyWords',
  methods: {
    addTagWord() {
      const _this = this
      if (this.add.keyword) {
        addTag({tagWord: this.add.keyword}).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            _this.tagWord = ''
            _this.getTag()
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          message: '请填写标记词',
          type: 'error'
        })
      }
    },
    removeTagWord() {
      this.visible = false
      const _this = this
      deleteTagById(this.removeTag).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          _this.tagWords.splice(_this.tagWords.indexOf(_this.removeTag), 1)
        } else {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        }
      })
    },
    getTag() {
      getAllTag().then((res) => {
        this.tagWords = res.data
      })
    },
    addKeyword() {
      const _this = this
      if (this.activeName !== 'first') {
        this.add.type = '0'
      }
      if (this.activeName === 'third') {
        this.addTagWord()
        return
      }
      if (this.add.keyword && this.add.type) {
        addKeyword(this.add).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            _this.add = {
              keyword: '',
              searchType: '',
            }
            this.getKeyWords()
          } else {
            this.$message({
              message: '添加失败' + res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          message: '请填写关键词和来源类别',
          type: 'error'
        })
      }
    },
    removeKeyWord() {
      if (this.activeName === 'third') {
        this.removeTagWord()
        return
      }
      deleteKeyword(this.removeTag).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          switch (this.activeName) {
            case "first":
              this.keyWords.splice(this.keyWords.indexOf(this.removeTag), 1)
              break;
            case "second":
              this.filterWords.splice(this.filterWords.indexOf(this.removeTag), 1)
              break;
          }
        } else {
          this.$message({
            message: '删除失败' + res.msg,
            type: 'error'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
      this.visible = false
    },
    getKeyWords() {
      getAllWord().then((res) => {
        const data = res.data;
        this.keyWords = data.filter(o => o.type !== '0')
        this.filterWords = data.filter(o => o.type === '0')
      })
    },
    handleClick(tab) {
      if (this.tagWords.length === 0 && tab.name === 'third') {
        this.getTag()
      }
    },
  },
  components: {},
  data() {
    return {
      add: {
        keyword: '',
        type: '',
      },
      sources: [],
      keyWords: [],
      tagWords: [],
      filterWords: [],
      visible: false,
      removeTag: '',
      activeName: 'first',
    }
  },
  created() {
    getAllType().then((res) => {
      this.sources = res.data
    })
    this.getKeyWords()
  },
}
</script>

<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 96%;margin-left: 2%">
      <header class="demo-input-suffix">
        <el-col :span="3">
          <label for="add">添加词：</label>
        </el-col>
        <el-col :span="5">
          <el-input
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model.trim="add.keyword"
              name="add"
          />
        </el-col>
        <el-col :span="3" v-show="activeName==='first'">
          <label for="add">来源类别：</label>
        </el-col>
        <el-col :span="5" style="text-align: left" v-show="activeName==='first'">
          <el-select v-model="add.type" placeholder="来源类别" name="source">
            <el-option
                v-for="item in sources"
                :key="item"
                :label="item"
                :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addKeyword">添加</el-button>
        </el-col>
      </header>
      <el-divider/>
      <el-tab-pane label="关键词" name="first">
        <el-col :span="2" v-for="tag in keyWords" :key="tag.keyword">
          <el-tag closable effect="dark" size="medium" @close="(visible = true )&( removeTag = tag)">
            {{ tag.keyword }}
          </el-tag>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="标记词" name="third">
        <el-col :span="2" v-for="tag in tagWords" :key="tag.id">
          <el-tag closable effect="dark" size="medium" @close="(visible = true )&( removeTag = tag)">
            {{ tag.tagWord }}
          </el-tag>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="二级筛选词" name="second">
        <el-tag v-for="tag in filterWords" :key="tag.keyword" closable effect="dark" size="medium"
                style="margin: 10px"
                @close="(visible = true )&( removeTag = tag)">
          {{ tag.keyword }}
        </el-tag>
      </el-tab-pane>
    </el-tabs>


    <el-dialog
        title="提示"
        :visible.sync="visible"
        width="20%"
        center>
      <span>是否删除</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取 消</el-button>
    <el-button type="primary" @click="removeKeyWord">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<style scoped>
.demo-input-suffix {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.el-col {
  height: 40px;
}
</style>
