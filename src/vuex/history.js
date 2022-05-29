
import { Vue } from './install'
import {forEach} from './utils'
export class Store {
  constructor(options) {
    const { state, getters,mutations,actions ,modules} = options
    this.getters = {}
    const computed = {} 
    forEach(getters,(fn,key) => {
      computed[key] = () => {
        return fn(state)
      }
      Object.defineProperty(this.getters, key, {
        get: () => {
          return this._vm[key]
        }
      })
    });

    this._vm = new Vue({
      data: {
        $$state: state
      },
      computed
    })
    this.mutations = {}
    forEach(mutations,(fn,key) => {
      this.mutations[key] = (payload) => fn.call(this,this.state,payload)
    })
   
    this.actions = {}
    forEach(actions,(fn,key) => {
      this.actions[key] = (payload) => fn.call(this,this,payload) 
    })
  }


  get state() {
    return this._vm._data.$$state
  }

  commit = (type,payload) => {
    this.mutations[type](payload)
  }
  dispatch = (type,payload) => {
    this.actions[type](payload)
  }

}

