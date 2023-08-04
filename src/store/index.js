import Vue from 'vue'
import Vuex from 'vuex'
import {getAllTag} from "@/api/searchList";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tagWord: [],
    },
    getters: {},
    mutations: {
        setTagWord(state, data) {
            state.tagWord = data
        }
    },
    actions: {
        getTagWord(context) {
            getAllTag().then((res) => {
                console.log(res.data)
                context.commit('setTagWord', res.data.map(item => item.tagWord))
            })
        }
    },
    modules: {}
})
