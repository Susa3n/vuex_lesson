<template>
  <router-link :to="{ path, query: params }">{{value}}</router-link>
</template>

<script>
export default {
  props: {
    data: Object,
    value: String,
    query: {
      type: Function,
      default: () => {
        return {
          path: '',
          payload: {}
        }
      }
    },
  },
  computed: {
    // 路由path
    path(){
      const { path } = this.query(this.data)
      return path
    },
    params(){
      const { payload } = this.query(this.data)
      return payload
    },
  },
}
</script>