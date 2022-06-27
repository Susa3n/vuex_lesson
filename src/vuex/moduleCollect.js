import { Module } from "./module"
import {forEach} from '@/utils/index'
export class ModuleCollect{
  constructor(options) {
    this.root = null
    this.register([],options)
  }

  register(path,rawModule) {
    let module = new Module(rawModule)
    rawModule.handleModule = module
    if(path.length == 0) {
      this.root = module
    }else {
      let parent = path.slice(0,-1).reduce((preModule,currKey) => {
       return preModule.getChildModule(currKey)
      },this.root)
      parent.addChildModule(path[path.length-1],module)
    }
    if(rawModule.modules) {
      forEach(rawModule.modules,(childModule,key) => {
        this.register(path.concat(key),childModule)
      })
    }
  }
}