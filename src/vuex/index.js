import { Store } from './store'
import { install } from './install'

function mapState(stateList) {
  let obj = {}
  stateList.forEach(item => {
    obj[item] = function() {
      return this.$store.state[item]
    }
  })
  return obj
}

function mapGetters(gettersList) {
  let obj = {}
  gettersList.forEach(item => {
    obj[item] = function() {
      return this.$store.getters[item]
    }
  })
  return obj
}

function mapActions(actionsList) {
  let obj = {}
  actionsList.forEach(item => {
    obj[item] = function(payload) {
      return this.$store.dispatch(item,payload)
    }
  })
  return obj
}

function mapMutations(mutationsList) {
  let obj = {}
  mutationsList.forEach(item => {
    obj[item] = function(payload) {
      return this.$store.commit(item,payload)
    }
  })
  return obj
}
export { Store, install,mapState,mapMutations,mapActions,mapGetters }