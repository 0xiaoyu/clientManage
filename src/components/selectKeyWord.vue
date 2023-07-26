

<template>
  <div>
    <el-drawer
        :visible.sync="visible"
        title="关键词选择"
        :before-close="()=>{this.$emit('update:visible',false)}"
        @close="closeF"
        direction="ltr"
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
import {getAllKeyword} from "@/api/KeyWord";

export default {
  props:{
    visible:{
      type: Boolean,
      default: false
    },
    word:{
      type: String,
      default:''
    },
    closeF:{
      type: Function,
      default: ()=>{}
    },
    keyWords:{
      type: Array,
      default:()=>  getAllKeyword().then((res) => {
        return res.data
      })
    }
  },
  data(){
    return {
      keyWord: this.word
    }
  },
  methods:{
  }
}
</script>
<style scoped>

</style>
