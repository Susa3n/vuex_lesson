let Vue;
// new Vuex.Store
// $store.state.age

// const forEach = (obj,cb) => {
//   Object.keys(obj).forEach(key => {
//     cb(key, obj[key])
//   })
// }
class ModuleCollector {
  constructor(options) {
    this.register([],options)
  }
  register(path, rootModule) {
    let module = {
      _rawModule: rootModule,
      _children: {},
      state: rootModule.state
    }
    if(path.length == 0) {
      this.root = module
    }else {
      let parent = path.slice(0,-1).reduce((root,current) => {
        return root._children[current]
      },this.root)
      parent._children[path[path.length-1]] = module
    }
    if(rootModule.modules) {
      Object.keys(rootModule.modules).forEach(moduleName => {
        this.register(path.concat(moduleName),rootModule.modules[moduleName])
      })
    }
  }
}

class Store {
  // 通过new Vuex.Store传入配置对象options，默认为空
  // this为new Vuex.Store产生的实例，也就是当前vm的store
  constructor(options = {}) {
    this._modules = new ModuleCollector(options)
    // 定义state为响应式数据， 用来维护全局数据
    this.s = new Vue ({
      data () {
        return {
          state: options.state
        }
      }
    })

    let getters = options.getters
    this.getters = {}

    // forEach(getters,(getterName,fn) => {
    //   Object.defineProperty(this.getters,getterName, {
    //     get: () => {
    //       fn(this.state)
    //     }
    //   })
    // })

    Object.keys(getters).forEach(getterName => {
      Object.defineProperty(this.getters, getterName, {
        get: () => {
          return getters[getterName](this.state)
        }
      })
    })

    let mutations = options.mutations
    this.mutations = {}
    // 订阅： 遍历当前配置对象的mutations的属性，给当前store的mutations绑定函数，传入payload
    Object.keys(mutations).forEach(mutationName => {
      this.mutations[mutationName] = (payload) => {
        // 真正订阅函数 默认第一个参数为当前store.state 第二个参数 payload
        mutations[mutationName](this.state,payload)
      }
    })




    let actions = options.actions
    this.actions = {}
    Object.keys(actions).forEach(actionName => {
      this.actions[actionName] = (payload) => {
        actions[actionName](this,payload)
      }
    })
  }

  

  
  // 发布：  提交更改 会在当前store.mutations上找到对应的函数执行
  commit = (mutationName, payload) => { // 通过mutationName进行查找
    this.mutations[mutationName](payload)
  }

  dispatch = (actionName,payload) => {
    this.actions[actionName](payload)
  }

  get state () {
    return this.s.state
  }

  
}

const install = (_vue) => {
  Vue = _vue  // Vue的构造函数
  console.log('install...');
  // 创建全局混入 使每个实例都能触发
  Vue.mixin({
    beforeCreate() {
      if(this.$options && this.$options.store) { // 判断当前是vm及有没有store属性
        this.$store = this.$options.store // 如果有将配置对象中的store挂载到当前vm
      }else { // 如果是vc实例，没有$store，去父级找父级的$store挂载到自身身上，使每个实例都能有$store属性
        this.$store = this.$parent && this.$parent.$store // （有可能单独创建了一个实例没有parent,那就无法获取到store属性）
      }
    },
  }) 
}

export default { 
  // 给用户提供一个install的方法  默认会被调用
  install,Store
}


// 第一步：给每个实例添加一个store属性