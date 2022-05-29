import { forEach } from './utils'

class Module {
  constructor(rawModule) {
    this.state = rawModule.state
    this._raw = rawModule
    this._children = {}
  }
  getChildModule(name) {
    return this._children[name]
  }
  addChildModule(name, module) {
    this._children[name] = module
  }
  forEachWarpGetters(cb) {
    this._raw.getters && forEach(this._raw.getters, cb)
  }
  forEachMutations(cb) {
    this._raw.mutations && forEach(this._raw.mutations, cb)
  }
  forEachActions(cb) {
    this._raw.actions && forEach(this._raw.actions, cb)
  }
  forEachChildInstall(cb) {
    forEach(this._children, cb)
  }
  get getNameSpaced() {
    return !!this._raw.nameSpaced
  }

}

export default Module