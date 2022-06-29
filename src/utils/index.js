/**
 * 接收一个对象和函数，调用函数传入遍历对象时拿到对象的key和value
 * @param {Object} obj  
 * @param {Function} cb 
 */
export function forEach(obj,cb){
  Object.keys(obj).forEach(key => {
    cb(obj[key],key)
  })
}