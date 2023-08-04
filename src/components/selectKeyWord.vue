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
      <el-radio-group v-model="keyWord" @change="()=>{this.$emit('update:word',this.keyWord)}">
        <el-radio :label="null">不选择</el-radio>
        <el-radio v-for="item in keyWords" :key="item.keyword" :label="item.keyword">{{ item.keyword }}</el-radio>
      </el-radio-group>

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
  },
  watch: {},
  data() {
    return {
      keyWord: this.word,
      keyWords: [],
      addV: false
    }
  },
  created() {
    this.get().then(res =>
        this.keyWords = res.data
    )
  },
  mounted() {

  },
}
</script>
<style scoped>

</style>
