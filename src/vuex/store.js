
import { Vue } from './install'
import { forEach } from './utils'
import ModuleCollection from './moduleCollection'

function installModules(store, rootState, path, module) {

  let ns = store._modules.getNamespace(path)
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((preValue, curr) => {
      return preValue[curr]
    }, rootState)
    Vue.set(parent, [path[path.length - 1]], module.state)
  }


  module.forEachWarpGetters((fn, key) => {
    store.warpComputed[ns + key] = () => {
      return fn.call(store, module.state)
    }
  })

  module.forEachMutations((fn, key) => {
    store.mutations[ns + key] = store.mutations[ns + key] || []
    store.mutations[ns + key].push((payload) => {
      fn.call(store, module.state, payload)
    })
  })

  module.forEachActions((fn, key) => {
    store.actions[ns + key] = store.actions[ns + key] || []
    store.actions[ns + key].push((payload) => {
      fn.call(store, store, payload)
    })
  })
  module.forEachChildInstall((module, key) => {
    installModules(store, rootState, path.concat(key), module)
  })


}

export class Store {
  constructor(options) {
    const { state, getters, mutations, actions, modules } = options
    // 整合好的modules模块
    this._modules = new ModuleCollection(options)
    this.warpComputed = {}
    this.getters = {}
    this.actions = {}
    this.mutations = {}
    installModules(this, state, [], this._modules.root)
    let computed = {}
    forEach(this.warpComputed, (fn, key) => {
      computed[key] = fn
      Object.defineProperty(this.getters, key, {
        get: () => {
          return this._vm[key]
        }
      })
    })
    this._vm = new Vue({
      data: {
        $state: state
      },
      computed
    })

  }
  get state() {
    return this._vm._data.$state
  }


  commit = (type, payload) => {
    this.mutations[type] && this.mutations[type].forEach(fn => fn(payload))
  }
  dispatch = (type, payload) => {
    this.actions[type] && this.actions[type].forEach(fn => fn(payload))
  }

}

