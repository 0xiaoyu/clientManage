import Vue from 'vue'
import Vuex from 'vuex'
import {getAllTag} from "@/api/searchList";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tagWord: [],
        isCollapse: true,
    },
    getters: {},
    mutations: {
        setTagWord(state, data) {
            state.tagWord = data
        },
        setCollapse(state, data) {
            state.isCollapse = data
        }
    },
    actions: {
        getTagWord(context) {
            getAllTag().then((res) => {
                console.log(res.data)
                context.commit('setTagWord', res.data.map(item => item.tagWord))
            })
        },
        setCollapse(context, data) {
            context.commit('setCollapse', data)
        }
    },
    modules: {}
})
