import { ModuleCollect } from "./moduleCollect";
import {forEach} from "@/utils/index"
import {Vue} from './install'
function getNewState(store,path) {
  return path.reduce((pre,cur) => {
    return pre[cur]
  },store.state)
}
/**
 * 
 * @param {Object} store  当前实例
 * @param {Array} path 用来处理state的收集
 * @param {Object} state 根状态state
 * @param {Object} rootModule 收集好的模块树
 */
function installModule(store,path,state,rootModule) {
  // 先根据path获取命名空间拼接成一个字符串
  let ns = store.module.getNameSpaceStr(path) //5. 当path有值时通过实例module属性上getNameSpaceStr方法获取命名空间
  if(path.length > 0 ){ //6. 如果path大于0,通过path安装state拼接成一个rootState
    let parent = path.slice(0,-1).reduce((pre,cur) => {
      return pre[cur]
    },state)
    Vue.set(parent,path[path.length -1],rootModule._rawState)  
  }
  rootModule.foreachActions((fn,key) => { //1.  根模块调用foreachActions方法传入执行函数处理action，并挂到实例actions对象
    store.actions[ns+key] = store.actions[ns+key] || []
    store.actions[ns+key].push((payload) => {
      fn.call(store,store,payload)
    })
  })

  rootModule.foreachMutations((fn,key) => { //2.  根模块调用foreachMutations方法传入执行函数处理mutation，并挂到实例mutation对象
    store.mutations[ns+key] = store.mutations[ns+key] || []
    store.mutations[ns+key].push((payload) => {
      fn.call(store,getNewState(store,path),payload)
      store.subscribeCallbacks.forEach(cb => {
        cb({mutationType:ns+key,payload},store.state)
      })
    })
  })

  rootModule.foreachComputed((fn,key) => { //3.  根模块调用foreachComputed方法传入执行函数处理computed，并挂到实例warpGetters对象
    store.warpGetters[ns+key] = () => {
      return fn.call(store,getNewState(store,path))
    }
  })


  forEach(rootModule._children,(childModule,key) => { //4.递归根模块下的子模块，依次安装
    installModule(store,path.concat(key),state,childModule)
  })
}
/**
 * 
 * @param {Object} store 当前Store的实例
 * @param {Object} state 收集安装好的state
 */
function resetVm(store,state) {
  let oldVm = store._vm 
  store.getters = {}
  let computed = {};
  forEach(store.warpGetters,(fn,key)=> { // 遍历收集好的getters拿到key和fn 赋值给computed
    computed[key] = fn
    Object.defineProperty(store.getters,key,{ //
      get:() => {
        return store._vm[key]
      }
    })
  })
  // 将state和computed挂载到new Vue的实例上
  store._vm = new Vue({
    data() {
      return {
        _state:state
      }
    },
    computed
  })
  if(oldVm) {  // 如果有旧的vue实例最后，等 dom 更新后把旧的 vue 实例销毁。
    Vue.nextTick(() => oldVm.$destroy())
  }
}
export class Store {
  constructor(options) {
    this.module = new ModuleCollect(options) // Vuex支持模块传入，会先进行模块的收集汇总
    this.mutations = {} // 用来保存配置对象mutations的方法，会先处理一层
    this.actions = {} // 用来保存配置对象actions的方法，会先处理一层
    this.warpGetters = {} // 封装后保存getter的对象
    this.subscribeCallbacks = [] // 插件订阅列表
    let state = options.state // 配置对象中的state
    // 接收参数：当前实例，[]空数组path用来处理state的收集，根状态state,收集好的模块树
    installModule(this,[],state,this.module.root) 
    resetVm(this,state)
    let plugins = options.plugins
    if(plugins) {
      plugins.forEach(plugin => {
        plugin(this)
      })
    }
  }

  
  get state() {
    return this._vm.$data._state
  }

  registerModule(path,module) {
    if(typeof path == 'string') path = [path]
    this.module.register(path,module)
    installModule(this,path,this.state,module.handleModule)
    resetVm(this,this.state)
  }

  replaceState(newState) {
      this._vm.$data._state = newState
  }


  subscribe(cb) {
    this.subscribeCallbacks.push(cb)
  }

  /**
   * 通过key去实例mutations属性拿去对应的函数列表，如果有遍历执行传入参数payload
   * @param {string} key  
   * @param {any} payload 
   */
  commit(key,payload) {
    if(this.mutations[key]) {
      this.mutations[key].forEach(callback => {
        callback(payload)
      })
    }
  }
/**
   * 通过key去实例actions属性拿去对应的函数列表，如果有遍历执行传入参数payload
   * @param {string} key  
   * @param {any} payload 
   */
  dispatch(key,payload) {
    if(this.actions[key]) {
      this.actions[key].forEach(callback => {
        callback(payload)
      })
    }
  }
}