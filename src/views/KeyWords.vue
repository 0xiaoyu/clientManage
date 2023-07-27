<script>
import {getAllType} from "@/api/searchList";
import {addKeyword, deleteKeyword, getAllKeyword} from "@/api/KeyWord";

export default {
  name: 'KeyWords',
  methods: {
    addKeyword() {
      const _this = this
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
              message: '添加失败'+res.msg,
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
    removeKeyWord(){
      deleteKeyword(this.removeTag).then((res)=> {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.keyWords.splice(this.keyWords.indexOf(this.removeTag), 1)
        } else {
          this.$message({
            message: '删除失败'+res.msg,
            type: 'error'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
      this.visible = false
    },
    getKeyWords(){
      getAllKeyword().then((res) => {
        this.keyWords = res.data
      })
    }
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
      visible: false,
      removeTag: '',
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
    <header class="demo-input-suffix">
      <el-col :span="3">
        <label for="add">添加关键词：</label>
      </el-col>
      <el-col :span="5">
        <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="add.keyword"
            name="add"
        />
      </el-col>
      <el-col :span="3">
        <label for="add">来源类别：</label>
      </el-col>
      <el-col :span="5" style="text-align: left">
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

    <el-col :span="2" v-for="tag in keyWords" :key="tag.keyword">
      <el-tag closable effect="dark" size="medium" @close="(visible = true )&( removeTag = tag)">
        {{ tag.keyword }}
      </el-tag>
    </el-col>


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
</style>
