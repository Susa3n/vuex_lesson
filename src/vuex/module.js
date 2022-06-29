import {forEach} from "@/utils/index"
export class Module {
  constructor(raw) {
    this._children = {} // 存子模块
    this._rawState = raw.state // 存默认模块的state
    this._rawModule = raw // 存原始模块
  }

  // 对模块每个action执行执行指定的回调
  foreachActions(cb) {
    this._rawModule.actions && forEach(this._rawModule.actions,cb)
  } 
  // 对模块每个computed执行执行指定的回调
  foreachComputed(cb) {
    this._rawModule.getters && forEach(this._rawModule.getters,cb)
  }
  // 对模块每个mutation执行执行指定的回调
  foreachMutations(cb) {
    this._rawModule.mutations && forEach(this._rawModule.mutations,cb)
  }
  // 获取子模块
  getChildModule(key) {
    return this._children[key]
  }
  // 添加子模块
  addChildModule(key,module) {
    this._children[key] = module
  }
  //  获取命名空间
  get nameSpaced() {
    return !!this._rawModule.namespaced
  }
}