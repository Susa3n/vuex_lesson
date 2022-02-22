let Vue;
// new Vuex.Store
// $store.state.age

let forEach = (obj, cb) => {
  Object.keys(obj).forEach(key => {
    cb(key, obj[key])
  })
}
class ModuleCollector {  // 递归格式化
  constructor(options) {
    this.register([], options) // 格式化操作
  }



  register(path, rootModule) {
    let module = {
      _rawModule: rootModule,
      _children: {},
      state: rootModule.state
    }
    if (path.length == 0) {
      this.root = module
    } else {
      let parent = path.slice(0, -1).reduce((root, current) => {
        return root._children[current]
      }, this.root)
      parent._children[path[path.length - 1]] = module
    }

    if (rootModule.modules) {
      Object.keys(rootModule.modules).forEach(moduleName => {
        this.register(path.concat(moduleName), rootModule.modules[moduleName])
      })
    }

  }


}


const installModule = (store, rootState, path, rootModule) => {


  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((root, current) => {
      return root[current]
    }, rootState)
    Vue.set(parent, path[path.length - 1], rootModule.state)
  }



  let getters = rootModule._rawModule.getters
  if (getters) {
    forEach(getters, (getterName, fn) => {
      Object.defineProperty(store.getters, getterName, {
        get() {
          return fn(rootModule.state) 
        }
      })
    })
  }

  let mutations = rootModule._rawModule.mutations
  if (mutations) {
    forEach(mutations, (mutationName, fn) => {
      let mutations = store.mutations[mutationName] || []
      mutations.push((payload) => {
        fn(rootModule.state, payload)
      })
      store.mutations[mutationName] = mutations
    })
  }

  let actions = rootModule._rawModule.actions
  if (actions) {
    forEach(actions, (actionName, fn) => {
      let actions = store.actions[actionName] || []
      actions.push((payload) => {
        fn(store, payload)
      })
      store.actions[actionName] = actions
    })
  }

  // 挂在儿子
  forEach(rootModule._children, (moduleName, module) => {
    installModule(store, rootState, path.concat(moduleName), module)
  })
}

class Store {
  // 通过new Vuex.Store传入配置对象options，默认为空
  // this为new Vuex.Store产生的实例，也就是当前vm的store
  constructor(options = {}) {
    // 定义state为响应式数据， 用来维护全局数据
    this.s = new Vue({
      data() {
        return {
          state: options.state
        }
      }
    })



    this.getters = {}
    this.mutations = {}
    this.actions = {}
    this._modules = new ModuleCollector(options)


    /**
     * @this Store的实例
     * @state Store实例的状态数据
     * @[] 为了递归创建出来的
     * @this._modules.root  从根模块开始安装
     */
    installModule(this, this.state, [], this._modules.root)


    //#region 
    // forEach(getters, (getterName, fn) => {
    //   Object.defineProperty(this.getters, getterName, {
    //     get: () => {
    //       fn(this.state)
    //     }
    //   })
    // })

    // Object.keys(getters).forEach(getterName => {
    //   Object.defineProperty(this.getters, getterName, {
    //     get: () => {
    //       return getters[getterName](this.state)
    //     }
    //   })
    // })

    // let mutations = options.mutations
    // this.mutations = {}
    // 订阅： 遍历当前配置对象的mutations的属性，给当前store的mutations绑定函数，传入payload
    // Object.keys(mutations).forEach(mutationName => {
    //   this.mutations[mutationName] = (payload) => {
    //     真正订阅函数 默认第一个参数为当前store.state 第二个参数 payload
    //     mutations[mutationName](this.state,payload)
    //   }
    // })

    // forEach(mutations, (mutationName, fn) => {
    //   Object.defineProperty(this.mutations, mutationName, (payload) => {
    //     fn(this.state, payload)
    //   })
    // });




    // let actions = options.actions
    // this.actions = {}
    // Object.keys(actions).forEach(actionName => {
    //   this.actions[actionName] = (payload) => {
    //     actions[actionName](this, payload)
    //   }
    // })
    // forEach(actions,(actionName,fn) => {
    //   Object.defineProperty(this.actions,actionName,(payload) => {
    //     fn(this,payload)
    //   })
    // });
    //#endregion

  }

  commit = (mutationName, payload) => {
    console.log(mutationName, payload, this);
    this.mutations[mutationName].forEach(fn => fn(payload))
  }

  dispatch = (actionsName, payload) => {
    this.actions[actionsName].forEach(fn => fn(payload))
  }


  // 发布：  提交更改 会在当前store.mutations上找到对应的函数执行
  // commit = (mutationName, payload) => { // 通过mutationName进行查找
  //   this.mutations[mutationName](payload)
  // }
  // dispatch = (actionName, payload) => {
  //   this.actions[actionName](payload)
  // }




  get state() {
    return this.s.state
  }


}

const install = (_vue) => {
  Vue = _vue  // Vue的构造函数
  // 创建全局混入 使每个实例都能触发
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.store) { // 判断当前是vm及有没有store属性
        this.$store = this.$options.store // 如果有将配置对象中的store挂载到当前vm
      } else { // 如果是vc实例，没有$store，去父级找父级的$store挂载到自身身上，使每个实例都能有$store属性
        this.$store = this.$parent && this.$parent.$store // （有可能单独创建了一个实例没有parent,那就无法获取到store属性）
      }
    },
  })
}

export default {
  // 给用户提供一个install的方法  默认会被调用
  install, Store
}


// 第一步：给每个实例添加一个store属性