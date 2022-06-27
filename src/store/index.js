import Vue from 'vue'
import Vuex from '../vuex/index'
// import Vuex from 'vuex'
Vue.use(Vuex)

// function logger() {
//   return function(store) {
//     let preValue = JSON.stringify(store.state)
//     store.subscribe((mutationType, rootState) => {
//       console.log(`preValue: ${preValue}`);
//       console.log(`mutationType: ${{type:mutationType,rootState}}`);
//       console.log(`nextValue: ${JSON.stringify(store.state)}`);
//     })
//   }
// }

function resetState () {
  return function(store) {
    let state = JSON.parse(window.localStorage.getItem('VUEX:STATE'))
    if(state) {
      store.replaceState(state)
    }
    store.subscribe((mutationType,rootState)=> {
      console.log('1111',store.state);
      window.localStorage.setItem('VUEX:STATE',JSON.stringify(rootState))
    })
  }
}


export default new Vuex.Store({
  // plugins: [
  //   // logger(),
  //   resetState()
  // ],
  state: {
    age: 18
  },
  mutations: {
    syncAdd(state, value) {
      state.age += value
    },
    syncMinus(state, value) {
      console.log(state, value);
      state.age += value
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
      namespaced: true,
      state: {
        aAge: 10
      },
      modules: {
        c: {
          namespaced: true,
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
      namespaced: true,
      state: {
        bAge: 20
      }
    }
  },
})
