import {forEach} from "@/utils/index"
export class Module {
  constructor(raw) {
    this._children = {}
    this._rawState = raw.state
    this._rawModule = raw
  }
  foreachActions(cb) {
    this._rawModule.actions && forEach(this._rawModule.actions,cb)
  } 

  foreachComputed(cb) {
    this._rawModule.getters && forEach(this._rawModule.getters,cb)
  }

  foreachMutations(cb) {
    this._rawModule.mutations && forEach(this._rawModule.mutations,cb)
  }
  getChildModule(key) {
    return this._children[key]
  }
  addChildModule(key,module) {
    this._children[key] = module
  }
}