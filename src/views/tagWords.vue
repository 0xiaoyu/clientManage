<script>
import {addTag, deleteTagById, getAllTag} from "@/api/searchList";

export default {
  name: 'KeyWords',
  methods: {
    getTag() {
      getAllTag().then((res) => {
        this.keyWords = res.data
      })
    },
    addKeyword() {
      const _this = this
      if (this.tagWord) {
        addTag({tagWord: this.tagWord}).then((res) => {
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
    removeKeyWord() {
      this.visible = false
      const _this = this
      deleteTagById(this.removeTag).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          _this.keyWords.splice(_this.keyWords.indexOf(_this.removeTag), 1)
        } else {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        }
      })
    }
  },
  components: {},
  data() {
    return {
      tagWord: '',
      keyWords: [],
      visible: false,
      removeTag: {},
    }
  },
  created() {
    this.getTag()
  },
}
</script>

<template>
  <div>
    <header class="demo-input-suffix">
      <el-col :span="3">
        <label for="add">添加标记词：</label>
      </el-col>
      <el-col :span="5">
        <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="tagWord"
            name="add"
        />
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="addKeyword">添加</el-button>
      </el-col>
    </header>
    <el-divider/>

    <el-col :span="2" v-for="tag in keyWords" :key="tag.id">
      <el-tag closable effect="dark" size="medium" @close="(visible = true )&( removeTag = tag)">
        {{ tag.tagWord }}
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
