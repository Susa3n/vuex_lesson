import Vue from 'vue'
import Vuex from '../vuex/index'
// import Vuex from 'vuex'
Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    age: 18
  },
  mutations: {
    syncAdd(state, value) {
      state.age += value
    },
    syncMinus(state, value) {
      state.age += value
    }
  },
  actions: {
    asyncMinus({commit}, payload) {
      setTimeout(() => {
        commit('syncMinus', payload)
      }, 1000);
    }
  },
  getters: {
    myAge(state) {
      return state.age + 5
    }
  },
  modules: {
    a: {
      state: {
        aAge:10
      },
      modules: {
        namespaced: true,
        c: {
          state: {
            cAge: 21
          },
          mutations: {
            syncAdd() {
              console.log('11111');
            }
          }
        }
      }
    },
    b: {
      state: {
        bAge: 20
      }
    }
  },
})
