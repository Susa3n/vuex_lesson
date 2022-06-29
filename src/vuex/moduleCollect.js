import { Module } from "./module"
import { forEach } from '@/utils/index' // 工具函数
export class ModuleCollect {
  constructor(options) {
    this.root = null
    this.register([], options)
  }

  // 获取命名空间
  getNameSpaceStr(path) {
    let module = this.root // 根模块
    return path.reduce((pre, cur) => {
      module = module.getChildModule(cur) // 获取子模块
      return pre + module.nameSpaced ?  `${cur}/` : '' // 判断子模块是否有命名空间进行拼接
    }, '')
  }

  // 注册模块
  /**
   * 注册模块通过path和模块，先对模块进行一层处理new Module()。返回处理后的模块{_children,_rawState,_rawModule}
   * @param {Array} path 
   * @param {Object} rawModule 
   */
  register(path, rawModule) {
    let module = new Module(rawModule)
    rawModule.handleModule = module
    if (path.length == 0) { //1. 如果path长度为0为根模块赋值实例的root属性
      this.root = module
    } else { //3. 如果不是根模块，此时path长度不为0
      let parent = path.slice(0, -1).reduce((preModule, currKey) => { // 拿取当前模块的父模块
        return preModule.getChildModule(currKey)
      }, this.root)
      parent.addChildModule(path[path.length - 1], module) // 给父模块_children属性添加子模块
    }
    if (rawModule.modules) { //2. 如果当前模块有modules属性，遍历modules，递归进行模块收集 
      forEach(rawModule.modules, (childModule, key) => {
        this.register(path.concat(key), childModule)
      })
    }
  }
}