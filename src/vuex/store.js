import { ModuleCollect } from "./moduleCollect";
import {forEach} from "@/utils/index"
import {Vue} from './install'
function installModule(store,path,state,rootModule) {
  if(path.length > 0 ){
    let parent = path.slice(0,-1).reduce((pre,cur) => {
      return pre[cur]
    },state)
    Vue.set(parent,path[path.length -1],rootModule._rawState)  
  }
  rootModule.foreachActions((fn,key) => {
    store.actions[key] = store.actions[key] || []
    store.actions[key].push((payload) => {
      fn.call(store,store,payload)
    })
  })

  rootModule.foreachMutations((fn,key) => {
    store.mutations[key] = store.mutations[key] || []
    store.mutations[key].push((payload) => {
      fn.call(store,rootModule._rawState,payload)
    })
  })

  rootModule.foreachComputed((fn,key) => {
    store.warpGetters[key] = () => {
      return fn.call(store,rootModule._rawState)
    }
    console.log(store.warpGetters);
  })


  forEach(rootModule._children,(childModule,key) => {
    installModule(store,path.concat(key),state,childModule)
  })
}
export class Store {
  constructor(options) {
    this.module = new ModuleCollect(options)
    this.mutations = {}
    this.actions = {}
    this.warpGetters = {}
    this.getters = {}
    let state = options.state
    installModule(this,[],state,this.module.root)
    let computed = {};
    forEach(this.warpGetters,(fn,key)=> {
      computed[key] = fn
      Object.defineProperty(this.getters,key,{
        get:() => {
          return this._vm[key]
        }
      })
    })

    this._vm = new Vue({
      data() {
        return {
          _state:state
        }
      },
      computed
    })

    
  }
  get state() {
    return this._vm.$data._state
  }

  commit(key,payload) {
    console.log(this);
    // if(this.mutations[key]) {
    //   this.mutations[key].forEach(callback => {
    //     callback(payload)
    //   })
    // }
  }

  dispatch(key,payload) {
    if(this.actions[key]) {
      this.actions[key].forEach(callback => {
        callback(payload)
      })
    }
  }
}