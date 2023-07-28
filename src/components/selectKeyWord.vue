<template>
  <div>
    <el-drawer
        :visible.sync="visible"
        :title="title"
        :before-close="()=>{this.$emit('update:visible',false)}"
        @close="closeF"
        :direction="direction"
        custom-class="demo-drawer"
        ref="drawer"
    >
      <el-radio-group v-if="type=='单选'" v-model="keyWord" @change="()=>{this.$emit('update:word',this.keyWord)}">
        <el-radio :label="null">不选择</el-radio>
        <el-radio v-for="item in keyWords" :key="item.keyword" :label="item.keyword">{{ item.keyword }}</el-radio>
      </el-radio-group>


      <el-checkbox-group v-else-if="type=='多选'" v-model="list"
                         @change="()=>{this.$emit('update:checkList',this.list)}">
        <el-checkbox v-for="item in keyWords" :key="item.id" :label="item.tagWord"></el-checkbox>
      </el-checkbox-group>
    </el-drawer>
  </div>
</template>
<script>

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: 'ltr'
    },
    visible: {
      type: Boolean,
      default: false
    },
    word: {
      type: String,
      default: ''
    },
    closeF: {
      type: Function,
      default: () => {
      }
    },
    get: {
      type: Function,
      default: () => {
      }
    },
    type: {
      type: String,
      default: '单选'
    },
    checkList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    checkList() {
      this.list = this.checkList
    }
  },
  data() {
    return {
      keyWord: this.word,
      list: this.checkList,
      keyWords: [],
      addV: false
    }
  },
  created() {
    this.get().then(res =>
        this.keyWords = res.data
    ).then(()=>{
      // 默认全选
      if (this.type === '多选'){
        this.list = this.keyWords.map(item => item.tagWord)
        this.$emit('update:checkList',this.list)
      }
    })

  },
  mounted() {

  },
  methods: {}
}
</script>
<style scoped>

</style>
