import Vue from 'vue'
import Vuex from '../vuex/index'
// import Vuex from 'vuex'
Vue.use(Vuex)

const persits = (store) => {
  store.subscribe((mutation,state) => {
    sessionStorage.setItem('vuex_state',JSON.stringify(state))
  })
}

export default new Vuex.Store({
  plugins: [
    persits
  ],
  state: {
    age: 18
  },
  mutations: {
    syncAdd(state, value) {
      state.age += value
    },
    syncMinus(state, value) {
      state.age += -value
    }
  },
  actions: {
    asyncMinus({ commit }, payload) {
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
        c: {
          state: {
            cAge: 21
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
