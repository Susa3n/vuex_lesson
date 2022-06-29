export let Vue
/**
 * Vue.use() 使用插件时，会执行插件的install方法并传入当前this也就是Vue
 * 将Vue赋值给全局下Vue属性并暴露出去，以便其他模块的使用
 * @param {Object} _Vue 
 */
export function install (_Vue) { 
  Vue = _Vue
  Vue.mixin({ // 使用Vue.mixin进行全局混入，beforeCreate生命周期函数
    beforeCreate() {
      if(this.$options.store){ // 判断当前配置对象中是否有store属性，如果有代表是根模块
        this.$store = this.$options.store // 并赋值给当前实例的$store属性
      }else {  // 如果没有 代表子模块
        this.$store = this.$parent && this.$parent.$store // 子模块可以通过自身实例的$parent找到父模块及父模块的$store属性，并赋值自身
      }
    },
  })
}