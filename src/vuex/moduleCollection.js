import {forEach} from './utils'
import Module from './module'
export default class ModuleCollection {
  constructor(options) {
    this.root = null
    this.register([],options)
  }

  
  getNamespace(path) {
    let root = this.root
    let ns = path.reduce((ns,key) => {
      let module = root.getChildModule(key)
      root = module
      return module.getNameSpaced ? ns + key + '/' : ns
    },'') 
    return ns
  }


  register = (path,rootModule) => {
    let newModule = new Module(rootModule)
    if(path.length == 0) {
      this.root = newModule
    }else {
      let parent = path.slice(0,-1).reduce((root,current)=> {
        return root.getChildModule(current)
      },this.root)
      parent.addChildModule(path[path.length-1],newModule)
    }
    if(rootModule.modules) {
      forEach(rootModule.modules,(val,name) => {
        this.register(path.concat(name),val)
      })
    }
  }
}