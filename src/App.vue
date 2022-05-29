<template>
  <div id="app">
    susa3n的年龄为：{{$store.state.age}}
    <hr>
    我的年龄为: {{$store.getters.myAge}}
    <hr>
    <button @click="syncAdd">增加</button>
    <button @click="asyncMinus">异步减少</button>
    <hr>
    <!-- <h2>{{$store.state.a.aAge}}</h2> -->
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    console.log(this.$store);
  },
  methods: { 
    syncAdd() {
      this.$store.commit('syncAdd',10)
    },
    asyncMinus() {
      this.$store.dispatch('asyncMinus',5)
    }
  }
}
</script>

<style>

</style>
